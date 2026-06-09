
window.currentLang = localStorage.getItem('appLang') || 'zh'; 
const langToggle = document.getElementById('langToggle');


function applyTranslation() {
  if (langToggle) {
    langToggle.textContent = window.currentLang === 'zh' ? 'EN' : '中';
  }
  
  
  document.querySelectorAll('[data-en]').forEach(el => {
   
    if (!el.hasAttribute('data-zh')) {
      el.setAttribute('data-zh', el.innerHTML);
    }
    
    el.innerHTML = window.currentLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh');
  });

  
  if (document.getElementById('result') && document.getElementById('result').textContent !== '') {
    calculateCarbon();
  }
}


applyTranslation();


if (langToggle) {
  langToggle.addEventListener('click', () => {
    
    window.currentLang = window.currentLang === 'zh' ? 'en' : 'zh';
   
    localStorage.setItem('appLang', window.currentLang);
   
    applyTranslation();
  });
}


const backToTop = document.getElementById("backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 200 ? "block" : "none";
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".navbar ul");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
}

window.carbonChartInstance = null;


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

 
  const eduEmission = (classroom * FACTORS.classroom) + (computerClass * FACTORS.computerClass) + (outdoorClass * FACTORS.outdoorClass);
  const deviceEmission = (mobile * FACTORS.mobile) + (computer * FACTORS.computer);
  const foodEmission = (meatMeal * FACTORS.meatMeal) + (vegMeal * FACTORS.vegMeal);

  const total = eduEmission + deviceEmission + foodEmission;
  const treesNeeded = total / 0.9;
  const resultEl = document.getElementById('result');


  if (total === 0) {
    resultEl.textContent = window.currentLang === 'en' ? "Please enter values to calculate." : "請輸入數值來進行計算。";
    document.getElementById('carbonChart').style.display = 'none';
    return;
  }

  
  if (window.currentLang === 'en') {
    resultEl.textContent = `Emissions: ${total.toFixed(2)} kg CO₂e. Approx. ${Math.ceil(treesNeeded)} trees needed to offset.`;
  } else {
    resultEl.textContent = `估計碳排放：${total.toFixed(2)} kg CO₂e，需要約 ${Math.ceil(treesNeeded)} 棵樹來抵消`;
  }

 
  const ctx = document.getElementById('carbonChart');
  ctx.style.display = 'block'; 

  if (window.carbonChartInstance) {
    window.carbonChartInstance.destroy();
  }

  
  const labels = window.currentLang === 'en' ? ['Education', '3C Devices', 'Diet'] : ['課程學習', '3C 使用', '飲食習慣'];

  window.carbonChartInstance = new Chart(ctx, {
    type: 'doughnut', 
    data: {
      labels: labels,
      datasets: [{
        data: [eduEmission, deviceEmission, foodEmission],
        backgroundColor: ['#f39c12', '#3498db', '#e74c3c'], 
        borderWidth: 2,
        borderColor: '#ecf0f1' 
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' } 
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}

if (document.getElementById('calcBtn')) {
  document.getElementById('calcBtn').addEventListener('click', calculateCarbon);
}

document.addEventListener('DOMContentLoaded', function() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800, 
      once: true,    
      offset: 100    
    });
  }
});
