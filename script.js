/**
 * SOCIAL BUDDY — Interactive Landing Page Logic & Deep Linking Gateway
 * Target Mobile Package: com.socialbuddy.app
 * Deep Link Scheme: socialbuddy://discover
 * Android Intent: intent://discover#Intent;scheme=socialbuddy;package=com.socialbuddy.app;end
 */

// =========================================================================
// 1. PRIMARY DEEP LINK LAUNCHER & ANDROID REDIRECT HANDLER
// =========================================================================

/**
 * Launches the installed Social Buddy application via Intent/Scheme on Mobile,
 * or displays the Desktop QR Scanner modal on desktop browsers.
 * @param {string} source - Identifier for the trigger location (e.g. 'hero', 'bottom_banner')
 */
function launchSocialBuddy(source = 'general') {
  console.log(`[Social Buddy] Launch invoked from: ${source}`);
  
  const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isMobile = isAndroid || isIOS || /Mobile|Tablet|Silk|Kindle/i.test(userAgent) || (window.innerWidth <= 768);

  const androidIntentUrl = "intent://discover#Intent;scheme=socialbuddy;package=com.socialbuddy.app;end";
  const customSchemeUrl = "socialbuddy://discover";

  if (isAndroid) {
    // Scenario 1: Direct Android Package Intent execution for installed APK (com.socialbuddy.app)
    showToastNotification('Launching installed SOCIAL-BUDDY APK...');
    
    // Attempt Android Intent first
    window.location.href = androidIntentUrl;

    // Seamless fallback to direct custom scheme in case of browser intent handling variances
    setTimeout(() => {
      window.location.href = customSchemeUrl;
    }, 350);

  } else if (isIOS) {
    // iOS deep link dispatch
    showToastNotification('Opening Social Buddy on iOS...');
    window.location.href = customSchemeUrl;

  } else if (isMobile) {
    // Generic mobile fallback
    showToastNotification('Redirecting to Social Buddy...');
    window.location.href = androidIntentUrl;
    setTimeout(() => {
      window.location.href = customSchemeUrl;
    }, 350);

  } else {
    // Desktop Browser: Open sleek QR Code scanner modal
    openDesktopQRModal();
  }
}

/**
 * Direct attempt to trigger custom scheme from desktop/tools for testing
 */
function testDirectScheme() {
  const scheme = "socialbuddy://discover";
  showToastNotification(`Triggering custom scheme: ${scheme}`);
  window.location.href = scheme;
}

/**
 * Copies the deep link to clipboard
 */
function copyDeepLink() {
  const deepLink = "socialbuddy://discover";
  navigator.clipboard.writeText(deepLink).then(() => {
    const copyBtn = document.getElementById('copy-text');
    if (copyBtn) {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "Copied to Clipboard! ✓";
      setTimeout(() => { copyBtn.textContent = orig; }, 2000);
    }
    showToastNotification('Deep Link copied: ' + deepLink);
  }).catch(() => {
    prompt('Copy this link manually:', deepLink);
  });
}

// =========================================================================
// 2. DESKTOP QR SCANNER MODAL & HIGH-CONTRAST SVG QR GENERATION
// =========================================================================

function openDesktopQRModal() {
  const modal = document.getElementById('desktop-qr-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    renderHighFidelityQRCode();
  }
}

function closeDesktopQRModal() {
  const modal = document.getElementById('desktop-qr-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Close on backdrop click
window.addEventListener('click', (e) => {
  const qrModal = document.getElementById('desktop-qr-modal');
  const featureModal = document.getElementById('feature-detail-modal');
  if (e.target === qrModal) closeDesktopQRModal();
  if (e.target === featureModal) closeFeatureModal();
});

// Close on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDesktopQRModal();
    closeFeatureModal();
  }
});

/**
 * Generates and renders a clean, crisp vector SVG QR code with Social Buddy branding
 */
