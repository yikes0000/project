// 回到頂端按鈕
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 200 ? "block" : "none";
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 漢堡選單（可及性）
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".navbar ul");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// 碳排放計算機
function calculateCarbon() {
  const classroom = Number(document.getElementById('classroom').value) || 0;
  const computerClass = Number(document.getElementById('computerClass').value) || 0;
  const outdoorClass = Number(document.getElementById('outdoorClass').value) || 0;
  const mobile = Number(document.getElementById('mobile').value) || 0;
  const meatMeal = Number(document.getElementById('meatMeal').value) || 0;
  const vegMeal = Number(document.getElementById('vegMeal').value) || 0;
  const computer = Number(document.getElementById('computer').value) || 0;

  // 範例換算係數（請依實際來源替換）
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

  const resultEl = document.getElementById('result');
  resultEl.textContent = `估計碳排放：${total.toFixed(2)} kg CO₂e`;
}

// 綁定按鈕
document.getElementById('calcBtn').addEventListener('click', calculateCarbon);
