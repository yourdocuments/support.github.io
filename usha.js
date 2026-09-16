/* =========================================================
   USHA AI — Step 4.4
   Smart AI Learning Mentor
   File: usha.js
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const STORAGE_KEY = "snkUshaChatHistory";
const PENDING_KEY = "ushaPendingQuestion";


const ACTIONS = {
  freeCourse: {
    label: "🎓 Free Course",
    url: "https://www.youtube.com/playlist?list=PLJe-RU9VQd38"
  },

  paidCourse: {
    label: "💎 Paid Course",
    url: "https://www.youtube.com/playlist?list=PLfz6zuYhx-uU"
  },

  liveClass: {
    label: "🔴 Live Class",
    url: "https://us05web.zoom.us/j/84311190995?pwd=d0j0VRyKL6Zxg5qN6rIaxAJb9Dk8rf.1"
  },

  recorded: {
    label: "📚 Recorded Classes",
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
    label: "📢 WhatsApp Channel",
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

let messagesBox;
let input;
let sendButton;
let suggestions;
let welcome;
let clearButton;
let toast;


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  messagesBox =
    document.getElementById("ushaMessages");

  input =
    document.getElementById("ushaInput");

  sendButton =
    document.getElementById("ushaSend");

  suggestions =
    document.getElementById("ushaSuggestions");

  welcome =
    document.getElementById("ushaWelcome");

  clearButton =
    document.getElementById("ushaClear");

  toast =
    document.getElementById("ushaToast");


  setupEvents();

  loadChat();

  handlePendingQuestion();

  resizeInput();

});


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  if (sendButton) {

    sendButton.addEventListener(
      "click",
      sendMessage
    );

  }


  if (clearButton) {

    clearButton.addEventListener(
      "click",
      clearUshaChat
    );

  }


  if (input) {

    input.addEventListener(
      "input",
      resizeInput
    );


    input.addEventListener(
      "keydown",
      (event) => {

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


  if (suggestions) {

    suggestions
      .querySelectorAll(
        "[data-question]"
      )
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            const question =
              button.dataset.question ||
              button.textContent.trim();

            askUsha(question);

          }
        );

      });

  }


  window.addEventListener(
    "resize",
    () => {

      resizeInput();

      scrollChatToBottom(false);

    }
  );


  if (window.visualViewport) {

    window.visualViewport.addEventListener(
      "resize",
      () => {

        setTimeout(() => {

          scrollChatToBottom(false);

        }, 100);

      }
    );

  }

}


/* =========================================================
   HANDLE PENDING QUESTION
========================================================= */

function handlePendingQuestion() {

  const question =
    sessionStorage.getItem(
      PENDING_KEY
    );

  if (!question) {
    return;
  }


  sessionStorage.removeItem(
    PENDING_KEY
  );


  setTimeout(() => {

    askUsha(question);

  }, 300);

}


/* =========================================================
   TEXT NORMALIZE
========================================================= */

function normalizeText(text) {

  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(text) {

  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   CHAT SCROLL
========================================================= */

function scrollChatToBottom(smooth = true) {

  if (!messagesBox) {
    return;
  }


  const scroll = () => {

    messagesBox.scrollTop =
      messagesBox.scrollHeight;


    if (smooth) {

      try {

        messagesBox.scrollTo({
          top: messagesBox.scrollHeight,
          behavior: "smooth"
        });

      } catch (error) {}

    }

  };


  requestAnimationFrame(() => {

    scroll();

    requestAnimationFrame(() => {

      scroll();

      setTimeout(scroll, 80);

      setTimeout(scroll, 220);

      setTimeout(scroll, 450);

    });

  });

}


/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(
  type,
  text,
  actionKeys = []
) {

  if (!messagesBox) {
    return;
  }


  const row =
    document.createElement("div");

  row.className =
    "usha-message " + type;


  const bubble =
    document.createElement("div");

  bubble.className =
    "usha-bubble";


  bubble.innerHTML =
    escapeHTML(text);


  if (
    type === "assistant" &&
    actionKeys.length
  ) {

    const actions =
      document.createElement("div");

    actions.className =
      "usha-actions";


    actionKeys.forEach((key) => {

      const action =
        ACTIONS[key];

      if (!action) {
        return;
      }


      const button =
        document.createElement("button");

      button.type =
        "button";

      button.className =
        "usha-action-btn";

      button.textContent =
        action.label;


      button.addEventListener(
        "click",
        () => {

          window.open(
            action.url,
            "_blank",
            "noopener,noreferrer"
          );

        }
      );


      actions.appendChild(button);

    });


    bubble.appendChild(actions);

  }


  row.appendChild(bubble);

  messagesBox.appendChild(row);


  saveMessage(
    type,
    text
  );


  scrollChatToBottom(true);

}


/* =========================================================
   SAVE CHAT
========================================================= */

function saveMessage(type, text) {

  try {

    const history =
      JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        ) || "[]"
      );


    history.push({
      type,
      text,
      time: Date.now()
    });


    if (history.length > 100) {

      history.splice(
        0,
        history.length - 100
      );

    }


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(history)
    );

  } catch (error) {

    console.warn(
      "USHA history save failed:",
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
        localStorage.getItem(
          STORAGE_KEY
        ) || "[]"
      );

  } catch (error) {

    history = [];

  }


  if (!history.length) {

    return;

  }


  if (welcome) {

    welcome.classList.add(
      "usha-hidden"
    );

  }


  if (suggestions) {

    suggestions.classList.add(
      "usha-hidden"
    );

  }


  history.forEach((item) => {

    const row =
      document.createElement("div");

    row.className =
      "usha-message " +
      (item.type === "user"
        ? "user"
        : "assistant");


    const bubble =
      document.createElement("div");

    bubble.className =
      "usha-bubble";

    bubble.textContent =
      item.text;


    row.appendChild(
      bubble
    );


    messagesBox.appendChild(
      row
    );

  });


  scrollChatToBottom(false);

}


