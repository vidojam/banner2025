const scrollText = document.getElementById('scrollText');
const bannerInput = document.getElementById('bannerInput');
const banner = document.getElementById('banner');

let messages = [];
let currentIndex = 0;
let rotationTimeout;

// Enable Enter key to add message
bannerInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addBannerMessage();
  }
});

// Load messages from localStorage
window.onload = () => {
  const saved = localStorage.getItem('bannerMessages');
  messages = saved ? JSON.parse(saved) : [];
};

function addBannerMessage() {
  const message = bannerInput.value.trim();
  if (message) {
    messages.push(message);
    localStorage.setItem('bannerMessages', JSON.stringify(messages));
    bannerInput.value = '';
    alert('Message added!');
  }
}

function startBanner() {
  if (messages.length === 0) {
    alert("Please add at least one message before starting the banner.");
    return;
  }

  banner.classList.remove('hidden');
  currentIndex = 0;
  updateScrollText(messages[currentIndex]);
}

function rotateBanner() {
  currentIndex = (currentIndex + 1) % messages.length;
  updateScrollText(messages[currentIndex]);
}

function stopBanner() {
  clearTimeout(rotationTimeout);
  banner.classList.add('hidden');
}

function clearAllMessages() {
  if (confirm("Are you sure you want to delete all banner messages?")) {
    localStorage.removeItem('bannerMessages');
    messages = [];
    currentIndex = 0;
    banner.classList.add('hidden');
    clearTimeout(rotationTimeout);
    alert('All messages cleared!');
  }
}

function updateScrollText(message) {
  scrollText.textContent = '';
  scrollText.className = 'scroll-text';
  banner.style.width = 'auto';
  banner.style.height = 'auto';
  banner.style.top = '';
  banner.style.bottom = '';
  banner.style.left = '';
  banner.style.right = '';
  scrollText.style.animation = 'none';
  void scrollText.offsetWidth;

  const animations = ['leftToRight', 'rightToLeft', 'topToBottom', 'bottomToTop'];
  const chosen = animations[Math.floor(Math.random() * animations.length)];

  let duration = Math.max(4, message.length * 0.15);
  if (chosen === 'topToBottom' || chosen === 'bottomToTop') {
    duration = Math.max(6, message.length * 0.3); // slower for vertical
  }

  if (chosen === 'leftToRight' || chosen === 'rightToLeft') {
    banner.style.width = '100vw';
    banner.style.height = '40px';
    banner.style.top = chosen === 'leftToRight' ? '0' : 'unset';
    banner.style.bottom = chosen === 'rightToLeft' ? '0' : 'unset';
    banner.style.left = '0';

    scrollText.classList.add('horizontal-text');
    scrollText.textContent = message;
    scrollText.style.animation = `${chosen} ${duration}s linear`;
  } else if (chosen === 'topToBottom' || chosen === 'bottomToTop') {
    banner.style.height = '100vh';
    banner.style.width = '40px';
    banner.style.left = chosen === 'topToBottom' ? '0' : 'unset';
    banner.style.right = chosen === 'bottomToTop' ? '0' : 'unset';
    banner.style.top = '0';

    scrollText.innerHTML = '';
    for (let char of message) {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      scrollText.appendChild(span);
    }

    scrollText.style.animation = `${chosen === 'topToBottom' ? 'verticalScrollLeft' : 'verticalScrollRight'} ${duration}s linear`;
  }

  clearTimeout(rotationTimeout);
  rotationTimeout = setTimeout(rotateBanner, duration * 1000);
}


