/*
 * index_style.js — 五鬼搬運 ③：純外觀互動
 * 深淺色由使用者手動切換並記住選擇，不跟隨裝置設定
 * 不處理任何作品資料或連結
 */

(function initializeTheme() {
    const themeButton = document.getElementById("theme-toggle");
    if (!themeButton) return;

    const storageKey = "slowly-home-theme";

    function readSavedTheme() {
        try {
            return window.localStorage.getItem(storageKey);
        } catch {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            window.localStorage.setItem(storageKey, theme);
        } catch {
            // 若瀏覽器禁用儲存，當次切換仍會正常運作
        }
    }

    function applyTheme(theme) {
        const isLight = theme === "light";
        document.documentElement.dataset.theme = isLight ? "light" : "dark";
        themeButton.setAttribute("aria-pressed", String(isLight));
        themeButton.querySelector(".theme-symbol").textContent = isLight ? "☾" : "☼";
    }

    applyTheme(readSavedTheme() === "light" ? "light" : "dark");

    themeButton.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        applyTheme(nextTheme);
        saveTheme(nextTheme);
    });
})();

/*
 * 返回頁面頂端
 * 捲動超過 240px 才顯示按鈕，避免一進入網站就遮擋畫面
 * 尊重使用者偏好的減少動態效果設定
 */
(function initializeBackToTop() {
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visibleAfter = 240;

    function updateVisibility() {
        const shouldShow = window.scrollY > visibleAfter;
        backToTopButton.classList.toggle("is-visible", shouldShow);
        backToTopButton.tabIndex = shouldShow ? 0 : -1;
    }

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reducedMotion.matches ? "auto" : "smooth"
        });
    });

    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
})();
