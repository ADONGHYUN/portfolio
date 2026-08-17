const yearNode = document.getElementById("current-year");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const navLinks = Array.from(document.querySelectorAll(".top-nav a[href^='#']"));
const sections = navLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    return target ? { link, target } : null;
  })
  .filter(Boolean);

function setActiveSection(sectionId) {
  for (const { link, target } of sections) {
    const isActive = target.id === sectionId;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

for (const { link, target } of sections) {
  link.addEventListener("click", () => setActiveSection(target.id));
}

if ("IntersectionObserver" in window && sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveSection(visible.target.id);
      }
    },
    {
      rootMargin: "-24% 0px -58% 0px",
      threshold: [0.15, 0.4, 0.7],
    },
  );

  for (const { target } of sections) {
    observer.observe(target);
  }
}
