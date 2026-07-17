document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
      });
    });
  }

  var sections = document.querySelectorAll("main .section[id]");
  var navItems = document.querySelectorAll(".nav-links a");

  if (sections.length && navItems.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navItems.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  var lastMouseX = null;
  var lastMouseY = null;
  document.addEventListener("mousemove", function (e) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  document.querySelectorAll(".competency-flip").forEach(function (flip) {
    // Touch devices have no hover, so tap toggles the flip directly.
    flip.addEventListener("click", function () {
      flip.classList.toggle("is-flipped");
    });

    // CSS :hover is only re-checked on mouse movement, so a card that
    // animates into place under an already-stationary cursor never
    // registers as hovered. Re-check manually once the reveal finishes,
    // and clean up on mouseleave so it still turns back like a normal hover.
    flip.addEventListener("transitionend", function (e) {
      if (e.propertyName !== "transform" || lastMouseX === null) return;
      var rect = flip.getBoundingClientRect();
      var isUnderCursor =
        lastMouseX >= rect.left &&
        lastMouseX <= rect.right &&
        lastMouseY >= rect.top &&
        lastMouseY <= rect.bottom;
      if (isUnderCursor && !flip.classList.contains("is-flipped")) {
        flip.classList.add("is-flipped");
        flip.addEventListener(
          "mouseleave",
          function onLeave() {
            flip.classList.remove("is-flipped");
          },
          { once: true }
        );
      }
    });
  });

  document.querySelectorAll(".section").forEach(function (section) {
    var items = section.querySelectorAll(".reveal-up");
    items.forEach(function (item, i) {
      item.style.transitionDelay = i * 0.12 + "s";
    });
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.querySelectorAll(".reveal-up").forEach(function (item) {
            item.classList.add("is-revealed");
          });
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".section").forEach(function (section) {
    revealObserver.observe(section);
  });

  var cardRevealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          cardRevealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll(".competency-flip").forEach(function (flip) {
    cardRevealObserver.observe(flip);
  });

  if (window.Swiper) {
    new Swiper(".competency-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: { el: ".competency-swiper .swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".competency-swiper .swiper-button-next",
        prevEl: ".competency-swiper .swiper-button-prev",
      },
      breakpoints: {
        720: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });

    new Swiper(".project-swiper", {
      slidesPerView: 1.3,
      spaceBetween: 24,
      centeredSlides: true,
      initialSlide: 1,
      loop: false,
      grabCursor: true,
      mousewheel: { forceToAxis: true },
      pagination: { el: ".project-swiper .swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".project-swiper .swiper-button-next",
        prevEl: ".project-swiper .swiper-button-prev",
      },
      breakpoints: {
        640: { slidesPerView: 2.2 },
        900: { slidesPerView: 3.3 },
      },
    });

    new Swiper(".testimonial-swiper", {
      slidesPerView: 1.3,
      spaceBetween: 24,
      centeredSlides: true,
      initialSlide: 1,
      loop: false,
      grabCursor: true,
      mousewheel: { forceToAxis: true },
      pagination: { el: ".testimonial-swiper .swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".testimonial-swiper .swiper-button-next",
        prevEl: ".testimonial-swiper .swiper-button-prev",
      },
      breakpoints: {
        640: { slidesPerView: 2.2 },
        900: { slidesPerView: 3.3 },
      },
    });
  }

  initChatWidget();
});

