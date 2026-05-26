// Controla navegação, tema, cards de conteúdo, progresso e ranking local.
(function () {
  const data = window.PROFMILANY_DATA;

  function initTheme() {
    const saved = localStorage.getItem("profmilany-theme");
    if (saved === "dark") document.documentElement.dataset.theme = "dark";
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const isDark = document.documentElement.dataset.theme === "dark";
        document.documentElement.dataset.theme = isDark ? "" : "dark";
        localStorage.setItem("profmilany-theme", isDark ? "light" : "dark");
      });
    });
  }

  function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function initBackToTop() {
    const button = document.querySelector(".back-to-top");
    if (!button) return;
    window.addEventListener("scroll", () => {
      button.classList.toggle("visible", window.scrollY > 500);
    });
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  function updateProgressUI() {
    const progress = window.ProfMilanyGame.getProgress();
    const total = Object.values(data.years).flat().length;
    const completed = Object.keys(progress.completed).length;
    const percent = Math.round((completed / total) * 100);
    document.querySelectorAll("[data-progress-label]").forEach((item) => item.textContent = `${percent}%`);
    document.querySelectorAll("[data-progress-bar]").forEach((item) => item.style.width = `${percent}%`);
    document.querySelectorAll("[data-achievement]").forEach((item) => {
      item.classList.toggle("unlocked", Boolean(progress.achievements[item.dataset.achievement]));
    });
  }

  function renderTopics() {
    const container = document.querySelector("[data-topics]");
    if (!container) return;
    const year = document.body.dataset.year;
    const topics = data.years[year] || [];
    const progress = window.ProfMilanyGame.getProgress();

    container.innerHTML = topics.map((topic) => `
      <article class="topic-card reveal">
        <div class="topic-topline">
          <span class="badge">${topic.badge}</span>
          <span class="achievement-pill ${progress.completed[topic.id] ? "unlocked" : ""}">${progress.completed[topic.id] ? "Concluído" : "Novo"}</span>
        </div>
        <h3>${topic.title}</h3>
        <p>${topic.explanation}</p>
        <strong>Sequência didática</strong>
        <ul class="sequence-list">
          <li><strong>Objetivo:</strong> ${topic.sequence.objetivo}</li>
          <li><strong>BNCC:</strong> ${topic.sequence.bncc}</li>
          <li><strong>Metodologia:</strong> ${topic.sequence.metodologia}</li>
          <li><strong>Recursos:</strong> ${topic.sequence.recursos}</li>
          <li><strong>Etapas:</strong> ${topic.sequence.etapas.slice(0, 3).join(" ")}</li>
          <li><strong>Avaliação:</strong> ${topic.sequence.avaliacao}</li>
          <li><strong>Atividade complementar:</strong> ${topic.sequence.complementares}</li>
        </ul>
        <div class="achievement-list">
          ${data.achievements.map((achievement) => `<span class="achievement-pill" data-achievement="${achievement.id}">${achievement.label}</span>`).join("")}
        </div>
        <div class="topic-actions">
          <button class="btn primary" type="button" data-play="${topic.id}">Jogar</button>
          <button class="btn secondary" type="button" data-details="${topic.id}">Ver etapas</button>
        </div>
      </article>
    `).join("");

    container.querySelectorAll("[data-play]").forEach((button) => {
      button.addEventListener("click", () => {
        const topic = topics.find((item) => item.id === button.dataset.play);
        window.ProfMilanyGame.openGame(topic, year);
      });
    });

    container.querySelectorAll("[data-details]").forEach((button) => {
      button.addEventListener("click", () => {
        const topic = topics.find((item) => item.id === button.dataset.details);
        alert(`Etapas da aula - ${topic.title}\n\n${topic.sequence.etapas.map((step, index) => `${index + 1}. ${step}`).join("\n")}`);
      });
    });

    initReveal();
    updateProgressUI();
  }

  function renderRanking() {
    const list = document.querySelector("[data-ranking]");
    if (!list) return;
    const entries = window.ProfMilanyGame.getRanking();
    if (!entries.length) {
      list.innerHTML = "<li>Nenhuma pontuação registrada ainda. Jogue um desafio do 3º Ano para começar.</li>";
      return;
    }
    list.innerHTML = entries.map((entry) => `<li><strong>${entry.score} pontos</strong> em ${entry.topic} <span>(${entry.date})</span></li>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavigation();
    initBackToTop();
    initReveal();
    renderTopics();
    renderRanking();
    updateProgressUI();
  });

  window.addEventListener("progress-updated", () => {
    renderTopics();
    updateProgressUI();
  });
  window.addEventListener("ranking-updated", renderRanking);
})();
