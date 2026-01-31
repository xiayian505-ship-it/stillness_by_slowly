
document.addEventListener("DOMContentLoaded", ()=>{
/* =========================================================
   慢慢｜時光膠囊 capsule_v1.js
   v2：時間語意版（封存後進入「時間層」）
========================================================= */

let timeLayerInited = false;

/* ===============================
   Tab 切換
================================ */
document.querySelectorAll(".tab").forEach(tab=>{
  tab.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    tab.classList.add("active");

    const page = document.getElementById(tab.dataset.tab);
    page.classList.add("active");

    if(tab.dataset.tab === "dev" && !timeLayerInited){
      initTimeLayerScene();
      timeLayerInited = true;
    }
  });   
});

/* ===============================
   Storage Key
================================ */
const CAPSULE_KEY = "mm_capsule_entries_v1";

/* ===============================
   節日表
================================ */
const HOLIDAY_TABLE_V1 = [
  { name:"新年第一天", month:1, day:1 },
  { name:"春分", month:3, day:20 },
  { name:"夏至", month:6, day:21 },
  { name:"秋分", month:9, day:22 },
  { name:"冬至", month:12, day:21 }
];

/* ================= 時間語氣池 ================= */
const TIME_SLEEP_LINES = [
  "正被時間保存",
  "在時光裡醞釀",
  "停泊於未來",
  "靜置時光深處",
  "未醒",
  "在時間中成形",
  "被未來珍藏",
  "把時間交付未來",
  "沉浮於時間之中",
"暫停於某個未來",
"尚在被歲月校準",
"佇立在時間的陰影",
"等待未來翻閱",
"穿梭歲月",
"被時間輕拂",
"還在與歲月對齊",
"停靠未來之前",
"於未來安放",
"歲月緩慢前行",
"時光旅途",
"放進未來",
"在時間背面停留",
"此刻",
"編入未來",
"時間正在讓路",
"暫存於未來邊界",
"尚未抵達",
"被歲月輕聲覆蓋",
"駐留在未來之前",
"逃離現在",
"時光尚未呼喚",
"停在將來",
"在時序之外緩慢呼吸",
"時光尚未跟上",
"暫未相遇",
"被未來接手",
"停留在將來之前",
"安靜存在"
  
];

function pickSleepLine(){
  const i = Math.floor(Math.random() * TIME_SLEEP_LINES.length);
  return TIME_SLEEP_LINES[i];
}

/* ================= 日期工具 ================= */
function pad2(n){ return String(n).padStart(2,"0"); }
function dateKey(d=new Date()){ return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function parseDateKey(key){ const [y,m,d]=key.split("-").map(Number); return new Date(y,m-1,d); }
function addDays(key,days){ const dt=parseDateKey(key); dt.setDate(dt.getDate()+days); return dateKey(dt); }
function formatDateMMDD(key){ const [,m,d]=key.split("-"); return `${m}/${d}`; }

/* ================= Storage ================= */
function loadCapsule(){ return JSON.parse(localStorage.getItem(CAPSULE_KEY)||"{}"); }
function saveCapsule(data){ localStorage.setItem(CAPSULE_KEY,JSON.stringify(data)); }

/* ================= Today UI ================= */
function renderToday(){
  if(!todayYear || !todayMonth || !todayDate) return;

  const now = new Date();
  const m=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  todayYear.textContent  = now.getFullYear();
  todayMonth.textContent = m[now.getMonth()];
  todayDate.textContent  = now.getDate();
}

/* ================= DOM ================= */
const titleEl=document.querySelector(".diaryTitle");
const contentEl=document.querySelector(".diaryContent");
const diaryPaper=document.querySelector(".diary");

const writeActions=document.querySelector(".diaryWriteActions");
const sealBtn=document.getElementById("sealBtn");
const editBtn=document.getElementById("editBtn");
const deleteBtn=document.getElementById("deleteBtn");
const exportBtn=document.getElementById("exportBtn");
const openedActions=document.querySelector(".openedActions");

const previewWrap = document.querySelector(".mailPreviewWrap");
const previewPaper = document.querySelector(".mailPreviewPaper");
const previewTitle = document.querySelector(".mailPreviewTitle");
const previewContent = document.querySelector(".mailPreviewContent");
const previewActions = document.querySelector(".mailPreviewActions");

let previewKey = null;   // ⭐ 信箱目前正在看的信

const dateInput=document.querySelector(".deliveryDateInput");
const meaningfulSelect=document.querySelector(".meaningfulSelect");
const festivalSelect=document.querySelector(".festivalSelect");
const birthdayInput=document.querySelector(".birthdayInput");

const todayYear  = document.getElementById("todayYear");
const todayMonth = document.getElementById("todayMonth");
const todayDate  = document.getElementById("todayDate");

let isEditing = false;  // UI 編輯模式開關（取代舊資料鎖）

const previewModal = document.getElementById("exportPreviewModal");
const previewMount = document.getElementById("exportPreviewMount");
const cancelExportBtn = document.getElementById("cancelExportBtn");
const confirmExportBtn = document.getElementById("confirmExportBtn");

/* ================= 插入文字到游標（純文字模式核心） ================= */
function insertTextAtCursor(text) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(text));
  range.collapse(false);
}

