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

// 建立一個全域變數來記住圖表，避免重複按計算時圖表重疊打架
window.carbonChartInstance = null;

// ====== 碳排放計算機 (升級版：含圖表) ======
function calculateCarbon() {
  const classroom = Number(document.getElementById('classroom').value) || 0;
  const computerClass = Number(document.getElementById('computerClass').value) || 0;
  const outdoorClass = Number(document.getElementById('outdoorClass').value) || 0;
  const mobile = Number(document.getElementById('mobile').value) || 0;
  const meatMeal = Number(document.getElementById('meatMeal').value) || 0;
  const vegMeal = Number(document.getElementById('vegMeal').value) || 0;
  const computer = Number(document.getElementById('computer').value) || 0;

  const FACTORS = {
    classroom: 0.02, computerClass: 0.05, outdoorClass: 0.01,
    mobile: 0.01, computer: 0.06,
    meatMeal: 2.5, vegMeal: 0.8
  };

  // 將碳排分為三大類，方便畫圓餅圖
  const eduEmission = (classroom * FACTORS.classroom) + (computerClass * FACTORS.computerClass) + (outdoorClass * FACTORS.outdoorClass);
  const deviceEmission = (mobile * FACTORS.mobile) + (computer * FACTORS.computer);
  const foodEmission = (meatMeal * FACTORS.meatMeal) + (vegMeal * FACTORS.vegMeal);

  const total = eduEmission + deviceEmission + foodEmission;
  const treesNeeded = total / 0.9;
  const resultEl = document.getElementById('result');

  // 如果總碳排為 0，就不畫圖
  if (total === 0) {
    resultEl.textContent = window.currentLang === 'en' ? "Please enter values to calculate." : "請輸入數值來進行計算。";
    document.getElementById('carbonChart').style.display = 'none';
    return;
  }

  // 根據當前語系輸出文字結果
  if (window.currentLang === 'en') {
    resultEl.textContent = `Emissions: ${total.toFixed(2)} kg CO₂e. Approx. ${Math.ceil(treesNeeded)} trees needed to offset.`;
  } else {
    resultEl.textContent = `估計碳排放：${total.toFixed(2)} kg CO₂e，需要約 ${Math.ceil(treesNeeded)} 棵樹來抵消`;
  }

  // ====== 繪製甜甜圈圖 ======
  const ctx = document.getElementById('carbonChart');
  ctx.style.display = 'block'; // 把隱藏的畫布顯示出來

  // 如果已經有舊圖表，先把它銷毀，重新畫一個
  if (window.carbonChartInstance) {
    window.carbonChartInstance.destroy();
  }

  // 標籤也能支援中英切換！
  const labels = window.currentLang === 'en' ? ['Education', '3C Devices', 'Diet'] : ['課程學習', '3C 使用', '飲食習慣'];

  window.carbonChartInstance = new Chart(ctx, {
    type: 'doughnut', // 使用外觀更具現代感的甜甜圈圖
    data: {
      labels: labels,
      datasets: [{
        data: [eduEmission, deviceEmission, foodEmission],
        backgroundColor: ['#f39c12', '#3498db', '#e74c3c'], // 給三大類配上橘、藍、紅三種顏色
        borderWidth: 2,
        borderColor: '#ecf0f1' // 與計算機背景同色，讓圖表有鏤空感
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' } // 圖例放在下方
      },
      animation: {
        animateScale: true, // 加上彈出來的動畫特效
        animateRotate: true
      }
    }
  });
}
// 綁定計算按鈕
if (document.getElementById('calcBtn')) {
  document.getElementById('calcBtn').addEventListener('click', calculateCarbon);
}
