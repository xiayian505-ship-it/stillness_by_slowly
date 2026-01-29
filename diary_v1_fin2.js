
/* ===============================
   基本 Tab 切換（原本功能，保留）
================================ */
document.querySelectorAll(".tab").forEach(tab=>{
  tab.onclick = ()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

/* ===============================
   Storage Keys（已定案）
================================ */
const AVATAR_KEY = "mm_diary_avatar_v1";
const HEADER_NOTE_KEY = "mm_diary_header_note_v1";
const DIARY_KEY = "mm_diary_entries_v1";

/* ===============================
   Avatar（原功能，未動）
================================ */
const avatarClickArea = document.getElementById("avatarClickArea");
const avatarImg = document.getElementById("avatarImg");
const avatarInput = document.getElementById("avatarInput");
const avatarConfirmModal = document.getElementById("avatarConfirmModal");
const avatarYes = document.getElementById("avatarYes");
const avatarCancel = document.getElementById("avatarCancel");

const savedAvatar = localStorage.getItem(AVATAR_KEY);
if (savedAvatar) avatarImg.src = savedAvatar;

avatarClickArea.onclick = ()=>avatarConfirmModal.style.display="flex";
avatarCancel.onclick = ()=>avatarConfirmModal.style.display="none";
avatarYes.onclick = ()=>{
  avatarConfirmModal.style.display="none";
  avatarInput.click();
};

avatarInput.onchange = e=>{
  const file=e.target.files[0];
  if(!file) return;
  compressImage(file,base64=>{
    localStorage.setItem(AVATAR_KEY,base64);
    avatarImg.src=base64;
  });
  avatarInput.value="";
};

function compressImage(file,cb){
  const r=new FileReader(),img=new Image();
  r.onload=e=>{
    img.onload=()=>{
      const c=document.createElement("canvas");
      const s=Math.min(512/Math.max(img.width,img.height),1);
      c.width=img.width*s;
      c.height=img.height*s;
      c.getContext("2d").drawImage(img,0,0,c.width,c.height);
      cb(c.toDataURL("image/jpeg",0.75));
    };
    img.src=e.target.result;
  };
  r.readAsDataURL(file);
}

/* ===============================
   Header 一句話（已定案）
================================ */
const headerNoteInput = document.getElementById("headerNoteInput");
const savedHeaderNote = localStorage.getItem(HEADER_NOTE_KEY);
if (savedHeaderNote) headerNoteInput.value = savedHeaderNote;

headerNoteInput.addEventListener("input",()=>{
  localStorage.setItem(HEADER_NOTE_KEY, headerNoteInput.value);
});

/* ===============================
   日記資料結構
================================ */
function loadDiary(){
  return JSON.parse(localStorage.getItem(DIARY_KEY) || "{}");
}
function saveDiary(data){
  localStorage.setItem(DIARY_KEY, JSON.stringify(data));
}

/* ===============================
   日期工具
================================ */
function dateKey(d=new Date()){
  return d.toISOString().slice(0,10);
}
function formatDate(key){
  const [y,m,d]=key.split("-");
  return `${m}/${d}`;
}

/* ===============================
   DOM 參考
================================ */
const diaryTitleEl = document.querySelector(".diaryTitle");
const diaryContentEl = document.querySelector(".diaryContent");
const diaryPage = document.getElementById("diary");
const monthListEl = diaryPage.querySelector(".monthList");
const deleteBtn = document.querySelectorAll(".diaryActions .btn")[2];
const exportBtn = document.querySelector(".diaryActions .btn.primary");

let currentDateKey = dateKey();

/* ===============================
   載入指定日期日記
================================ */
function loadEntry(key){
  const data = loadDiary();
  const entry = data[key] || { title:"", content:"" };

  diaryTitleEl.textContent = entry.title || "留 白";
  diaryContentEl.textContent = entry.content || "今天，依然在這裡";

  currentDateKey = key;
  updateCalendarUI(key);
}

/* ===============================
   自動存檔（核心）
================================ */
function autoSave(){
  const data = loadDiary();
  data[currentDateKey] = {
    title: diaryTitleEl.textContent.replace("留 白","").trim(),
    content: diaryContentEl.textContent
  };
  saveDiary(data);
  renderMonthList();
}

/* ===============================
   編輯行為
================================ */
diaryTitleEl.contentEditable = true;
diaryContentEl.contentEditable = true;

diaryTitleEl.addEventListener("input", autoSave);
diaryContentEl.addEventListener("input", autoSave);

/* ===============================
   刪除（日記內容清空，不刪 key）
================================ */
deleteBtn.onclick = ()=>{
  const data = loadDiary();
  if(data[currentDateKey]){
    data[currentDateKey].title="";
    data[currentDateKey].content="";
    saveDiary(data);
    loadEntry(currentDateKey);
    renderMonthList();
  }
};

/* ===============================
   月目錄渲染
================================ */
function renderMonthList(){
  const data = loadDiary();
  monthListEl.innerHTML = "";

  Object.keys(data).sort().reverse().forEach(k=>{
    if(!data[k].content) return;
    const item=document.createElement("div");
    item.className="monthItem";
    item.innerHTML=`
      <div class="date">${formatDate(k)}</div>
      <div class="title">${data[k].title||""}</div>
    `;
    item.onclick=()=>loadEntry(k);
    monthListEl.appendChild(item);
  });
}

/* ===============================
   TXT 匯出（UTF-8 BOM）
================================ */
/*

function exportTxt(filename, text){
  const blob = new Blob(
    ["\uFEFF"+text],
    {type:"text/plain;charset=utf-8"}
  );
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

exportBtn.onclick = ()=>{
  const data = loadDiary()[currentDateKey];
  if(!data) return;
  exportTxt(
    `${currentDateKey}.txt`,
    `${data.title}\n\n${data.content}`
  );
};
*/
/* ===============================
   搜尋區間 TXT 匯出
================================ */
/*
// 搜尋頁的 input 與按鈕
const searchStartInput = document.querySelector('#search input[type="date"]:nth-of-type(1)');
const searchEndInput   = document.querySelector('#search input[type="date"]:nth-of-type(2)');
const searchExportBtn  = document.querySelector('#search .btn.primary');

searchExportBtn.onclick = () => {
  const start = searchStartInput.value;
  const end   = searchEndInput.value;
  if (!start || !end || start > end) return;

  const data = loadDiary();
  let output = "";

  Object.keys(data)
    .sort()
    .forEach(key => {
      if (key >= start && key <= end && data[key].content) {
        output += `【${key}】\n`;
        if (data[key].title) {
          output += `${data[key].title}\n`;
        }
        output += `${data[key].content}\n\n`;
      }
    });

  if (!output) return;

  exportTxt(`${start}_to_${end}.txt`, output.trim());
};

*/


/* ===============================
   日曆 UI 同步
================================ */
function updateCalendarUI(selectedKey){
  const [, , d] = selectedKey.split("-");
  const bigDateEl = document.querySelector(".bigDate");
  if (bigDateEl) bigDateEl.textContent = String(Number(d));

  document.querySelectorAll(".calendar .day").forEach(el=>{
    el.classList.remove("today");
    if(el.textContent.trim() === String(Number(d))){
      el.classList.add("today");
    }
  });
}

/* ===============================
   日曆點擊 → 切換日期
================================ */
function getCurrentYearMonth() {
  const year = document.querySelector(".calTitle .year")?.textContent;
  const monthText = document.querySelector(".calTitle .month")?.textContent;

  const monthMap = {
    JAN:"01",FEB:"02",MAR:"03",APR:"04",
    MAY:"05",JUN:"06",JUL:"07",AUG:"08",
    SEP:"09",OCT:"10",NOV:"11",DEC:"12"
  };

  return { year, month: monthMap[monthText] || "01" };
}

document.querySelectorAll(".calendar .day").forEach(dayEl=>{
  dayEl.addEventListener("click",()=>{
    const dayText = dayEl.textContent.trim();
    if(!dayText) return;

    const {year,month} = getCurrentYearMonth();
    const day = dayText.padStart(2,"0");
    const key = `${year}-${month}-${day}`;

    loadEntry(key);
  });
});

/* ===============================
   Diary Search → Jump to Diary
   Version: v1
   職責：
   1. 依日期區間產生搜尋結果列表
   2. 點擊日期 → 跳回日記頁該日
   ⚠️ 不修改、不儲存任何資料
================================ */

/* ===== DOM 參考 ===== */
const searchPage = document.getElementById("search");
const searchStartInput = searchPage.querySelector('input[type="date"]:nth-of-type(1)');
const searchEndInput   = searchPage.querySelector('input[type="date"]:nth-of-type(2)');
const searchResultList = searchPage.querySelector(".searchResultList");

/* ===== 工具：切換到日記頁 ===== */
function switchToDiaryPage(){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));

  const diaryTab  = document.querySelector('.tab[data-tab="diary"]');
  const diaryPage = document.getElementById("diary");

  if(diaryTab)  diaryTab.classList.add("active");
  if(diaryPage) diaryPage.classList.add("active");
}