function handleEnterKey(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    insertTextAtCursor("\n");
  }
}

/* ================= 編輯按鈕（UI 控制） ================= */
if (editBtn) {
  editBtn.addEventListener("click", () => {
  const data = loadCapsule();
  const e = ensureEntryShape(data[currentKey]);

  // 只有「今天＋draft」才允許進入編輯模式
  if (currentKey !== todayKey() || e.status !== "draft") return;

  isEditing = !isEditing;

  titleEl.contentEditable = isEditing;
  contentEl.contentEditable = isEditing;

if (isEditing) {
  contentEl.addEventListener("keydown", handleEnterKey);
} else {
  contentEl.removeEventListener("keydown", handleEnterKey);
}

editBtn.textContent = isEditing ? "完成信件" : "寫信";

if (isEditing) titleEl.focus();
});
}


/* ================= Entry 結構 ================= */
function ensureEntryShape(e){
  return {
    title:e?.title||"",
    content:e?.content||"",
    status:e?.status||"draft",
    openAt:e?.openAt||null,
    mode:e?.mode||null,
    holidayName:e?.holidayName||null,
    sealedAt:e?.sealedAt||null,
    aging:e?.aging||0
  };
}

function todayKey(){ return dateKey(new Date()); }
function isOpenable(e){ return e.status==="sealed" && todayKey()>=e.openAt; }

/* ================= 投遞設定 ================= */
function getSelectedMode(){ return document.querySelector('input[name="deliverMode"]:checked').value; }

function computeOpenAt(){
  const today=todayKey();
  const mode=getSelectedMode();

if(mode==="custom"){
  const min = addDays(today,1);   // 明天
  const key = dateInput.value;

  if(!key){
    alert("請選擇投遞日期");
    return null;
  }

  if(key < min){
    alert("時光膠囊只能寄往未來，最早為明天");
    return null;   // ❗阻止封存
  }

  return {openAt:key, mode:"custom", holidayName:null};
}

  if(mode==="meaningful"){
    const days=Number(meaningfulSelect.value||7);
    const key=addDays(today,days);
    return {openAt:key,mode:"meaningful",holidayName:null};
  }

  if(mode==="random"){
    const days=Math.floor(Math.random()*365)+1;
    const key=addDays(today,days);
    return {openAt:key,mode:"random",holidayName:null};
  }

  if(mode==="festival"){
    const val=festivalSelect.value;
    const [m,d]=val.split("-").map(Number);
    const t=parseDateKey(today);
    let y=t.getFullYear();
    let key=dateKey(new Date(y,m-1,d));
    if(key<=today) key=dateKey(new Date(y+1,m-1,d));
    const holiday=HOLIDAY_TABLE_V1.find(h=>h.month===m&&h.day===d)?.name||null;
    return {openAt:key,mode:"holiday",holidayName:holiday};
  }

if(mode==="birthday"){
  if(!birthdayInput) return null;

  const key = birthdayInput.value;
  if(!key){
    alert("請選擇生日日期");
    return null;
  }

  // 規則：只能選今天或今天之後（不允許今天以前）
  if(key < today){
    alert("這一天已經過去了呢，請選擇今天或未來的生日。若今天就是生日，時間會替你把祝福送往明年的今天。");
    return null;
  }

  const [y,m,d] = key.split("-").map(Number);
  const t = parseDateKey(today);
  const thisYear = t.getFullYear();

  // 規則：若選的是「今天」，寄達改為「明年的今天」
  if(key === today){
    const openKey = dateKey(new Date(thisYear + 1, t.getMonth(), t.getDate()));
    return { openAt: openKey, mode:"birthday", holidayName:"誕生" };
  }

  // 規則：只能選「今年的今天之後」（避免選到明年/後年其他日期）
  if(y !== thisYear){
    alert("生日只能選『今年今天之後』；若今天就是生日，請選今天（系統會寄達明年的今天）");
    return null;
  }

return { openAt: key, mode:"birthday", holidayName:"誕生" };
}
}  // ← 補這行