/* =========================================================
   CLEAR CHAT
========================================================= */

function clearUshaChat() {

  localStorage.removeItem(
    STORAGE_KEY
  );


  if (messagesBox) {

    messagesBox.innerHTML = "";

  }


  if (welcome) {

    welcome.classList.remove(
      "usha-hidden"
    );

  }


  if (suggestions) {

    suggestions.classList.remove(
      "usha-hidden"
    );

  }


  showToast(
    "Chat cleared successfully."
  );

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


  const typing =
    document.createElement("div");

  typing.className =
    "usha-typing";


  typing.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;


  row.appendChild(
    typing
  );


  messagesBox.appendChild(
    row
  );


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

function containsAny(
  text,
  words
) {

  return words.some(
    (word) =>
      text.includes(
        normalizeText(word)
      )
  );

}


function isGreeting(text) {

  return containsAny(
    text,
    [
      "hi",
      "hello",
      "hey",
      "হাই",
      "হ্যালো",
      "আসসালামু আলাইকুম",
      "assalamu alaikum"
    ]
  );

}


function isThanks(text) {

  return containsAny(
    text,
    [
      "thanks",
      "thank you",
      "ধন্যবাদ",
      "থ্যাংকস"
    ]
  );

}


function isGoodbye(text) {

  return containsAny(
    text,
    [
      "bye",
      "goodbye",
      "বিদায়",
      "আবার কথা হবে"
    ]
  );

}


function isUshaQuestion(text) {

  return containsAny(
    text,
    [
      "তুমি কে",
      "তোমার নাম",
      "usha কে",
      "usha কী",
      "usha কি",
      "who are you",
      "your name"
    ]
  );

}


function isSNKQuestion(text) {

  return containsAny(
    text,
    [
      "snk কে",
      "snk কী",
      "snk কি",
      "snk institute",
      "snk it institute",
      "শাহ নীল খান",
      "shah neil khan"
    ]
  );

}


function isCourseQuestion(text) {

  return containsAny(
    text,
    [
      "course",
      "কোর্স",
      "শিখতে",
      "শেখা",
      "learning",
      "learn"
    ]
  );

}


function isFreeCourseQuestion(text) {

  return containsAny(
    text,
    [
      "free course",
      "ফ্রি কোর্স",
      "ফ্রি ক্লাস",
      "free class",
      "বিনামূল্যে"
    ]
  );

}


function isPaidCourseQuestion(text) {

  return containsAny(
    text,
    [
      "paid course",
      "পেইড কোর্স",
      "paid class",
      "পেইড ক্লাস"
    ]
  );

}


function isLiveQuestion(text) {

  return containsAny(
    text,
    [
      "live class",
      "লাইভ ক্লাস",
      "live",
      "zoom",
      "জুম"
    ]
  );

}


function isRecordedQuestion(text) {

  return containsAny(
    text,
    [
      "recorded",
      "recorded class",
      "রেকর্ডেড",
      "রেকর্ড ক্লাস"
    ]
  );

}


function isCodingQuestion(text) {

  return containsAny(
    text,
    [
      "coding",
      "কোডিং",
      "programming",
      "প্রোগ্রামিং",
      "developer",
      "ডেভেলপার"
    ]
  );

}


function isHTMLQuestion(text) {

  return containsAny(
    text,
    [
      "html",
      "এইচটিএমএল"
    ]
  );

}


function isCSSQuestion(text) {

  return containsAny(
    text,
    [
      "css",
      "সিএসএস"
    ]
  );

}


function isJSQuestion(text) {

  return containsAny(
    text,
    [
      "javascript",
      "java script",
      "জাভাস্ক্রিপ্ট",
      " js "
    ]
  );

}


function isGitHubQuestion(text) {

  return containsAny(
    text,
    [
      "github",
      "গিটহাব",
      "git hub",
      "repository",
      "repo"
    ]
  );

}


function isSupportQuestion(text) {

  return containsAny(
    text,
    [
      "support",
      "সাপোর্ট",
      "যোগাযোগ",
      "contact",
      "help",
      "সহায়তা"
    ]
  );

}


function isSocialQuestion(text) {

  return containsAny(
    text,
    [
      "facebook",
      "ফেসবুক",
      "youtube",
      "ইউটিউব",
      "whatsapp",
      "হোয়াটসঅ্যাপ"
    ]
  );

}


function isShoppingMelaQuestion(text) {

  return containsAny(
    text,
    [
      "shopping mela",
      "shoppingmela",
      "শপিং মেলা"
    ]
  );

}


/* =========================================================
   LEARNING ROADMAP
========================================================= */

function getLearningRoadmap() {

  return `
তুমি যদি একদম beginner হও, তাহলে আমি এই roadmap অনুসরণ করতে বলব:

1️⃣ HTML
ওয়েবসাইটের structure তৈরি করা।

2️⃣ CSS
ওয়েবসাইটকে সুন্দর ও responsive করা।

3️⃣ JavaScript
Button, form, interaction এবং dynamic features তৈরি করা।

4️⃣ Git & GitHub
নিজের project save ও publish করা।

5️⃣ Real Project
নিজের একটি complete website বানানো।

6️⃣ Advanced
API, database, authentication এবং AI integration শেখা।

💡 সবচেয়ে ভালো হবে একসাথে সব না শিখে step-by-step এগোনো।

তুমি চাইলে এখন থেকেই HTML দিয়ে শুরু করতে পারো।
`.trim();

}


/* =========================================================
   HTML ROADMAP
========================================================= */

function getHTMLResponse() {

  return `
HTML শেখার জন্য একদম basic থেকে শুরু করো। 🌐

HTML-এ প্রথমে এগুলো শিখবে:

1️⃣ HTML document structure
2️⃣ Heading
3️⃣ Paragraph
4️⃣ Link
5️⃣ Image
6️⃣ Button
7️⃣ Form
8️⃣ Table
9️⃣ Semantic elements
🔟 Website layout

এরপর CSS দিয়ে design এবং JavaScript দিয়ে interaction শেখা যাবে।

চাইলে আমি তোমাকে HTML শেখার step-by-step roadmap দিতে পারি।
`.trim();

}


/* =========================================================
   CSS RESPONSE
========================================================= */

function getCSSResponse() {

  return `
CSS হলো website design করার language। 🎨

CSS শেখার সময় এই order অনুসরণ করতে পারো:

1️⃣ Selectors
2️⃣ Colors
3️⃣ Fonts
4️⃣ Margin & Padding
5️⃣ Border
6️⃣ Box Model
7️⃣ Flexbox
8️⃣ Grid
9️⃣ Responsive Design
🔟 Animation

HTML জানা থাকলে CSS শেখা অনেক সহজ হবে। ❤️
`.trim();

}


/* =========================================================
   JAVASCRIPT RESPONSE
========================================================= */

function getJSResponse() {

  return `
JavaScript দিয়ে website-কে interactive করা যায়। 💻

JavaScript শেখার roadmap:

1️⃣ Variables
2️⃣ Data Types
3️⃣ Conditions
4️⃣ Functions
5️⃣ Arrays
6️⃣ Objects
7️⃣ Loops
8️⃣ DOM
9️⃣ Events
🔟 API
1️⃣1️⃣ LocalStorage
1️⃣2️⃣ Real Projects

HTML + CSS + JavaScript জানলে তুমি নিজের interactive website তৈরি করতে পারবে।
`.trim();

}


/* =========================================================
   GITHUB RESPONSE
========================================================= */

function getGitHubResponse() {

  return `
GitHub শেখার পর তুমি নিজের website/project online রাখতে পারবে। 🚀

Basic roadmap:

1️⃣ GitHub account
2️⃣ Repository তৈরি
3️⃣ Files upload
4️⃣ Commit
5️⃣ GitHub Pages
6️⃣ Custom domain
7️⃣ Project update

এরপর তুমি নিজের HTML/CSS/JS project GitHub Pages-এ publish করতে পারবে।
`.trim();

}


/* =========================================================
   SMART RESPONSE ENGINE
========================================================= */

function getUshaResponse(message) {

  const text =
    normalizeText(message);


  /* Greeting */

  if (isGreeting(text)) {

    return {
      text:
        "হ্যালো! 👋 আমি USHA — তোমার AI Learning Mentor। ❤️\n\nতুমি কী শিখতে চাও বলো। HTML, CSS, JavaScript, GitHub বা course নিয়ে আমি তোমাকে guide করতে পারি।",

      actions: [
        "freeCourse",
        "liveClass"
      ]
    };

  }


  /* USHA */

  if (isUshaQuestion(text)) {

    return {
      text:
        "আমি USHA 🤖 — SNK IT Institute-এর AI Learning Mentor।\n\nআমার কাজ হলো তোমাকে learning, coding, course এবং website development বিষয়ে step-by-step guide করা। ❤️",

      actions: [
        "freeCourse",
        "support"
      ]
    };

  }


  /* SNK */

  if (isSNKQuestion(text)) {

    return {
      text:
        "SNK IT Institute একটি learning platform যেখানে technology ও digital skills শেখার জন্য বিভিন্ন learning resource, live class এবং course পাওয়া যায়। 🎓\n\nতুমি চাইলে Free Course বা Live Class থেকে শুরু করতে পারো।",

      actions: [
        "freeCourse",
        "liveClass",
        "youtube"
      ]
    };

  }


  /* HTML */

  if (isHTMLQuestion(text)) {

    return {
      text:
        getHTMLResponse(),
      actions: [
        "freeCourse"
      ]
    };

  }


  /* CSS */

  if (isCSSQuestion(text)) {

    return {
      text:
        getCSSResponse(),
      actions: [
        "freeCourse"
      ]
    };

  }


  /* JavaScript */

  if (isJSQuestion(text)) {

    return {
      text:
        getJSResponse(),
      actions: [
        "freeCourse"
      ]
    };

  }


  /* GitHub */

  if (isGitHubQuestion(text)) {

    return {
      text:
        getGitHubResponse(),
      actions: [
        "freeCourse"
      ]
    };

  }


  /* Coding */

  if (isCodingQuestion(text)) {

    return {
      text:
        "দারুণ! 💻 Coding শেখার জন্য আগে HTML → CSS → JavaScript এই sequence অনুসরণ করতে পারো।\n\nএরপর GitHub এবং real project development শেখা ভালো হবে।\n\nআমি চাইলে তোমার জন্য beginner থেকে advanced পর্যন্ত coding roadmap তৈরি করে দিতে পারি।",

      actions: [
        "freeCourse"
      ]
    };

  }


  /* Learning roadmap */

  if (
    containsAny(
      text,
      [
        "roadmap",
        "রোডম্যাপ",
        "কোথা থেকে শুরু",
        "কীভাবে শুরু",
        "কিভাবে শুরু",
        "beginner",
        "শুরু করব"
      ]
    )
  ) {

    return {
      text:
        getLearningRoadmap(),
      actions: [
        "freeCourse"
      ]
    };

  }


  /* Free course */

  if (isFreeCourseQuestion(text)) {

    return {
      text:
        "অবশ্যই! 🎓 SNK-এর Free Course থেকে তুমি শেখা শুরু করতে পারো।\n\nতুমি যদি beginner হও, তাহলে নিয়মিত practice করার মাধ্যমে step-by-step এগিয়ে যাও।",

      actions: [
        "freeCourse"
      ]
    };

  }


  /* Paid course */

  if (isPaidCourseQuestion(text)) {

    return {
      text:
        "Paid Course সম্পর্কে বিস্তারিত দেখতে course section-এ যেতে পারো। 💎\n\nতোমার প্রয়োজন অনুযায়ী course নির্বাচন করে শেখা শুরু করতে পারো।",

      actions: [
        "paidCourse"
      ]
    };

  }


  /* Live */

  if (isLiveQuestion(text)) {

    return {
      text:
        "🔴 Live Class-এর জন্য Zoom link ব্যবহার করে join করতে পারো।\n\nClass শুরু হওয়ার সময় link-এ গিয়ে Join Meeting চাপবে।",

      actions: [
        "liveClass"
      ]
    };

  }


  /* Recorded */

  if (isRecordedQuestion(text)) {

    return {
      text:
        "📚 Recorded learning content-এর জন্য YouTube playlist ব্যবহার করতে পারো।\n\nতুমি নিজের সময় অনুযায়ী video দেখে practice করতে পারবে।",

      actions: [
        "recorded",
        "youtube"
      ]
    };

  }


  /* Support */

  if (isSupportQuestion(text)) {

    return {
      text:
        "💬 তোমার যদি কোনো সমস্যা থাকে, SNK Support Team-এর সঙ্গে WhatsApp-এ যোগাযোগ করতে পারো।",

      actions: [
        "support"
      ]
    };

  }


  /* Social */

  if (isSocialQuestion(text)) {

    return {
      text:
        "🌐 SNK-এর social platforms থেকে latest updates, learning content এবং announcements দেখতে পারো।",

      actions: [
        "facebook",
        "youtube",
        "whatsappChannel"
      ]
    };

  }


  /* Shopping Mela */

  if (isShoppingMelaQuestion(text)) {

    return {
      text:
        "🛍️ Shopping Mela হলো local brand ও business promotion-এর জন্য তৈরি একটি marketplace-style platform।\n\nতুমি চাইলে Shopping Mela দেখতে পারো।",

      actions: [
        "shoppingMela"
      ]
    };

  }


  /* Thanks */

  if (isThanks(text)) {

    return {
      text:
        "You're welcome! ❤️\n\nশেখার পথে যখনই সাহায্য দরকার হবে, আমাকে জিজ্ঞেস করতে পারো।",

      actions: []
    };

  }


  /* Goodbye */

  if (isGoodbye(text)) {

    return {
      text:
        "ঠিক আছে! 👋 আবার দেখা হবে।\n\nHappy Learning! 🚀",

      actions: []
    };

  }


  /* Default */

  return {
    text:
      `আমি তোমার প্রশ্নটি বুঝতে চেষ্টা করছি। 😊

তুমি চাইলে আমাকে সরাসরি এগুলোর যেকোনো একটি সম্পর্কে জিজ্ঞেস করতে পারো:

🎓 Free Course
💻 Coding
🌐 HTML
🎨 CSS
⚡ JavaScript
🚀 GitHub
🔴 Live Class
📚 Recorded Class
❤️ SNK
🤖 USHA

উদাহরণ:
"আমি HTML শিখতে চাই, কোথা থেকে শুরু করব?"`,

    actions: [
      "freeCourse"
    ]
  };

}


/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage() {

  if (!input) {
    return;
  }


  const message =
    input.value.trim();


  if (!message) {
    return;
  }


  if (sendButton) {

    sendButton.disabled = true;

  }


  if (welcome) {

    welcome.classList.add(
      "usha-hidden"
    );

  }


  if (suggestions) {

    suggestions.classList.add(
      "usha-hidden"
    );

  }


  addMessage(
    "user",
    message
  );


  input.value = "";

  resizeInput();


  showTyping();


  await wait(600);


  removeTyping();


  const response =
    getUshaResponse(message);


  addMessage(
    "assistant",
    response.text,
    response.actions
  );


  if (sendButton) {

    sendButton.disabled = false;

  }


  input.focus();


  scrollChatToBottom(true);

}


/* =========================================================
   ASK USHA
========================================================= */

function askUsha(question) {

  if (!input) {
    return;
  }


  input.value =
    question;


  resizeInput();


  sendMessage();

}


/* =========================================================
   WAIT
========================================================= */

function wait(ms) {

  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        ms
      );
    }
  );

}


/* =========================================================
   INPUT RESIZE
========================================================= */

function resizeInput() {

  if (!input) {
    return;
  }


  input.style.height =
    "auto";


  input.style.height =
    Math.min(
      input.scrollHeight,
      150
    ) + "px";

}


/* =========================================================
   SUPPORT TOAST
========================================================= */

function showSupportMessage() {

  showToast(
    "Support Team-এর সঙ্গে যোগাযোগ করতে নিচের button ব্যবহার করুন।"
  );


  setTimeout(() => {

    const action =
      ACTIONS.support;

    if (!action) {
      return;
    }


    window.open(
      action.url,
      "_blank",
      "noopener,noreferrer"
    );

  }, 700);

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  if (!toast) {
    return;
  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    window.__ushaToastTimer
  );


  window.__ushaToastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2500);

}


/* =========================================================
   OPTIONAL OPEN/CLOSE FUNCTIONS
========================================================= */

function openUsha() {

  window.location.href =
    "usha.html";

}


function closeUsha() {

  window.history.back();

}


function toggleUsha() {

  window.location.href =
    "usha.html";

}


/* =========================================================
   GLOBAL ACCESS
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
   READY
========================================================= */

console.log(
  "USHA AI Mentor — Step 4.4 loaded successfully."
);
