/* =========================================================
   1.4 — USHA AI CHATBOT JAVASCRIPT
   File: usha.js
   ========================================================= */

(function () {

  "use strict";

  /* =======================================================
     USHA LINKS
  ======================================================= */

  const USHA_LINKS = {

    freeCourse:
      "https://yourdocuments.github.io/freecourse.github.io/",

    shopping:
      "https://yourdocuments.github.io/shopingmela/",

    zoom:
      "https://us05web.zoom.us/j/84311190995?pwd=d0j0VRyKL6Zxg5qN6rIaxAJb9Dk8rf.1",

    whatsapp:
      "https://wa.me/8801636363801",

    whatsappChannel:
      "https://whatsapp.com/channel/0029VbD6LlH6RGJJ1QsBN93x",

    freePlaylist:
      "https://www.youtube.com/playlist?list=PLJe-RU9VQd38"

  };


  /* =======================================================
     GET ELEMENTS
  ======================================================= */

  const ushaButton =
    document.getElementById("ushaButton");

  const chatbot =
    document.getElementById("chatbot");

  const closeChat =
    document.getElementById("closeChat");

  const chatMessages =
    document.getElementById("chatMessages");

  const chatForm =
    document.getElementById("chatForm");

  const chatInput =
    document.getElementById("chatInput");


  /* =======================================================
     CHECK ELEMENTS
  ======================================================= */

  if (
    !ushaButton ||
    !chatbot ||
    !closeChat ||
    !chatMessages ||
    !chatForm ||
    !chatInput
  ) {

    console.warn(
      "USHA AI: Required HTML elements were not found."
    );

    return;

  }


  /* =======================================================
     OPEN USHA
  ======================================================= */

  function openUsha() {

    chatbot.classList.add("show");

    setTimeout(function () {

      chatInput.focus();

    }, 150);

  }


  /* =======================================================
     CLOSE USHA
  ======================================================= */

  function closeUshaChat() {

    chatbot.classList.remove("show");

  }


  /* =======================================================
     FLOATING BUTTON
  ======================================================= */

  ushaButton.addEventListener(
    "click",
    function () {

      if (
        chatbot.classList.contains("show")
      ) {

        closeUshaChat();

      } else {

        openUsha();

      }

    }
  );


  /* =======================================================
     CLOSE BUTTON
  ======================================================= */

  closeChat.addEventListener(
    "click",
    function () {

      closeUshaChat();

    }
  );


  /* =======================================================
     ADD MESSAGE
  ======================================================= */

  function addMessage(
    text,
    type
  ) {

    const message =
      document.createElement("div");

    message.classList.add(
      "message"
    );


    if (type === "user") {

      message.classList.add(
        "user-message"
      );

    } else {

      message.classList.add(
        "bot-message"
      );

    }


    message.innerHTML =
      text;


    chatMessages.appendChild(
      message
    );


    scrollToBottom();

  }


  /* =======================================================
     SCROLL
  ======================================================= */

  function scrollToBottom() {

    chatMessages.scrollTop =
      chatMessages.scrollHeight;

  }


  /* =======================================================
     TYPING MESSAGE
  ======================================================= */

  function showTyping() {

    const typing =
      document.createElement("div");

    typing.id =
      "ushaTyping";

    typing.className =
      "message bot-message";


    typing.innerHTML = `
      <div class="typing-message">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;


    chatMessages.appendChild(
      typing
    );


    scrollToBottom();

  }


  /* =======================================================
     REMOVE TYPING
  ======================================================= */

  function hideTyping() {

    const typing =
      document.getElementById(
        "ushaTyping"
      );


    if (typing) {

      typing.remove();

    }

  }


  /* =======================================================
     TEXT NORMALIZE
  ======================================================= */

  function normalizeText(text) {

    return String(text || "")
      .toLowerCase()
      .trim();

  }


  /* =======================================================
     SAFE USER TEXT
  ======================================================= */

  function escapeHTML(text) {

    const div =
      document.createElement("div");

    div.textContent =
      text;

    return div.innerHTML;

  }


  /* =======================================================
     USHA RESPONSE
  ======================================================= */

  function getUshaReply(question) {

    const q =
      normalizeText(question);


    /* ---------------------------------------------------
       GREETING
    --------------------------------------------------- */

    if (
      q.includes("hi") ||
      q.includes("hello") ||
      q.includes("হাই") ||
      q.includes("হ্যালো") ||
      q.includes("আসসালামু") ||
      q.includes("salam")
    ) {

      return `
        👋 ওয়ালাইকুম আসসালাম!

        <br><br>

        আমি <strong>USHA AI</strong>।

        <br><br>

        আপনাকে Free Course, Live Class,
        Recorded Course, WhatsApp এবং
        Shopping সম্পর্কে সাহায্য করতে পারি।

        <br><br>

        কী জানতে চান? 😊
      `;

    }


    /* ---------------------------------------------------
       FREE COURSE
    --------------------------------------------------- */

    if (
      q.includes("free course") ||
      q.includes("free") ||
      q.includes("ফ্রি") ||
      q.includes("ফ্রী") ||
      q.includes("কোর্স")
    ) {

      return `
        🎓 <strong>Free Course</strong>

        <br><br>

        আমাদের Free Course দেখতে
        নিচের button-এ click করুন।

        <br><br>

        <a
          class="usha-link"
          href="${USHA_LINKS.freeCourse}"
          target="_blank"
          rel="noopener noreferrer"
        >
          🎓 Open Free Course
        </a>
      `;

    }


    /* ---------------------------------------------------
       PAID COURSE
    --------------------------------------------------- */

    if (
      q.includes("paid") ||
      q.includes("premium") ||
      q.includes("পেইড") ||
      q.includes("প্রিমিয়াম") ||
      q.includes("প্রিমিয়াম")
    ) {

      return `
        💎 <strong>Paid Course</strong>

        <br><br>

        Paid Course সম্পর্কে জানতে
        Support-এর সাথে যোগাযোগ করুন।

        <br><br>

        <a
          class="usha-link dark"
          href="${USHA_LINKS.whatsapp}"
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 Contact Support
        </a>
      `;

    }


    /* ---------------------------------------------------
       LIVE CLASS
    --------------------------------------------------- */

    if (
      q.includes("live") ||
      q.includes("লাইভ") ||
      q.includes("live class")
    ) {

      return `
        📹 <strong>Live Class</strong>

        <br><br>

        Live Class-এ join করতে
        নিচের button ব্যবহার করুন।

        <br><br>

        <a
          class="usha-link blue"
          href="${USHA_LINKS.zoom}"
          target="_blank"
          rel="noopener noreferrer"
        >
          📹 JOIN LIVE CLASS
        </a>
      `;

    }


    /* ---------------------------------------------------
       ZOOM
    --------------------------------------------------- */

    if (
      q.includes("zoom") ||
      q.includes("জুম")
    ) {

      return `
        🔵 <strong>Zoom Class</strong>

        <br><br>

        Zoom meeting-এ join করতে
        নিচের button-এ click করুন।

        <br><br>

        <a
          class="usha-link blue"
          href="${USHA_LINKS.zoom}"
          target="_blank"
          rel="noopener noreferrer"
        >
          🔵 JOIN ZOOM
        </a>
      `;

    }


    /* ---------------------------------------------------
       RECORDED COURSE
    --------------------------------------------------- */

    if (
      q.includes("recorded") ||
      q.includes("record") ||
      q.includes("রেকর্ড")
    ) {

      return `
        ▶️ <strong>Recorded Course</strong>

        <br><br>

        Recorded classes দেখতে
        YouTube playlist খুলুন।

        <br><br>

        <a
          class="usha-link"
          href="${USHA_LINKS.freePlaylist}"
          target="_blank"
          rel="noopener noreferrer"
        >
          ▶️ WATCH RECORDED CLASS
        </a>
      `;

    }


    /* ---------------------------------------------------
       WHATSAPP
    --------------------------------------------------- */

    if (
      q.includes("whatsapp") ||
      q.includes("হোয়াটসঅ্যাপ") ||
      q.includes("হোয়াটসঅ্যাপ") ||
      q.includes("সাপোর্ট") ||
      q.includes("support")
    ) {

      return `
        💬 <strong>WhatsApp Support</strong>

        <br><br>

        সরাসরি WhatsApp-এ যোগাযোগ করুন।

        <br><br>

        <a
          class="usha-link"
          href="${USHA_LINKS.whatsapp}"
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 WhatsApp Support
        </a>

        <br><br>

        📢 WhatsApp Channel-এ join করতে পারেন।

        <br><br>

        <a
          class="usha-link"
          href="${USHA_LINKS.whatsappChannel}"
          target="_blank"
          rel="noopener noreferrer"
        >
          📢 Join Channel
        </a>
      `;

    }


    /* ---------------------------------------------------
       SHOPPING
    --------------------------------------------------- */

    if (
      q.includes("shopping") ||
      q.includes("shop") ||
      q.includes("শপিং") ||
      q.includes("discount") ||
      q.includes("ডিসকাউন্ট") ||
      q.includes("ছাড়") ||
      q.includes("ছাড়") ||
      q.includes("promo") ||
      q.includes("promocode") ||
      q.includes("coupon") ||
      q.includes("কুপন") ||
      q.includes("36")
    ) {

      return `
        🛍️ <strong>Shopping Mela</strong>

        <br><br>

        🎉 <strong>36% Discount</strong>

        <br><br>

        Promo Code:

        <strong>SHOPING36</strong>

        <br><br>

        Shopping করতে নিচের button-এ
        click করুন।

        <br><br>

        <a
          class="usha-link"
          href="${USHA_LINKS.shopping}"
          target="_blank"
          rel="noopener noreferrer"
        >
          🛍️ SHOP NOW
        </a>
      `;

    }


    /* ---------------------------------------------------
       OFFER
    --------------------------------------------------- */

    if (
      q.includes("offer") ||
      q.includes("অফার")
    ) {

      return `
        🎉 <strong>Special Offer</strong>

        <br><br>

        Shopping Mela-তে
        <strong>36% Discount</strong> আছে।

        <br><br>

        Promo Code:

        <strong>SHOPING36</strong>

        <br><br>

        <a
          class="usha-link"
          href="${USHA_LINKS.shopping}"
          target="_blank"
          rel="noopener noreferrer"
        >
          🛍️ SHOP NOW
        </a>
      `;

    }


    /* ---------------------------------------------------
       PRICE
    --------------------------------------------------- */

    if (
      q.includes("price") ||
      q.includes("দাম") ||
      q.includes("মূল্য")
    ) {

      return `
        💰 কোন Course-এর দাম জানতে
        চাচ্ছেন?

        <br><br>

        Course-এর নাম লিখুন অথবা
        WhatsApp Support-এ যোগাযোগ করুন।

        <br><br>

        <a
          class="usha-link dark"
          href="${USHA_LINKS.whatsapp}"
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 Ask Support
        </a>
      `;

    }


    /* ---------------------------------------------------
       THANK YOU
    --------------------------------------------------- */

    if (
      q.includes("thank") ||
      q.includes("thanks") ||
      q.includes("ধন্যবাদ")
    ) {

      return `
        😊 আপনাকেও ধন্যবাদ!

        <br><br>

        প্রয়োজন হলে আবার
        <strong>USHA AI</strong>-কে জিজ্ঞেস করুন।
      `;

    }


    /* ---------------------------------------------------
       DEFAULT
    --------------------------------------------------- */

    return `
      😊 আপনার প্রশ্নটি আমি পুরোপুরি
      বুঝতে পারিনি।

      <br><br>

      আপনি নিচের বিষয়গুলো সম্পর্কে
      জানতে পারেন:

      <br><br>

      🎓 Free Course

      <br>

      💎 Paid Course

      <br>

      📹 Live Class

      <br>

      🔵 Zoom

      <br>

      ▶️ Recorded Course

      <br>

      💬 WhatsApp Support

      <br>

      🛍️ Shopping Discount
    `;

  }


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  function sendMessage(question) {

    question =
      String(question || "").trim();


    if (!question) {

      return;

    }


    /* User message */

    addMessage(
      escapeHTML(question),
      "user"
    );


    /* Clear input */

    chatInput.value = "";


    /* Show typing */

    showTyping();


    /* AI-like delay */

    const delay =
      600 +
      Math.floor(
        Math.random() * 800
      );


    setTimeout(
      function () {

        hideTyping();


        const reply =
          getUshaReply(
            question
          );


        addMessage(
          reply,
          "bot"
        );

      },
      delay
    );

  }


  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  chatForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      sendMessage(
        chatInput.value
      );

    }
  );


  /* =======================================================
     QUICK QUESTION
     Used by onclick="" in usha.html
  ======================================================= */

  window.quickQuestion =
    function (question) {

      openUsha();

      sendMessage(
        question
      );

    };


  /* =======================================================
     ENTER KEY
  ======================================================= */

  chatInput.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendMessage(
          chatInput.value
        );

      }

    }
  );


  /* =======================================================
     ESC KEY CLOSE
  ======================================================= */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape"
      ) {

        closeUshaChat();

      }

    }
  );


  /* =======================================================
     INITIAL MESSAGE
  ======================================================= */

  console.log(
    "USHA AI JavaScript loaded successfully."
  );


})();
