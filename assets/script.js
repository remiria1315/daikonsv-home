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
          <article class="news">
            <div class="embed-wrapper">
              <article class="embed" aria-hidden="false">
                <div class="embed-grid">
                  <div class="embed-title embed-margin">
                    ${item.name}
                  </div>

                  <div class="embed-description embed-margin">
                    ${item.content}
                  </div>
                  <div class="embed-footer embed-margin">
                    <img
                      alt="送信者のアイコン"
                      class="embed-footer-icon"
                      src="${item.icon || "https://cdn.discordapp.com/embed/avatars/5.png" /* discordのデフォルトアイコン */}"
                    >
                    <span class="embed-footer-text">
                      ${item.author}
                      <span class="embed-footer-sep">•</span>
                      ${new Date(item.date * 1000)
                        .toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        .replace(/\//g, "/")}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </article>`,
            )
            .join("")
        : "<p>ニュースはまだありません。</p>";
    } catch (e) {
      list.innerHTML = `<p>取得に失敗しました (${e.message})</p>`;
    }
  })();
});