function renderHighFidelityQRCode() {
  const container = document.getElementById('qr-code-container');
  if (!container) return;

  // 21x21 QR Code Version 1 pattern representing 'socialbuddy://discover'
  const matrix = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,1,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0],
    [0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,0,1],
    [1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1,1,0,1,0,0],
    [0,1,1,0,1,0,1,1,0,0,1,0,0,1,1,0,1,1,0,1,1],
    [1,0,0,1,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,1,1,0,1,1,0,0,1],
    [1,1,1,1,1,1,1,0,1,1,0,0,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,1,0,1,0,0,0],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,0,1,1,0,0],
    [1,0,1,1,1,0,1,0,1,1,1,0,0,1,1,0,1,1,0,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,1,1,0,0,1,1,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,1,0,0,1,1,1,0]
  ];

  const size = 200;
  const modules = matrix.length;
  const cellSize = size / modules;

  let rects = '';
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (matrix[r][c] === 1) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize + 0.05}" height="${cellSize + 0.05}" fill="#07080B" />`;
      }
    }
  }

  // Embed custom compass icon in the center with obsidian orange accent
  const centerSize = 44;
  const centerPos = (size - centerSize) / 2;

  const svg = `
    <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#FFFFFF" rx="8" />
      <g>${rects}</g>
      <!-- Center Emblem Badge -->
      <rect x="${centerPos - 3}" y="${centerPos - 3}" width="${centerSize + 6}" height="${centerSize + 6}" rx="8" fill="#FFFFFF" />
      <rect x="${centerPos}" y="${centerPos}" width="${centerSize}" height="${centerSize}" rx="6" fill="#07080B" stroke="#FF5400" stroke-width="2" />
      <!-- Compass Star in Center -->
      <g transform="translate(${size/2}, ${size/2}) scale(0.65)">
        <polygon points="0,-16 6,0 0,-4 -6,0" fill="#FF5400" />
        <polygon points="0,16 6,0 0,4 -6,0" fill="#FFC837" />
        <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
      </g>
    </svg>
  `;

  container.innerHTML = svg;
}

// =========================================================================
// 3. 4 INTERACTIVE POP-UP FEATURE MODALS
// =========================================================================

const featureModalData = {
  radar: {
    badge: 'Geofence Radar Engine',
    title: '📡 Hyperlocal Proximity Radar',
    desc: 'Real-time neighborhood scanning without battery drain or algorithmic feeds. Pick your radius and explore secret jams, AI buildathons, and builder dinners happening right next door.',
    bullets: [
      'Configurable radius ring from 2km walking distance up to 25km citywide perimeter.',
      'Low-power background proximity beacon listeners.',
      'Zero advertising noise or algorithmic recommendation manipulation.',
      'Instant directions navigation integrated with maps.'
    ],
    image: 'assets/app-feed.jpg',
    actionText: 'Open Radar in App 📲',
    actionSource: 'modal_radar'
  },
  hackathons: {
    badge: 'Verified Builder Ecosystem',
    title: '⚡ Curated AI Hackathons & Secret Gigs',
    desc: 'Tired of generic virtual webinars? Social Buddy brings you into physical rooms where builders ship production agentic AI swarms, React Native mobile apps, and underground audio experiments.',
    bullets: [
      'Strict venue verification and physical host presence required.',
      'Solo and team sprints (up to 4 members) with provided hardware and sensors.',
      'Direct contact with community verified organizers.',
      '120 FPS high-performance mobile UI for instantaneous registration.'
    ],
    image: 'assets/event-details.jpg',
    actionText: 'View Sprints in App 📲',
    actionSource: 'modal_hackathons'
  },
  qr_passes: {
    badge: 'Cryptographic Privacy Layer',
    title: '🛡️ Cryptographic QR Passes & Privacy',
    desc: 'Never give your personal phone number or email to strangers again. Social Buddy generates rotating offline cryptographic tokens for zero-leak admission.',
    bullets: [
      'Offline asymmetric ECDSA key pair verification at door.',
      'Masked contact relay — hosts can message without knowing your phone number.',
      'Dynamic single-use entry tokens prevent duplicate ticket re-selling.',
      'No cloud connectivity required for rapid offline door check-in.'
    ],
    image: 'assets/event-details.jpg',
    actionText: 'Access Offline Passes 📲',
    actionSource: 'modal_qr_passes'
  },
  host_control: {
    badge: 'Creator & Host Control Room',
    title: '👑 Creator & Host Control Room',
    desc: 'Host your own secret gatherings, code sprints, or live acoustic sessions. Social Buddy provides professional organizers with a full mobile CRM and 1-second camera door scanner.',
    bullets: [
      'Verified Community Organizer badge status (EarthTech Open Network standard).',
      'Instant 1-second camera scanner for QR admission verification.',
      'Automated waitlists and capped RSVP limits for exclusive venues.',
      'Direct broadcast announcements to attendees with zero spam filters.'
    ],
    image: 'assets/organizer-profile.jpg',
    actionText: 'Open Host Tools in App 📲',
    actionSource: 'modal_host_control'
  }
};

