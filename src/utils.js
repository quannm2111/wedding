const MAX_HEARTS = 10;

export function startHearts() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  let alive = 0;
  const id = window.setInterval(() => {
    if (alive >= MAX_HEARTS) return;

    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "💕";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${3 + Math.random() * 3}s`;
    document.body.appendChild(heart);
    alive += 1;

    window.setTimeout(() => {
      heart.remove();
      alive -= 1;
    }, 6500);
  }, 1800);

  return () => {
    window.clearInterval(id);
    document.querySelectorAll(".heart").forEach((node) => node.remove());
  };
}
