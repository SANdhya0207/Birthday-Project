document.addEventListener("DOMContentLoaded", () => {
  // Initialize countdown timer
  initCountdown();

  // Initialize category filters
  initCategoryFilters();

  // Initialize fireworks animation
  initFireworks();

  // Initialize wish button
  initWishButton();

  // Fetch and display memories
  fetch("memories.json")
    .then((response) => response.json())
    .then((memories) => {
      const container = document.getElementById("memories-container");
      container.innerHTML = ''; // Clear container first

      memories.forEach((memory) => {
        const memoryDiv = document.createElement("div");
        memoryDiv.classList.add("memory");

        // Set the correct category based on the image path
        if (memory.image.includes('goodPhoto')) {
          memoryDiv.dataset.category = "memories";
        } else if (memory.image.includes('birthdaycelebration')) {
          memoryDiv.dataset.category = "birthday";
        } else if (memory.image.includes('adventureTrip')) {
          memoryDiv.dataset.category = "adventure";
        } else if (memory.image.includes('firstShortTrip') || memory.image.includes('firstTrip')) {
          memoryDiv.dataset.category = "trips";
        } else if (memory.image.includes('funPhotos')) {
          memoryDiv.dataset.category = "fun";
        }

        const img = document.createElement("img");
        img.src = memory.image;
        img.alt = "Memory Image";

        // Add click handler for image zoom
        img.addEventListener("click", () => {
          openImageModal(memory.image, memory.caption);
        });

        const caption = document.createElement("p");
        caption.classList.add("caption");
        caption.textContent = memory.caption;

        // Add date if available
        if (memory.date) {
          const date = document.createElement("span");
          date.classList.add("memory-date");
          date.textContent = new Date(memory.date).toLocaleDateString();
          caption.appendChild(date);
        }

        memoryDiv.appendChild(img);
        memoryDiv.appendChild(caption);
        container.appendChild(memoryDiv);
      });

      // Show special memories by default
      filterMemories('memories');
    })
    .catch((error) => console.error("Error loading memories:", error));

  // Initialize music player
  initMusicPlayer();
  initSlideshow();
  initTimeline();
  initGuestbook();

  // Make sure the Special Memories button is active by default
  const specialMemoriesBtn = document.querySelector('[data-category="memories"]');
  if (specialMemoriesBtn) {
    specialMemoriesBtn.classList.add('active');
  }
});

// Category filter functionality
function initCategoryFilters() {
  const categoryBtns = document.querySelectorAll(".category-btn");
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      categoryBtns.forEach(b => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      const category = btn.dataset.category;
      filterMemories(category);
    });
  });
}

// Update the category colors and icons
const categoryConfig = {
  adventure: {
    icon: '🏃‍♂️',
    color: '#ff6b6b'
  },
  birthday: {
    icon: '🎂',
    color: '#cc13cc'
  },
  trips: {
    icon: '✈️',
    color: '#4dabf7'
  },
  fun: {
    icon: '😄',
    color: '#ffd43b'
  },
  memories: {
    icon: '💝',
    color: '#69db7c'
  }
};

// Update the memory display function
function createMemoryElement(memory) {
  const memoryDiv = document.createElement("div");
  memoryDiv.classList.add("memory");
  memoryDiv.dataset.category = memory.category;

  // Add category badge
  const categoryInfo = categoryConfig[memory.category] || { icon: '📷', color: '#868e96' };

  memoryDiv.innerHTML = `
    <div class="category-badge" style="background-color: ${categoryInfo.color}">
      ${categoryInfo.icon} ${memory.category}
    </div>
    <img src="${memory.image}" alt="Memory Image">
    <div class="memory-info">
      <p class="caption">${memory.caption}</p>
      <span class="memory-date">${new Date(memory.date).toLocaleDateString()}</span>
    </div>
  `;

  // Add click handler for image zoom
  const img = memoryDiv.querySelector('img');
  img.addEventListener('click', () => {
    openImageModal(memory.image, memory.caption);
  });

  return memoryDiv;
}

// Update the filter function
function filterMemories(category) {
  const memories = document.querySelectorAll(".memory");
  memories.forEach(memory => {
    if (memory.dataset.category === category) {
      memory.style.display = "block";
      memory.style.animation = "fadeIn 0.5s ease-in";
    } else {
      memory.style.display = "none";
    }
  });
}

// Birthday countdown functionality
function initCountdown() {
  const countdownElement = document.getElementById("birthday-countdown");
  // Set birthday to March 2nd, 2025, 12:00 AM
  const birthdayDate = new Date(2025, 2, 2, 0, 0, 0); // Month is 0-based, so 2 = March

  function updateCountdown() {
    const now = new Date();
    const difference = birthdayDate - now;

    if (difference > 0) {
      const totalSeconds = Math.floor(difference / 1000);
      countdownElement.innerHTML = `${totalSeconds} seconds until the big day! 🎉`;
    } else {
      countdownElement.innerHTML = "Happy Birthday! 🎂";
    }
  }

  // Update every second
  updateCountdown();
  setInterval(updateCountdown, 1000); // Update every second instead of every minute
}

