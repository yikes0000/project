// 顯示/隱藏按鈕
window.addEventListener("scroll", function() {
  const btn = document.getElementById("backToTop");
  if (window.scrollY > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
});

// 點擊回到頂端
document.getElementById("backToTop").addEventListener("click", function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// 漢堡選單（可及性）
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".navbar ul");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// 碳排放計算機
function calculateCarbon() {
  const classroom = Number(document.getElementById("classroom").value) || 0;
  const computerClass = Number(document.getElementById("computerClass").value) || 0;
  const outdoorClass = Number(document.getElementById("outdoorClass").value) || 0;
  const mobile = Number(document.getElementById("mobile").value) || 0;
  const meatMeal = Number(document.getElementById("meatMeal").value) || 0;
  const vegMeal = Number(document.getElementById("vegMeal").value) || 0;
  const computer = Number(document.getElementById("computer").value) || 0;

  // 範例換算係數
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

  // 🌳 樹木抵消邏輯：每棵樹每月可抵消 0.9 kg CO₂
  const treesNeeded = total / 0.9;

  const resultEl = document.getElementById("result");
  resultEl.textContent = `估計碳排放：${total.toFixed(2)} kg CO₂e，需要約 ${Math.ceil(treesNeeded)} 棵樹來抵消每月排放`;
}

// 綁定按鈕
document.getElementById("calcBtn").addEventListener("click", calculateCarbon);
