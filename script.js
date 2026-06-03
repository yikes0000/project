// ====== 全域變數與語系切換 (加入 localStorage 記憶功能) ======
// 優先讀取瀏覽器記憶，如果沒有紀錄就預設為 'zh'
window.currentLang = localStorage.getItem('appLang') || 'zh'; 
const langToggle = document.getElementById('langToggle');

// 把翻譯動作獨立寫成一個功能
function applyTranslation() {
  if (langToggle) {
    langToggle.textContent = window.currentLang === 'zh' ? 'EN' : '中';
  }
  
  // 找出所有帶有 data-en 的標籤
  document.querySelectorAll('[data-en]').forEach(el => {
    // 備份原本的中文內容
    if (!el.hasAttribute('data-zh')) {
      el.setAttribute('data-zh', el.innerHTML);
    }
    // 根據當前語言替換文字
    el.innerHTML = window.currentLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh');
  });

  // 如果計算機已經有跑出結果，順便更新計算機結果的翻譯
  if (document.getElementById('result') && document.getElementById('result').textContent !== '') {
    calculateCarbon();
  }
}

// 🌟 網頁一載入，馬上執行一次翻譯，這樣跨網頁就能保持相同語言
applyTranslation();

// 當按鈕被點擊時
if (langToggle) {
  langToggle.addEventListener('click', () => {
    // 切換語系狀態
    window.currentLang = window.currentLang === 'zh' ? 'en' : 'zh';
    // 把新狀態存進瀏覽器的 localStorage 裡
    localStorage.setItem('appLang', window.currentLang);
    // 執行翻譯
    applyTranslation();
  });
}

// ====== 回到頂端按鈕 ======
const backToTop = document.getElementById("backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 200 ? "block" : "none";
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ====== 漢堡選單 ======
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".navbar ul");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
}

// ====== 碳排放計算機 ======
function calculateCarbon() {
  const classroom = Number(document.getElementById('classroom').value) || 0;
  const computerClass = Number(document.getElementById('computerClass').value) || 0;
  const outdoorClass = Number(document.getElementById('outdoorClass').value) || 0;
  const mobile = Number(document.getElementById('mobile').value) || 0;
  const meatMeal = Number(document.getElementById('meatMeal').value) || 0;
  const vegMeal = Number(document.getElementById('vegMeal').value) || 0;
  const computer = Number(document.getElementById('computer').value) || 0;

  const FACTORS = {
    classroom: 0.02,
    computerClass: 0.05,
    outdoorClass: 0.01,
    mobile: 0.01,
    meatMeal: 2.5,
    vegMeal: 0.8,
    computer: 0.06
  };

  const total =
    classroom * FACTORS.classroom +
    computerClass * FACTORS.computerClass +
    outdoorClass * FACTORS.outdoorClass +
    mobile * FACTORS.mobile +
    meatMeal * FACTORS.meatMeal +
    vegMeal * FACTORS.vegMeal +
    computer * FACTORS.computer;

  const treesNeeded = total / 0.9;
  const resultEl = document.getElementById('result');

  // 根據當前語系輸出對應語言的計算結果
  if (window.currentLang === 'en') {
    resultEl.textContent = `Estimated Emissions: ${total.toFixed(2)} kg CO₂e. Approx. ${Math.ceil(treesNeeded)} trees needed to offset monthly.`;
  } else {
    resultEl.textContent = `估計碳排放：${total.toFixed(2)} kg CO₂e，需要約 ${Math.ceil(treesNeeded)} 棵樹來抵消每月排放`;
  }
}

// 綁定計算按鈕
if (document.getElementById('calcBtn')) {
  document.getElementById('calcBtn').addEventListener('click', calculateCarbon);
}