/* ================= 信紙慢慢做舊 ================= */
let agingTarget=0;
let agingValue=0;

function applyPaperAging(){
  if(!diaryPaper) return;   // ⭐ 防呆

  const sepia = agingValue * 0.35;
  const bright = 1 - agingValue * 0.08;
  const sat = 1 - agingValue * 0.12;
  const contrast = 1 - agingValue * 0.05;

  diaryPaper.style.filter =
    `sepia(${sepia}) brightness(${bright}) saturate(${sat}) contrast(${contrast})`;
}

function agingLoop(){
  agingValue += (agingTarget-agingValue)*0.0001;
  applyPaperAging();

  // 🔥 把老化進度寫回 storage（時間真正流逝）
  const data=loadCapsule();
  const e=ensureEntryShape(data[currentKey]);
  if(Math.abs(e.aging-agingValue)>0.0005){
    e.aging=agingValue;
    data[currentKey]=e;
    saveCapsule(data);
  }

  requestAnimationFrame(agingLoop);
}

/* ================= 核心顯示 ================= */
let currentKey=todayKey();

function showPreview(key){
  const data = loadCapsule();
  const e = ensureEntryShape(data[key]);
  if(!e || e.status !== "opened") return;

  previewKey = key;

  previewTitle.textContent = e.title || "留 給 未 來";
  previewContent.textContent = e.content || "";
  previewActions.style.display = "flex";
}

function applyView(key){
  const data=loadCapsule();
  let e=ensureEntryShape(data[key]);

  if(isOpenable(e)){ e.status="opened"; data[key]=e; saveCapsule(data); }

  agingTarget=e.aging;
  agingValue=e.aging;
applyPaperAging();
isEditing = false;

if(titleEl){
  titleEl.textContent = e.title || "寄 給 未 來";
  titleEl.contentEditable = false;
}

if(contentEl){
  contentEl.textContent =
    (e.status==="sealed" && !isOpenable(e))
      ? pickSleepLine()
      : (e.content || "信件在時間裡沉澱");
  contentEl.contentEditable = false;
}

if(editBtn){
  editBtn.textContent = "寫信";
}

  const diaryPage=document.getElementById("diary");

if(e.status==="draft"){
  if(writeActions) writeActions.style.display = "flex";
  if(diaryPaper) diaryPaper.classList.remove("time-sealed");
  if(diaryPage) diaryPage.classList.remove("time-layer");
}else{
  if(writeActions) writeActions.style.display = "none";
  if(diaryPaper) diaryPaper.classList.add("time-sealed");
  if(diaryPage) diaryPage.classList.add("time-layer");
}

  if(openedActions){
    openedActions.style.display=(e.status==="opened")?"flex":"none";
  }
}

function loadEntry(key){
  currentKey=key;
  applyView(key);
  renderMonthList();
}

/* ================= 點擊標題觸發老化 ================= */
if (titleEl) {
  titleEl.addEventListener("click",()=>{
    const data=loadCapsule();
    let e=ensureEntryShape(data[currentKey]);
    if(e.aging===0){
      e.aging=1;
      data[currentKey]=e;
      saveCapsule(data);
      agingTarget=1;
    }
  });
}

