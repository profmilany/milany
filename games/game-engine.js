// Motor gamificado da MathVibe. Cada conteúdo mantém seu jogo independente,
// mas agora possui cinco níveis internos, XP, estrelas e progresso salvo.
(function () {
  const STORAGE_KEY = "profmilany-progress-v2";
  const LEGACY_KEY = "profmilany-progress-v1";
  const RANKING_KEY = "profmilany-ranking-v1";
  const LEVELS = [
    { id: 1, name: "Muito fácil", label: "Nível 1" },
    { id: 2, name: "Fácil", label: "Nível 2" },
    { id: 3, name: "Médio", label: "Nível 3" },
    { id: 4, name: "Difícil", label: "Nível 4" },
    { id: 5, name: "Desafio final", label: "Nível 5" }
  ];

  const MECHANICS = {
    "funcao-1-grau": { type: "capture-coins", name: "Missão das Retas", medal: "Mestre das Funções" },
    "funcao-2-grau": { type: "capture-parabolas", name: "Missão das Parábolas", medal: "Arquiteto das Parábolas" },
    conjuntos: { type: "set-sort", name: "Laboratório de conjuntos", medal: "Guardião dos Conjuntos" },
    pa: { type: "sequence", name: "Sequência contra o tempo", medal: "Mestre das Sequências" },
    pg: { type: "growth", name: "Crescimento exponencial", medal: "Estrategista da PG" },
    "geometria-plana": { type: "puzzle", name: "Quebra-cabeça geométrico", medal: "Rei da Geometria" },
    "trigonometria-basica": { type: "aim", name: "Mira trigonométrica", medal: "Atirador Trigonométrico" },
    "analise-combinatoria": { type: "escape", name: "Escape room matemático", medal: "Chaveiro Combinatório" },
    probabilidade: { type: "simulator", name: "Simulador de eventos", medal: "Especialista em Probabilidade" },
    matrizes: { type: "robot-battle", name: "Batalha contra robôs", medal: "Comandante das Matrizes" },
    determinantes: { type: "doors", name: "Portas determinantes", medal: "Guardião dos Determinantes" },
    "sistemas-lineares": { type: "rescue", name: "Resgate linear", medal: "Herói dos Sistemas" },
    "geometria-espacial": { type: "solid", name: "Oficina 3D", medal: "Construtor Espacial" },
    logaritmos: { type: "race", name: "Corrida logarítmica", medal: "Corredor dos Logs" },
    "geometria-analitica": { type: "map", name: "Mapa cartesiano", medal: "Explorador Cartesiano" },
    estatistica: { type: "chart", name: "Investigação com gráficos", medal: "Detetive Estatístico" },
    "matematica-financeira": { type: "finance", name: "Simulador financeiro", medal: "Investidor Matemático" },
    "funcoes-exponenciais": { type: "city", name: "Cidade exponencial", medal: "Prefeito Exponencial" },
    "funcoes-logaritmicas": { type: "decode", name: "Missões de decodificação", medal: "Decodificador Logarítmico" },
    polinomios: { type: "combat", name: "Combate polinomial", medal: "Campeão dos Polinômios" },
    "numeros-complexos": { type: "complex-plane", name: "Navegação complexa", medal: "Navegador Complexo" }
  };

  const CAPTURE_COINS_DATA = {
    "funcao-1-grau": {
      1: {
        name: "Introdução",
        description: "Cada moeda exige uma função diferente",
        coins: [
          { id: 0, x: 1, y: 3, refA: 1, refB: 2, desc: "f(x) = x + 2" },
          { id: 1, x: 3, y: 7, refA: 2, refB: 1, desc: "f(x) = 2x + 1" },
          { id: 2, x: -1, y: 4, refA: -1, refB: 3, desc: "f(x) = -x + 3" }
        ]
      },
      2: {
        name: "Coeficiente Angular",
        description: "Varie a inclinação — inclui função decrescente",
        coins: [
          { id: 0, x: 2, y: 5, refA: 2, refB: 1, desc: "f(x) = 2x + 1" },
          { id: 1, x: 3, y: 0, refA: -1, refB: 3, desc: "f(x) = -x + 3", constraint: "decreasing" },
          { id: 2, x: -2, y: -3, refA: 1, refB: -1, desc: "f(x) = x - 1" }
        ]
      },
      3: {
        name: "Coeficiente Linear",
        description: "Ajuste o coeficiente linear com restrições",
        coins: [
          { id: 0, x: -1, y: 5, refA: -2, refB: 3, desc: "f(x) = -2x + 3", constraint: "decreasing" },
          { id: 1, x: 2, y: -3, refA: 2, refB: -7, desc: "f(x) = 2x - 7", constraint: "increasing" },
          { id: 2, x: 4, y: 1, refA: 1, refB: -3, desc: "f(x) = x - 3" }
        ]
      },
      4: {
        name: "Desafios",
        description: "Duas moedas alinhadas — uma função captura ambas!",
        coins: [
          { id: 0, x: 1, y: 4, refA: 2, refB: 2, desc: "f(x) = 2x + 2", pairedIds: [1] },
          { id: 1, x: 3, y: 8, refA: 2, refB: 2, desc: "f(x) = 2x + 2", pairedIds: [0] },
          { id: 2, x: 5, y: 6, refA: 1, refB: 1, desc: "f(x) = x + 1" }
        ]
      },
      5: {
        name: "Desafio Final",
        description: "Dois pares alinhados com restrições de crescimento",
        coins: [
          { id: 0, x: 1, y: 2, refA: 3, refB: -1, desc: "f(x) = 3x - 1", pairedIds: [1], constraint: "increasing" },
          { id: 1, x: 3, y: 8, refA: 3, refB: -1, desc: "f(x) = 3x - 1", pairedIds: [0] },
          { id: 2, x: 2, y: 4, refA: -3, refB: 10, desc: "f(x) = -3x + 10", pairedIds: [3], constraint: "decreasing" },
          { id: 3, x: 4, y: -2, refA: -3, refB: 10, desc: "f(x) = -3x + 10", pairedIds: [2] }
        ]
      }
    },
    "funcao-2-grau": {
      1: {
        name: "Introdução às Parábolas",
        description: "Use f(x)=ax²+bx+c para capturar moedas",
        coins: [
          { id: 0, x: 0, y: 1, refA: 1, refB: 0, refC: 1, desc: "f(x) = x² + 1", isQuad: true },
          { id: 1, x: 2, y: 3, refA: 1, refB: -4, refC: 7, desc: "f(x) = x² - 4x + 7", isQuad: true },
          { id: 2, x: -1, y: 4, refA: 1, refB: 0, refC: 3, desc: "f(x) = x² + 3", isQuad: true }
        ]
      },
      2: {
        name: "Vértice",
        description: "A moeda está no vértice da parábola",
        coins: [
          { id: 0, x: 2, y: 1, refA: 1, refB: -4, refC: 5, desc: "f(x) = x² - 4x + 5", isQuad: true, atVertex: true },
          { id: 1, x: -1, y: -2, refA: 1, refB: 2, refC: -1, desc: "f(x) = x² + 2x - 1", isQuad: true, atVertex: true },
          { id: 2, x: 1, y: 0, refA: 1, refB: -2, refC: 1, desc: "f(x) = x² - 2x + 1", isQuad: true }
        ]
      },
      3: {
        name: "Raízes",
        description: "Duas moedas são raízes — uma função captura ambas!",
        coins: [
          { id: 0, x: 1, y: 0, refA: 1, refB: -4, refC: 3, desc: "f(x) = x² - 4x + 3", isQuad: true, pairedIds: [1] },
          { id: 1, x: 3, y: 0, refA: 1, refB: -4, refC: 3, desc: "f(x) = x² - 4x + 3", isQuad: true, pairedIds: [0] },
          { id: 2, x: 2, y: 4, refA: -1, refB: 4, refC: 0, desc: "f(x) = -x² + 4x", isQuad: true }
        ]
      },
      4: {
        name: "Desafios",
        description: "Vértice e raízes combinados",
        coins: [
          { id: 0, x: 3, y: 2, refA: 1, refB: -6, refC: 11, desc: "f(x) = x² - 6x + 11", isQuad: true, atVertex: true },
          { id: 1, x: 1, y: 0, refA: 1, refB: -6, refC: 5, desc: "f(x) = x² - 6x + 5", isQuad: true, pairedIds: [2] },
          { id: 2, x: 5, y: 0, refA: 1, refB: -6, refC: 5, desc: "f(x) = x² - 6x + 5", isQuad: true, pairedIds: [1] }
        ]
      },
      5: {
        name: "Desafio Final",
        description: "Pares de raízes e parábola com vértice",
        coins: [
          { id: 0, x: -3, y: 0, refA: 1, refB: 2, refC: -3, desc: "f(x) = x² + 2x - 3", isQuad: true, pairedIds: [1] },
          { id: 1, x: 1, y: 0, refA: 1, refB: 2, refC: -3, desc: "f(x) = x² + 2x - 3", isQuad: true, pairedIds: [0] },
          { id: 2, x: 2, y: 3, refA: -1, refB: 4, refC: -1, desc: "f(x) = -x² + 4x - 1", isQuad: true, pairedIds: [3], constraint: "concaveDown" },
          { id: 3, x: 4, y: -1, refA: -1, refB: 4, refC: -1, desc: "f(x) = -x² + 4x - 1", isQuad: true, pairedIds: [2] }
        ]
      }
    }
  };

  function freshProgress() {
    return { totalXp: 0, games: {}, achievements: {}, completed: {}, scores: {} };
  }

  function getProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeProgress(JSON.parse(saved));

    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "null");
    const progress = freshProgress();
    if (legacy) {
      progress.completed = legacy.completed || {};
      progress.scores = legacy.scores || {};
      progress.achievements = legacy.achievements || {};
    }
    saveProgress(progress);
    return progress;
  }

  function normalizeProgress(progress) {
    progress.totalXp ||= 0;
    progress.games ||= {};
    progress.achievements ||= {};
    progress.completed ||= {};
    progress.scores ||= {};
    return progress;
  }

  function gameProgress(progress, topicId) {
    if (!progress.games[topicId]) {
      progress.games[topicId] = { unlockedLevel: 1, xp: 0, bestScore: 0, completed: false, stars: {}, history: [] };
    }
    return progress.games[topicId];
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(progress)));
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

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function starsText(stars) {
    return "★".repeat(stars) + "☆".repeat(3 - stars);
  }

  function playerLevel(totalXp) {
    return Math.floor(totalXp / 250) + 1;
  }

  function nextLevelPercent(totalXp) {
    return Math.round(((totalXp % 250) / 250) * 100);
  }

  function beep(type) {
    const enabled = localStorage.getItem("profmilany-sound") === "on";
    if (!enabled || !window.AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = type === "ok" ? 680 : type === "win" ? 880 : 220;
    gain.gain.value = 0.05;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.14);
  }

  function buildLevels(topic) {
    return LEVELS.map((level) => {
      const challenges = buildChallenges(topic, level.id);
      return { ...level, challenges };
    });
  }

  function buildChallenges(topic, level) {
    const baseQuestions = topic.questions?.length ? topic.questions : [];
    const basePairs = topic.pairs?.length ? topic.pairs : [];
    const fromQuestions = baseQuestions.map((question, index) => ({
      prompt: contextualize(question.prompt, topic.title, level, index),
      options: question.options || ["Verdadeiro", "Falso"],
      answer: question.answer,
      feedback: question.feedback || "Revise o conceito e tente novamente."
    }));
    const fromPairs = basePairs.map((pair) => ({
      item: pair.item || pair.a,
      target: pair.target || pair.b,
      prompt: `${pair.item || pair.a} corresponde a:`,
      options: shuffle(basePairs.map((item) => item.target || item.b)),
      answer: pair.target || pair.b,
      feedback: "Boa associação."
    }));
    const pool = [...fromQuestions, ...fromPairs];
    if (!pool.length) {
      return [
        { prompt: `Escolha a afirmação correta sobre ${topic.title}.`, options: ["Conceito essencial", "Ideia sem relação", "Resultado impossível"], answer: "Conceito essencial", feedback: "Você identificou a ideia central." }
      ];
    }
    return shuffle(pool).slice(0, Math.min(3, pool.length)).map((challenge, index) => ({
      ...challenge,
      scene: sceneFor(topic.id, level, index)
    }));
  }

  function contextualize(prompt, title, level, index) {
    const prefixes = [
      "Aquecimento:",
      "Reconhecimento:",
      "Análise:",
      "Situação-problema:",
      "Desafio estilo ENEM:"
    ];
    if (level <= 2) return `${prefixes[level - 1]} ${prompt}`;
    if (level === 3) return `${prefixes[2]} Em ${title}, ${prompt}`;
    if (level === 4) return `${prefixes[3]} Uma turma está resolvendo ${title}. ${prompt}`;
    return `${prefixes[4]} Missão ${index + 1}: ${prompt}`;
  }

  function sceneFor(topicId, level, index) {
    const value = level + index + 1;
    const scenes = {
      "funcao-2-grau": `y = x² ${value % 2 ? "- 4" : "+ 2x - 3"}`,
      "trigonometria-basica": `${30 + level * 10}°`,
      probabilidade: `${value * 7} simulações`,
      "matematica-financeira": `R$ ${100 + level * 80},00`,
      "numeros-complexos": `${level}+${index + 1}i`
    };
    return scenes[topicId] || `Fase ${level}.${index + 1}`;
  }

  function openGame(topic, year) {
    const root = document.querySelector("[data-game-root]") || document.body;
    const mechanic = MECHANICS[topic.id] || { type: topic.gameType || "investigation", name: topic.badge, medal: "Medalha Matemática" };
    const levels = buildLevels(topic);
    const progress = getProgress();
    const current = gameProgress(progress, topic.id);
    let timer = null;
    let activeLevel = Math.min(current.unlockedLevel, 5);

    root.innerHTML = `
      <div class="game-backdrop" role="dialog" aria-modal="true" aria-label="Jogo ${escapeHtml(topic.title)}">
        <section class="game-modal expanded">
          <div class="game-header">
            <div>
              <p class="eyebrow">${escapeHtml(mechanic.name)}</p>
              <h2>${escapeHtml(topic.title)}</h2>
            </div>
            <button class="icon-button" type="button" data-close-game aria-label="Fechar jogo">×</button>
          </div>
          <div class="player-panel">
            <div>
              <strong>XP do jogador: <span data-total-xp>${progress.totalXp}</span></strong>
              <span>Nível ${playerLevel(progress.totalXp)}</span>
            </div>
            <div class="progress-track"><span data-player-xp-bar style="width:${nextLevelPercent(progress.totalXp)}%"></span></div>
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
    const soundToggle = root.querySelector("[data-sound-toggle]");
    soundToggle.checked = localStorage.getItem("profmilany-sound") === "on";
    soundToggle.addEventListener("change", () => localStorage.setItem("profmilany-sound", soundToggle.checked ? "on" : "off"));

    function close() {
      clearInterval(timer);
      root.innerHTML = "";
    }

    function feedback(message, ok) {
      root.querySelector("[data-feedback]").textContent = message;
      root.querySelector(".game-modal").classList.toggle("pulse-ok", Boolean(ok));
      beep(ok ? "ok" : "error");
      setTimeout(() => root.querySelector(".game-modal")?.classList.remove("pulse-ok"), 450);
    }

    function renderMenu() {
      const fresh = getProgress();
      const game = gameProgress(fresh, topic.id);
      const totalStars = Object.values(game.stars).reduce((sum, value) => sum + value, 0);
      stage.innerHTML = `
        <div class="game-map">
          <div class="map-intro">
            <span class="badge">${escapeHtml(mechanic.name)}</span>
            <h3>Jornada interna do jogo</h3>
            <p>Escolha um nível desbloqueado. Cada fase aumenta a dificuldade dentro deste mesmo conteúdo.</p>
            <div class="mini-stats">
              <span>XP do jogo: <strong>${game.xp}</strong></span>
              <span>Melhor pontuação: <strong>${game.bestScore}</strong></span>
              <span>Estrelas: <strong>${totalStars}/15</strong></span>
            </div>
          </div>
          <div class="level-path">
            ${levels.map((level) => {
              const locked = level.id > game.unlockedLevel;
              const stars = game.stars[level.id] || 0;
              return `
                <button class="level-node ${locked ? "locked" : ""}" type="button" data-level="${level.id}" ${locked ? "disabled" : ""}>
                  <span>${locked ? "🔒" : "●"}</span>
                  <strong>${level.label}</strong>
                  <small>${level.name}</small>
                  <em>${starsText(stars)}</em>
                </button>
              `;
            }).join("")}
          </div>
        </div>
      `;
      stage.querySelectorAll("[data-level]").forEach((button) => {
        button.addEventListener("click", () => startLevel(Number(button.dataset.level)));
      });
    }

    function startLevel(levelId) {
      activeLevel = levelId;
      clearInterval(timer);
      const level = levels[levelId - 1];
      const state = {
        level,
        score: 0,
        xp: 0,
        correct: 0,
        wrong: 0,
        index: 0,
        startedAt: Date.now(),
        finished: false
      };

      stage.innerHTML = `
        <div class="level-hud">
          <div>
            <span class="badge">${level.label}</span>
            <strong>${level.name}</strong>
          </div>
          <div class="level-meters">
            <span>Pontos <strong data-score>0</strong></span>
            <span>XP <strong data-level-xp>0</strong></span>
            <span>Tempo <strong data-time>00:00</strong></span>
          </div>
        </div>
        <div class="progress-track"><span data-level-progress style="width:0%"></span></div>
        <div class="mechanic-shell ${mechanic.type}" data-mechanic-stage></div>
      `;

      timer = setInterval(() => {
        const seconds = Math.floor((Date.now() - state.startedAt) / 1000);
        const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
        const rest = String(seconds % 60).padStart(2, "0");
        stage.querySelector("[data-time]").textContent = `${minutes}:${rest}`;
      }, 1000);

      if (mechanic.type === "capture-coins" || mechanic.type === "capture-parabolas") {
        startCaptureCoins(topic, activeLevel, mechanic, state, stage, finishLevel, feedback);
        return;
      }

      renderChallenge(topic, mechanic, state, stage.querySelector("[data-mechanic-stage]"), answerChallenge, finishLevel);

      function answerChallenge(ok, message) {
        if (ok) {
          state.correct += 1;
          state.score += 20;
          state.xp += 10;
        } else {
          state.wrong += 1;
          state.score = Math.max(0, state.score - 5);
        }
        stage.querySelector("[data-score]").textContent = state.score;
        stage.querySelector("[data-level-xp]").textContent = state.xp;
        feedback(message, ok);
        state.index += 1;
        stage.querySelector("[data-level-progress]").style.width = `${Math.round((state.index / state.level.challenges.length) * 100)}%`;
        setTimeout(() => {
          if (state.index >= state.level.challenges.length) finishLevel(state);
          else renderChallenge(topic, mechanic, state, stage.querySelector("[data-mechanic-stage]"), answerChallenge, finishLevel);
        }, 850);
      }
    }

    function finishLevel(state) {
      if (state.finished) return;
      state.finished = true;
      clearInterval(timer);
      const missionsForLevel = CAPTURE_COINS_DATA[topic.id]?.[state.level.id];
      const total = missionsForLevel
        ? missionsForLevel.coins.length - missionsForLevel.coins.filter((c) => c.pairedIds && c.pairedIds.some((pid) => pid < c.id)).length
        : state.level.challenges.length;
      const accuracy = Math.round((state.correct / total) * 100);
      const stars = accuracy >= 90 && state.wrong === 0 ? 3 : accuracy >= 65 ? 2 : 1;
      const bonus = state.wrong === 0 ? 30 : 0;
      const gainedXp = state.xp + 50 + bonus;
      const progress = getProgress();
      const game = gameProgress(progress, topic.id);
      game.unlockedLevel = Math.max(game.unlockedLevel, Math.min(5, state.level.id + 1));
      game.stars[state.level.id] = Math.max(game.stars[state.level.id] || 0, stars);
      game.xp += gainedXp;
      game.bestScore = Math.max(game.bestScore, state.score);
      game.history.push({ level: state.level.id, stars, score: state.score, xp: gainedXp, date: new Date().toISOString() });
      progress.totalXp += gainedXp;
      progress.scores[topic.id] = Math.max(progress.scores[topic.id] || 0, game.bestScore);

      if (state.level.id === 5) {
        game.completed = true;
        progress.completed[topic.id] = true;
        unlockMedals(progress, topic, mechanic);
        if (Number(year) === 3) updateRanking(topic, game.bestScore);
      }

      saveProgress(progress);
      updatePlayerPanel(progress);
      beep("win");

      const finalLevel = state.level.id === 5;
      stage.innerHTML = `
        <div class="victory-card ${finalLevel ? "final" : ""}">
          <div class="celebration">${finalLevel ? "🏆" : "✅"}</div>
          <h3>${finalLevel ? "Conteúdo concluído" : "Nível concluído"}</h3>
          <p>${finalLevel ? `Você conquistou a medalha: ${mechanic.medal}.` : "O próximo nível deste jogo foi desbloqueado."}</p>
          <div class="result-grid">
            <div><span>Estrelas</span><strong>${starsText(stars)}</strong></div>
            <div><span>XP conquistado</span><strong>${gainedXp}</strong></div>
            <div><span>Aproveitamento</span><strong>${accuracy}%</strong></div>
            <div><span>Pontuação</span><strong>${state.score}</strong></div>
          </div>
          ${finalLevel ? `<p class="review-tip">Sugestão: revise a sequência didática e crie uma nova questão contextualizada para fixar ${escapeHtml(topic.title)}.</p>` : ""}
          <div class="topic-actions">
            <button class="btn secondary" type="button" data-repeat>Repetir nível</button>
            ${finalLevel ? `<button class="btn primary" type="button" data-menu>Voltar ao menu do conteúdo</button>` : `<button class="btn primary" type="button" data-next>Próximo nível</button>`}
            <button class="btn ghost" type="button" data-menu>Menu do conteúdo</button>
          </div>
        </div>
      `;
      if (finalLevel) launchConfetti(stage);
      stage.querySelector("[data-repeat]")?.addEventListener("click", () => startLevel(state.level.id));
      stage.querySelector("[data-next]")?.addEventListener("click", () => startLevel(Math.min(5, state.level.id + 1)));
      stage.querySelectorAll("[data-menu]").forEach((button) => button.addEventListener("click", renderMenu));
    }

    function updatePlayerPanel(progress) {
      root.querySelector("[data-total-xp]").textContent = progress.totalXp;
      root.querySelector("[data-player-xp-bar]").style.width = `${nextLevelPercent(progress.totalXp)}%`;
    }

    function startCaptureCoins(topic, levelId, mechanic, state, stage, onFinish, feedback) {
      const missions = CAPTURE_COINS_DATA[topic.id]?.[levelId];
      if (!missions) { feedback("Missão não encontrada!", false); return; }

      const isQuad = missions.coins[0]?.isQuad;
      let currentCoinIndex = 0;
      let attempts = 0;
      let captured = [];
      let lastCurveFunc = null;
      const mechanicStage = stage.querySelector("[data-mechanic-stage]");

      function parseLinear(s) {
        s = s.replace(/\*x/g, "x");
        if (s === "x") return { a: 1, b: 0 };
        if (s === "-x") return { a: -1, b: 0 };
        const xIdx = s.indexOf("x");
        if (xIdx >= 0) {
          let aStr = s.slice(0, xIdx), rest = s.slice(xIdx + 1);
          let a = 1;
          if (aStr === "" || aStr === "+") a = 1;
          else if (aStr === "-") a = -1;
          else if (aStr.includes("/")) { const p = aStr.split("/"); a = parseFloat(p[0]) / parseFloat(p[1]); }
          else a = parseFloat(aStr);
          let b = 0;
          if (rest) {
            rest = rest.replace(/\+/g, " +").replace(/-/g, " -").trim();
            for (const part of rest.split(/\s+/).filter(Boolean)) { const n = parseFloat(part); if (!isNaN(n)) b += n; }
          }
          return { a, b, c: 0 };
        }
        const n = parseFloat(s);
        if (!isNaN(n)) return { a: 0, b: n, c: 0 };
        return null;
      }

      function parseQuadratic(s) {
        s = s.replace(/²/g, "^2").replace(/x2(?!\d)/g, "x^2").replace(/x\^2/g, "q").replace(/\*x/g, "x");
        let a = 0, b = 0, c = 0;
        let t = s.replace(/-/g, "+-").split("+").filter(Boolean);
        for (const term of t) {
          if (term.includes("q")) {
            const parts = term.split("q");
            const coef = parts[0];
            if (coef === "" || coef === "1") a += 1;
            else if (coef === "-1") a += -1;
            else a += parseFloat(coef);
          } else if (term.includes("x")) {
            const parts = term.split("x");
            const coef = parts[0];
            if (coef === "" || coef === "1") b += 1;
            else if (coef === "-1") b += -1;
            else b += parseFloat(coef);
          } else if (term !== "") {
            c += parseFloat(term);
          }
        }
        return { a, b, c };
      }

      function parseFunction(input) {
        let s = input.replace(/\s/g, "").toLowerCase();
        s = s.replace(/^f\(x\)=/, "");
        if (!s) return null;
        if (isQuad) return parseQuadratic(s);
        return parseLinear(s);
      }

      function constraintLabel(coin) {
        if (!coin.constraint) return "";
        const labels = { increasing: "CRESCENTE (a>0)", decreasing: "DECRESCENTE (a<0)", concaveUp: "CÔNCAVA P/CIMA (a>0)", concaveDown: "CÔNCAVA P/BAIXO (a<0)" };
        return labels[coin.constraint] || "";
      }

      function checkConstraint(parsed, coin) {
        if (!coin.constraint) return null;
        if (coin.constraint === "increasing" && parsed.a <= 0) return "A função precisa ser CRESCENTE (a > 0).";
        if (coin.constraint === "decreasing" && parsed.a >= 0) return "A função precisa ser DECRESCENTE (a < 0).";
        if (coin.constraint === "concaveUp" && parsed.a <= 0) return "A parábola precisa ter concavidade para CIMA (a > 0).";
        if (coin.constraint === "concaveDown" && parsed.a >= 0) return "A parábola precisa ter concavidade para BAIXO (a < 0).";
        return null;
      }

      function drawCanvas(coin, curveFunc) {
        const canvas = mechanicStage.querySelector("#ccCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = canvas.width, H = canvas.height, pad = 40;
        const gW = W - pad * 2, gH = H - pad * 2;
        const xMin = -8, xMax = 8, yMin = -8, yMax = 8;
        const xS = gW / (xMax - xMin), yS = gH / (yMax - yMin);

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--surface") || "#f8faff";
        ctx.fillRect(0, 0, W, H);

        const gridColor = getComputedStyle(document.documentElement).getPropertyValue("--border") || "#e0e8f0";
        const textColor = getComputedStyle(document.documentElement).getPropertyValue("--muted") || "#666";
        ctx.strokeStyle = gridColor; ctx.lineWidth = 0.5;
        for (let i = xMin; i <= xMax; i++) { const x = pad + (i - xMin) * xS; ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, H - pad); ctx.stroke(); }
        for (let i = yMin; i <= yMax; i++) { const y = H - pad - (i - yMin) * yS; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); }
        const y0 = H - pad - (0 - yMin) * yS, x0 = pad + (0 - xMin) * xS;
        ctx.strokeStyle = textColor; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(pad, y0); ctx.lineTo(W - pad, y0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x0, pad); ctx.lineTo(x0, H - pad); ctx.stroke();
        ctx.fillStyle = textColor; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        for (let i = xMin; i <= xMax; i++) { if (i === 0) continue; ctx.fillText(i, pad + (i - xMin) * xS, y0 + 16); }
        ctx.textAlign = "right";
        for (let i = yMin; i <= yMax; i++) { if (i === 0) continue; ctx.fillText(i, x0 - 6, H - pad - (i - yMin) * yS + 4); }
        ctx.fillStyle = textColor; ctx.textAlign = "center"; ctx.font = "bold 11px sans-serif";
        ctx.fillText("x", W - pad + 12, y0 + 4); ctx.fillText("y", x0 - 14, pad - 6); ctx.fillText("0", x0 - 10, y0 + 16);

        const func = curveFunc || lastCurveFunc;
        if (func) {
          ctx.strokeStyle = "#0f9f8f"; ctx.lineWidth = 3;
          ctx.beginPath(); let first = true;
          for (let px = 0; px <= gW; px++) {
            const xVal = xMin + (px / gW) * (xMax - xMin);
            const yVal = func(xVal);
            if (isFinite(yVal)) {
              const cx = pad + px, cy = H - pad - (yVal - yMin) * yS;
              if (first) { ctx.moveTo(cx, cy); first = false; } else ctx.lineTo(cx, cy);
            }
          }
          ctx.stroke();
        }

        missions.coins.forEach((c) => {
          const cp = captured.includes(c.id);
          const cx = pad + (c.x - xMin) * xS, cy = H - pad - (c.y - yMin) * yS;
          if (cp) {
            ctx.fillStyle = "#4caf50"; ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#fff"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("✓", cx, cy + 4);
          } else {
            const grad = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 12);
            grad.addColorStop(0, "#ffd700"); grad.addColorStop(0.6, "#ffa500"); grad.addColorStop(1, "#b8860b");
            ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#b8860b"; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = "#8B6914"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center"; ctx.fillText("$", cx, cy + 4);
          }
        });

        const cur = missions.coins[currentCoinIndex];
        if (cur && !captured.includes(cur.id)) {
          ctx.fillStyle = "#ef5b7d"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center";
          ctx.fillText("◉", pad + (cur.x - xMin) * xS, H - pad - (cur.y - yMin) * yS - 18);
        }
      }

      function renderCoinGrid() {
        const grid = mechanicStage.querySelector(".cc-coin-grid");
        if (!grid) return;
        grid.innerHTML = missions.coins.map((c, i) => {
          const cp = captured.includes(c.id);
          return `<span class="cc-coin-dot ${cp ? "captured" : i === currentCoinIndex ? "active" : ""}">${cp ? "✓" : "$"}</span>`;
        }).join("");
      }

      function skipCaptured() {
        while (currentCoinIndex < missions.coins.length && captured.includes(missions.coins[currentCoinIndex].id)) {
          currentCoinIndex++;
        }
      }

      function updateHUD() {
        skipCaptured();
        const cur = missions.coins[currentCoinIndex];
        const target = cur || { x: "?", y: "?" };
        mechanicStage.querySelector(".cc-mission-target").textContent = `(${target.x}, ${target.y})`;
        mechanicStage.querySelector(".cc-coin-count").textContent = `${captured.length}/${missions.coins.length}`;
        mechanicStage.querySelector("[data-cc-score]").textContent = state.score;
        mechanicStage.querySelector("[data-cc-attempts]").textContent = attempts;
        mechanicStage.querySelector("[data-cc-xp]").textContent = state.xp;
        renderCoinGrid();
      }

      function render() {
        const cur = missions.coins[currentCoinIndex];
        const stdHud = stage.querySelector(".level-hud");
        const stdProg = stage.querySelector(".progress-track");
        if (stdHud) stdHud.style.display = "none";
        if (stdProg) stdProg.style.display = "none";
        mechanicStage.style.padding = "0";

        const constraint = constraintLabel(cur);
        const inputPlaceholder = isQuad ? "ex: x²+2x+1" : "ex: 2x+1";
        const inputLabel = isQuad ? "Digite f(x)=ax²+bx+c (use x² ou x^2 ou x2):" : "Digite f(x)=ax+b:";
        const hintText = isQuad ? "Digite a função quadrática e clique em \"Construir parábola\"." : "Capture a moeda digitando f(x)=ax+b.";

        mechanicStage.innerHTML = `
          <div class="cc-layout">
            <div class="cc-canvas-area">
              <canvas id="ccCanvas" class="cc-canvas"></canvas>
              <div class="cc-mission-bar">
                <span class="cc-mission-label">${constraint ? `Missão (${constraint}):` : "Missão:"}</span>
                <span class="cc-mission-target">(${cur.x}, ${cur.y})</span>
              </div>
            </div>
            <div class="cc-panel">
              <div class="cc-level-title">
                <strong>Nível ${levelId} — ${missions.name}</strong>
                <span>${missions.description}</span>
                ${constraint ? `<span class="cc-constraint-badge">${constraint}</span>` : ""}
              </div>
              <div class="cc-stats">
                <div><span>Moedas</span><strong class="cc-coin-count">0/${missions.coins.length}</strong></div>
                <div><span>Pontos</span><strong data-cc-score>0</strong></div>
                <div><span>Tentativas</span><strong data-cc-attempts>0</strong></div>
                <div><span>XP</span><strong data-cc-xp>0</strong></div>
              </div>
              <div class="cc-input-area">
                <label>${inputLabel}</label>
                <div class="cc-input-row">
                  <span class="cc-fx">f(x) =</span>
                  <input type="text" id="ccFunctionInput" class="cc-input" placeholder="${inputPlaceholder}" autocomplete="off" spellcheck="false">
                </div>
                <button class="btn primary" id="ccBuildBtn" type="button">${isQuad ? "Construir parábola" : "Construir reta"}</button>
              </div>
              <div class="cc-progress-area">
                <span class="cc-progress-label">Progresso das moedas:</span>
                <div class="cc-coin-grid"></div>
              </div>
              <div class="cc-feedback-area" id="ccFeedback">
                <p class="cc-mission-text">${hintText}</p>
              </div>
            </div>
          </div>
        `;

        resizeCanvas();
        drawCanvas(cur, null);
        renderCoinGrid();
        updateHUD();

        const input = mechanicStage.querySelector("#ccFunctionInput");
        const buildBtn = mechanicStage.querySelector("#ccBuildBtn");

        function doCheck() {
          if (captured.length >= missions.coins.length) return;
          const val = input.value.trim();
          if (!val) { feedback("Digite uma função primeiro!", false); return; }
          const parsed = parseFunction(val);
          if (!parsed || (isQuad && (parsed.a === undefined || parsed.b === undefined || parsed.c === undefined))) {
            feedback(isQuad ? "Formato inválido. Use ax²+bx+c, ex: x²+2x+1 (use x², x^2 ou x2)." : "Formato inválido. Use f(x)=ax+b, ex: 2x+1", false);
            return;
          }

          const coin = missions.coins[currentCoinIndex];
          const result = isQuad ? parsed.a * coin.x * coin.x + parsed.b * coin.x + parsed.c : parsed.a * coin.x + parsed.b;

          if (isQuad) lastCurveFunc = (x) => parsed.a * x * x + parsed.b * x + parsed.c;
          else lastCurveFunc = (x) => parsed.a * x + parsed.b;
          drawCanvas(coin, lastCurveFunc);

          const constraintMsg = checkConstraint(parsed, coin);
          if (constraintMsg) {
            attempts++; state.wrong++; state.score = Math.max(0, state.score - 3);
            feedback(constraintMsg + " Tente novamente.", false);
            updateHUD(); return;
          }

          if (Math.abs(result - coin.y) < 0.01) {
            let newlyCaptured = [coin.id];
            if (coin.pairedIds) {
              coin.pairedIds.forEach((pid) => {
                const pc = missions.coins.find((c) => c.id === pid);
                if (pc && !captured.includes(pid)) {
                  const pr = isQuad ? parsed.a * pc.x * pc.x + parsed.b * pc.x + parsed.c : parsed.a * pc.x + parsed.b;
                  if (Math.abs(pr - pc.y) < 0.01 && !captured.includes(pid)) newlyCaptured.push(pid);
                }
              });
            }
            newlyCaptured.forEach((id) => { if (!captured.includes(id)) captured.push(id); });
            state.correct++;
            const bonus = Math.max(10, 20 - attempts * 2);
            state.score += bonus * newlyCaptured.length;
            state.xp += 10 * newlyCaptured.length;
            attempts = 0;
            const msg = newlyCaptured.length > 1 ? `${newlyCaptured.length} moedas capturadas! ✓✓` : "Moeda capturada! ✓";
            feedback(msg, true);
            beep("ok");
            if (captured.length >= missions.coins.length) {
              state.score += 30; state.xp += 20;
              mechanicStage.querySelector(".cc-mission-text").textContent = "Todas as moedas capturadas! Missão cumprida! 🎉";
              setTimeout(() => onFinish(state), 1200);
            } else {
              setTimeout(() => {
                updateHUD();
                mechanicStage.querySelector(".cc-mission-text").textContent = newlyCaptured.length > 1 ? "Par alinhado capturado! Próximo alvo:" : "Moeda capturada! Próximo alvo:";
              }, 300);
            }
          } else {
            attempts++; state.wrong++; state.score = Math.max(0, state.score - 3);
            let hint = "";
            if (isQuad) {
              if (parsed.a !== coin.refA) hint = "ajuste o coeficiente a (termo quadrático)";
              else if (parsed.b !== coin.refB) hint = "ajuste o coeficiente b (termo linear)";
              else hint = "ajuste o coeficiente c (termo constante)";
            } else {
              if (parsed.a !== coin.refA) hint = "ajuste o coeficiente angular (a)";
              else hint = "ajuste o coeficiente linear (b)";
            }
            feedback(`A curva não passou em (${coin.x}, ${coin.y}). f(${coin.x}) = ${result.toFixed(1)}. Dica: ${hint}.`, false);
            updateHUD();
          }
        }

        buildBtn.addEventListener("click", doCheck);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") doCheck(); });
        setTimeout(() => input.focus(), 200);
      }

      function resizeCanvas() {
        const canvas = mechanicStage.querySelector("#ccCanvas");
        if (!canvas) return;
        const container = mechanicStage.querySelector(".cc-canvas-area");
        const rect = container.getBoundingClientRect();
        const size = Math.min(rect.width - 2, 600);
        canvas.width = size; canvas.height = size;
      }

      render();
      window.addEventListener("resize", resizeCanvas);
    }

    root.querySelectorAll("[data-close-game]").forEach((button) => button.addEventListener("click", close));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });
    renderMenu();
  }

  function renderChallenge(topic, mechanic, state, stage, answerChallenge) {
    const challenge = state.level.challenges[state.index];
    const renderers = {
      investigation: renderInvestigation,
      parabola: renderParabola,
      "set-sort": renderSetSort,
      sequence: renderSequence,
      growth: renderGrowth,
      puzzle: renderPuzzle,
      aim: renderAim,
      escape: renderEscape,
      simulator: renderSimulator,
      "robot-battle": renderRobotBattle,
      doors: renderDoors,
      rescue: renderRescue,
      solid: renderSolid,
      race: renderRace,
      map: renderMap,
      chart: renderChart,
      finance: renderFinance,
      city: renderCity,
      decode: renderDecode,
      combat: renderCombat,
      "complex-plane": renderComplexPlane,
      "capture-coins": renderCaptureCoins,
      "capture-parabolas": renderCaptureCoins
    };
    (renderers[mechanic.type] || renderInvestigation)(topic, challenge, state, stage, answerChallenge);
  }

  function optionsHtml(challenge, className = "option-button") {
    return shuffle(challenge.options || ["Verdadeiro", "Falso"]).map((option) => (
      `<button class="${className}" type="button" data-value="${escapeHtml(option)}">${escapeHtml(option)}</button>`
    )).join("");
  }

  function bindOptions(stage, challenge, answerChallenge, okMessage = "Resposta correta. Você avançou na fase.") {
    stage.querySelectorAll("[data-value]").forEach((button) => {
      button.addEventListener("click", () => {
        const ok = String(button.dataset.value) === String(challenge.answer);
        button.classList.add(ok ? "correct" : "incorrect");
        answerChallenge(ok, ok ? okMessage : challenge.feedback || "Ainda não. Observe as pistas e tente no próximo desafio.");
      }, { once: true });
    });
  }

  function renderInvestigation(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="scene-card detective">
        <span>🔎 Pista ${state.index + 1}</span>
        <h3>Descubra a função correta</h3>
        <p>${escapeHtml(challenge.prompt)}</p>
      </div>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Investigação resolvida.");
  }

  function renderParabola(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="plane-scene">
        <svg viewBox="0 0 420 220" role="img" aria-label="Plano cartesiano com parábola">
          <path d="M20 110H400M210 15V205" />
          <path class="curve" d="M60 185 Q210 ${45 + state.level.id * 8} 360 185" />
          <circle cx="${150 + state.level.id * 18}" cy="${70 + state.index * 20}" r="8" />
        </svg>
        <p>${escapeHtml(challenge.prompt)}</p>
      </div>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Parábola ajustada com sucesso.");
  }

  function renderSetSort(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="set-lab">
        <button class="drag-item selected" type="button">${escapeHtml(challenge.item || challenge.prompt)}</button>
        <div class="set-zone">
          <button data-value="${escapeHtml(challenge.answer)}">Conjunto correto</button>
          <button data-value="distrator-${state.index}">Fora do conjunto</button>
        </div>
        <p>${escapeHtml(challenge.prompt)}</p>
      </div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Elemento classificado.");
  }

  function renderSequence(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="sequence-game">
        <div class="sequence-strip"><span>2</span><span>4</span><span>6</span><span>?</span></div>
        <p>${escapeHtml(challenge.prompt)}</p>
      </div>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Sequência completada antes do tempo.");
  }

  function renderGrowth(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="growth-scene">
        ${[1, 2, 3, 4, 5].map((bar) => `<span style="height:${32 + bar * state.level.id * 8}px"></span>`).join("")}
      </div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Crescimento previsto corretamente.");
  }

  function renderPuzzle(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="geometry-puzzle">
        <div class="piece triangle"></div><div class="piece square"></div><div class="piece circle"></div>
      </div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Peça encaixada.");
  }

  function renderAim(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="aim-game">
        <div class="target"><span>${escapeHtml(challenge.scene)}</span></div>
        <div class="arrow"></div>
      </div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Mira calculada.");
  }

  function renderEscape(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="escape-room">
        <div class="door-art">▣</div>
        <p>${escapeHtml(challenge.prompt)}</p>
        <small>Escolha o código para destravar a sala.</small>
      </div>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Código aceito. Porta aberta.");
  }

  function renderSimulator(topic, challenge, state, stage, answerChallenge) {
    const rolls = Array.from({ length: 6 }, (_, index) => 1 + ((index + state.level.id + state.index) % 6));
    stage.innerHTML = `
      <div class="dice-simulator">${rolls.map((roll) => `<span>${roll}</span>`).join("")}</div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Evento estimado corretamente.");
  }

  function renderRobotBattle(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="battle-scene">
        <div class="avatar">Você</div><div class="laser"></div><div class="robot">Robô ${state.level.id}</div>
      </div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Robô derrotado.");
  }

  function renderDoors(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="door-grid">${optionsHtml(challenge, "door-option")}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Porta correta aberta.");
  }

  function renderRescue(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="rescue-scene"><span>🧍</span><div class="bridge"></div><span>🏁</span></div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Personagem salvo.");
  }

  function renderSolid(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="solid-workshop"><div class="cube"></div><div class="prism"></div><div class="sphere"></div></div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Sólido montado.");
  }

  function renderRace(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="race-track"><span style="left:${16 + state.index * 22}%">🏎</span></div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Você avançou na corrida.");
  }

  function renderMap(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="cartesian-map"><span style="left:${38 + state.level.id * 7}%;top:${28 + state.index * 15}%"></span></div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Ponto localizado.");
  }

  function renderChart(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="chart-investigation">${[42, 66, 38, 74].map((height) => `<span style="height:${height + state.level.id * 4}px"></span>`).join("")}</div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Dado interpretado.");
  }

  function renderFinance(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="finance-sim"><strong>${escapeHtml(challenge.scene)}</strong><div class="coin-row"><span></span><span></span><span></span></div></div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Investimento planejado.");
  }

  function renderCity(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="city-growth">${[1, 2, 3, 4].map((tower) => `<span style="height:${42 + tower * state.level.id * 9}px"></span>`).join("")}</div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Crescimento controlado.");
  }

  function renderDecode(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="decode-panel"><span>LOG</span><span>→</span><span>?</span></div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Mensagem decodificada.");
  }

  function renderCombat(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="combat-scene"><div>HP ${100 - state.index * 25}</div><div class="slash"></div><div>Polinômio</div></div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Ataque certeiro.");
  }

  function renderComplexPlane(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `
      <div class="complex-plane"><span style="left:${45 + state.level.id * 6}%;top:${52 - state.index * 12}%"></span></div>
      <p class="game-question">${escapeHtml(challenge.prompt)}</p>
      <div class="option-grid">${optionsHtml(challenge)}</div>
    `;
    bindOptions(stage, challenge, answerChallenge, "Navegação concluída.");
  }

  function renderCaptureCoins(topic, challenge, state, stage, answerChallenge) {
    stage.innerHTML = `<p class="game-question">Jogo Missão das Retas carregando...</p>`;
  }

  function unlockMedals(progress, topic, mechanic) {
    progress.achievements["first-game"] = true;
    progress.achievements[topic.id] = true;
    progress.achievements[`medal-${topic.id}`] = mechanic.medal;
    const completedCount = Object.keys(progress.completed).length;
    progress.achievements["five-games"] = completedCount >= 5;
    progress.achievements["score-100"] = progress.totalXp >= 100;
    progress.achievements["all-topics"] = completedCount >= 21;
  }

  function updateRanking(topic, score) {
    const entries = getRanking();
    entries.push({ topic: topic.title, score, date: new Date().toLocaleDateString("pt-BR") });
    entries.sort((a, b) => b.score - a.score);
    saveRanking(entries);
  }

  function launchConfetti(stage) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.innerHTML = Array.from({ length: 18 }, (_, index) => `<span style="--i:${index}"></span>`).join("");
    stage.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1800);
  }

  window.ProfMilanyGame = {
    openGame,
    getProgress,
    getRanking,
    playerLevel,
    nextLevelPercent,
    mechanics: MECHANICS
  };
})();