// Update the wish button functionality
function initWishButton() {
  const wishButton = document.getElementById("make-wish");
  if (wishButton) {
    wishButton.addEventListener("click", () => {
      // Create and show modal
      showWishModal();
    });
  }
}

// Create and handle wish modal
function showWishModal() {
  const modalHTML = `
    <div class="wish-modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Send Birthday Wishes! 🎂✨</h2>
        <form id="wish-form">
          <textarea id="wish-message" placeholder="Write your birthday wish here..." required></textarea>
          <button type="submit" class="send-wish-btn">Send Wishes 🎉</button>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.querySelector('.wish-modal');
  const closeBtn = document.querySelector('.close-modal');
  const wishForm = document.getElementById('wish-form');

  // Close modal when clicking X or outside
  closeBtn.onclick = () => modal.remove();
  window.onclick = (e) => {
    if (e.target === modal) modal.remove();
  }

  // Handle form submission
  wishForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('sender-name').value;
    const message = document.getElementById('wish-message').value;

    // Create mailto link with form data
    const subject = encodeURIComponent(`Birthday Wishes from ${name}`);
    const body = encodeURIComponent(`Name: Aisha Singh\n\nWish: ${message}`);
    const mailtoLink = `mailto:jhas54212@gmail.com?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show confirmation and remove modal
    alert('Thank you for your wishes! Your email client will open to send the message.');
    modal.remove();

    // Trigger confetti animation
    createConfetti();
  };
}

// Image modal functionality
function openImageModal(imageSrc, caption) {
  const modal = document.createElement("div");
  modal.classList.add("image-modal");

  const modalContent = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <img src="${imageSrc}" alt="Memory Image">
      <p class="modal-caption">${caption}</p>
    </div>
  `;

  modal.innerHTML = modalContent;
  document.body.appendChild(modal);

  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Music Player initialization
function initMusicPlayer() {
  const music = document.getElementById('bgMusic');
  const toggleBtn = document.getElementById('toggleMusic');
  const icon = toggleBtn.querySelector('i');
  const text = toggleBtn.querySelector('.music-text');

  function updateMusicState(isPlaying) {
    if (isPlaying) {
      text.textContent = 'Pause Music';
    } else {
      text.textContent = 'Play Music';
    }
    // Force visibility
    text.style.display = 'inline-block';
    icon.style.display = 'inline-block';
  }

  // Initial state
  updateMusicState(false);

  // Start playing music when page loads
  let playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      updateMusicState(true);
    }).catch(error => {
      updateMusicState(false);
      console.log("Autoplay prevented");
    });
  }

  toggleBtn.addEventListener('click', () => {
    if (music.paused) {
      music.play();
      updateMusicState(true);
    } else {
      music.pause();
      updateMusicState(false);
    }
  });
}

// Slideshow for videos only
function initSlideshow() {
  const videos = [
    { src: 'assets/videos/Video1.MP4', caption: 'Special Video for You Part 1' },
    { src: 'assets/videos/Video2.mp4', caption: 'Special Video for You Part 2' }
  ];

  const wrapper = document.querySelector('.slideshow-wrapper');
  let currentSlide = 0;

  // Clear existing content
  wrapper.innerHTML = '';

  // Create video slides
  videos.forEach((video, index) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'slide';
    slideDiv.innerHTML = `
      <video controls>
        <source src="${video.src}" type="video/mp4">
        Your browser does not support video playback.
      </video>
      <div class="slide-caption">${video.caption}</div>
    `;
    wrapper.appendChild(slideDiv);
  });

  function moveSlide(direction) {
    // Pause current video before moving
    const currentVideo = wrapper.querySelectorAll('video')[currentSlide];
    currentVideo.pause();

    currentSlide = (currentSlide + direction + videos.length) % videos.length;
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  // Add event listeners for navigation
  document.querySelector('.prev').addEventListener('click', () => moveSlide(-1));
  document.querySelector('.next').addEventListener('click', () => moveSlide(1));
}

// Timeline
function initTimeline() {
  const timeline = document.querySelector('.timeline');
  const events = [
    { date: '2020', text: 'First met in college' },
    { date: '2021', text: 'Started our friendship journey' },
    { date: '2022', text: 'Became best friends' },
    { date: '2023', text: 'Made countless memories together' },
    { date: '2024', text: 'Stronger friendship than ever' },
    { date: '2025', text: 'Looking forward to many more years!' }
  ];

  events.forEach(event => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-content">
        <h3>${event.date}</h3>
        <p>${event.text}</p>
      </div>
    `;
    timeline.appendChild(item);
  });
}

