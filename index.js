/*
 * index.js — 五鬼搬運 ②：分類資料與產生視窗的功能
 *
 * 此版刻意沒有作品清單、連結、點擊導覽、指令輸入框
 * 現在只看「七個大區塊」的整體視覺
 *
 * 未來修改分類：
 *   1. 在 siteCategories 增加、刪除或移動一個物件即可
 *   2. 各分類 id 不可重複，使用小寫英數與連字號
 *   3. size 可為 "normal"（半寬）或 "full"（整排）
 *   4. 尚未有任何站外網址；等外觀定案再加上作品連結
 */

const siteCategories = [
    {
        id: "about",
        title: "個人說明書",
        filename: "about.terminal",
        command: "cat ./about.md",
        description: "藏起來的慢慢",
        icon: "♡",
        tone: "pink",
        size: "normal"
    },
    {
        id: "art",
        title: "藝術與創作",
        filename: "art.terminal",
        command: "ls ./art/",
        description: "想得到的和想不到的",
        icon: "✦",
        tone: "lavender",
        size: "normal"
    },
    {
        id: "tools",
        title: "工具研究室",
        filename: "tools.terminal",
        command: "ls ./tools/",
        description: "什麼都想做",
        icon: "⌘",
        tone: "blue",
        size: "normal"
    },
    {
        id: "games",
        title: "遊戲",
        filename: "games.terminal",
        command: "ls ./games/",
        description: "想玩什麼自己做",
        icon: "♠",
        tone: "mint",
        size: "normal"
    },
    {
        id: "life",
        title: "生活時光",
        filename: "life.terminal",
        command: "ls ./life/",
        description: "收藏那些值得留下的日子",
        icon: "◷",
        tone: "yellow",
        size: "normal"
    },
    {
        id: "temple",
        title: "電子宮廟",
        filename: "temple.terminal",
        command: "ls ./temple/",
        description: "沒看錯，這裡真的有一座電子宮廟",
        icon: "✧",
        tone: "peach",
        size: "normal"
    },
    {
        id: "whatever",
        title: "隨心所欲",
        filename: "whatever.terminal",
        command: "./whatever/surprise.sh",
        description: "想到什麼就做什麼，不一定需要理由",
        icon: "✳",
        tone: "pink",
        size: "full"
    }
];

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function createTerminalWindow(category, index) {
    const card = createElement("article", "terminal-card");
    card.id = `section-${category.id}`;
    card.dataset.tone = category.tone || "pink";
    card.dataset.size = category.size === "full" ? "full" : "normal";

    const headingId = `title-${category.id}`;
    card.setAttribute("aria-labelledby", headingId);

    const top = createElement("div", "window-top");
    const dots = createElement("span", "window-dots");
    dots.setAttribute("aria-hidden", "true");

    for (let dotIndex = 0; dotIndex < 3; dotIndex += 1) {
        dots.appendChild(createElement("i"));
    }

    top.appendChild(dots);
    top.appendChild(createElement("span", "window-filename", category.filename || `${category.id}.terminal`));
    top.appendChild(createElement("span", "window-number", String(index + 1).padStart(2, "0")));

    const content = createElement("div", "window-content");
    const command = createElement("p", "window-command");
    command.appendChild(createElement("span", "command-dollar", "$"));
    command.appendChild(document.createTextNode(` ${category.command || `ls ./${category.id}/`}`));
    content.appendChild(command);

    const categoryHeading = createElement("div", "category-heading");
    const icon = createElement("span", "category-icon", category.icon || "✦");
    icon.setAttribute("aria-hidden", "true");
    categoryHeading.appendChild(icon);

    const title = createElement("h3", "category-title", category.title);
    title.id = headingId;
    categoryHeading.appendChild(title);
    content.appendChild(categoryHeading);
    content.appendChild(createElement("p", "category-description", category.description || ""));

    const baseline = createElement("div", "window-baseline");
    baseline.appendChild(createElement("span", "baseline-line"));
    baseline.appendChild(createElement("span", "baseline-indicator", "_"));
    content.appendChild(baseline);

    card.appendChild(top);
    card.appendChild(content);
    return card;
}

function renderCategories() {
    const grid = document.getElementById("terminal-grid");
    const windowCount = document.getElementById("window-count");

    if (!grid) return;

    const fragment = document.createDocumentFragment();
    const usedIds = new Set();
    let renderedCount = 0;

    for (const category of siteCategories) {
        if (!category || !/^[a-z0-9-]+$/.test(category.id) || usedIds.has(category.id)) {
            console.warn("略過不合法或重複的分類：", category && category.id);
            continue;
        }

        usedIds.add(category.id);
        fragment.appendChild(createTerminalWindow(category, renderedCount));
        renderedCount += 1;
    }

    grid.replaceChildren(fragment);

    if (windowCount) {
        windowCount.textContent = `${String(renderedCount).padStart(2, "0")} WINDOWS`;
    }
}

renderCategories();