function openFeatureModal(featureKey) {
  const data = featureModalData[featureKey];
  if (!data) return;

  const modal = document.getElementById('feature-detail-modal');
  const container = document.getElementById('feature-modal-content');
  if (!modal || !container) return;

  const bulletsHtml = data.bullets.map(b => `
    <li class="feature-bullet-item">
      <span class="bullet-icon">✓</span>
      <span>${b}</span>
    </li>
  `).join('');

  container.innerHTML = `
    <div class="feature-modal-grid">
      <div class="feature-modal-info">
        <div class="feature-modal-badge">${data.badge}</div>
        <h2 id="feature-modal-title" class="feature-modal-title">${data.title}</h2>
        <p class="feature-modal-desc">${data.desc}</p>
        <ul class="feature-bullets">
          ${bulletsHtml}
        </ul>
        <div class="feature-modal-actions">
          <button type="button" class="btn-primary deep-link-trigger" onclick="launchSocialBuddy('${data.actionSource}')">
            <span>${data.actionText}</span>
          </button>
        </div>
      </div>
      <div class="feature-modal-visual">
        <img src="${data.image}" alt="${data.title} Screenshot">
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeFeatureModal() {
  const modal = document.getElementById('feature-detail-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// =========================================================================
// 4. INTERACTIVE RADAR SIMULATOR
// =========================================================================

const simulatedEvents = [
  {
    id: 1,
    title: 'Mobile Dev Olympics: React Native Sprint',
    venue: 'CodeCraft Studio, Whitefield',
    distance: 1.2,
    type: 'hackathon',
    icon: '⚡',
    x: 48,
    y: 40
  },
  {
    id: 2,
    title: 'Aura Bloom: Synthwave Echoes',
    venue: 'Velvet Horizon Club, Koramangala',
    distance: 2.8,
    type: 'music',
    icon: '🎵',
    x: 62,
    y: 35
  },
  {
    id: 3,
    title: 'Agentic Swarms Build-Off',
    venue: 'EarthTech Open Hub, Indiranagar',
    distance: 4.1,
    type: 'ai',
    icon: '🤖',
    x: 32,
    y: 65
  },
  {
    id: 4,
    title: 'Rooftop Acoustic Guitar Jam',
    venue: 'Skyline Terrace, HSR Layout',
    distance: 4.9,
    type: 'music',
    icon: '🎸',
    x: 70,
    y: 68
  },
  {
    id: 5,
    title: 'Indie Founder Breakfast & Coffee Sprints',
    venue: 'Roaster Co-work, Church St',
    distance: 11.5,
    type: 'hackathon',
    icon: '☕',
    x: 82,
    y: 22
  },
  {
    id: 6,
    title: 'Decentralized Edge LLMs Roundtable',
    venue: 'Turing Hall, Electronic City',
    distance: 21.0,
    type: 'ai',
    icon: '⚡',
    x: 18,
    y: 84
  }
];

let activeRadius = 2;

function setSimulatedRadius(radius) {
  activeRadius = radius;

  // Update button classes
  const buttons = document.querySelectorAll('.radius-btn');
  buttons.forEach(btn => {
    if (parseInt(btn.getAttribute('data-radius'), 10) === radius) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderRadarEvents();
}

function renderRadarEvents() {
  const listContainer = document.getElementById('radar-event-list');
  const blipContainer = document.getElementById('radar-blips');
  if (!listContainer || !blipContainer) return;

  // Filter events within active radius
  const filtered = simulatedEvents.filter(ev => ev.distance <= activeRadius);

  // Render list
  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="radar-event-card-item">
        <div class="radar-item-left">
          <span class="radar-item-icon">🧭</span>
          <div>
            <div class="radar-item-title">No events within ${activeRadius}km</div>
            <div class="radar-item-venue">Expand radius to 5km or 15km to find more gatherings</div>
          </div>
        </div>
      </div>
    `;
  } else {
    listContainer.innerHTML = filtered.map(ev => `
      <div class="radar-event-card-item" onclick="focusRadarEvent(${ev.id})">
        <div class="radar-item-left">
          <span class="radar-item-icon">${ev.icon}</span>
          <div>
            <div class="radar-item-title">${ev.title}</div>
            <div class="radar-item-venue">📍 ${ev.venue}</div>
          </div>
        </div>
        <div class="radar-item-distance">${ev.distance} km</div>
      </div>
    `).join('');
  }

  // Render blips on radar screen
  blipContainer.innerHTML = filtered.map(ev => `
    <div class="radar-blip ${ev.type}" 
         style="left: ${ev.x}%; top: ${ev.y}%;" 
         title="${ev.title} (${ev.distance} km)"
         onclick="focusRadarEvent(${ev.id})">
    </div>
  `).join('');
}

