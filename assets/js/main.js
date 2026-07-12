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
      loop: false,
      grabCursor: true,
      mousewheel: { forceToAxis: true },
      pagination: { el: ".project-swiper .swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".project-swiper .swiper-button-next",
        prevEl: ".project-swiper .swiper-button-prev",
      },
      breakpoints: {
        720: { slidesPerView: 2.2 },
        1100: { slidesPerView: 3.3 },
      },
    });

    new Swiper(".testimonial-swiper", {
      slidesPerView: 1.3,
      spaceBetween: 24,
      centeredSlides: true,
      loop: false,
      grabCursor: true,
      mousewheel: { forceToAxis: true },
      pagination: { el: ".testimonial-swiper .swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".testimonial-swiper .swiper-button-next",
        prevEl: ".testimonial-swiper .swiper-button-prev",
      },
      breakpoints: {
        720: { slidesPerView: 2.2 },
        1100: { slidesPerView: 3.3 },
      },
    });
  }

  // Images are shown at their original size (object-fit: contain), which can
  // leave empty bands above/below when the image's aspect ratio doesn't match
  // the card. Fill those bands with the image's own top/bottom edge color
  // instead of a fixed background, so it looks intentional rather than empty.
  function fillEdgeColors(img) {
    var container = img.parentElement;
    function apply() {
      var w = img.naturalWidth;
      var h = img.naturalHeight;
      if (!w || !h) return;
      try {
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        var topColor = averageRowColor(ctx.getImageData(0, 0, w, 1).data);
        var bottomColor = averageRowColor(ctx.getImageData(0, h - 1, w, 1).data);
        container.style.background =
          "linear-gradient(to bottom, " +
          topColor +
          " 0%, " +
          topColor +
          " 50%, " +
          bottomColor +
          " 50%, " +
          bottomColor +
          " 100%)";
      } catch (e) {
        // Cross-origin or decode failure: keep the default background.
      }
    }
    function averageRowColor(data) {
      var r = 0,
        g = 0,
        b = 0;
      var count = data.length / 4;
      for (var i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      return "rgb(" + Math.round(r / count) + "," + Math.round(g / count) + "," + Math.round(b / count) + ")";
    }
    if (img.complete && img.naturalWidth) {
      apply();
    } else {
      img.addEventListener("load", apply);
    }
  }

  document.querySelectorAll(".project-thumb.has-image img, .gallery-item.has-image img").forEach(fillEdgeColors);
});