/* ================= 封存 ================= */
if (sealBtn) {
  sealBtn.onclick = () => {
    const tKey = todayKey();
    if (currentKey !== tKey) return alert("封存只能對今天這封信操作");

    const data = loadCapsule();
    const e = ensureEntryShape(data[tKey]);
    if (e.status !== "draft") return alert("已封存");

    const t = titleEl.textContent.trim();
 const c = contentEl.innerText.trim();
    if (!t && !c) return alert("你還沒寫內容");

    const result = computeOpenAt();
    if (!result) return;

    e.title = t.replace("留 給 未 來", "");
    e.content = c;
    e.status = "sealed";
    e.openAt = result.openAt;
    e.mode = result.mode;
    e.holidayName = result.holidayName;
    e.sealedAt = tKey;

    data[tKey] = e;
    saveCapsule(data);
    loadEntry(tKey);
  };
}

/* ================= 信箱 ================= */
function renderMonthList(){
  const data=loadCapsule();
  const openedList=document.querySelector(".openedList");
  const sealedList=document.querySelector(".sealedList");
  if(openedList) openedList.innerHTML="";
if(sealedList) sealedList.innerHTML="";

  Object.keys(data).sort().reverse().forEach(k=>{
    const e=ensureEntryShape(data[k]);
    if(!e.title&&!e.content) return;

    const item=document.createElement("div");
    item.className="monthItem";

    item.innerHTML = `
  <div class="date">${formatDateMMDD(k)}</div>
  <div class="title">${e.title || "留 給 未 來"}</div>`;
item.onclick=()=>{
  const e = ensureEntryShape(data[k]);
  if(e.status==="opened"){
    showPreview(k);      // ⭐ 顯示在信箱預覽區
  }else{
    loadEntry(k);        // sealed 仍用舊邏輯
  }
};

    if(e.status==="opened") openedList.appendChild(item);
    else if(e.status==="sealed") sealedList.appendChild(item);
  });
}

/* ================= PNG 匯出 ================= */
const exportCard = document.getElementById("capsuleExportCard");

let exportTitle, exportBody, exportFrom, exportTo;

if (exportCard) {
  exportTitle = exportCard.querySelector(".exportTitle");
  exportBody  = exportCard.querySelector(".exportBody");
  exportFrom  = exportCard.querySelector(".fromText");
  exportTo    = exportCard.querySelector(".toText");
}

function buildToText(entry){
  if(entry.mode==="meaningful"){
    const days=Math.round((parseDateKey(entry.openAt)-parseDateKey(entry.sealedAt))/86400000);
    return `${days} DAY`;
  }
  if(entry.holidayName){
    return `Welcome to ${entry.holidayName}`;
  }
  return `To ${entry.openAt}`;
}

function fillExportCard(key,entry){
  if(exportTitle) exportTitle.textContent = entry.title || "留 給 未 來";
  if(exportBody)  exportBody.textContent  = entry.content || "";
  if(exportFrom)  exportFrom.textContent  = `from ${entry.sealedAt||key}`;
  if(exportTo)    exportTo.textContent    = buildToText(entry);
}

async function exportCapsulePNG(){
  const data=loadCapsule();
const entry=ensureEntryShape(data[previewKey]);
  if(entry.status!=="opened"){ alert("只能匯出已開啟的信件"); return; }

fillExportCard(previewKey,entry);

  exportCard.style.left="0";
  exportCard.style.opacity="1";
  await new Promise(r=>setTimeout(r,50));

// ⭐ 截圖前強制還原真實尺寸
const oldTransform = exportCard.style.transform;
const oldWidth = exportCard.style.width;

exportCard.style.transform = "none";
exportCard.style.width = exportCard.offsetWidth + "px";
exportCard.style.position = "relative";

// 等 DOM 穩定
await new Promise(r => requestAnimationFrame(r));


  const canvas=await html2canvas(exportCard,{backgroundColor:null,scale:2,useCORS:true});
  exportCard.style.left="-9999px";

  canvas.toBlob(blob=>{
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
a.download=`mm_capsule_${previewKey}.png`;
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
  },"image/png");
}

