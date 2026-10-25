/*
 * index.js — 五鬼搬運 ②：分類與作品資料、終端機視窗功能
 *
 * 新增或修改分類：編輯 siteCategories，不必複製整組 HTML
 * - headerUrl：可選，讓小終端機標題列的英文檔名成為連結
 * - folders：可選，放入可展開的資料夾與作品
 * - brandImage：可選，在分類的內容區顯示小型品牌縮圖
 * - folders[].preview：可選，展開資料夾後顯示作品縮圖
 * - size："normal" 或 "full"
 *
 * 作品 URL 使用絕對路徑，保持使用者原有網址不變
 */


// 全部使用慢慢自己的外部圖床，不在 GitHub 專案存放圖片
// 換圖只需要修改下列網址，不用更動 HTML 或排版
const siteImages = {
    slowlyGames: "https://img.stillnessbyslowly.com/images/2026/10/c03304c4-5ad7-4718-b2bf-74c37c9513c5_%E6%85%A2%E6%85%A2%E9%81%8A%E6%88%B2_aurora_horizontal_2x.png",
    jieLong: "https://img.stillnessbyslowly.com/images/2026/10/1b2503bd-dcba-454f-b6ec-62ec49db0744_%E6%8E%A5%E9%BE%8D%E5%B8%9D%E5%9C%8B_%E5%BE%A1%E9%A7%95%E8%A6%AA%E5%BE%81_%E6%A9%AB%E5%BC%8F_2x.png",
    slowlyWord: "https://img.stillnessbyslowly.com/images/2026/10/df1287c2-7dcf-4632-b318-453b4aa58aec_slowly-word-share.png",
    bingo: "https://img.stillnessbyslowly.com/images/2026/10/f1226ede-34dd-4107-a659-da1d1db89897_%E6%A7%8B%E6%80%9D%E8%B3%93%E6%9E%9C_yin-yang_horizontal_2x.png"
};

const siteCategories = [
    {
        id: "about",
        title: "個人說明書",
        filename: "about.terminal",
        command: "cat ./about.md",
        description: "藏起來的慢慢",
        icon: "♡",
        tone: "pink",
        size: "normal",
        headerUrl: "https://xiayian505.stillnessbyslowly.com/"
    },
    {
        id: "art",
        title: "藝術與創作",
        filename: "art.terminal",
        command: "ls ./art/",
        description: "想得到的和想不到的",
        icon: "✦",
        tone: "lavender",
        size: "normal",
        folders: [
            {
                name: "word/",
                prompt: "/word $",
                preview: {
                    src: siteImages.slowlyWord,
                    alt: "慢慢藝術字作品縮圖"
                },
                items: [
                    {
                        title: "慢慢藝術字",
                        url: "https://desk.stillnessbyslowly.com/word/"
                    }
                ]
            },
            {
                name: "bingo/",
                prompt: "/bingo $",
                preview: {
                    src: siteImages.bingo,
                    alt: "構思賓果作品縮圖"
                },
                items: [
                    {
                        title: "構思賓果",
                        url: "https://desk.stillnessbyslowly.com/novel/bingo/"
                    }
                ]
            }
        ]
    },
    {
        id: "tools",
        title: "工具研究室",
        filename: "tools.terminal",
        command: "ls ./tools/",
        description: "什麼都想做",
        icon: "⌘",
        tone: "blue",
        size: "normal",
        folders: [
            {
                name: "termux/",
                prompt: "/termux $",
                items: [
                    {
                        title: "終端機",
                        url: "https://desk.stillnessbyslowly.com/termux/"
                    }
                ]
            },
            {
                name: "cycle/",
                prompt: "/cycle $",
                items: [
                    {
                        title: "給自己的溫柔紀錄",
                        url: "https://xiayian505.stillnessbyslowly.com/cycle/"
                    }
                ]
            }
        ]
    },
    {
        id: "games",
        title: "遊戲",
        filename: "games.terminal",
        command: "ls ./games/",
        description: "想玩什麼自己做",
        icon: "♠",
        tone: "mint",
        size: "normal",
        headerUrl: "https://game.stillnessbyslowly.com/",
        brandImage: {
            src: siteImages.slowlyGames,
            alt: "慢慢遊戲品牌藝術字"
        },
        folders: [
            {
                name: "JieLong/",
                prompt: "/JieLong $",
                preview: {
                    src: siteImages.jieLong,
                    alt: "接龍帝國作品縮圖"
                },
                items: [
                    {
                        title: "接龍帝國",
                        url: "https://game.stillnessbyslowly.com/JieLong/index.html"
                    }
                ]
            }
        ]
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
        size: "normal",
        headerUrl: "https://pocket.stillnessbyslowly.com/temple/",
        folders: [
            {
                name: "incense/",
                prompt: "/incense $",
                items: [
                    {
                        title: "上香",
                        url: "https://pocket.stillnessbyslowly.com/temple/incense.html"
                    }
                ]
            },
            {
                name: "jiaobei/",
                prompt: "/jiaobei $",
                items: [
                    {
                        title: "擲筊",
                        url: "https://pocket.stillnessbyslowly.com/temple/jiaobei.html"
                    }
                ]
            },
            {
                name: "fortune_sticks/",
                prompt: "/fortune_sticks $",
                items: [
                    {
                        title: "求籤",
                        url: "https://pocket.stillnessbyslowly.com/temple/fortune_sticks.html"
                    }
                ]
            },
            {
                name: "joss_paper/",
                prompt: "/joss_paper $",
                items: [
                    {
                        title: "燒紙錢",
                        url: "https://pocket.stillnessbyslowly.com/temple/joss_paper.html"
                    }
                ]
            },
            {
                name: "wooden_fish/",
                prompt: "/wooden_fish $",
                items: [
                    {
                        title: "敲木魚",
                        url: "https://pocket.stillnessbyslowly.com/temple/wooden_fish.html"
                    }
                ]
            }
        ]
    },
    {
        id: "whatever",
        title: "隨心所欲",
        filename: "whatever.terminal",
        command: "./whatever/surprise.sh",
        description: "想到什麼就做什麼，不一定需要理由",
        icon: "✳",
        tone: "pink",
        size: "normal"
    },
    {
        id: "arsenal",
        title: "軍火庫",
        filename: "arsenal.terminal",
        command: "ls ./arsenal/",
        description: "就算只有三行\n我也不想寫第二次",
        icon: "⌁",
        tone: "blue",
        size: "normal",
        headerUrl: "https://lib.stillnessbyslowly.com/"
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

/**
 * 建立純展示用的圖片，不改變既有作品連結的點擊方式
 * 若圖床暫時無法載入，隱藏預覽區，但保留資料夾與文字連結
 */
function createImagePreview(preview, className) {
    if (!preview || !preview.src) return null;

    const container = createElement("div", className);
    const image = createElement("img", "preview-image");

    image.src = preview.src;
    image.alt = preview.alt || "";
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
        container.hidden = true;
    });

    container.appendChild(image);
    return container;
}