/* ===== 渲染搜尋結果 ===== */
function renderSearchResult(){
  const start = searchStartInput.value;
  const end   = searchEndInput.value;

  searchResultList.innerHTML = "";

  if(!start || !end || start > end) return;

  const data = loadDiary();
  const keys = Object.keys(data).sort().reverse();

  keys.forEach(key=>{
    if(key < start || key > end) return;
    if(!data[key]?.content) return;

    const item = document.createElement("div");
    item.className = "monthItem";
    item.innerHTML = `
      <div class="date">${formatDate(key)}</div>
      <div class="title">${data[key].title || ""}</div>
    `;

    item.onclick = ()=>{
  loadEntry(key);        // 1. 載入該日
  renderMonthList();     // 2. 強制展開「已寫日記清單」
  switchToDiaryPage();   // 3. 切回日記頁
};

    searchResultList.appendChild(item);
  });
}

/* ===== 監聽日期變化 ===== */
searchStartInput.addEventListener("change", renderSearchResult);
searchEndInput.addEventListener("change", renderSearchResult);

/* ===============================
   全部選取 / 內文複製（UI 行為）
   - 不修改資料
   - 不影響切頁 / 搜尋
================================ */

// 取得按鈕（依目前 HTML 順序）
const diaryActionBtns = document.querySelectorAll(".diaryActions .btn");
const selectAllBtn = diaryActionBtns[3]; // 全部選取
const copyBtn      = diaryActionBtns[4]; // 內文複製

/* ===== 全部選取：標題＋內容 ===== */
selectAllBtn.onclick = () => {
  const selection = window.getSelection();
  selection.removeAllRanges();

  const range = document.createRange();
  range.setStartBefore(diaryTitleEl);
  range.setEndAfter(diaryContentEl);

  selection.addRange(range);
};

/* ===== 內文複製：只複製內容 ===== */
copyBtn.onclick = async () => {
  const text = diaryContentEl.innerText || "";

  if (!text.trim()) return;

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // 舊裝置 / WebView fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
};


/* ===============================
   初始化
================================ */
loadEntry(currentDateKey);
renderMonthList();