if (exportBtn) {
  exportBtn.onclick = openExportPreview;
}

function openExportPreview(){
  if(!previewKey){
    alert("請先選擇一封已開啟的信件");
    return;
  }

  const data = loadCapsule();
  const entry = ensureEntryShape(data[previewKey]);
  if(entry.status!=="opened"){ alert("只能匯出已開啟的信件"); return; }

  fillExportCard(previewKey, entry);

  // 把卡片移到預覽容器
  previewMount.innerHTML = "";
  previewMount.appendChild(exportCard);

  exportCard.style.position = "relative";
  exportCard.style.left = "0";

  previewModal.style.display = "flex";
}

if(cancelExportBtn){
  cancelExportBtn.onclick = ()=>{
    previewModal.style.display = "none";

    // 把卡片丟回隱藏區
    document.body.appendChild(exportCard);
    exportCard.style.position = "fixed";
    exportCard.style.left = "-9999px";
  };
}

if(confirmExportBtn){
  confirmExportBtn.onclick = async ()=>{

    await new Promise(r=>setTimeout(r,30));

    // ⭐ 找到會影響排版的父層（時光膠囊頁）
    const pageEl = document.querySelector(".page.active");

    // ⭐ 保存原本狀態
    const oldPageTransform = pageEl.style.transform;
    const oldCardTransform = exportCard.style.transform;
    const oldWidth = exportCard.style.width;
    const oldPosition = exportCard.style.position;

    // ⭐ 關閉所有 transform 影響
    pageEl.style.transform = "none";
    exportCard.style.transform = "none";
    exportCard.style.position = "relative";
    exportCard.style.width = exportCard.offsetWidth + "px";

    // 等版面重新排好
    await new Promise(r => requestAnimationFrame(r));

    // ⭐ 用正確尺寸截圖
    const canvas = await html2canvas(exportCard,{
      backgroundColor:"#ffffff",
      scale:2,
      useCORS:true,
      width: exportCard.offsetWidth,
      height: exportCard.offsetHeight
    });

    // ⭐ 截完恢復現場
    pageEl.style.transform = oldPageTransform;
    exportCard.style.transform = oldCardTransform;
    exportCard.style.width = oldWidth;
    exportCard.style.position = oldPosition;

    // ⭐ 下載
    canvas.toBlob(blob=>{
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mm_capsule_${previewKey}.png`;
      document.body.appendChild(a);
      a.click();
      setTimeout(()=>URL.revokeObjectURL(url),5000);
    },"image/png");
  };
}

/* ================= 刪除（信箱預覽模式） ================= */
if(deleteBtn){
  deleteBtn.onclick=()=>{
    if(!previewKey) return;

    const ok = confirm("從時光膠囊消散。\n消散後無法回來。");
    if(!ok) return;

    const data=loadCapsule();
    delete data[previewKey];
    saveCapsule(data);

    previewTitle.textContent="選一封信";
    previewContent.textContent="信件會在這裡展開";
    previewActions.style.display="none";
    previewKey=null;

    renderMonthList();
  };
}

/* ================= 初始化 ================= */
renderToday();
autoCleanupCapsules();   // ⭐ 先讓時間吞信
loadEntry(todayKey());   // 再讀乾淨後的世界
renderMonthList();
agingLoop();

/* ===============================
   ⏳ 時光膠囊自動銷毀系統
   規則：12天 OR 12封
================================ */
function autoCleanupCapsules(){
  const MAX_DAYS = 12;
  const MAX_COUNT = 12;

  const data = loadCapsule();
  const keys = Object.keys(data);

  // === ① 時間銷毀 ===
  const today = parseDateKey(todayKey());

  keys.forEach(k=>{
    const e = ensureEntryShape(data[k]);
    if(!e.sealedAt) return;

    const sealedDate = parseDateKey(e.sealedAt);
    const diffDays = Math.floor((today - sealedDate) / 86400000);

    if(diffDays > MAX_DAYS){
      delete data[k];
    }
  });

  // === ② 數量銷毀 ===
  const remainingKeys = Object.keys(data)
    .sort((a,b)=> parseDateKey(b) - parseDateKey(a)); // 新到舊

  if(remainingKeys.length > MAX_COUNT){
    const overflow = remainingKeys.slice(MAX_COUNT);
    overflow.forEach(k=> delete data[k]);
  }

  saveCapsule(data);
}


// === 未來型 UX 限制（明天起）===
const tomorrowKey = addDays(todayKey(), 1);

if (dateInput) {
  dateInput.min = tomorrowKey;     // 今天以前無法選
  dateInput.value = tomorrowKey;   // 預設明天
}



// 初始化完成後解除隱藏（避免首幀閃爍）
const diaryPageEl = document.getElementById("diary");
if(diaryPageEl){
  diaryPageEl.classList.remove("preload");
}
/* =========================================================
   🌿 植栽頁｜時間層場景模組（只初始化一次）
========================================================= */
function initTimeLayerScene(){

  const scene = document.getElementById("mm_time_layer_scene");
  if(!scene) return;

  const HELP_TEXT = "這裡可以\n寫信給未來\n時光會保存信件\n停下來\n慢一點\n讓靈魂跟上\n無論說什麼\n僅你可見";

  const state = {
    t:0,
    light:.35,
    lightTarget:Math.random(),
    lightTimer:0,
    lightInterval:4.5,
    papers:[],
    firstRevealDone:false
  };

  function rand(min,max){return min+Math.random()*(max-min);}

  function createPaper(i){
    const el=document.createElement("div");
    el.className="mm_time_paper";

    const text=document.createElement("div");
    text.className="mm_time_text";

    // 🔹 內容規則
if(i === 0){
  text.textContent = HELP_TEXT;
  el.style.zIndex = 999;
  el.dataset.type = "help";
}
else{
  // 從第 1 張開始全部是時間語氣紙
  const randIndex = Math.floor(Math.random() * TIME_SLEEP_LINES.length);
  text.textContent = TIME_SLEEP_LINES[randIndex];
  el.dataset.type = "time";
}

    el.appendChild(text);

    const base={
      x:rand(-40,window.innerWidth-180),
      y:rand(-40,window.innerHeight-260),
      rot:rand(-22,22),
      scale:rand(.92,1.08),
      phase:Math.random()*Math.PI*2,
      aged:0,
      agedTarget:0
    };

    el.dataset.base=JSON.stringify(base);
    el.style.left=base.x+"px";
    el.style.top=base.y+"px";
    el.style.transform=`rotate(${base.rot}deg) scale(${base.scale})`;
    if(!el.style.zIndex) el.style.zIndex=i;

    el.addEventListener("click",()=>{
      const b=JSON.parse(el.dataset.base);
      b.agedTarget=1;
      el.dataset.base=JSON.stringify(b);

      const textEl=el.querySelector(".mm_time_text");

      // 首次一定顯示說明
      if(!state.firstRevealDone && el.dataset.type==="help"){
        textEl.classList.add("mm_time_revealed");
        state.firstRevealDone=true;
        return;
      }

      // 說明後才開始隨機
      if(state.firstRevealDone){
        if(el.dataset.type==="time" && Math.random()<0.45){
          textEl.classList.add("mm_time_revealed");
        }
        if(el.dataset.type==="dev"){
          textEl.classList.add("mm_time_revealed");
        }
      }
    });

    scene.appendChild(el);
    state.papers.push(el);
  }

  for(let i=0;i<16;i++) createPaper(i);

  function animate(){
    state.t+=.016;

    state.lightTimer+=.016;
    if(state.lightTimer>state.lightInterval){
      state.lightTarget=Math.random();
      state.lightTimer=0;
      state.lightInterval=3+Math.random()*3;
    }
    state.light+=(state.lightTarget-state.light)*.008;

    state.papers.forEach(el=>{
      const b=JSON.parse(el.dataset.base);
      const drift=Math.sin(state.t*.55+b.phase)*42*state.light;
      el.style.boxShadow=`${drift}px 12px 26px rgba(0,0,0,.22)`;

      b.aged+=(b.agedTarget-b.aged)*.02;
      el.style.filter=`sepia(${.12+b.aged*.55}) brightness(${1-b.aged*.07})`;
      el.dataset.base=JSON.stringify(b);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

});