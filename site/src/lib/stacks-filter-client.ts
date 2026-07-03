import gsap from "gsap";

const PAGE_SIZE = 12;

const pills = document.querySelectorAll<HTMLElement>(".filter-pill");
const tipItems = Array.from(document.querySelectorAll<HTMLElement>(".tip-item"));
const searchInput = document.getElementById("stack-search") as HTMLInputElement | null;
const countEl = document.getElementById("stacks-count");
const emptyEl = document.getElementById("stacks-empty");
const navEl = document.getElementById("stacks-pagination");
const prevBtn = document.getElementById("stacks-prev") as HTMLButtonElement | null;
const nextBtn = document.getElementById("stacks-next") as HTMLButtonElement | null;
const pageLabel = document.getElementById("stacks-page-label");

let activeFilter = "all";
let searchQuery = "";
let currentPage = 1;

function applyState(animate = true) {
  const matched = tipItems.filter((item) => {
    const stack = item.dataset.tipStack ?? "";
    const matchesPill = activeFilter === "all" || stack === activeFilter;
    const matchesSearch = !searchQuery || stack.includes(searchQuery);
    return matchesPill && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = new Set(matched.slice(start, start + PAGE_SIZE));

  tipItems.forEach((el) => {
    if (visible.has(el)) el.removeAttribute("data-hidden");
    else el.setAttribute("data-hidden", "");
  });

  if (countEl) countEl.textContent = `${matched.length} tip${matched.length !== 1 ? "s" : ""}`;
  if (emptyEl) {
    emptyEl.classList.toggle("hidden", matched.length !== 0);
    emptyEl.classList.toggle("block", matched.length === 0);
  }
  if (navEl) navEl.style.display = totalPages > 1 ? "flex" : "none";
  if (pageLabel) pageLabel.textContent = `${currentPage} / ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

  if (visible.size && animate) {
    gsap.fromTo(
      [...visible],
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.035 }
    );
  }
}

function setPill(filter: string) {
  activeFilter = filter;
  pills.forEach((p) => {
    const on = p.dataset.filter === filter;
    p.classList.toggle("active", on);
    p.setAttribute("aria-pressed", String(on));
  });
}

pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    setPill(pill.dataset.filter ?? "all");
    currentPage = 1;
    applyState();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.toLowerCase().trim();
    // Reset pill to "all" when searching so pills don't conflict
    if (searchQuery) setPill("all");
    currentPage = 1;
    applyState();
  });
}

prevBtn?.addEventListener("click", () => {
  currentPage--;
  applyState();
});
nextBtn?.addEventListener("click", () => {
  currentPage++;
  applyState();
});

applyState(false);
