/* =========================================================
   USHA AI MENTOR - FULL JAVASCRIPT
   SNK IT Institute
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     CONFIG
     ========================================================= */

  const STORAGE_KEY = "ushaChatHistory";

  const DEFAULT_MESSAGE =
    "Hi! আমি USHA 👋 তোমার AI learning mentor। " +
    "তুমি আমাকে course, class, coding, website বা learning নিয়ে যেকোনো প্রশ্ন করতে পারো।";

  /* =========================================================
     DOM ELEMENTS
     ========================================================= */

  const ushaPanel =
    document.getElementById("ushaPanel") ||
    document.querySelector(".usha-panel") ||
    document.querySelector("#ushaChat");

  const ushaButton =
    document.getElementById("ushaButton") ||
    document.querySelector(".usha-floating-btn") ||
    document.querySelector(".usha-float");

  const closeButton =
    document.getElementById("ushaClose") ||
    document.querySelector(".usha-close");

  const clearButton =
    document.getElementById("ushaClear") ||
    document.querySelector(".usha-clear");

  const messageArea =
    document.getElementById("ushaMessages") ||
    document.querySelector(".usha-messages") ||
    document.querySelector(".chat-messages");

  const input =
    document.getElementById("ushaInput") ||
    document.querySelector(".usha-input") ||
    document.querySelector("textarea");

  const sendButton =
    document.getElementById("ushaSend") ||
    document.querySelector(".usha-send") ||
    document.querySelector(".send-btn");

  const suggestionContainer =
    document.getElementById("ushaSuggestions") ||
    document.querySelector(".usha-suggestions");

  /* =========================================================
     HELPER
     ========================================================= */

  function safeText(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeText(text) {
    return String(text)
      .toLowerCase()
      .trim()
      .replace(/[!?.,،。]/g, " ")
      .replace(/\s+/g, " ");
  }

  /* =========================================================
     OPEN USHA
     ========================================================= */

  window.openUsha = function () {
    if (!ushaPanel) return;

    ushaPanel.classList.add("active");
    ushaPanel.classList.add("open");

    document.body.classList.add("usha-open");

    setTimeout(function () {
      if (input) {
        input.focus();
      }
    }, 250);
  };

  /* =========================================================
     CLOSE USHA
     ========================================================= */

  window.closeUsha = function () {
    if (!ushaPanel) return;

    ushaPanel.classList.remove("active");
    ushaPanel.classList.remove("open");

    document.body.classList.remove("usha-open");
  };

  /* =========================================================
     TOGGLE USHA
     ========================================================= */

  window.toggleUsha = function () {
    if (!ushaPanel) return;

    if (
      ushaPanel.classList.contains("active") ||
      ushaPanel.classList.contains("open")
    ) {
      closeUsha();
    } else {
      openUsha();
    }
  };

  /* =========================================================
     ADD MESSAGE
     ========================================================= */

  function addMessage(text, sender, save = true) {
    if (!messageArea) return;

    const message = document.createElement("div");

    message.className =
      sender === "user"
        ? "usha-message user-message"
        : "usha-message usha-message";

    const bubble = document.createElement("div");
    bubble.className = "usha-bubble";

    bubble.innerHTML = safeText(text).replace(/\n/g, "<br>");

    message.appendChild(bubble);
    messageArea.appendChild(message);

    scrollMessages();

    if (save) {
      saveMessage(text, sender);
    }
  }

  /* =========================================================
     SCROLL MESSAGE AREA
     ========================================================= */

  function scrollMessages() {
    if (!messageArea) return;

    setTimeout(function () {
      messageArea.scrollTop = messageArea.scrollHeight;
    }, 50);
  }

  /* =========================================================
     SAVE MESSAGE
     ========================================================= */

  function saveMessage(text, sender) {
    try {
      const history = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      history.push({
        text: text,
        sender: sender,
        time: new Date().toISOString()
      });

      /*
       * Keep last 100 messages
       */
      const limitedHistory = history.slice(-100);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(limitedHistory)
      );
    } catch (error) {
      console.warn("USHA localStorage error:", error);
    }
  }

  /* =========================================================
     LOAD CHAT HISTORY
     ========================================================= */

  function loadChat() {
    if (!messageArea) return;

    messageArea.innerHTML = "";

    try {
      const history = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (!history.length) {
        addMessage(DEFAULT_MESSAGE, "usha", false);
        return;
      }

      history.forEach(function (item) {
        if (!item || !item.text) return;

        addMessage(
          item.text,
          item.sender === "user" ? "user" : "usha",
          false
        );
      });

      scrollMessages();
    } catch (error) {
      console.warn("USHA history load error:", error);

      addMessage(DEFAULT_MESSAGE, "usha", false);
    }
  }

  /* =========================================================
     CLEAR CHAT
     ========================================================= */

  window.clearUshaChat = function () {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Unable to clear USHA chat:", error);
    }

    if (messageArea) {
      messageArea.innerHTML = "";
      addMessage(DEFAULT_MESSAGE, "usha", false);
    }
  };

  /* =========================================================
     TYPING INDICATOR
     ========================================================= */

  function showTyping() {
    if (!messageArea) return;

    removeTyping();

    const typing = document.createElement("div");

    typing.id = "ushaTyping";
    typing.className = "usha-message usha-message";

    typing.innerHTML = `
      <div class="usha-bubble usha-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;

    messageArea.appendChild(typing);

    scrollMessages();
  }

  function removeTyping() {
    const typing = document.getElementById("ushaTyping");

    if (typing) {
      typing.remove();
    }
  }

  /* =========================================================
     SHAH NEIL KHAN / SNK INTENT
     ========================================================= */

  function isShahNeilKhanQuestion(lower) {
    const patterns = [
      "shah neil khan কে",
      "shah neil khan কি",
      "shah neil khan সম্পর্কে",
      "shah neil khan কে সে",
      "shah neil khan",
      "শাহ নীল খান কে",
      "শাহ নীল খান কি",
      "শাহ নীল খান সম্পর্কে",
      "শাহ নীল খান",
      "shah neil কে",
      "শাহ নীল কে",
      "who is shah neil khan",
      "who is shah neil",
      "who is snk",
      "snk কে",
      "snk কি",
      "snk সম্পর্কে",
      "snk কে সে",
      "snk person",
      "snk founder",
      "snk sir কে",
      "snk স্যার কে"
    ];

    return patterns.some(function (pattern) {
      return lower.includes(pattern);
    });
  }

  /* =========================================================
     "TOMAR KI?" / RELATION WITH SHAH NEIL KHAN
     ========================================================= */

  function isTomarQuestion(lower) {
    const patterns = [
      "তোমার কি শাহ নীল খান",
      "তোমার কি shah neil khan",
      "তোমার কি snk",
      "snk তোমার কি",
      "শাহ নীল খান তোমার কি",
      "shah neil khan তোমার কি",
      "snk কে তোমার",
      "শাহ নীল খান কে তোমার",
      "shah neil khan কে তোমার",
      "তোমার কাছে snk",
      "তোমার কাছে শাহ নীল খান"
    ];

    return patterns.some(function (pattern) {
      return lower.includes(pattern);
    });
  }

  /* =========================================================
     USHA ABOUT HERSELF
     ========================================================= */

  function isUshaQuestion(lower) {
    const patterns = [
      "usha কে",
      "usha কি",
      "usha সম্পর্কে",
      "তুমি কে",
      "তুমি কি",
      "who are you",
      "what is usha",
      "who is usha",
      "usha ai",
      "usha assistant",
      "usha mentor"
    ];

    return patterns.some(function (pattern) {
      return lower.includes(pattern);
    });
  }

  /* =========================================================
     GREETING
     ========================================================= */

  function isGreeting(lower) {
    const patterns = [
      "hi",
      "hello",
      "hey",
      "হাই",
      "হ্যালো",
      "আসসালামু আলাইকুম",
      "assalamualaikum",
      "good morning",
      "good evening",
      "good afternoon"
    ];

    return patterns.some(function (pattern) {
      return lower === pattern || lower.startsWith(pattern + " ");
    });
  }

  /* =========================================================
     COURSE QUESTIONS
     ========================================================= */

  function isCourseQuestion(lower) {
    const patterns = [
      "course",
      "কোর্স",
      "কোন কোর্স",
      "free course",
      "ফ্রি কোর্স",
      "paid course",
      "পেইড কোর্স",
      "শিখতে চাই",
      "কি শিখবো",
      "what can i learn",
      "learning"
    ];

    return patterns.some(function (pattern) {
      return lower.includes(pattern);
    });
  }

  /* =========================================================
     LIVE CLASS QUESTIONS
     ========================================================= */

  function isLiveClassQuestion(lower) {
    const patterns = [
      "live class",
      "লাইভ ক্লাস",
      "জুম ক্লাস",
      "zoom class",
      "zoom",
      "ক্লাস কখন",
      "class time",
      "join live",
      "লাইভে কিভাবে",
      "কিভাবে join",
      "ক্লাসে join"
    ];

    return patterns.some(function (pattern) {
      return lower.includes(pattern);
    });
  }

  /* =========================================================
     RECORDED CLASS QUESTIONS
     ========================================================= */

  function isRecordedQuestion(lower) {
    const patterns = [
      "recorded",
      "recorded class",
      "রেকর্ডেড",
      "রেকর্ড ক্লাস",
      "ভিডিও ক্লাস",
      "video class",
      "playlist"
    ];

    return patterns.some(function (pattern) {
      return lower.includes(pattern);
    });
  }

  /* =========================================================
     WEBSITE / CODING QUESTIONS
     ========================================================= */

  function isCodingQuestion(lower) {
    const patterns = [
      "html",
      "css",
      "javascript",
      "js",
      "coding",
      "code",
      "কোড",
      "ওয়েবসাইট",
      "website",
      "web design",
      "web development",
      "programming",
      "প্রোগ্রামিং"
    ];

    return patterns.some(function (pattern) {
      return lower.includes(pattern);
    });
  }

  /* =========================================================
     SUPPORT QUESTIONS
     ========================================================= */

  function isSupportQuestion(lower) {
    const patterns = [
      "support",
      "সাপোর্ট",
      "যোগাযোগ",
      "contact",
      "help",
      "সাহায্য",
      "whatsapp",
      "হোয়াটসঅ্যাপ"
    ];

    return patterns.some(function (pattern) {
      return lower.includes(pattern);
    });
  }

  /* =========================================================
     THANK YOU
     ========================================================= */

  function isThanks(lower) {
    const patterns = [
      "thanks",
      "thank you",
      "ধন্যবাদ",
      "থ্যাংকস",
      "অনেক ধন্যবাদ"
    ];

    return patterns.some(function (pattern) {
      return lower.includes(pattern);
    });
  }

  /* =========================================================
     GOODBYE
     ========================================================= */

  function isGoodbye(lower) {
    const patterns = [
      "bye",
      "goodbye",
      "বিদায়",
      "আবার কথা হবে",
      "পরে কথা হবে"
    ];

    return patterns.some(function (pattern) {
      return lower.includes(pattern);
    });
  }

  /* =========================================================
     MAIN USHA REPLY ENGINE
     ========================================================= */

  function getUshaReply(userText) {
    const lower = normalizeText(userText);

    /*
     * IMPORTANT:
     * Shah Neil Khan / SNK intent comes first.
     */

    if (isTomarQuestion(lower)) {
      return "Shah Neil Khan? 😊 সে আমার খুব পছন্দের একজন। ❤️ আর SNK আমার কাছে খুবই special!";
    }

    if (isShahNeilKhanQuestion(lower)) {
      return "Shah Neil Khan? 😊 সে আমার খুব পছন্দের একজন। ❤️ আর SNK আমার কাছে খুবই special!";
    }

    /* -------------------------------------------------------
       USHA
       ------------------------------------------------------- */

    if (isUshaQuestion(lower)) {
      return "আমি USHA — SNK-এর AI learning mentor। 🤖💛 তোমার learning, course, coding আর website journey-তে আমি তোমার সাথে আছি।";
    }

    /* -------------------------------------------------------
       GREETING
       ------------------------------------------------------- */

    if (isGreeting(lower)) {
      return "Hello! 👋 আমি USHA। আজ কী শিখতে চাও? 😊";
    }

    /* -------------------------------------------------------
       COURSE
       ------------------------------------------------------- */

    if (isCourseQuestion(lower)) {
      return "SNK IT Institute-এ বিভিন্ন learning opportunity আছে। 🎓 তুমি চাইলে Free Classes, Paid Classes বা Recorded Classes থেকে শুরু করতে পারো।";
    }

    /* -------------------------------------------------------
       LIVE CLASS
       ------------------------------------------------------- */

    if (isLiveClassQuestion(lower)) {
      return "Live Class-এ অংশ নিতে Join Live অপশন ব্যবহার করো। 💻📚 ক্লাস Zoom-এর মাধ্যমে হতে পারে।";
    }

    /* -------------------------------------------------------
       RECORDED
       ------------------------------------------------------- */

    if (isRecordedQuestion(lower)) {
      return "Recorded Classes-এর জন্য Recorded section অথবা available YouTube playlist দেখতে পারো। 🎥 চাইলে আমি তোমাকে কীভাবে শুরু করবে সেটাও বুঝিয়ে দিতে পারি।";
    }

    /* -------------------------------------------------------
       CODING
       ------------------------------------------------------- */

    if (isCodingQuestion(lower)) {
      return "Coding শিখতে হলে HTML → CSS → JavaScript এইভাবে শুরু করতে পারো। 💻✨ চাইলে আমি beginner level থেকে step-by-step শেখাতে পারি।";
    }

    /* -------------------------------------------------------
       SUPPORT
       ------------------------------------------------------- */

    if (isSupportQuestion(lower)) {
      return "সাহায্যের জন্য SNK IT Institute-এর Support option ব্যবহার করতে পারো। 💬 প্রয়োজন হলে WhatsApp support-এ যোগাযোগ করাও যেতে পারে।";
    }

    /* -------------------------------------------------------
       THANK YOU
       ------------------------------------------------------- */

    if (isThanks(lower)) {
      return "You're welcome! 😊❤️ যখনই প্রয়োজন হবে, USHA তোমার পাশে আছে।";
    }

    /* -------------------------------------------------------
       GOODBYE
       ------------------------------------------------------- */

    if (isGoodbye(lower)) {
      return "ঠিক আছে 😊 আবার এসো। তোমার learning journey-এর জন্য অনেক শুভকামনা! 💛";
    }

    /* -------------------------------------------------------
       DEFAULT SMART RESPONSE
       ------------------------------------------------------- */

    const defaultReplies = [
      "Interesting! 😊 একটু বিস্তারিত বলো, তাহলে আমি ভালোভাবে সাহায্য করতে পারব।",
      "বুঝতে পারছি। 💛 তুমি চাইলে বিষয়টা সহজ করে step-by-step আলোচনা করতে পারি।",
      "অবশ্যই! 😊 তোমার প্রশ্নটা আরেকটু বিস্তারিত লিখলে আমি আরও নির্দিষ্টভাবে উত্তর দিতে পারব।",
      "আমি তোমাকে learning, coding, website এবং course-related বিষয়ে সাহায্য করতে পারি। 🚀"
    ];

    const randomIndex = Math.floor(
      Math.random() * defaultReplies.length
    );

    return defaultReplies[randomIndex];
  }

  /* =========================================================
     SEND MESSAGE
     ========================================================= */

  window.sendMessage = function () {
    if (!input) return;

    const text = input.value.trim();

    if (!text) return;

    /*
     * User message
     */
    addMessage(text, "user", true);

    /*
     * Clear input
     */
    input.value = "";

    /*
     * Show typing
     */
    showTyping();

    /*
     * Small AI-style delay
     */
    const delay =
      Math.floor(Math.random() * 700) + 700;

    setTimeout(function () {
      removeTyping();

      const reply = getUshaReply(text);

      addMessage(reply, "usha", true);
    }, delay);
  };

  /* =========================================================
     ASK USHA
     * Used by suggestion buttons
     * ========================================================= */

  window.askUsha = function (question) {
    if (!input) return;

    input.value = question;

    openUsha();

    setTimeout(function () {
      sendMessage();
    }, 150);
  };

  /* =========================================================
     ENTER KEY
     ========================================================= */

  function handleInputKeydown(event) {
    if (!event) return;

    /*
     * Enter = Send
     * Shift + Enter = New line
     */

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      sendMessage();
    }
  }

  /* =========================================================
     SUGGESTION BUTTONS
     ========================================================= */

  function setupSuggestions() {
    if (!suggestionContainer) return;

    const buttons =
      suggestionContainer.querySelectorAll(
        "button, [data-question]"
      );

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const question =
          button.getAttribute("data-question") ||
          button.textContent.trim();

        if (question) {
          askUsha(question);
        }
      });
    });
  }

  /* =========================================================
     FLOATING BUTTON
     ========================================================= */

  function setupFloatingButton() {
    if (!ushaButton) return;

    ushaButton.addEventListener("click", function () {
      toggleUsha();
    });
  }

  /* =========================================================
     CLOSE BUTTON
     ========================================================= */

  function setupCloseButton() {
    if (!closeButton) return;

    closeButton.addEventListener("click", function () {
      closeUsha();
    });
  }

  /* =========================================================
     CLEAR BUTTON
     ========================================================= */

  function setupClearButton() {
    if (!clearButton) return;

    clearButton.addEventListener("click", function () {
      clearUshaChat();
    });
  }

  /* =========================================================
     SEND BUTTON
     ========================================================= */

  function setupSendButton() {
    if (!sendButton) return;

    sendButton.addEventListener("click", function () {
      sendMessage();
    });
  }

  /* =========================================================
     INPUT
     ========================================================= */

  function setupInput() {
    if (!input) return;

    input.addEventListener(
      "keydown",
      handleInputKeydown
    );
  }

  /* =========================================================
     ESC KEY
     ========================================================= */

  function setupEscapeKey() {
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeUsha();
      }
    });
  }

  /* =========================================================
     PREVENT CHAT CLICK FROM CLOSING
     ========================================================= */

  if (ushaPanel) {
    ushaPanel.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }

  /* =========================================================
     INITIALIZE
     ========================================================= */

  function initUsha() {
    setupFloatingButton();
    setupCloseButton();
    setupClearButton();
    setupSendButton();
    setupInput();
    setupSuggestions();
    setupEscapeKey();

    loadChat();

    console.log("USHA AI Mentor initialized successfully.");
  }

  /* =========================================================
     DOM READY
     ========================================================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initUsha
    );
  } else {
    initUsha();
  }

})();
