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

});
