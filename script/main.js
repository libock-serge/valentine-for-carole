// ===== Valentine Countdown Configuration =====
const CONFIG = {
  // Start date: February 2, 2026 at midnight
  startDate: new Date("2026-02-02T00:00:00"),
  // Valentine's Day: February 14, 2026 (main countdown target)
  endDate: new Date("2026-02-14T00:00:00"),
  // Anniversary date: February 11, 2026 (QR code reveal date)
  anniversaryDate: new Date("2026-02-11T00:00:00"),
  // Total days for card reveals (Feb 2-13 = 12 days, 1 card per day = 12 cards)
  totalDays: 12,
  // TEMPORARY: Set to true to unlock everything for testing
  debugMode: true,
};

// ===== DOM Elements =====
const elements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  loveCards: document.querySelectorAll(".love-card"),
  revealContent: document.getElementById("reveal-content"),
  revealLocked: document.getElementById("reveal-locked"),
};

// ===== Calculate Current Day (1-12) =====
function getCurrentDay() {
  // Debug mode: unlock all cards
  if (CONFIG.debugMode) return CONFIG.totalDays + 1;

  const now = new Date();
  const startDate = CONFIG.startDate;
  const timeDiff = now - startDate;
  const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Return the current day number (1-12), capped at 12
  if (daysPassed < 0) return 0; // Before start
  if (daysPassed >= CONFIG.totalDays) return CONFIG.totalDays + 1; // After countdown ends
  return daysPassed + 1; // Current day (1-indexed)
}

// ===== Update Countdown Timer =====
function updateCountdown() {
  const now = new Date();
  const endDate = CONFIG.endDate;
  const timeDiff = endDate - now;

  if (timeDiff <= 0) {
    // Countdown finished!
    elements.days.textContent = "0";
    elements.hours.textContent = "0";
    elements.minutes.textContent = "0";
    elements.seconds.textContent = "0";
    revealFinalSurprise();
    return;
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  elements.days.textContent = days;
  elements.hours.textContent = hours;
  elements.minutes.textContent = minutes;
  elements.seconds.textContent = seconds;
}

// ===== Reveal Love Cards Based on Current Day =====
function updateLoveCards() {
  const currentDay = getCurrentDay();

  elements.loveCards.forEach((card) => {
    const cardDay = parseInt(card.dataset.day);

    if (cardDay <= currentDay) {
      // This card should be revealed
      card.classList.add("revealed");
      card.classList.remove("locked");
    } else {
      // This card is still locked
      card.classList.add("locked");
      card.classList.remove("revealed");
    }
  });
}

// ===== Reveal Final Surprise (QR Code) - On Anniversary =====
function revealFinalSurprise() {
  if (elements.revealContent && elements.revealLocked) {
    elements.revealLocked.classList.add("hidden");
    elements.revealContent.classList.remove("hidden");

    // Add celebration animation
    elements.revealContent.classList.add("celebrate");
    createConfetti();
  }
}

// ===== Check if Anniversary Date Reached (Video Reveal) =====
function isAnniversaryReached() {
  // Debug mode: always show reveal
  if (CONFIG.debugMode) return true;
  return new Date() >= CONFIG.anniversaryDate;
}

// ===== Check if Valentine's Day Reached =====
function isValentinesDay() {
  return new Date() >= CONFIG.endDate;
}

// ===== Create Confetti Animation =====
function createConfetti() {
  const colors = ["#ff6b9d", "#ffa5c3", "#ff69b4", "#ffd700", "#ff1493"];
  const confettiContainer = document.createElement("div");
  confettiContainer.className = "confetti-container";
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + "s";
    confetti.style.animationDuration = Math.random() * 2 + 3 + "s";
    confettiContainer.appendChild(confetti);
  }
}

// ===== Add Staggered Animation to Cards =====
function animateCardsOnLoad() {
  elements.loveCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add("fade-in-up");
  });
}

// ===== Sparkle Effect on Hover =====
function addSparkleEffects() {
  elements.loveCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (card.classList.contains("revealed")) {
        createSparkles(card);
      }
    });
  });
}

function createSparkles(element) {
  const sparkleCount = 5;
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = Math.random() * 100 + "%";
    sparkle.style.top = Math.random() * 100 + "%";
    sparkle.style.animationDelay = Math.random() * 0.5 + "s";
    element.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1000);
  }
}

// ===== Pulse Animation for Countdown When Close =====
function checkCountdownUrgency() {
  const now = new Date();
  const timeDiff = CONFIG.endDate - now;
  const hoursLeft = timeDiff / (1000 * 60 * 60);

  if (hoursLeft <= 24 && hoursLeft > 0) {
    document.querySelector(".countdown-section").classList.add("urgent");
  }
}

// ===== Initialize Everything =====
function init() {
  // Initial updates
  updateCountdown();
  updateLoveCards();
  animateCardsOnLoad();
  addSparkleEffects();
  checkCountdownUrgency();

  // Check if anniversary reached (reveal QR code)
  if (isAnniversaryReached()) {
    revealFinalSurprise();
  }

  // Update countdown every second
  setInterval(updateCountdown, 1000);

  // Update cards every minute (in case day changes while viewing)
  setInterval(updateLoveCards, 60000);

  // Check urgency every hour
  setInterval(checkCountdownUrgency, 3600000);

  // Add click interaction to revealed cards (optional flip back)
  elements.loveCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (card.classList.contains("revealed")) {
        card.classList.toggle("flipped-back");
      }
    });
  });
}

// ===== Start when DOM is ready =====
document.addEventListener("DOMContentLoaded", init);
