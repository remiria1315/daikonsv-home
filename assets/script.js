document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const main = document.querySelector("main");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    hamburger.classList.toggle("open");
    main.classList.toggle("open");
  });

  (async () => {
    const list = document.getElementById("news-list");
    if (!list) return;

    const fmt = (unix) =>
      new Date(unix * 1000).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const esc = (s) =>
      String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    try {
      const res = await fetch("https://news.daikonsv.f5.si/news");
      if (!res.ok) throw new Error(res.status);
      const items = await res.json();
      items.sort((a, b) => b.date - a.date);
      list.innerHTML = items.length
        ? items
            .map(
              (item) => `
          <article class="news-card">
            <time>${fmt(item.date)}</time>
            <h2>${esc(item.name)}</h2>
            <p>${esc(item.content)}</p>
          </article>`,
            )
            .join("")
        : "<p>ニュースはまだありません。</p>";
    } catch (e) {
      list.innerHTML = `<p>取得に失敗しました (${e.message})</p>`;
    }
  })();
});