function focusRadarEvent(id) {
  const ev = simulatedEvents.find(e => e.id === id);
  if (!ev) return;
  showToastNotification(`📍 ${ev.title} — ${ev.distance} km away at ${ev.venue}`);
}

// =========================================================================
// 5. APP SHOWCASE FILTER SWITCHERS & HOTSPOTS
// =========================================================================

function switchShowcaseFocus(view) {
  const feedCard = document.getElementById('showcase-card-feed');
  const eventCard = document.getElementById('showcase-card-event');
  const hostCard = document.getElementById('showcase-card-host');

  const filterBtns = document.querySelectorAll('.showcase-pill-switchers .pill-filter');
  filterBtns.forEach(b => b.classList.remove('active'));

  const clickedBtn = event ? (event.currentTarget || event.target) : null;
  if (clickedBtn && clickedBtn.classList) {
    clickedBtn.classList.add('active');
  }

  if (view === 'all') {
    feedCard.style.display = 'flex';
    eventCard.style.display = 'flex';
    hostCard.style.display = 'block';
  } else if (view === 'feed') {
    feedCard.style.display = 'flex';
    eventCard.style.display = 'none';
    hostCard.style.display = 'none';
  } else if (view === 'event') {
    feedCard.style.display = 'none';
    eventCard.style.display = 'flex';
    hostCard.style.display = 'none';
  } else if (view === 'host') {
    feedCard.style.display = 'none';
    eventCard.style.display = 'none';
    hostCard.style.display = 'block';
  }
}

// Live interactive pop-up banner trigger
function triggerLivePopUpNotification() {
  const toast = document.getElementById('hotspot-toast');
  const toastText = document.getElementById('hotspot-toast-text');
  if (!toast || !toastText) return;

  toast.innerHTML = `
    <span class="toast-icon">🛡️</span>
    <span class="toast-text"><strong>New Organizer Pop-Up:</strong> EarthTech Open Network posted a sprint!</span>
    <button class="toast-action-btn" onclick="openFeatureModal('host_control')">Open Pop-Up ↗</button>
  `;
  toast.style.display = 'flex';
}

function showHotspotInfo(text) {
  showToastNotification('💡 ' + text);
}

// Toast notification helper
let toastTimeout;
function showToastNotification(message) {
  const toast = document.getElementById('hotspot-toast');
  const toastText = document.getElementById('hotspot-toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.style.display = 'flex';

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}

// =========================================================================
// 6. MOBILE MENU & INITIALIZATION
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close when clicking nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Initialize Radar display with 2km default
  setSimulatedRadius(2);

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Automatically trigger a live pop-up banner after 2 seconds to showcase modal interactivity
  setTimeout(triggerLivePopUpNotification, 2000);

  console.log('[Social Buddy] Web Gateway Initialized. Deep Link Targets: socialbuddy://discover & com.socialbuddy.app');
});
