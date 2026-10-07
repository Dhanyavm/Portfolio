/**
 * Dhanya V. M. - Software Engineer Portfolio JavaScript
 * Handles Theme Toggling (Night/Day Mode), Typewriter Effect, Smooth Scroll, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme (Night Mode) Auto-detection & Toggle Setup
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Retrieve stored theme or auto-detect from browser default
  const savedTheme = localStorage.getItem('portfolio-theme');
  
  if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
  } else {
    // If no manual preference was stored, use system/browser preference
    const systemTheme = mediaQuery.matches ? 'dark' : 'light';
    rootElement.setAttribute('data-theme', systemTheme);
  }

  // Listen for system theme changes if user hasn't overridden
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      rootElement.setAttribute('data-theme', newSystemTheme);
    }
  });

  // Manual Toggle Handler
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || (mediaQuery.matches ? 'dark' : 'light');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  // 2. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 3. Typewriter Animation for Hero Section
  const typedTextElement = document.getElementById('typed-text');
  const roles = [
    'Java & Python Code',
    'IoT & Embedded Systems',
    'Smart Accident Alert Tech',
    'Algorithmic Solutions',
    'Full-Stack Concepts'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 1800;

  function typeEffect() {
    if (!typedTextElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = newTextDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 500;
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();

  // 4. Header Scroll Shadow & Active Navigation Highlight
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Active nav link highlight
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  });

  // 5. Dynamic Footer Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 6. Skill Progress Bar Animate-on-Scroll Observer
  const skillBars = document.querySelectorAll('.skill-meter-bar');
  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.style.getPropertyValue('--skill-width');
          skillObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => {
      bar.style.width = '0%';
      skillObserver.observe(bar);
    });
  }
});

// 7. Interactive Skills Filter Handler
function filterSkills(category) {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillBoxes = document.querySelectorAll('.skill-category-box');

  // Update active button state
  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Filter category boxes
  skillBoxes.forEach(box => {
    const boxCategory = box.getAttribute('data-category');
    if (category === 'all' || boxCategory === category) {
      box.classList.remove('hide-category');
      // Trigger smooth re-animation of progress bars in visible boxes
      const innerBars = box.querySelectorAll('.skill-meter-bar');
      innerBars.forEach(bar => {
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = bar.style.getPropertyValue('--skill-width');
        }, 50);
      });
    } else {
      box.classList.add('hide-category');
    }
  });
}

// 8. Project Details Data Store (Populates modal upon thumbnail click)
const projectsData = {
  'accident-alert': {
    badge: 'Featured IoT Hardware Innovation',
    title: 'Smart IoT Accident Alert & Emergency Dispatch System',
    category: 'Embedded Systems & Telematics',
    overview: 'An intelligent real-time automotive safety device engineered using Arduino microcontrollers and MPU6050 gyroscope/accelerometer sensor modules to detect sudden collisions, severe impacts, and vehicle rollovers.',
    problem: 'Traffic accidents in remote areas frequently result in delayed emergency response times ("Golden Hour"). This automated system removes human delay by instantly reporting live telemetry.',
    features: [
      'Continuous 6-axis acceleration and angular velocity monitoring via MPU6050.',
      'Instant trigger threshold algorithm detecting impact forces exceeding 3.5G.',
      'Real-time GPS NMEA sentence parsing for precise latitude/longitude location extraction.',
      'Automated GSM SMS dispatch broadcasting emergency SOS links with live Google Maps coordinates to predefined hospital and family contacts.'
    ],
    techStack: ['Arduino Mega/Uno', 'MPU6050 Accelerometer/Gyro', 'SIM800L GSM Module', 'NEO-6M GPS', 'Embedded C', 'I2C / UART'],
    githubUrl: 'https://github.com/Dhanyavm'
  },
  'java-oop': {
    badge: 'Java Enterprise Architecture',
    title: 'Java OOP Algorithmic Data Management Suite',
    category: 'Object-Oriented Software Engineering',
    overview: 'A high-performance modular desktop application designed following clean Object-Oriented Architecture (encapsulation, polymorphism, abstract factories, and custom exceptions) for large-scale record indexing.',
    problem: 'Unstructured record storage creates computational overhead during queries and updates. This engine implements optimized sorting, hashing, and collection-based indexing.',
    features: [
      'Modular class hierarchy with strict encapsulation and custom domain exceptions.',
      'Optimized collections framework (HashMap, PriorityQueue, LinkedList) for rapid data lookup.',
      'Multi-threaded background task processing to prevent UI blocking during file I/O operations.',
      'Robust unit tests and logging integrated inside Eclipse IDE.'
    ],
    techStack: ['Java 17', 'Eclipse IDE', 'OOP Design Patterns', 'Collections Framework', 'Multi-threading', 'Git'],
    githubUrl: 'https://github.com/Dhanyavm'
  },
  'sih-platform': {
    badge: 'Hackathon Innovation (SIH 2026)',
    title: 'Smart India Hackathon 2026 Solution Platform',
    category: 'Collaborative Problem Solving & System Architecture',
    overview: 'An agile, scalable solution prototype developed during the prestigious Smart India Internal Hackathon 2026 to tackle real-world community bottlenecks under rigorous time constraints.',
    problem: 'Complex public sector and infrastructural challenges require rapid synthesis of digital data feeds and accessible citizen-first user interfaces.',
    features: [
      'Fast-paced agile sprint collaboration and solution prototyping.',
      'Modular component breakdown and synchronized Git versioning across team members.',
      'Interactive workflow design presenting technical feasibility to jury panels.',
      'Awarded the official Smart India Internal Hackathon Participation and Innovation Certificate.'
    ],
    techStack: ['Python', 'Web Architecture', 'Git & GitHub', 'Agile Methodology', 'API Integration'],
    githubUrl: 'https://github.com/Dhanyavm'
  },
  'python-toolkit': {
    badge: 'Automation & Data Engineering',
    title: 'Python Automated Telemetry & Utility Toolkit',
    category: 'Scripting, Automation & File Processing',
    overview: 'A comprehensive suite of automation scripts and data ingestion utilities designed to parse serial telemetry logs, clean sensor streams, and automate local maintenance routines.',
    problem: 'Manual parsing of raw microcontroller sensor logs is error-prone. This toolkit provides automated file parsing, anomaly detection, and formatted report generation.',
    features: [
      'Automated batch ingestion of comma-delimited sensor logs with regex validation.',
      'Statistical threshold analysis flagging outlier sensor readings and anomaly spikes.',
      'Reusable script libraries compatible with terminal CLI automation pipelines.',
      'Clean PEP 8 compliant code structure with comprehensive inline documentation.'
    ],
    techStack: ['Python 3.x', 'VS Code', 'File I/O Streams', 'Regular Expressions', 'Automation CLI'],
    githubUrl: 'https://github.com/Dhanyavm'
  }
};

// 9. Open Project Detail Modal
function openProjectModal(projectId) {
  const project = projectsData[projectId];
  if (!project) return;

  const modalBackdrop = document.getElementById('project-modal-backdrop');
  const modalContent = document.getElementById('modal-dynamic-content');

  if (modalBackdrop && modalContent) {
    modalContent.innerHTML = `
      <div class="modal-header-section">
        <span class="modal-badge-tag">${project.badge}</span>
        <h3 class="modal-title">${project.title}</h3>
      </div>
      <div class="modal-body-section">
        <div class="modal-section-block">
          <h4><i class="fa-solid fa-circle-info"></i> Project Overview</h4>
          <p>${project.overview}</p>
        </div>
        <div class="modal-section-block">
          <h4><i class="fa-solid fa-triangle-exclamation"></i> Problem & Impact</h4>
          <p>${project.problem}</p>
        </div>
        <div class="modal-section-block">
          <h4><i class="fa-solid fa-list-check"></i> Key Engineering Features</h4>
          <ul class="modal-list-specs">
            ${project.features.map(f => `<li><i class="fa-solid fa-check"></i> <span>${f}</span></li>`).join('')}
          </ul>
        </div>
        <div class="modal-section-block">
          <h4><i class="fa-solid fa-layer-group"></i> Technologies & Hardware</h4>
          <div class="modal-hardware-badges">
            ${project.techStack.map(t => `<span class="modal-badge-item"><i class="fa-solid fa-tag"></i> ${t}</span>`).join('')}
          </div>
        </div>
        <div class="modal-footer-actions">
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <i class="fa-brands fa-github"></i> View Repository
          </a>
          <button type="button" class="btn btn-secondary" onclick="closeProjectModal()">
            <span>Close Details</span>
          </button>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

// 10. Close Project Detail Modal
function closeProjectModal(event) {
  const modalBackdrop = document.getElementById('project-modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
  }
});

// 11. Contact Form Submission Handler (Client-side simulation)
function handleFormSubmit(event) {
  event.preventDefault();
  const formStatus = document.getElementById('form-status');
  const form = document.getElementById('contact-form');

  if (formStatus) {
    formStatus.innerHTML = '<span style="color: var(--accent-tertiary);"><i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully.</span>';
    form?.reset();
    setTimeout(() => {
      formStatus.innerHTML = '';
    }, 5000);
  }
}

// ==========================================================================
// 12. AI Persona Chat Interaction System (Simulated & API Ready)
// ==========================================================================

/**
 * ============================================================================
 * [API INTEGRATION GUIDE FOR OPENAI / GEMINI / CLAUDE]
 * ============================================================================
 * To connect this chat interface to a live LLM API (e.g. OpenAI GPT-4o-mini):
 *
 * 1. Define your backend proxy endpoint or API key (DO NOT expose private keys in frontend code for production).
 * 2. Replace the simulated `generateAIReply(userText)` function call with an async fetch:
 *
 * Example OpenAI Integration:
 * ```javascript
 * async function queryOpenAI(userMessage) {
 *   const response = await fetch("https://api.openai.com/v1/chat/completions", {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       "Authorization": `Bearer YOUR_OPENAI_API_KEY`
 *     },
 *     body: JSON.stringify({
 *       model: "gpt-4o-mini",
 *       messages: [
 *         {
 *           role: "system",
 *           content: `You are Dhanya V. M.'s AI persona. You represent Dhanya, a passionate fresh software engineer with a 9.6 CGPA from Adichunchanagiri Institute of Technology. You specialize in Java, Python, C, IoT (Accident Alert System), and hackathons (SIH 2026). Respond politely, concisely, and professionally.`
 *         },
 *         { role: "user", content: userMessage }
 *       ],
 *       temperature: 0.7,
 *       max_tokens: 300
 *     })
 *   });
 *   const data = await response.json();
 *   return data.choices[0].message.content;
 * }
 * ```
 * ============================================================================
 */