function createFolder(folder, categoryId, folderIndex) {
    const folderEntry = createElement("div", "terminal-folder");
    const folderButton = createElement("button", "folder-toggle", folder.name);
    const folderContent = createElement("div", "folder-output");
    const contentId = `folder-${categoryId}-${folderIndex}`;

    folderButton.type = "button";
    folderButton.setAttribute("aria-expanded", "false");
    folderButton.setAttribute("aria-controls", contentId);
    folderContent.id = contentId;
    folderContent.hidden = true;

    // 先顯示作品縮圖，再顯示原本的命令列與可點擊作品名稱
    const folderPreview = createImagePreview(folder.preview, "folder-preview");
    if (folderPreview) {
        folderContent.appendChild(folderPreview);
    }

    for (const item of folder.items || []) {
        const outputLine = createElement("p", "folder-output-line");
        const prompt = createElement("span", "folder-prompt", folder.prompt || "$ ");
        const link = createElement("a", "folder-item-link", item.title);

        link.href = item.url;
        outputLine.appendChild(prompt);
        outputLine.appendChild(link);
        folderContent.appendChild(outputLine);
    }

    folderButton.addEventListener("click", () => {
        const isExpanded = folderButton.getAttribute("aria-expanded") === "true";
        folderButton.setAttribute("aria-expanded", String(!isExpanded));
        folderContent.hidden = isExpanded;
    });

    folderEntry.appendChild(folderButton);
    folderEntry.appendChild(folderContent);
    return folderEntry;
}

function createTerminalWindow(category, index) {
    const card = createElement("article", "terminal-card");
    const headingId = `title-${category.id}`;

    card.id = `section-${category.id}`;
    card.dataset.tone = category.tone || "pink";
    card.dataset.size = category.size === "full" ? "full" : "normal";
    card.setAttribute("aria-labelledby", headingId);

    const top = createElement("div", "window-top");
    const dots = createElement("span", "window-dots");
    dots.setAttribute("aria-hidden", "true");

    for (let dotIndex = 0; dotIndex < 3; dotIndex += 1) {
        dots.appendChild(createElement("i"));
    }

    top.appendChild(dots);

    const filename = category.filename || `${category.id}.terminal`;
    if (category.headerUrl) {
        const titleLink = createElement("a", "window-filename window-filename-link", filename);
        titleLink.href = category.headerUrl;
        top.appendChild(titleLink);
    } else {
        top.appendChild(createElement("span", "window-filename", filename));
    }
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

    // 例如遊戲區的品牌藝術字：小型展示，不占用標題列
    const brandPreview = createImagePreview(category.brandImage, "category-brand-preview");
    if (brandPreview) {
        content.appendChild(brandPreview);
    }

    if (Array.isArray(category.folders) && category.folders.length > 0) {
        const folderList = createElement("div", "terminal-folder-list");
        category.folders.forEach((folder, folderIndex) => {
            folderList.appendChild(createFolder(folder, category.id, folderIndex));
        });
        content.appendChild(folderList);
    }

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
