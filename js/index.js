(() => {
const qs = (selector, element = document) => element.querySelector(selector);
const qsa = (selector, element = document) => [...element.querySelectorAll(selector)];

const portfolioContent = {
  projects: [
    {
      title: "Sistema de Gestão para Cantina Acadêmica",
      tag: "Projeto",
      summary:
        "Modelagem de sistema para otimizar atendimento, reduzir erros e melhorar controle de estoque em cantina universitária.",
      desc:
        "Projeto acadêmico focado em especificação e modelagem de um sistema para cantina, a partir de problemas reais: filas extensas, erros em pedidos, falta de controle de estoque e baixa visibilidade de vendas.",
      bullets: [
        "Levantamento de requisitos orientado a ponto de vista",
        "Cenários positivos e negativos",
        "Storyboards e histórias de usuário",
        "Modelagem por casos de uso",
        "Verificação e validação dos requisitos"
      ],
      primaryLink: "projeto-cantina.html",
      thirdLink:
        "https://www.figma.com/design/ByHiIbUXfk4iztiaJkwhvd/Prototipo?node-id=0-1&t=fE75sD1dMUcjLLkd-1",
      status: "Ver projeto"
    }
  ],
  caseStudies: [
    {
      title: "Critérios de Qualidade em IHC: Análise do Meu SUS Digital",
      tag: "Estudo de Caso",
      summary:
        "Trabalho acadêmico com análise de usabilidade e acessibilidade do aplicativo Meu SUS Digital com base na ISO 9241-11 e nas diretrizes do eMAG.",
      desc:
        "Trabalho acadêmico desenvolvido na disciplina de Interação Humano-Computador, com análise de usabilidade e acessibilidade do aplicativo Meu SUS Digital utilizando critérios da ISO 9241-11 e diretrizes do eMAG. O estudo avaliou aprendizado, eficiência, satisfação e acessibilidade, além de propor melhorias para a experiência do usuário.",
      bullets: [
        "Avaliação de aprendizado, eficiência e satisfação do usuário",
        "Análise de acessibilidade com base nas diretrizes do eMAG",
        "Aplicação dos critérios de qualidade da ISO 9241-11",
        "Identificação de pontos de melhoria na experiência do usuário",
        "Status atual: em melhoria"
      ],
      status: "Em melhoria"
    }
  ],
  articles: [
    {
      title: "Do Conceito à Criação: Fundamentos de Identidade Visual no GIMP",
      tag: "Artigo",
      summary:
        "Estudo voltado ao uso de cartilha e tutorial prático para apoiar o aprendizado de identidade visual e criação de logotipos no GIMP.",
      desc:
        "Produção acadêmica voltada ao desenvolvimento de uma cartilha e de um tutorial prático para apoiar o aprendizado de fundamentos de identidade visual e criação de logotipos utilizando o GIMP.",
      bullets: [
        "Cartilha de apoio ao aprendizado de identidade visual",
        "Tutorial prático aplicado ao GIMP",
        "Estudo com foco em fundamentos visuais e criação de logotipos",
        "Status atual: em andamento"
      ],
      status: "Em andamento"
    }
  ]
};

const projectGrid = qs("#projectsGrid");
const caseStudiesGrid = qs("#caseStudiesGrid");
const articlesGrid = qs("#articlesGrid");
const modal = qs("[data-modal]");
const modalTitle = qs("#modalTitle");
const modalTag = qs("#modalTag");
const modalDesc = qs("#modalDesc");
const modalBullets = qs("#modalBullets");
const modalLinks = qs(".modal__links");
const modalPrimaryLink = qs("#modalPrimaryLink");
const modalThirdLink = qs("#modalThirdLink");

let lastFocus = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildCard(item, label) {
  const card = document.createElement("article");

  card.className = "card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `${label}: ${item.title}`);

  card.innerHTML = `
    <span class="card__tag">${escapeHtml(item.tag)}</span>
    <div>
      <h3 class="card__title">${escapeHtml(item.title)}</h3>
      <p class="card__desc">${escapeHtml(item.summary)}</p>
    </div>
    <div class="card__foot">
      <span style="display:inline-flex;align-items:center;gap:10px;">
        <span class="pulse" aria-hidden="true"></span>
        <span>Ver detalhes</span>
      </span>
      <span class="card__status">${escapeHtml(item.status || "Abrir")}</span>
    </div>
  `;

  card.addEventListener("click", () => openModal(item));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal(item);
    }
  });

  return card;
}

function renderCollection(grid, items, label) {
  if (!grid) return;

  grid.innerHTML = "";

  items.forEach((item) => {
    grid.appendChild(buildCard(item, label));
  });
}

function setModalLink(element, href, label) {
  if (!element) return;

  if (!href || href === "#") {
    element.hidden = true;
    element.style.display = "none";
    return;
  }

  element.hidden = false;
  element.style.display = "";
  element.href = href;
  element.textContent = label;
}

function updateModalLinks(item) {
  setModalLink(modalPrimaryLink, item.primaryLink, item.primaryLabel || "Abrir projeto");
  setModalLink(modalThirdLink, item.thirdLink, item.thirdLabel || "Ver design (Figma)");

  if (!modalLinks) return;

  const hasVisibleLink = [modalPrimaryLink, modalThirdLink].some(
    (link) => link && !link.hidden
  );

  modalLinks.hidden = !hasVisibleLink;
  modalLinks.style.display = hasVisibleLink ? "" : "none";
}

function openModal(item) {
  if (!modal || !modalTitle || !modalTag || !modalDesc || !modalBullets) return;

  lastFocus = document.activeElement;
  modalTitle.textContent = item.title;
  modalTag.textContent = item.tag;
  modalDesc.textContent = item.desc;
  modalBullets.innerHTML = "";

  item.bullets.forEach((bullet) => {
    const listItem = document.createElement("li");
    listItem.textContent = bullet;
    modalBullets.appendChild(listItem);
  });

  updateModalLinks(item);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  const closeBtn = qs("[data-close]", modal);
  closeBtn?.focus();

  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocus && typeof lastFocus.focus === "function") {
    lastFocus.focus();
  }
}

function setupModalEvents() {
  if (!modal) return;

  qsa("[data-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal__overlay")) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function setupIndex() {
  renderCollection(projectGrid, portfolioContent.projects, "Abrir detalhes do projeto");
  renderCollection(caseStudiesGrid, portfolioContent.caseStudies, "Abrir detalhes do estudo de caso");
  renderCollection(articlesGrid, portfolioContent.articles, "Abrir detalhes do artigo");
  setupModalEvents();
}

setupIndex();
})();
