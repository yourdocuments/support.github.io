/* =========================================================
   USHA.AI
   SNK IT INSTITUTE
   Full Smart Chat JS
   Proper Desktop + Mobile Auto Scrolling
   ========================================================= */


/* =========================================================
   CONFIG
   ========================================================= */

const STORAGE_KEY = "snkUshaChatHistory";


/* =========================================================
   REAL SNK LINKS
   ========================================================= */

const ACTIONS = {

  freeCourse: {
    label: "🎓 Open Free Course",
    url: "https://www.youtube.com/playlist?list=PLJe-RU9VQd38"
  },

  paidCourse: {
    label: "💳 Open Paid Course",
    url: "https://www.youtube.com/playlist?list=PLfz6zuYhx-uU"
  },

  live: {
    label: "🔴 Join Live Class",
    url: "https://us05web.zoom.us/j/84311190995?pwd=d0j0VRyKL6Zxg5qN6rIaxAJb9Dk8rf.1"
  },

  recorded: {
    label: "🎥 Open Recorded Playlist",
    url: "https://www.youtube.com/playlist?list=PLJe-RU9VQd38"
  },

  support: {
    label: "💬 WhatsApp Support",
    url: "https://wa.me/8801636363801"
  },

  facebook: {
    label: "📘 Facebook",
    url: "https://www.facebook.com/snkitinstitute"
  },

  youtube: {
    label: "▶️ YouTube",
    url: "https://www.youtube.com/@snkguideup"
  },

  whatsappChannel: {
    label: "📣 WhatsApp Channel",
    url: "https://whatsapp.com/channel/0029VbD6LlH6RGJJ1QsBN93x"
  },

  shoppingMela: {
    label: "🛍️ Shopping Mela",
    url: "https://yourdocuments.github.io/shopingmela/"
  }

};


/* =========================================================
   DOM
   ========================================================= */

const messagesBox =
  document.getElementById("ushaMessages");

const input =
  document.getElementById("ushaInput");

const sendButton =
  document.getElementById("ushaSend");

const suggestionsBox =
  document.getElementById("ushaSuggestions");

const welcomeBox =
  document.getElementById("ushaWelcome");


/* =========================================================
   NORMALIZE TEXT
   ========================================================= */

function normalizeText(text) {

  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* =========================================================
   IMPORTANT SCROLL FUNCTION
   =========================================================
   This function keeps the chat at the latest message.
   Multiple animation frames are used because:
   - message DOM is rendered
   - typing indicator may change height
   - mobile browser may calculate height slightly later
   ========================================================= */

function scrollChatToBottom(force = true) {

  if (!messagesBox) {
    return;
  }

  const doScroll = () => {

    messagesBox.scrollTop =
      messagesBox.scrollHeight;

    if (force) {

      messagesBox.scrollTo({
        top: messagesBox.scrollHeight,
        behavior: "smooth"
      });

    }

  };


  requestAnimationFrame(() => {

    doScroll();

    requestAnimationFrame(() => {

      doScroll();

      setTimeout(() => {
        doScroll();
      }, 80);

      setTimeout(() => {
        doScroll();
      }, 250);

    });

  });

}


/* =========================================================
   SCROLL ALIAS
   ========================================================= */

function scrollMessages() {

  scrollChatToBottom(true);

}


/* =========================================================
   HIDE WELCOME
   ========================================================= */

function hideWelcome() {

  if (welcomeBox) {

    welcomeBox.style.display = "none";

  }

  if (suggestionsBox) {

    suggestionsBox.style.display = "none";

  }

}


/* =========================================================
   SHOW WELCOME
   ========================================================= */

function showWelcome() {

  if (welcomeBox) {

    welcomeBox.style.display = "";

  }

  if (suggestionsBox) {

    suggestionsBox.style.display = "";

  }

}


/* =========================================================
   CREATE ACTION BUTTONS
   ========================================================= */

function createActions(actions = []) {

  if (!actions || !actions.length) {

    return "";

  }


  let html = `
    <div class="usha-actions">
  `;


  actions.forEach(actionKey => {

    const action = ACTIONS[actionKey];

    if (!action) {
      return;
    }


    html += `
      <a
        class="usha-action-btn"
        href="${action.url}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${action.label}
      </a>
    `;

  });


  html += `
    </div>
  `;


  return html;

}


/* =========================================================
   ADD MESSAGE
   ========================================================= */

function addMessage(
  text,
  sender = "assistant",
  save = true,
  actions = []
) {

  if (!messagesBox) {
    return;
  }


  hideWelcome();


  const row =
    document.createElement("div");


  row.className =
    `usha-message ${sender}`;


  const bubble =
    document.createElement("div");


  bubble.className =
    "usha-bubble";


  bubble.innerHTML =
    escapeHTML(text);


  row.appendChild(bubble);


  messagesBox.appendChild(row);


  /* Add action buttons only for assistant */
  if (
    sender === "assistant" &&
    actions &&
    actions.length
  ) {

    const actionHTML =
      createActions(actions);

    bubble.insertAdjacentHTML(
      "beforeend",
      actionHTML
    );

  }


  if (save) {

    saveMessage({
      sender: sender,
      text: text
    });

  }


  /*
    IMPORTANT:
    Wait until the bubble has entered DOM,
    then scroll.
  */

  scrollChatToBottom(true);


  return row;

}


/* =========================================================
   SAVE MESSAGE
   ========================================================= */

function saveMessage(message) {

  try {

    const history =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );


    history.push({
      sender: message.sender,
      text: message.text,
      time: Date.now()
    });


    /*
      Keep latest 100 messages.
    */

    const limitedHistory =
      history.slice(-100);


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(limitedHistory)
    );

  } catch (error) {

    console.warn(
      "USHA history save error:",
      error
    );

  }

}