// Guestbook
function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const messagesContainer = document.getElementById('guestbook-messages');

  // Load existing messages from localStorage
  const messages = JSON.parse(localStorage.getItem('guestbookMessages') || '[]');
  renderMessages(messages);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guest-name').value;
    const message = document.getElementById('guest-message').value;

    const newMessage = {
      name,
      message,
      date: new Date().toLocaleDateString()
    };

    messages.unshift(newMessage);
    localStorage.setItem('guestbookMessages', JSON.stringify(messages));
    renderMessages(messages);
    form.reset();
  });
}

function renderMessages(messages) {
  const container = document.getElementById('guestbook-messages');
  container.innerHTML = messages.map(msg => `
    <div class="message-card">
      <h4>${msg.name}</h4>
      <p>${msg.message}</p>
      <small>${msg.date}</small>
    </div>
  `).join('');
}

function initFireworks() {
  // helper functions
  const PI2 = Math.PI * 2;
  const random = (min, max) => (Math.random() * (max - min + 1) + min) | 0;
  const timestamp = (_) => new Date().getTime();

  // container
  class Birthday {
    constructor() {
      this.resize();

      // create a lovely place to store the firework
      this.fireworks = [];
      this.counter = 0;
    }

    resize() {
      this.width = canvas.width = window.innerWidth;
      let center = (this.width / 2) | 0;
      this.spawnA = (center - center / 4) | 0;
      this.spawnB = (center + center / 4) | 0;

      this.height = canvas.height = window.innerHeight;
      this.spawnC = this.height * 0.1;
      this.spawnD = this.height * 0.5;
    }

    onClick(evt) {
      let x = evt.clientX || (evt.touches && evt.touches[0].pageX);
      let y = evt.clientY || (evt.touches && evt.touches[0].pageY);

      let count = random(3, 5);
      for (let i = 0; i < count; i++)
        this.fireworks.push(
          new Firework(
            random(this.spawnA, this.spawnB),
            this.height,
            x,
            y,
            random(0, 260),
            random(30, 110)
          )
        );

      this.counter = -1;
    }

    update(delta) {
      ctx.globalCompositeOperation = "hard-light";
      ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.globalCompositeOperation = "lighter";
      for (let firework of this.fireworks) firework.update(delta);

      // if enough time passed... create new new firework
      this.counter += delta * 3; // each second
      if (this.counter >= 1) {
        this.fireworks.push(
          new Firework(
            random(this.spawnA, this.spawnB),
            this.height,
            random(0, this.width),
            random(this.spawnC, this.spawnD),
            random(0, 360),
            random(30, 110)
          )
        );
        this.counter = 0;
      }

      // remove the dead fireworks
      if (this.fireworks.length > 1000)
        this.fireworks = this.fireworks.filter((firework) => !firework.dead);
    }
  }

  class Firework {
    constructor(x, y, targetX, targetY, shade, offsprings) {
      this.dead = false;
      this.offsprings = offsprings;

      this.x = x;
      this.y = y;
      this.targetX = targetX;
      this.targetY = targetY;

      this.shade = shade;
      this.history = [];
    }
    update(delta) {
      if (this.dead) return;

      let xDiff = this.targetX - this.x;
      let yDiff = this.targetY - this.y;
      if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
        // is still moving
        this.x += xDiff * 2 * delta;
        this.y += yDiff * 2 * delta;

        this.history.push({
          x: this.x,
          y: this.y
        });

        if (this.history.length > 20) this.history.shift();
      } else {
        if (this.offsprings && !this.madeChilds) {
          let babies = this.offsprings / 2;
          for (let i = 0; i < babies; i++) {
            let targetX =
              (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0;
            let targetY =
              (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0;

            birthday.fireworks.push(
              new Firework(this.x, this.y, targetX, targetY, this.shade, 0)
            );
          }
        }
        this.madeChilds = true;
        this.history.shift();
      }

      if (this.history.length === 0) this.dead = true;
      else if (this.offsprings) {
        for (let i = 0; this.history.length > i; i++) {
          let point = this.history[i];
          ctx.beginPath();
          ctx.fillStyle = "hsl(" + this.shade + ",100%," + i + "%)";
          ctx.arc(point.x, point.y, 1, 0, PI2, false);
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.fillStyle = "hsl(" + this.shade + ",100%,50%)";
        ctx.arc(this.x, this.y, 1, 0, PI2, false);
        ctx.fill();
      }
    }
  }

  let canvas = document.getElementById("birthday");
  let ctx = canvas.getContext("2d");

  let then = timestamp();

  let birthday = new Birthday();
  window.onresize = () => birthday.resize();
  document.onclick = (evt) => birthday.onClick(evt);
  document.ontouchstart = (evt) => birthday.onClick(evt);
  (function loop() {
    requestAnimationFrame(loop);

    let now = timestamp();
    let delta = now - then;

    then = now;
    birthday.update(delta / 1000);
  })();
}