// "Ask about my work" chat widget. Rule based and fully static, no API key,
// no backend, no ongoing cost. Answers are matched by keyword against a
// small, hand written Q&A list built from real project content. To teach it
// a new answer later, add an entry to QA_PAIRS below with a few keywords.
function initChatWidget() {
  var QA_PAIRS = [
    {
      keywords: ["achieve", "achievement", "proud", "biggest", "impressive", "highlight", "best work"],
      answer:
        "One of my proudest wins is the AI Enabled Market Intelligence Platform at STMicroelectronics. It tracks 12 competitors and 50 plus customers, and its 4 mode currency engine once surfaced a 1.5 billion dollar currency distortion in a single quarter, insight that directly informed C-Suite resource allocation.",
    },
    {
      keywords: ["tool", "tools", "software", "stack", "power bi", "tableau", "sql", "python"],
      answer:
        "My core toolkit is Power BI, Tableau, Alteryx, SQL, and Python for analysis, plus n8n for AI automation and Power Automate for workflows. Scroll up to the Tools section for the full breakdown by category.",
    },
    {
      keywords: ["forecast", "forecasting", "demand", "prediction"],
      answer:
        "I built a bottom up demand forecasting model at STMicroelectronics covering 50 plus key customers at the individual business segment level, cross validated against WSTS and OMDIA industry benchmarks.",
    },
    {
      keywords: ["ai", "automation", "n8n", "agent", "artificial intelligence"],
      answer:
        "I run an AI automated pipeline in n8n that pulls competitor and customer financials, has an AI agent review them, and refreshes a Power BI dashboard with zero manual steps, cutting a 2 to 3 day task down to under 4 hours.",
    },
    {
      keywords: ["robot", "robotics", "humanoid", "automatica"],
      answer:
        "I led ground intelligence gathering for a Humanoid Robotics go to market strategy, built on direct C-suite conversations at Automatica 2025, helping position the business as a strategic silicon partner in that emerging market.",
    },
    {
      keywords: ["bsh", "launch", "appliance", "home care"],
      answer:
        "At BSH Hausgeräte, I built the Local Launch Excellence dashboard system, giving Marketing, Sales, and Supply Chain one shared view of sell-in, sell-out, and reviews for every product launch.",
    },
    {
      keywords: ["ecommerce", "e-commerce", "amazon", "seo", "keyword", "listing"],
      answer:
        "I ran an e-commerce webpage optimization project using Helium10 keyword research to improve product listing visibility and conversion on Amazon.",
    },
    {
      keywords: ["ceramic", "glass", "geopolitical", "diversification", "sayano"],
      answer:
        "I led a portfolio diversification project at Sayano Deutschland, pivoting from a ceramics line into glassware by spotting a geopolitical shift in energy costs early and moving fast on it.",
    },
    {
      keywords: ["education", "degree", "mim", "escp", "study", "university", "chemical engineer", "background"],
      answer:
        "I am a Chemical Engineer by training who moved into strategy and market intelligence, with a Master in Management from ESCP Business School, ranked 7th globally by the Financial Times.",
    },
    {
      keywords: ["why", "differentiate", "unique", "strength", "stand out", "hire you"],
      answer:
        "I do not just report numbers. I build the intelligence systems, dashboards, forecasting models, and automated pipelines that leadership teams actually use to make decisions. That is the difference between analysis and infrastructure.",
    },
    {
      keywords: ["contact", "email", "reach", "hire", "linkedin", "talk", "call", "phone"],
      answer:
        "The fastest way is the Contact section, or connect with me directly on LinkedIn. Both are linked at the bottom of the home page.",
    },
  ];

  var FALLBACK_ANSWER =
    "I don't have a ready answer for that one yet. Try asking about my tools, a specific project, or my background, or head to the Contact section to ask me directly.";

  var SUGGESTED_CHIPS = [
    "What's your biggest achievement?",
    "What tools do you use?",
    "Tell me about your AI project",
    "How do I contact you?",
  ];

  function matchAnswer(question) {
    var q = question.toLowerCase();
    for (var i = 0; i < QA_PAIRS.length; i++) {
      var pair = QA_PAIRS[i];
      for (var j = 0; j < pair.keywords.length; j++) {
        if (q.indexOf(pair.keywords[j]) !== -1) {
          return pair.answer;
        }
      }
    }
    return FALLBACK_ANSWER;
  }

  var button = document.createElement("button");
  button.className = "chat-widget-button";
  button.setAttribute("aria-label", "Ask about my work");
  button.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';

  var panel = document.createElement("div");
  panel.className = "chat-widget-panel";
  panel.innerHTML =
    '<div class="chat-widget-header">' +
    '<div><div class="chat-widget-header-title">Ask about my work</div>' +
    '<div class="chat-widget-header-subtitle">Instant answers, no waiting</div></div>' +
    '<button class="chat-widget-close" aria-label="Close chat">&times;</button>' +
    "</div>" +
    '<div class="chat-widget-messages"></div>' +
    '<div class="chat-widget-chips"></div>' +
    '<div class="chat-widget-input-row">' +
    '<input class="chat-widget-input" type="text" placeholder="Type a question..." aria-label="Type a question">' +
    '<button class="chat-widget-send">Send</button>' +
    "</div>";

  document.body.appendChild(button);
  document.body.appendChild(panel);

  var messagesEl = panel.querySelector(".chat-widget-messages");
  var chipsEl = panel.querySelector(".chat-widget-chips");
  var inputEl = panel.querySelector(".chat-widget-input");
  var sendEl = panel.querySelector(".chat-widget-send");
  var closeEl = panel.querySelector(".chat-widget-close");

  function addMessage(text, from) {
    var msg = document.createElement("div");
    msg.className = "chat-message " + from;
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function askQuestion(text) {
    if (!text.trim()) return;
    addMessage(text, "user");
    inputEl.value = "";
    setTimeout(function () {
      addMessage(matchAnswer(text), "bot");
    }, 350);
  }

  SUGGESTED_CHIPS.forEach(function (chipText) {
    var chip = document.createElement("button");
    chip.className = "chat-chip";
    chip.type = "button";
    chip.textContent = chipText;
    chip.addEventListener("click", function () {
      askQuestion(chipText);
    });
    chipsEl.appendChild(chip);
  });

  addMessage(
    "Hi, I'm a quick assistant trained on Abhinav's real project data. Ask me about his tools, projects, or background.",
    "bot"
  );

  var hasOpenedOnce = false;
  button.addEventListener("click", function () {
    var isOpen = panel.classList.toggle("is-open");
    if (isOpen && !hasOpenedOnce) {
      hasOpenedOnce = true;
      inputEl.focus();
    }
  });

  closeEl.addEventListener("click", function () {
    panel.classList.remove("is-open");
  });

  sendEl.addEventListener("click", function () {
    askQuestion(inputEl.value);
  });

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      askQuestion(inputEl.value);
    }
  });
}
