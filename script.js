const types = [
  {
    id: "164",
    title: "164",
    description: "대형 평형에 어울리는 프리미엄 자재 구성 타입",
    price: "65,000,000원",
    images: [
      "164-page-1.png",
      "164-page-2.png",
      "164-page-3.png",
      "164-page-4.png",
    ],
  },
  {
    id: "161",
    title: "161",
    description: "대형 평형에 어울리는 프리미엄 자재 구성 타입",
    price: "62,400,000원",
    images: [
      "161-page-1.png",
      "161-page-2.png",
      "161-page-3.png",
      "161-page-4.png",
    ],
  },
  {
    id: "111B",
    title: "111B",
    description: "실용적인 동선과 따뜻한 거실 분위기가 돋보이는 타입",
    price: "43,710,000원",
    images: [
      "111b-page-1.png",
      "111b-page-2.png",
      "111b-page-3.png",
      "111b-page-4.png",
      "111b-page-5.png",
    ],
  },
  {
    id: "111A",
    title: "111A",
    description: "균형 잡힌 공간 구성과 편안한 무드가 어울리는 타입",
    price: "43,710,000원",
    images: [
      "111a-page-1.png",
      "111a-page-2.png",
      "111a-page-3.png",
      "111a-page-4.png",
      "111a-page-5.png",
    ],
  },
  {
    id: "110C",
    title: "110C",
    description: "실용적인 공간 구성과 세련된 디자인이 돋보이는 타입",
    price: "43,330,000원",
    images: [
      "110c-page-1.png",
      "110c-page-2.png",
      "110c-page-3.png",
      "110c-page-4.png",
    ],
  },
];

let activeTypeIndex = 0;
const activePages = Object.fromEntries(types.map((type) => [type.id, 0]));

const tabs = document.querySelector(".type-tabs");
const dots = document.querySelector(".page-dots");
const mainVisual = document.querySelector("#mainVisual");
const typeName = document.querySelector("#typeName");
const typeDescription = document.querySelector("#typeDescription");
const priceValue = document.querySelector("#priceValue");
const prevButton = document.querySelector(".showcase .prev");
const nextButton = document.querySelector(".showcase .next");
const openViewer = document.querySelector("#openViewer");
const viewerModal = document.querySelector("#viewerModal");
const viewerImage = document.querySelector("#viewerImage");
const viewerTitle = document.querySelector("#viewerTitle");
const viewerCounter = document.querySelector("#viewerCounter");
const viewerPrev = document.querySelector("#viewerPrev");
const viewerNext = document.querySelector("#viewerNext");

function activeType() {
  return types[activeTypeIndex];
}

function activePage() {
  return activePages[activeType().id] || 0;
}

function setPage(pageIndex) {
  const type = activeType();
  const nextIndex = (pageIndex + type.images.length) % type.images.length;
  activePages[type.id] = nextIndex;
  render();
}

function setType(typeIndex) {
  activeTypeIndex = typeIndex;
  render();
}

function renderTabs() {
  tabs.innerHTML = "";
  types.forEach((type, index) => {
    const button = document.createElement("button");
    button.className = `type-tab${index === activeTypeIndex ? " active" : ""}`;
    button.type = "button";
    button.role = "tab";
    button.setAttribute("aria-selected", String(index === activeTypeIndex));
    button.textContent = type.title;
    button.addEventListener("click", () => setType(index));
    tabs.appendChild(button);
  });
}

function renderDots() {
  const type = activeType();
  dots.innerHTML = "";
  type.images.forEach((_, index) => {
    const button = document.createElement("button");
    button.className = `page-dot${index === activePage() ? " active" : ""}`;
    button.type = "button";
    button.setAttribute("aria-label", `${type.title} ${index + 1}번 이미지`);
    button.addEventListener("click", () => setPage(index));
    dots.appendChild(button);
  });
}

function renderViewer() {
  if (viewerModal.hidden) return;
  const type = activeType();
  const page = activePage();
  viewerTitle.textContent = `${type.title} TYPE`;
  viewerImage.src = type.images[page];
  viewerCounter.textContent = `${page + 1} / ${type.images.length}`;
}

function render() {
  const type = activeType();
  const page = activePage();
  mainVisual.src = type.images[page];
  mainVisual.alt = `${type.title} 타입 3D 인테리어 ${page + 1}번 이미지`;
  typeName.textContent = type.title;
  typeDescription.textContent = type.description;
  priceValue.textContent = type.price;
  renderTabs();
  renderDots();
  renderViewer();
}

function openImageViewer() {
  viewerModal.hidden = false;
  document.body.style.overflow = "hidden";
  renderViewer();
}

function closeImageViewer() {
  viewerModal.hidden = true;
  document.body.style.overflow = "";
}

prevButton.addEventListener("click", () => setPage(activePage() - 1));
nextButton.addEventListener("click", () => setPage(activePage() + 1));
openViewer.addEventListener("click", openImageViewer);
viewerPrev.addEventListener("click", () => setPage(activePage() - 1));
viewerNext.addEventListener("click", () => setPage(activePage() + 1));

viewerModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-viewer]")) closeImageViewer();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !viewerModal.hidden) closeImageViewer();
  if (event.key === "ArrowLeft" && !viewerModal.hidden) setPage(activePage() - 1);
  if (event.key === "ArrowRight" && !viewerModal.hidden) setPage(activePage() + 1);
});

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  alert("상담 신청이 접수되었습니다.");
});

render();
