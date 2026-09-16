/* =========================================================
   SNK IT INSTITUTE
   Main Website Script
   File: script.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     CONFIG
  ======================================================= */

  const LINKS = {
    live:
      "https://us05web.zoom.us/j/84311190995?pwd=d0j0VRyKL6Zxg5qN6rIaxAJb9Dk8rf.1",

    freeCourse:
      "https://www.youtube.com/playlist?list=PLJe-RU9VQd38",

    paidCourse:
      "https://www.youtube.com/playlist?list=PLfz6zuYhx-uU",

    support:
      "https://wa.me/8801636363801",

    facebook:
      "https://www.facebook.com/snkitinstitute",

    youtube:
      "https://www.youtube.com/@snkguideup",

    whatsappChannel:
      "https://whatsapp.com/channel/0029VbD6LlH6RGJJ1QsBN93x",

    shoppingMela:
      "https://yourdocuments.github.io/shopingmela/",

    usha:
      "usha.html"
  };


  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".main-nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuBtn.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuBtn.classList.remove("active");
      });
    });
  }


  /* =======================================================
     SMOOTH SCROLL
  ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });


  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });


  /* =======================================================
     EXTERNAL LINK HANDLER
  ======================================================= */

  document.querySelectorAll("[data-link]").forEach((element) => {
    element.addEventListener("click", () => {
      const type = element.dataset.link;

      if (!type || !LINKS[type]) {
        return;
      }

      window.open(LINKS[type], "_blank", "noopener,noreferrer");
    });
  });


  /* =======================================================
     USHA OPEN
  ======================================================= */

  document.querySelectorAll("[data-usha]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = LINKS.usha;
    });
  });


  /* =======================================================
     PROMO CODE
  ======================================================= */

  const promoCopy = document.querySelector("[data-copy-promo]");

  if (promoCopy) {
    promoCopy.addEventListener("click", async () => {
      const code =
        promoCopy.dataset.copyPromo ||
        "SHOPING36";

      try {
        await navigator.clipboard.writeText(code);

        showToast(
          "Promo code copied: " + code
        );

      } catch (error) {
        showToast(
          "Promo code: " + code
        );
      }
    });
  }


  /* =======================================================
     GENERAL TOAST
  ======================================================= */

  function showToast(message) {
    let toast = document.querySelector(".site-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "site-toast";

      toast.style.position = "fixed";
      toast.style.left = "50%";
      toast.style.bottom = "25px";
      toast.style.transform = "translateX(-50%)";
      toast.style.zIndex = "99999";
      toast.style.padding = "11px 17px";
      toast.style.borderRadius = "10px";
      toast.style.background = "#111";
      toast.style.color = "#fff";
      toast.style.fontSize = "13px";
      toast.style.fontWeight = "600";
      toast.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.18)";
      toast.style.opacity = "0";
      toast.style.transition = "opacity .2s ease";

      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";

    clearTimeout(window.__snkToastTimer);

    window.__snkToastTimer = setTimeout(() => {
      toast.style.opacity = "0";
    }, 2200);
  }


  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".reveal, .fade-up, .animate-on-scroll"
    );

  if (revealElements.length) {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }


  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */

  const sections =
    document.querySelectorAll("section[id]");

  const navLinks =
    document.querySelectorAll(
      '.main-nav a[href^="#"]'
    );

  if (sections.length && navLinks.length) {
    const sectionObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const id = entry.target.id;

            navLinks.forEach((link) => {
              link.classList.remove("active");

              if (
                link.getAttribute("href") ===
                "#" + id
              ) {
                link.classList.add("active");
              }
            });
          });
        },
        {
          rootMargin:
            "-25% 0px -60% 0px"
        }
      );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  /* =======================================================
     BACK TO TOP
  ======================================================= */

  const topButton =
    document.querySelector(
      "#backToTop, .back-to-top"
    );

  if (topButton) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 500) {
          topButton.classList.add("show");
        } else {
          topButton.classList.remove("show");
        }
      },
      {
        passive: true
      }
    );

    topButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  /* =======================================================
     HERO BUTTONS
  ======================================================= */

  document
    .querySelectorAll(
      '[data-action="free-course"]'
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        window.open(
          LINKS.freeCourse,
          "_blank",
          "noopener,noreferrer"
        );
      });
    });


  document
    .querySelectorAll(
      '[data-action="paid-course"]'
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        window.open(
          LINKS.paidCourse,
          "_blank",
          "noopener,noreferrer"
        );
      });
    });


  document
    .querySelectorAll(
      '[data-action="live"]'
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        window.open(
          LINKS.live,
          "_blank",
          "noopener,noreferrer"
        );
      });
    });


  document
    .querySelectorAll(
      '[data-action="support"]'
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        window.open(
          LINKS.support,
          "_blank",
          "noopener,noreferrer"
        );
      });
    });


  /* =======================================================
     SOCIAL BUTTONS
  ======================================================= */

  document
    .querySelectorAll(
      '[data-social="facebook"]'
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        window.open(
          LINKS.facebook,
          "_blank",
          "noopener,noreferrer"
        );
      });
    });


  document
    .querySelectorAll(
      '[data-social="youtube"]'
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        window.open(
          LINKS.youtube,
          "_blank",
          "noopener,noreferrer"
        );
      });
    });


  document
    .querySelectorAll(
      '[data-social="whatsapp"]'
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        window.open(
          LINKS.whatsappChannel,
          "_blank",
          "noopener,noreferrer"
        );
      });
    });


  /* =======================================================
     USHA SUGGESTION QUICK ACTIONS
  ======================================================= */

  const ushaQuestions = {
    free:
      "আমি কীভাবে Free Course শুরু করব?",

    coding:
      "আমি coding শিখতে চাই, কোথা থেকে শুরু করব?",

    html:
      "আমি HTML শিখতে চাই, কীভাবে শুরু করব?",

    live:
      "Live class কীভাবে join করব?",

    recorded:
      "Recorded class কোথায় পাব?",

    snk:
      "SNK সম্পর্কে বলো"
  };


  document
    .querySelectorAll("[data-usha-question]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const key =
          button.dataset.ushaQuestion;

        const question =
          ushaQuestions[key];

        if (!question) {
          return;
        }

        sessionStorage.setItem(
          "ushaPendingQuestion",
          question
        );

        window.location.href =
          LINKS.usha;
      });
    });


  /* =======================================================
     SEND QUESTION TO USHA
  ======================================================= */

  window.askUshaFromHome = function (question) {
    if (!question) {
      return;
    }

    sessionStorage.setItem(
      "ushaPendingQuestion",
      question
    );

    window.location.href =
      LINKS.usha;
  };


  /* =======================================================
     FLOATING USHA BUTTON
  ======================================================= */

  const floatingUsha =
    document.querySelector(
      ".floating-usha"
    );

  if (floatingUsha) {
    floatingUsha.addEventListener(
      "click",
      () => {
        window.location.href =
          LINKS.usha;
      }
    );
  }


  /* =======================================================
     PREVENT DOUBLE SUBMIT
  ======================================================= */

  document
    .querySelectorAll("form")
    .forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          const submitButton =
            form.querySelector(
              'button[type="submit"]'
            );

          if (submitButton) {
            submitButton.disabled = true;

            setTimeout(() => {
              submitButton.disabled =
                false;
            }, 2500);
          }
        }
      );
    });


  /* =======================================================
     IMAGE LAZY LOAD
  ======================================================= */

  document
    .querySelectorAll("img")
    .forEach((image) => {
      if (!image.hasAttribute("loading")) {
        image.setAttribute(
          "loading",
          "lazy"
        );
      }
    });


  /* =======================================================
     YEAR FALLBACK
  ======================================================= */

  const yearElements =
    document.querySelectorAll(
      ".current-year"
    );

  yearElements.forEach((element) => {
    element.textContent =
      new Date().getFullYear();
  });


  /* =======================================================
     PAGE LOADED
  ======================================================= */

  document.body.classList.add(
    "page-ready"
  );


  /* =======================================================
     DEBUG
  ======================================================= */

  console.log(
    "SNK Website Script Loaded Successfully."
  );

  console.log(
    "USHA AI Mentor:",
    LINKS.usha
  );
});


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

function openFreeCourse() {
  window.open(
    "https://www.youtube.com/playlist?list=PLJe-RU9VQd38",
    "_blank",
    "noopener,noreferrer"
  );
}


function openPaidCourse() {
  window.open(
    "https://www.youtube.com/playlist?list=PLfz6zuYhx-uU",
    "_blank",
    "noopener,noreferrer"
  );
}


function joinLiveClass() {
  window.open(
    "https://us05web.zoom.us/j/84311190995?pwd=d0j0VRyKL6Zxg5qN6rIaxAJb9Dk8rf.1",
    "_blank",
    "noopener,noreferrer"
  );
}


function contactSupport() {
  window.open(
    "https://wa.me/8801636363801",
    "_blank",
    "noopener,noreferrer"
  );
}


function openUsha() {
  window.location.href =
    "usha.html";
}


function openShoppingMela() {
  window.open(
    "https://yourdocuments.github.io/shopingmela/",
    "_blank",
    "noopener,noreferrer"
  );
}
