// Motor de jogos reutilizável para todos os conteúdos da plataforma.
(function () {
  const STORAGE_KEY = "profmilany-progress-v1";
  const RANKING_KEY = "profmilany-ranking-v1";

  function getProgress() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"completed":{},"scores":{},"achievements":{}}');
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent("progress-updated"));
  }

  function getRanking() {
    return JSON.parse(localStorage.getItem(RANKING_KEY) || "[]");
  }

  function saveRanking(entries) {
    localStorage.setItem(RANKING_KEY, JSON.stringify(entries.slice(0, 8)));
    window.dispatchEvent(new CustomEvent("ranking-updated"));
  }

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function beep(type) {
    const enabled = localStorage.getItem("profmilany-sound") === "on";
    if (!enabled || !window.AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = type === "ok" ? 660 : 220;
    gain.gain.value = 0.05;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
  }

  function openGame(topic, year) {
    const root = document.querySelector("[data-game-root]") || document.body;
    const state = {
      score: 0,
      index: 0,
      correct: 0,
      startedAt: Date.now(),
      timer: null
    };

    root.innerHTML = `
      <div class="game-backdrop" role="dialog" aria-modal="true" aria-label="Jogo ${topic.title}">
        <section class="game-modal">
          <div class="game-header">
            <div>
              <p class="eyebrow">${topic.badge}</p>
              <h2>${topic.title}</h2>
            </div>
            <button class="icon-button" type="button" data-close-game aria-label="Fechar jogo">×</button>
          </div>
          <div class="game-meta">
            <strong>Pontos: <span data-score>0</span></strong>
            <strong>Tempo: <span data-time>00:00</span></strong>
          </div>
          <label class="sound-row">
            <input type="checkbox" data-sound-toggle>
            Sons opcionais
          </label>
          <div data-game-stage></div>
          <p class="game-feedback" data-feedback aria-live="polite"></p>
        </section>
      </div>
    `;

    const modal = root.querySelector(".game-backdrop");
    const stage = root.querySelector("[data-game-stage]");
    const scoreEl = root.querySelector("[data-score]");
    const timeEl = root.querySelector("[data-time]");
    const soundToggle = root.querySelector("[data-sound-toggle]");
    soundToggle.checked = localStorage.getItem("profmilany-sound") === "on";
    soundToggle.addEventListener("change", () => localStorage.setItem("profmilany-sound", soundToggle.checked ? "on" : "off"));

    function updateScore(points) {
      state.score = Math.max(0, state.score + points);
      scoreEl.textContent = state.score;
    }

    function feedback(message, ok) {
      root.querySelector("[data-feedback]").textContent = message;
      beep(ok ? "ok" : "error");
    }

    function finish() {
      clearInterval(state.timer);
      const seconds = Math.floor((Date.now() - state.startedAt) / 1000);
      const progress = getProgress();
      progress.completed[topic.id] = true;
      progress.scores[topic.id] = Math.max(progress.scores[topic.id] || 0, state.score);
      const completedCount = Object.keys(progress.completed).length;
      const totalScore = Object.values(progress.scores).reduce((sum, value) => sum + value, 0);
      progress.achievements["first-game"] = true;
      progress.achievements["score-100"] = totalScore >= 100;
      progress.achievements["five-games"] = completedCount >= 5;
      progress.achievements["all-topics"] = completedCount >= 21;
      saveProgress(progress);

      if (Number(year) === 3) {
        const entries = getRanking();
        entries.push({ topic: topic.title, score: state.score, date: new Date().toLocaleDateString("pt-BR") });
        entries.sort((a, b) => b.score - a.score);
        saveRanking(entries);
      }

      stage.innerHTML = `
        <div class="game-question">
          Desafio concluído! Pontuação final: ${state.score} pontos em ${seconds}s.
        </div>
        <div class="topic-actions" style="margin-top:1rem">
          <button class="btn primary" type="button" data-close-game>Concluir</button>
          <button class="btn secondary" type="button" data-replay>Jogar novamente</button>
        </div>
      `;
      root.querySelector("[data-feedback]").textContent = "Progresso salvo no navegador.";
      stage.querySelector("[data-replay]").addEventListener("click", () => openGame(topic, year));
      root.querySelectorAll("[data-close-game]").forEach((button) => button.addEventListener("click", close));
    }

    function close() {
      clearInterval(state.timer);
      root.innerHTML = "";
    }

    function startTimer() {
      state.timer = setInterval(() => {
        const seconds = Math.floor((Date.now() - state.startedAt) / 1000);
        const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
        const rest = String(seconds % 60).padStart(2, "0");
        timeEl.textContent = `${minutes}:${rest}`;
      }, 1000);
    }

    root.querySelectorAll("[data-close-game]").forEach((button) => button.addEventListener("click", close));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });
    startTimer();

    if (topic.gameType === "drag") renderDrag(topic, stage, updateScore, feedback, finish);
    else if (topic.gameType === "memory") renderMemory(topic, stage, updateScore, feedback, finish);
    else if (topic.gameType === "truefalse") renderQuestionGame(topic, stage, updateScore, feedback, finish, true);
    else if (topic.gameType === "mission" || topic.gameType === "escape" || topic.gameType === "battle") renderMission(topic, stage, updateScore, feedback, finish);
    else if (topic.gameType === "canvas") renderCanvas(topic, stage, updateScore, feedback, finish);
    else renderQuestionGame(topic, stage, updateScore, feedback, finish, false);
  }

  function renderQuestionGame(topic, stage, updateScore, feedback, finish, trueFalse) {
    const questions = shuffle(topic.questions);
    let index = 0;

    function render() {
      const question = questions[index];
      const options = trueFalse ? [
        { label: "Verdadeiro", value: true },
        { label: "Falso", value: false }
      ] : question.options.map((option) => ({ label: option, value: option }));

      stage.innerHTML = `
        <div class="game-question">${question.prompt}</div>
        <div class="option-grid">
          ${options.map((option) => `<button class="option-button" type="button" data-value="${option.value}">${option.label}</button>`).join("")}
        </div>
      `;

      stage.querySelectorAll(".option-button").forEach((button) => {
        button.addEventListener("click", () => {
          const value = trueFalse ? button.dataset.value === "true" : button.dataset.value;
          const ok = value === question.answer;
          button.classList.add(ok ? "correct" : "incorrect");
          updateScore(ok ? 20 : -5);
          feedback(question.feedback, ok);
          setTimeout(() => {
            index += 1;
            if (index >= questions.length) finish();
            else render();
          }, 850);
        }, { once: true });
      });
    }

    render();
  }

  function renderMission(topic, stage, updateScore, feedback, finish) {
    const questions = shuffle(topic.questions);
    stage.innerHTML = `
      <div class="game-question">Complete as missões para liberar o selo de ${topic.title}.</div>
      <div class="mission-list">
        ${questions.map((question, index) => `
          <div class="mission-item">
            <strong>Missão ${index + 1}</strong>
            <p>${question.prompt}</p>
            <div class="option-grid">
              ${question.options.map((option) => `<button class="option-button" type="button" data-answer="${question.answer}" data-value="${option}">${option}</button>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      <button class="btn primary" type="button" data-finish disabled>Finalizar missão</button>
    `;
    let answered = 0;
    stage.querySelectorAll(".option-button").forEach((button) => {
      button.addEventListener("click", () => {
        const group = button.closest(".mission-item");
        if (group.dataset.done) return;
        group.dataset.done = "true";
        const ok = button.dataset.value === button.dataset.answer;
        button.classList.add(ok ? "correct" : "incorrect");
        updateScore(ok ? 18 : -4);
        answered += 1;
        feedback(ok ? "Missão concluída com sucesso." : "Resposta registrada. Revise a estratégia e siga para a próxima.", ok);
        if (answered === questions.length) stage.querySelector("[data-finish]").disabled = false;
      });
    });
    stage.querySelector("[data-finish]").addEventListener("click", finish);
  }

  function renderDrag(topic, stage, updateScore, feedback, finish) {
    const pairs = shuffle(topic.pairs);
    stage.innerHTML = `
      <div class="game-question">Arraste cada conceito para sua descrição correta.</div>
      <div class="drag-layout">
        <div class="drag-pool">
          ${shuffle(pairs).map((pair) => `<button class="drag-item" draggable="true" data-item="${pair.item}" type="button">${pair.item}</button>`).join("")}
        </div>
        <div class="drop-list">
          ${pairs.map((pair) => `<div class="drop-zone" data-target="${pair.item}"><strong>${pair.target}</strong><span></span></div>`).join("")}
        </div>
      </div>
      <button class="btn primary" type="button" data-finish style="margin-top:1rem" disabled>Finalizar</button>
    `;
    let matched = 0;
    let selectedItem = null;
    stage.querySelectorAll(".drag-item").forEach((item) => {
      item.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", item.dataset.item));
      item.addEventListener("click", () => {
        selectedItem = item.dataset.item;
        stage.querySelectorAll(".drag-item").forEach((button) => button.classList.remove("correct"));
        item.classList.add("correct");
        feedback("Item selecionado. Toque na descrição correspondente.", true);
      });
    });
    stage.querySelectorAll(".drop-zone").forEach((zone) => {
      zone.addEventListener("click", () => {
        if (selectedItem) attemptDrop(selectedItem, zone);
      });
      zone.addEventListener("dragover", (event) => {
        event.preventDefault();
        zone.classList.add("over");
      });
      zone.addEventListener("dragleave", () => zone.classList.remove("over"));
      zone.addEventListener("drop", (event) => {
        event.preventDefault();
        zone.classList.remove("over");
        attemptDrop(event.dataTransfer.getData("text/plain"), zone);
      });
    });

    function attemptDrop(value, zone) {
      if (zone.classList.contains("correct")) return;
      const ok = value === zone.dataset.target;
      if (ok) {
        zone.classList.add("correct");
        zone.querySelector("span").textContent = `  ${value}`;
        const dragged = stage.querySelector(`[data-item="${CSS.escape(value)}"]`);
        if (dragged) dragged.disabled = true;
        selectedItem = null;
        matched += 1;
        updateScore(20);
      } else {
        updateScore(-3);
      }
      feedback(ok ? "Associação correta." : "Ainda não. Compare o símbolo com a descrição.", ok);
      if (matched === topic.pairs.length) stage.querySelector("[data-finish]").disabled = false;
    }
    stage.querySelector("[data-finish]").addEventListener("click", finish);
  }

  function renderMemory(topic, stage, updateScore, feedback, finish) {
    const cards = shuffle(topic.pairs.flatMap((pair, index) => [
      { text: pair.a, pair: index },
      { text: pair.b, pair: index }
    ]));
    let first = null;
    let lock = false;
    let matched = 0;
    stage.innerHTML = `
      <div class="game-question">Encontre os pares correspondentes.</div>
      <div class="memory-grid">
        ${cards.map((card, index) => `<button class="memory-card" type="button" data-index="${index}" data-pair="${card.pair}" data-text="${card.text}">?</button>`).join("")}
      </div>
    `;
    stage.querySelectorAll(".memory-card").forEach((card) => {
      card.addEventListener("click", () => {
        if (lock || card.classList.contains("matched") || card === first) return;
        card.textContent = card.dataset.text;
        if (!first) {
          first = card;
          return;
        }
        const ok = first.dataset.pair === card.dataset.pair;
        if (ok) {
          first.classList.add("matched");
          card.classList.add("matched");
          matched += 1;
          updateScore(18);
          feedback("Par encontrado.", true);
          first = null;
          if (matched === topic.pairs.length) setTimeout(finish, 700);
        } else {
          lock = true;
          updateScore(-3);
          feedback("Essas cartas não formam par.", false);
          setTimeout(() => {
            first.textContent = "?";
            card.textContent = "?";
            first = null;
            lock = false;
          }, 850);
        }
      });
    });
  }

  function renderCanvas(topic, stage, updateScore, feedback, finish) {
    const question = topic.questions[0];
    stage.innerHTML = `
      <canvas class="canvas-game" width="800" height="450" aria-label="Jogo em canvas"></canvas>
      <div class="game-question" style="margin-top:1rem">${question.prompt}</div>
      <div class="option-grid">
        ${question.options.map((option) => `<button class="option-button" type="button" data-value="${option}">${option}</button>`).join("")}
      </div>
    `;
    const canvas = stage.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    let x = 40;
    let direction = 1;
    let animation;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f9f8f";
      ctx.fillRect(0, 350, canvas.width, 100);
      ctx.fillStyle = "#ffb547";
      ctx.beginPath();
      ctx.arc(x, 320 - Math.sin(x / 55) * 65, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#172033";
      ctx.font = "bold 28px system-ui";
      ctx.fillText(topic.title, 28, 48);
      ctx.font = "20px system-ui";
      ctx.fillText("Observe a animação e responda ao desafio.", 28, 82);
      x += 2.5 * direction;
      if (x > canvas.width - 40 || x < 40) direction *= -1;
      animation = requestAnimationFrame(draw);
    }
    draw();

    stage.querySelectorAll(".option-button").forEach((button) => {
      button.addEventListener("click", () => {
        cancelAnimationFrame(animation);
        const ok = button.dataset.value === question.answer;
        button.classList.add(ok ? "correct" : "incorrect");
        updateScore(ok ? 25 : -5);
        feedback(question.feedback, ok);
        setTimeout(finish, 900);
      }, { once: true });
    });
  }

  window.ProfMilanyGame = {
    openGame,
    getProgress,
    getRanking
  };
})();
