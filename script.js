const types = [
  {
    id: "164",
    title: "164",
    description: "????됲삎???댁슱由щ뒗 ?꾨━誘몄뾼 ?먯옱 援ъ꽦 ???,
    price: "65,000,000??,
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
    description: "????됲삎???댁슱由щ뒗 ?꾨━誘몄뾼 ?먯옱 援ъ꽦 ???,
    price: "62,400,000??,
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
    description: "?ㅼ슜?곸씤 ?숈꽑怨??곕쑜??嫄곗떎 遺꾩쐞湲곌? ?뗫낫?대뒗 ???,
    price: "43,710,000??,
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
    description: "洹좏삎 ?≫엺 怨듦컙 援ъ꽦怨??몄븞??臾대뱶媛 ?댁슱由щ뒗 ???,
    price: "43,710,000??,
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
    description: "?ㅼ슜?곸씤 怨듦컙 援ъ꽦怨??몃젴???붿옄?몄씠 ?뗫낫?대뒗 ???,
    price: "43,330,000??,
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
    button.setAttribute("aria-label", `${type.title} ${index + 1}踰??대?吏`);
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
  mainVisual.alt = `${type.title} ???3D ?명뀒由ъ뼱 ${page + 1}踰??대?吏`;
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
  alert("?곷떞 ?좎껌???묒닔?섏뿀?듬땲??");
});

render();