/* =========================================================
   LOAD CHAT
   ========================================================= */

function loadChat() {

  if (!messagesBox) {
    return;
  }


  let history = [];


  try {

    history =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

  } catch (error) {

    history = [];

  }


  if (!Array.isArray(history) || history.length === 0) {

    showWelcome();

    return;

  }


  hideWelcome();


  history.forEach(item => {

    addMessage(
      item.text,
      item.sender,
      false
    );

  });


  /*
    After all history is rendered,
    go to bottom.
  */

  setTimeout(() => {

    scrollChatToBottom(false);

  }, 100);

}


/* =========================================================
   CLEAR CHAT
   ========================================================= */

function clearChat() {

  localStorage.removeItem(STORAGE_KEY);


  if (messagesBox) {

    messagesBox.innerHTML = "";

  }


  showWelcome();


  /*
    Small welcome message is optional.
  */

}


/* =========================================================
   CLEAR CHAT ALIAS
   ========================================================= */

function clearUshaChat() {

  clearChat();

}


/* =========================================================
   TYPING INDICATOR
   ========================================================= */

function showTyping() {

  if (!messagesBox) {
    return;
  }


  removeTyping();


  const row =
    document.createElement("div");


  row.className =
    "usha-message assistant";


  row.id =
    "ushaTypingMessage";


  row.innerHTML = `
    <div class="usha-typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;


  messagesBox.appendChild(row);


  scrollChatToBottom(true);

}


/* =========================================================
   REMOVE TYPING
   ========================================================= */

function removeTyping() {

  const typing =
    document.getElementById(
      "ushaTypingMessage"
    );


  if (typing) {

    typing.remove();

  }

}


/* =========================================================
   INTENT HELPERS
   ========================================================= */


/* ---------- SNK ---------- */

function isSNKQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("shah neil khan") ||
    lower.includes("shah neil") ||
    lower.includes("শাহ নীল খান") ||
    lower.includes("শাহ নীল") ||

    lower.includes("snk কে") ||
    lower.includes("snk কি") ||
    lower.includes("snk সম্পর্কে") ||
    lower.includes("snk সম্বন্ধে") ||
    lower.includes("who is snk") ||
    lower.includes("about snk")
  );

}


/* ---------- SNK PERSONAL ---------- */

function isSNKPersonalQuestion(text) {

  const lower =
    normalizeText(text);


  const snkMention =
    lower.includes("shah neil khan") ||
    lower.includes("shah neil") ||
    lower.includes("শাহ নীল খান") ||
    lower.includes("শাহ নীল") ||
    lower.includes("snk");


  const personalWords =
    lower.includes("তোমার") ||
    lower.includes("তোমার কি") ||
    lower.includes("পছন্দ") ||
    lower.includes("ভালো লাগে") ||
    lower.includes("your") ||
    lower.includes("like") ||
    lower.includes("favorite") ||
    lower.includes("favourite");


  return (
    snkMention &&
    personalWords
  );

}


/* ---------- USHA ---------- */

function isUshaQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("তুমি কে") ||
    lower.includes("তোমার নাম") ||
    lower.includes("usha কে") ||
    lower.includes("usha কি") ||
    lower.includes("who are you") ||
    lower.includes("what are you") ||
    lower.includes("your name") ||
    lower === "usha" ||
    lower === "usha?"
  );

}


/* ---------- GREETING ---------- */

function isGreeting(text) {

  const lower =
    normalizeText(text);


  return (
    lower === "hi" ||
    lower === "hello" ||
    lower === "hey" ||
    lower.includes("হাই") ||
    lower.includes("হ্যালো") ||
    lower.includes("আসসালামু আলাইকুম") ||
    lower.includes("assalamualaikum") ||
    lower.includes("good morning") ||
    lower.includes("good evening")
  );

}


/* ---------- LEARNING ---------- */

function isLearningQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("কি শিখ") ||
    lower.includes("কী শিখ") ||
    lower.includes("কি শিখতে") ||
    lower.includes("কী শিখতে") ||
    lower.includes("শেখা শুরু") ||
    lower.includes("কোথা থেকে শুরু") ||
    lower.includes("what should i learn") ||
    lower.includes("what can i learn") ||
    lower.includes("learn")
  );

}


/* ---------- COURSE ---------- */

function isCourseQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("course") ||
    lower.includes("কোর্স") ||
    lower.includes("কোর্স সম্পর্কে") ||
    lower.includes("free course") ||
    lower.includes("ফ্রি কোর্স") ||
    lower.includes("paid course") ||
    lower.includes("পেইড কোর্স") ||
    lower.includes("পেইড ক্লাস") ||
    lower.includes("ফ্রি ক্লাস")
  );

}


/* ---------- FREE COURSE ---------- */

function isFreeCourseQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("free") ||
    lower.includes("ফ্রি") ||
    lower.includes("বিনা খরচ") ||
    lower.includes("ফ্রি কোর্স") ||
    lower.includes("free course")
  );

}


/* ---------- PAID COURSE ---------- */

function isPaidCourseQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("paid") ||
    lower.includes("পেইড") ||
    lower.includes("paid course") ||
    lower.includes("পেইড কোর্স") ||
    lower.includes("টাকার কোর্স") ||
    lower.includes("payment course")
  );

}


/* ---------- LIVE ---------- */

function isLiveQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("live") ||
    lower.includes("লাইভ") ||
    lower.includes("zoom") ||
    lower.includes("জুম") ||
    lower.includes("live class") ||
    lower.includes("লাইভ ক্লাস") ||
    lower.includes("join live")
  );

}


/* ---------- RECORDED ---------- */

function isRecordedQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("recorded") ||
    lower.includes("রেকর্ডেড") ||
    lower.includes("recording") ||
    lower.includes("রেকর্ডিং") ||
    lower.includes("ভিডিও ক্লাস")
  );

}


/* ---------- CODING ---------- */

function isCodingQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("html") ||
    lower.includes("css") ||
    lower.includes("javascript") ||
    lower.includes("js") ||
    lower.includes("coding") ||
    lower.includes("code") ||
    lower.includes("কোডিং") ||
    lower.includes("কোড")
  );

}


/* ---------- SUPPORT ---------- */

function isSupportQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("support") ||
    lower.includes("সাপোর্ট") ||
    lower.includes("help") ||
    lower.includes("হেল্প") ||
    lower.includes("যোগাযোগ") ||
    lower.includes("contact") ||
    lower.includes("whatsapp")
  );

}


/* ---------- SOCIAL ---------- */

function isSocialQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("facebook") ||
    lower.includes("ফেসবুক") ||
    lower.includes("youtube") ||
    lower.includes("ইউটিউব") ||
    lower.includes("whatsapp channel") ||
    lower.includes("সোশ্যাল") ||
    lower.includes("social")
  );

}


/* ---------- SHOPPING MELA ---------- */

function isShoppingMelaQuestion(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("shopping mela") ||
    lower.includes("shoppingmela") ||
    lower.includes("শপিং মেলা") ||
    lower.includes("shoping mela") ||
    lower.includes("shopingmela")
  );

}


/* ---------- THANKS ---------- */

function isThanks(text) {

  const lower =
    normalizeText(text);


  return (
    lower.includes("thank") ||
    lower.includes("thanks") ||
    lower.includes("ধন্যবাদ") ||
    lower.includes("অনেক ধন্যবাদ")
  );

}


/* ---------- GOODBYE ---------- */

function isGoodbye(text) {

  const lower =
    normalizeText(text);


  return (
    lower === "bye" ||
    lower.includes("goodbye") ||
    lower.includes("বিদায়") ||
    lower.includes("আবার কথা হবে")
  );

}


/* =========================================================
   RANDOM REPLY
   ========================================================= */

function randomReply(list) {

  return list[
    Math.floor(
      Math.random() * list.length
    )
  ];

}


/* =========================================================
   RESPONSE BUILDER
   ========================================================= */

function makeResponse(
  text,
  actions = []
) {

  return {
    text: text,
    actions: actions
  };

}


/* =========================================================
   SMART USHA RESPONSE
   ========================================================= */

function getUshaReply(userText) {

  const text =
    normalizeText(userText);


  /* =======================================================
     1. PERSONAL SNK QUESTION
     ======================================================= */

  if (isSNKPersonalQuestion(text)) {

    return makeResponse(
      "Shah Neil Khan? 😊\nসে আমার খুব পছন্দের একজন। ❤️\nআর SNK আমার কাছে খুবই special!",
      ["facebook"]
    );

  }


  /* =======================================================
     2. SNK QUESTION
     ======================================================= */

  if (isSNKQuestion(text)) {

    return makeResponse(
      "Shah Neil Khan? 😊\nতিনি SNK-এর সঙ্গে যুক্ত একজন গুরুত্বপূর্ণ ব্যক্তি।\nআর SNK আমার কাছে খুবই special! ❤️",
      ["facebook", "youtube"]
    );

  }


  /* =======================================================
     3. USHA
     ======================================================= */

  if (isUshaQuestion(text)) {

    return makeResponse(
      "আমি USHA — SNK IT Institute-এর AI Learning Mentor। 🤖✨\n\nতুমি আমাকে learning, coding, course, live class, recorded class অথবা SNK সম্পর্কে প্রশ্ন করতে পারো। ❤️"
    );

  }


  /* =======================================================
     4. GREETING
     ======================================================= */

  if (isGreeting(text)) {

    return makeResponse(
      randomReply([
        "হ্যালো! 👋 আমি USHA। আজ কী শিখতে চাও?",
        "হাই! 😊 আমি USHA। তোমার learning journey-তে আমি আছি।",
        "আসসালামু আলাইকুম! 🌸 আমি USHA। কীভাবে সাহায্য করতে পারি?"
      ]),
      [
        "freeCourse",
        "live"
      ]
    );

  }


  /* =======================================================
     5. FREE COURSE
     ======================================================= */

  if (isFreeCourseQuestion(text)) {

    return makeResponse(
      "অবশ্যই! 🎓 SNK-এর Free Learning playlist থেকে তুমি নিজের সময় অনুযায়ী শেখা শুরু করতে পারো।",
      [
        "freeCourse"
      ]
    );

  }


  /* =======================================================
     6. PAID COURSE
     ======================================================= */

  if (isPaidCourseQuestion(text)) {

    return makeResponse(
      "Paid course-এর জন্য SNK-এর structured learning content দেখতে পারো। 💳",
      [
        "paidCourse"
      ]
    );

  }


  /* =======================================================
     7. GENERAL COURSE
     ======================================================= */

  if (isCourseQuestion(text)) {

    return makeResponse(
      "SNK-তে তুমি Free এবং Paid — দুই ধরনের learning content দেখতে পারো। 🎓\n\nতুমি চাইলে Free Course দিয়ে শুরু করতে পারো, অথবা Paid Course দেখতে পারো।",
      [
        "freeCourse",
        "paidCourse"
      ]
    );

  }


  /* =======================================================
     8. LIVE CLASS
     ======================================================= */

  if (isLiveQuestion(text)) {

    return makeResponse(
      "Live class-এ যোগ দিতে Zoom ব্যবহার করো। 🔴\n\nনিচের button থেকে সরাসরি Join Live Class করতে পারবে।",
      [
        "live"
      ]
    );

  }


  /* =======================================================
     9. RECORDED
     ======================================================= */

  if (isRecordedQuestion(text)) {

    return makeResponse(
      "Recorded learning content দেখতে নিচের playlist-এ যেতে পারো। 🎥",
      [
        "recorded"
      ]
    );

  }


  /* =======================================================
     10. CODING
     ======================================================= */

  if (isCodingQuestion(text)) {

    return makeResponse(
      "Coding শিখতে চাইলে HTML → CSS → JavaScript এইভাবে শুরু করা ভালো। 💻\n\nপ্রথমে HTML দিয়ে webpage structure তৈরি শেখো। তারপর CSS দিয়ে design এবং JavaScript দিয়ে interaction শেখো।\n\nচাইলে Free Learning দিয়ে শুরু করতে পারো।",
      [
        "freeCourse"
      ]
    );

  }


  /* =======================================================
     11. LEARNING
     ======================================================= */

  if (isLearningQuestion(text)) {

    return makeResponse(
      "তুমি কয়েকটি direction থেকে শুরু করতে পারো। 🎓\n\n💻 Web Development\n🎨 HTML & CSS\n⚡ JavaScript\n🤖 AI & Technology\n📚 Practical Projects\n\nতুমি একদম beginner হলে HTML দিয়ে শুরু করা সহজ।",
      [
        "freeCourse"
      ]
    );

  }


  /* =======================================================
     12. SUPPORT
     ======================================================= */

  if (isSupportQuestion(text)) {

    return makeResponse(
      "অবশ্যই। 💬 SNK Support Team-এর সঙ্গে WhatsApp-এ যোগাযোগ করতে পারো।",
      [
        "support"
      ]
    );

  }


  /* =======================================================
     13. SOCIAL
     ======================================================= */

  if (isSocialQuestion(text)) {

    return makeResponse(
      "SNK-এর social platforms থেকে update, learning content এবং announcements পেতে পারো। 📱",
      [
        "facebook",
        "youtube",
        "whatsappChannel"
      ]
    );

  }


  /* =======================================================
     14. SHOPPING MELA
     ======================================================= */

  if (isShoppingMelaQuestion(text)) {

    return makeResponse(
      "Shopping Mela হলো local brands এবং businesses-এর জন্য একটি online marketplace ও promotion platform। 🛍️",
      [
        "shoppingMela"
      ]
    );

  }


  /* =======================================================
     15. THANKS
     ======================================================= */

  if (isThanks(text)) {

    return makeResponse(
      randomReply([
        "You're welcome! 😊❤️",
        "অবশ্যই! আমি আছি। ✨",
        "Welcome! 🌸 আবার কিছু জানতে চাইলে আমাকে জিজ্ঞেস করো।"
      ])
    );

  }


  /* =======================================================
     16. GOODBYE
     ======================================================= */

  if (isGoodbye(text)) {

    return makeResponse(
      "ঠিক আছে। 😊 আবার দেখা হবে। তোমার learning journey-এর জন্য শুভকামনা! ❤️"
    );

  }


  /* =======================================================
     17. DEFAULT
     ======================================================= */

  return makeResponse(
    "আমি বুঝতে চেষ্টা করছি। 😊\n\nতুমি আমাকে Free Course, Paid Course, Live Class, Recorded Class, Coding, HTML, Support অথবা SNK সম্পর্কে প্রশ্ন করতে পারো।",
    [
      "freeCourse",
      "live"
    ]
  );

}


/* =========================================================
   SEND MESSAGE
   ========================================================= */

async function sendMessage() {

  if (!input) {
    return;
  }


  const text =
    input.value.trim();


  if (!text) {
    return;
  }


  /*
    Prevent double send.
  */

  if (
    sendButton &&
    sendButton.disabled
  ) {
    return;
  }


  /* Clear input immediately */

  input.value = "";

  autoResizeTextarea();


  /* Add user message */

  addMessage(
    text,
    "user",
    true
  );


  /* Disable button */

  if (sendButton) {

    sendButton.disabled = true;

  }


  /* Show typing */

  showTyping();


  /*
    Small realistic thinking delay.
  */

  await new Promise(resolve => {

    setTimeout(
      resolve,
      550
    );

  });


  /* Remove typing */

  removeTyping();


  /* Generate response */

  const response =
    getUshaReply(text);


  /* Add USHA response */

  addMessage(
    response.text,
    "assistant",
    true,
    response.actions
  );


  /* Re-enable */

  if (sendButton) {

    sendButton.disabled = false;

  }


  /* Focus input */

  input.focus();


  /* Final guaranteed scroll */

  scrollChatToBottom(true);

}


/* =========================================================
   ASK USHA
   ========================================================= */

function askUsha(text) {

  if (!input) {
    return;
  }


  input.value =
    text || "";


  autoResizeTextarea();


  input.focus();


  if (input.value.trim()) {

    sendMessage();

  }

}


/* =========================================================
   OPEN USHA
   ========================================================= */

function openUsha() {

  /*
    If using usha.html as a standalone page,
    browser is already on the page.
  */

  if (input) {

    input.focus();

  }


  scrollChatToBottom(false);

}


/* =========================================================
   CLOSE USHA
   ========================================================= */

function closeUsha() {

  /*
    Reserved for future popup version.
  */

}


/* =========================================================
   TOGGLE USHA
   ========================================================= */

function toggleUsha() {

  /*
    Reserved for future popup version.
  */

}


/* =========================================================
   AUTO RESIZE TEXTAREA
   ========================================================= */

function autoResizeTextarea() {

  if (!input) {
    return;
  }


  input.style.height =
    "auto";


  const maxHeight =
    window.innerWidth <= 700
      ? 110
      : 150;


  input.style.height =
    Math.min(
      input.scrollHeight,
      maxHeight
    ) + "px";

}


/* =========================================================
   SUPPORT TOAST
   ========================================================= */

function showSupportMessage() {

  /*
    If support button already exists,
    show a small confirmation.
  */

  let toast =
    document.querySelector(
      ".usha-toast"
    );


  if (!toast) {

    toast =
      document.createElement("div");

    toast.className =
      "usha-toast";

    toast.textContent =
      "💬 Support: WhatsApp থেকে SNK Team-এর সাথে যোগাযোগ করুন।";

    document.body.appendChild(toast);

  }


  toast.classList.add("show");


  setTimeout(() => {

    toast.classList.remove("show");

  }, 2800);

}


/* =========================================================
   SUGGESTION BUTTONS
   ========================================================= */

function setupSuggestions() {

  if (!suggestionsBox) {
    return;
  }


  const cards =
    suggestionsBox.querySelectorAll(
      ".suggestion-card"
    );


  cards.forEach(card => {

    card.addEventListener(
      "click",
      function() {

        const text =
          this.dataset.question ||
          this.getAttribute("data-question") ||
          this.textContent.trim();


        askUsha(text);

      }
    );

  });

}


/* =========================================================
   ENTER KEY
   ========================================================= */

function setupInput() {

  if (!input) {
    return;
  }


  input.addEventListener(
    "input",
    function() {

      autoResizeTextarea();

    }
  );


  input.addEventListener(
    "keydown",
    function(event) {

      /*
        Enter = send
        Shift + Enter = new line
      */

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendMessage();

      }

    }
  );

}


/* =========================================================
   SEND BUTTON
   ========================================================= */

function setupSendButton() {

  if (!sendButton) {
    return;
  }


  sendButton.addEventListener(
    "click",
    function() {

      sendMessage();

    }
  );

}


/* =========================================================
   CLEAR BUTTON
   ========================================================= */

function setupClearButton() {

  const clearButton =
    document.getElementById(
      "ushaClear"
    );


  if (!clearButton) {
    return;
  }


  clearButton.addEventListener(
    "click",
    function() {

      clearChat();

    }
  );

}


/* =========================================================
   SUPPORT BUTTON
   ========================================================= */

function setupSupportButton() {

  const supportButton =
    document.querySelector(
      ".usha-support"
    );


  if (!supportButton) {
    return;
  }


  supportButton.addEventListener(
    "click",
    function() {

      showSupportMessage();

    }
  );

}


/* =========================================================
   VISIBILITY / RESIZE
   ========================================================= */

window.addEventListener(
  "resize",
  function() {

    autoResizeTextarea();

    /*
      On mobile browser resize,
      keep latest message visible.
    */

    setTimeout(() => {

      scrollChatToBottom(false);

    }, 100);

  }
);


/* =========================================================
   MOBILE KEYBOARD FIX
   ========================================================= */

if (window.visualViewport) {

  window.visualViewport.addEventListener(
    "resize",
    function() {

      setTimeout(() => {

        scrollChatToBottom(false);

      }, 120);

    }
  );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initUsha() {

  loadChat();

  setupSuggestions();

  setupInput();

  setupSendButton();

  setupClearButton();

  setupSupportButton();

  autoResizeTextarea();


  /*
    Final scroll after browser has painted everything.
  */

  setTimeout(() => {

    scrollChatToBottom(false);

  }, 150);


  setTimeout(() => {

    scrollChatToBottom(false);

  }, 500);

}


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.sendMessage =
  sendMessage;

window.askUsha =
  askUsha;

window.clearUshaChat =
  clearUshaChat;

window.openUsha =
  openUsha;

window.closeUsha =
  closeUsha;

window.toggleUsha =
  toggleUsha;

window.showSupportMessage =
  showSupportMessage;


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initUsha
  );

} else {

  initUsha();

}