// Global state for chat
let isAIResponding = false;

// Format current time (e.g., "12:15 PM")
function getFormattedTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

// Append a message to the chat display box
function appendChatMessage(sender, htmlContent, isUser = false) {
  const messagesArea = document.getElementById('chat-messages');
  if (!messagesArea) return;

  const timeStr = getFormattedTime();
  const messageRow = document.createElement('div');
  messageRow.className = `message-row ${isUser ? 'user-row' : 'ai-row'}`;

  if (isUser) {
    messageRow.innerHTML = `
      <div class="msg-avatar user-avatar">
        <i class="fa-solid fa-user"></i>
      </div>
      <div class="msg-content-wrap">
        <div class="msg-meta">
          <span class="msg-sender">You</span>
          <span class="msg-time">${timeStr}</span>
        </div>
        <div class="msg-bubble user-bubble">
          <p>${escapeHTML(htmlContent)}</p>
        </div>
      </div>
    `;
  } else {
    messageRow.innerHTML = `
      <div class="msg-avatar ai-avatar">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="msg-content-wrap">
        <div class="msg-meta">
          <span class="msg-sender">Dhanya AI</span>
          <span class="msg-time">${timeStr}</span>
        </div>
        <div class="msg-bubble ai-bubble">
          ${htmlContent}
        </div>
      </div>
    `;
  }

  messagesArea.appendChild(messageRow);
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Helper to prevent XSS in user input
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Show typing indicator
function showTypingIndicator() {
  const messagesArea = document.getElementById('chat-messages');
  if (!messagesArea) return;

  const typingRow = document.createElement('div');
  typingRow.className = 'message-row ai-row typing-indicator-row';
  typingRow.id = 'typing-indicator';
  typingRow.innerHTML = `
    <div class="msg-avatar ai-avatar">
      <i class="fa-solid fa-robot"></i>
    </div>
    <div class="msg-content-wrap">
      <div class="msg-bubble ai-bubble typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  messagesArea.appendChild(typingRow);
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingElem = document.getElementById('typing-indicator');
  if (typingElem) {
    typingElem.remove();
  }
}

// Knowledge Base Simulation for AI Dhanya persona
function generateAIReply(query) {
  const q = query.toLowerCase().trim();

  // 1. Greetings
  if (/^(hi|hello|hey|greetings|namaste|good\s*(morning|afternoon|evening)|yo)/i.test(q)) {
    return `<p>Hello! 👋 Wonderful to meet you. I'm Dhanya's AI assistant. How can I help you today? You can ask about her <strong>technical skills</strong>, <strong>IoT projects</strong>, <strong>academic achievements</strong>, or <strong>internship availability</strong>!</p>`;
  }

  // 2. Technical Skills & Languages
  if (q.includes('skill') || q.includes('language') || q.includes('stack') || q.includes('tech') || q.includes('python') || q.includes('java') || q.includes('c programming')) {
    return `
      <p>Dhanya is proficient across several modern software & embedded technologies:</p>
      <ul>
        <li><strong>Programming:</strong> Java (OOP, Data Structures), Python (Scripting, Algorithms), C Programming (Low-level systems & Memory).</li>
        <li><strong>Web Development:</strong> HTML5, CSS3 (Modern Responsive UI, Animations), JavaScript.</li>
        <li><strong>Hardware & IoT:</strong> Arduino IDE, MPU6050 Accelerometers, GPS & GSM Modules.</li>
        <li><strong>Tools & IDEs:</strong> Git & GitHub, Eclipse IDE, VS Code.</li>
      </ul>
      <p>She excels at bridging high-level software logic with real-world IoT hardware.</p>
    `;
  }

  // 3. IoT Accident Alert System Project
  if (q.includes('project') || q.includes('accident') || q.includes('iot') || q.includes('alert') || q.includes('hardware') || q.includes('arduino') || q.includes('mpu6050')) {
    return `
      <p>🚨 Dhanya's flagship innovation is the <strong>Smart IoT Accident Alert System</strong>:</p>
      <ul>
        <li><strong>Objective:</strong> Eliminates emergency response delays by automatically detecting collisions.</li>
        <li><strong>Sensors & Core:</strong> Utilizes an <em>MPU6050 6-axis gyroscope/accelerometer</em> to detect sudden tilt, roll, and impact shocks.</li>
        <li><strong>Location & Dispatch:</strong> Interfaces with a <em>GPS module</em> for precision coordinates and a <em>GSM module</em> to broadcast real-time SMS alerts with Google Maps links to emergency contacts & hospitals.</li>
        <li><strong>Tools Used:</strong> Arduino Uno, Embedded C/C++, AT Commands.</li>
      </ul>
    `;
  }

  // 4. Education, College & CGPA
  if (q.includes('education') || q.includes('college') || q.includes('cgpa') || q.includes('university') || q.includes('school') || q.includes('degree') || q.includes('ait')) {
    return `
      <p>Dhanya holds an outstanding academic track record:</p>
      <ul>
        <li>🎓 <strong>Bachelor of Engineering (B.E.):</strong> Adichunchanagiri Institute of Technology (AIT) — <strong>Current CGPA: 9.6 / 10.0</strong>.</li>
        <li>🏫 <strong>Pre-University (12th):</strong> Hoysaleshwara PU College — <strong>93%</strong> (Distinction).</li>
        <li>📚 <strong>Secondary School (10th):</strong> Rotary High School — <strong>95.04%</strong> (Distinction).</li>
      </ul>
      <p>Her high academic performance reflects rigorous problem-solving skills and discipline.</p>
    `;
  }

  // 5. Hackathon & Competitions
  if (q.includes('hackathon') || q.includes('sih') || q.includes('smart india') || q.includes('competition') || q.includes('achievement') || q.includes('award')) {
    return `
      <p>🏆 <strong>Hackathon Milestones:</strong></p>
      <ul>
        <li><strong>Smart India Internal Hackathon 2026 (SIH 2026):</strong> Successfully cleared the institutional round with certification.</li>
        <li>Developed rapid IoT prototypes and collaborated under intense sprint deadlines.</li>
        <li>Demonstrated active participation in competitive coding challenges and technical symposiums.</li>
      </ul>
    `;
  }

  // 6. Contact & Hiring / Internship
  if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('intern') || q.includes('job') || q.includes('role')) {
    return `
      <p>💼 Dhanya is <strong>actively looking for software engineering internships and entry-level roles</strong>!</p>
      <p>You can connect directly via:</p>
      <ul>
        <li>📧 <strong>Email:</strong> <a href="mailto:dhanyavm249@gmail.com" style="color:var(--accent-primary);text-decoration:underline;">dhanyavm249@gmail.com</a></li>
        <li>📱 <strong>Phone / WhatsApp:</strong> <a href="tel:+918971043968" style="color:var(--accent-primary);text-decoration:underline;">+91 8971043968</a></li>
        <li>🔗 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/dhanya-v-m-5b4423389" target="_blank" style="color:var(--accent-primary);text-decoration:underline;">linkedin.com/in/dhanya-v-m</a></li>
        <li>🐙 <strong>GitHub:</strong> <a href="https://github.com/Dhanyavm" target="_blank" style="color:var(--accent-primary);text-decoration:underline;">github.com/Dhanyavm</a></li>
      </ul>
      <p>You can also fill out the form in the <a href="#contact" style="color:var(--accent-secondary);font-weight:600;">Contact section below</a>.</p>
    `;
  }

  // 7. About Dhanya / Bio
  if (q.includes('who are you') || q.includes('about') || q.includes('dhanya') || q.includes('introduce') || q.includes('yourself')) {
    return `
      <p>I am Dhanya V. M. — an ambitious software engineer and technology enthusiast with a passion for software craftsmanship, algorithm design, and connected hardware solutions.</p>
      <p>I combine analytical thinking with practical engineering, demonstrated by my <strong>9.6 CGPA</strong> and real-world IoT projects.</p>
    `;
  }

  // 8. Default fallback with helpful guidance
  return `
    <p>That's an interesting question! As Dhanya's digital assistant, I can provide detailed information about:</p>
    <ul>
      <li>💻 Her core skills in <strong>Java, Python, C, Web & IoT</strong></li>
      <li>🚨 Her <strong>Smart IoT Accident Alert System</strong></li>
      <li>🎓 Her education at <strong>AIT (9.6 CGPA)</strong></li>
      <li>🏆 Her <strong>SIH 2026 Hackathon</strong> participation</li>
      <li>📬 Contact details & <strong>internship/job opportunities</strong></li>
    </ul>
    <p>Feel free to click any suggestion chip above or rephrase your question!</p>
  `;
}

// Main handler for user chat submission
function handleChatSubmit(event) {
  if (event) event.preventDefault();

  if (isAIResponding) return;

  const chatInput = document.getElementById('chat-input');
  if (!chatInput) return;

  const userQuery = chatInput.value.trim();
  if (!userQuery) return;

  // Clear input
  chatInput.value = '';

  // 1. Render user message
  appendChatMessage('user', userQuery, true);

  // 2. Set loading state
  isAIResponding = true;
  const sendBtn = document.getElementById('chat-send-btn');
  if (sendBtn) sendBtn.disabled = true;

  // 3. Show typing indicator
  showTypingIndicator();

  // 4. Simulate response delay (500ms - 1200ms for realistic AI feeling)
  // NOTE: When integrating OpenAI or Gemini API, replace this setTimeout with `await queryLLM(userQuery)`.
  const simulatedDelay = Math.floor(Math.random() * 500) + 700;

  setTimeout(() => {
    removeTypingIndicator();
    const aiResponseHtml = generateAIReply(userQuery);
    appendChatMessage('ai', aiResponseHtml, false);

    isAIResponding = false;
    if (sendBtn) sendBtn.disabled = false;
    chatInput.focus();
  }, simulatedDelay);
}

// Quick trigger from suggested prompt chips
function sendSuggestedMessage(promptText) {
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.value = promptText;
    handleChatSubmit(null);
  }
}

// Reset chat history to initial greeting
function resetChatHistory() {
  const messagesArea = document.getElementById('chat-messages');
  if (!messagesArea) return;

  const timeStr = getFormattedTime();
  messagesArea.innerHTML = `
    <div class="message-row ai-row">
      <div class="msg-avatar ai-avatar">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="msg-content-wrap">
        <div class="msg-meta">
          <span class="msg-sender">Dhanya AI</span>
          <span class="msg-time">${timeStr}</span>
        </div>
        <div class="msg-bubble ai-bubble">
          <p>
            👋 Hi there! I'm the <strong>AI representation of Dhanya V. M.</strong>
          </p>
          <p>
            I can tell you all about my programming skills in <strong>Java, Python, & C</strong>, my <strong>Smart IoT Accident Alert System</strong>, my <strong>9.6 CGPA</strong> at Adichunchanagiri Institute of Technology, or how I can contribute to your team.
          </p>
          <p class="msg-tip">
            💡 <em>Click one of the suggested prompts above or type your question below!</em>
          </p>
        </div>
      </div>
    </div>
  `;
}



