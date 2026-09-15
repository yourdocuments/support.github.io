/* =========================================================
   USHA AI — SNK IT INSTITUTE
   Complete JavaScript
   Step 3 — usha.js
   ========================================================= */

"use strict";

/* =========================================================
   USHA LINKS
========================================================= */

const USHA_LINKS = {
  snk: "https://snkitinstitute.github.io/",

  freeCourse: "https://snkguideup.github.io/",

  zoom:
    "https://us05web.zoom.us/j/84311190995?pwd=d0j0VRyKL6Zxg5qN6rIaxAJb9Dk8rf.1",

  whatsapp:
    "https://wa.me/8801636363801",

  freePlaylist:
    "https://www.youtube.com/playlist?list=PLJe-RU9VQd38",

  paidPlaylist:
    "https://www.youtube.com/playlist?list=PLfz6zuYhx-uU",

  facebook:
    "https://www.facebook.com/snkitinstitute",

  youtube:
    "https://www.youtube.com/@snkguideup",

  whatsappChannel:
    "https://whatsapp.com/channel/0029VbD6LlH6RGJJ1QsBN93x",

  shopping:
    "https://yourdocuments.github.io/shopingmela/",

  shoppingGroup:
    "https://www.facebook.com/groups/shopingnmela"
};


/* =========================================================
   STORAGE KEYS
========================================================= */

const CHAT_STORAGE_KEY =
  "ushaAIChatHistory_v2";

const RECENT_STORAGE_KEY =
  "ushaAIRecentQuestions_v2";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const chatOverlay =
  document.getElementById("chatOverlay");

const chatInput =
  document.getElementById("chatInput");

const mainQuestion =
  document.getElementById("mainQuestion");

const messages =
  document.getElementById("messages");

const typingIndicator =
  document.getElementById("typingIndicator");

const recentSection =
  document.getElementById("recentSection");

const recentList =
  document.getElementById("recentList");


/* =========================================================
   SAFE ELEMENT HELPER
========================================================= */

function getElement(id) {
  return document.getElementById(id);
}


/* =========================================================
   OPEN CHAT
========================================================= */

function openUshaChat(question = "") {

  if (!chatOverlay) {
    console.warn("USHA chat overlay not found.");
    return;
  }

  chatOverlay.classList.add("active");

  document.body.style.overflow = "hidden";

  setTimeout(() => {

    if (question && chatInput) {
      chatInput.value = question;
      chatInput.focus();
    } else if (chatInput) {
      chatInput.focus();
    }

  }, 100);

}


/* =========================================================
   CLOSE CHAT
========================================================= */

function closeUshaChat() {

  if (!chatOverlay) return;

  chatOverlay.classList.remove("active");

  document.body.style.overflow = "";

}


/* =========================================================
   CLEAR CHAT
========================================================= */

function clearUshaChat() {

  if (!messages) return;

  const confirmed =
    window.confirm(
      "Clear this USHA conversation?"
    );

  if (!confirmed) return;

  localStorage.removeItem(
    CHAT_STORAGE_KEY
  );

  messages.innerHTML = "";

  addMessage(
    "assistant",
    `
      <strong>Hi! I'm USHA 👋</strong><br><br>
      I'm the AI Learning Assistant from
      <strong>SNK IT Institute</strong>.<br><br>
      What would you like to learn today?
    `
  );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   FORMAT TEXT
========================================================= */

function formatText(text) {

  let safe =
    escapeHTML(text);

  safe =
    safe.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

  safe =
    safe.replace(
      /\n/g,
      "<br>"
    );

  return safe;

}


/* =========================================================
   CURRENT TIME
========================================================= */

function getCurrentTime() {

  return new Date().toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}


/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(
  role,
  text,
  save = true
) {

  if (!messages) return;

  const message =
    document.createElement("div");

  message.className =
    `message ${role === "user" ? "user" : "assistant"}`;

  const avatar =
    role === "user"
      ? ""
      : `
        <img
          class="message-avatar"
          src="https://github.com/yourdocuments/products/blob/main/ushaicon.svg?raw=true"
          alt="USHA"
        >
      `;

  message.innerHTML = `
    <div class="message-inner">

      ${avatar}

      <div>

        <div class="message-bubble">
          ${formatText(text)}
        </div>

        <div class="message-time">
          ${getCurrentTime()}
        </div>

      </div>

    </div>
  `;

  messages.appendChild(message);

  scrollMessagesToBottom();

  if (save) {
    saveChatMessage(role, text);
  }

}


/* =========================================================
   ADD HTML MESSAGE
========================================================= */

function addHTMLMessage(
  role,
  html,
  saveText = null
) {

  if (!messages) return;

  const message =
    document.createElement("div");

  message.className =
    `message ${role === "user" ? "user" : "assistant"}`;

  const avatar =
    role === "user"
      ? ""
      : `
        <img
          class="message-avatar"
          src="https://github.com/yourdocuments/products/blob/main/ushaicon.svg?raw=true"
          alt="USHA"
        >
      `;

  message.innerHTML = `
    <div class="message-inner">

      ${avatar}

      <div>

        <div class="message-bubble">
          ${html}
        </div>

        <div class="message-time">
          ${getCurrentTime()}
        </div>

      </div>

    </div>
  `;

  messages.appendChild(message);

  scrollMessagesToBottom();

  if (saveText) {
    saveChatMessage(
      role,
      saveText
    );
  }

}


/* =========================================================
   SCROLL CHAT
========================================================= */

function scrollMessagesToBottom() {

  if (!messages) return;

  setTimeout(() => {

    messages.scrollTop =
      messages.scrollHeight;

  }, 50);

}


/* =========================================================
   SAVE CHAT
========================================================= */

function saveChatMessage(
  role,
  text
) {

  try {

    const history =
      JSON.parse(
        localStorage.getItem(
          CHAT_STORAGE_KEY
        ) || "[]"
      );

    history.push({
      role,
      text,
      time: Date.now()
    });

    /*
      Keep the latest 100 messages only.
    */

    const limited =
      history.slice(-100);

    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(limited)
    );

  } catch (error) {

    console.warn(
      "USHA chat storage error:",
      error
    );

  }

}


/* =========================================================
   LOAD CHAT HISTORY
========================================================= */

function loadChatHistory() {

  if (!messages) return;

  try {

    const history =
      JSON.parse(
        localStorage.getItem(
          CHAT_STORAGE_KEY
        ) || "[]"
      );

    if (!Array.isArray(history)) {
      return;
    }

    /*
      If there is no history,
      show welcome message.
    */

    if (history.length === 0) {

      addMessage(
        "assistant",
        `
          <strong>Hi! I'm USHA 👋</strong><br><br>
          I'm the AI Learning Assistant from
          <strong>SNK IT Institute</strong>.<br><br>
          Ask me about HTML, CSS, JavaScript,
          computer basics, study plans, quizzes,
          courses, or live classes.
        `,
        false
      );

      return;
    }

    history.forEach(item => {

      if (!item || !item.role) {
        return;
      }

      addMessage(
        item.role,
        item.text,
        false
      );

    });

  } catch (error) {

    console.warn(
      "Could not load USHA history:",
      error
    );

    addMessage(
      "assistant",
      `
        <strong>Hi! I'm USHA 👋</strong><br><br>
        What would you like to learn today?
      `,
      false
    );

  }

}


/* =========================================================
   NORMALIZE TEXT
========================================================= */

function normalizeText(text) {

  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

}


/* =========================================================
   KEYWORD CHECK
========================================================= */

function containsAny(
  text,
  keywords
) {

  return keywords.some(
    keyword =>
      text.includes(
        keyword
      )
  );

}


/* =========================================================
   SAVE RECENT QUESTION
========================================================= */

function saveRecentQuestion(
  question
) {

  try {

    let recent =
      JSON.parse(
        localStorage.getItem(
          RECENT_STORAGE_KEY
        ) || "[]"
      );

    if (!Array.isArray(recent)) {
      recent = [];
    }

    const cleanQuestion =
      question.trim();

    if (!cleanQuestion) return;

    recent =
      recent.filter(
        item =>
          normalizeText(item) !==
          normalizeText(cleanQuestion)
      );

    recent.unshift(
      cleanQuestion
    );

    recent =
      recent.slice(0, 8);

    localStorage.setItem(
      RECENT_STORAGE_KEY,
      JSON.stringify(recent)
    );

    renderRecentQuestions();

  } catch (error) {

    console.warn(
      "Recent question storage error:",
      error
    );

  }

}


/* =========================================================
   RENDER RECENT QUESTIONS
========================================================= */

function renderRecentQuestions() {

  if (!recentSection || !recentList) {
    return;
  }

  try {

    const recent =
      JSON.parse(
        localStorage.getItem(
          RECENT_STORAGE_KEY
        ) || "[]"
      );

    if (
      !Array.isArray(recent) ||
      recent.length === 0
    ) {

      recentSection.classList.remove(
        "visible"
      );

      return;
    }

    recentSection.classList.add(
      "visible"
    );

    recentList.innerHTML = "";

    recent.forEach(
      question => {

        const button =
          document.createElement("button");

        button.className =
          "recent-item";

        button.type =
          "button";

        button.innerHTML = `
          <span class="recent-icon">
            <i class="fa-regular fa-clock"></i>
          </span>

          <span class="recent-question">
            ${escapeHTML(question)}
          </span>
        `;

        button.addEventListener(
          "click",
          () => {

            openUshaChat(
              question
            );

          }
        );

        recentList.appendChild(
          button
        );

      }
    );

  } catch (error) {

    console.warn(
      "Could not render recent questions:",
      error
    );

  }

}


/* =========================================================
   LEARNING RESPONSE HELPERS
========================================================= */

function htmlResponse(
  title,
  body,
  actions = []
) {

  let actionHTML = "";

  if (actions.length) {

    actionHTML = `
      <div class="chat-action-row">

        ${actions
          .map(
            action => `
              <button
                class="chat-action"
                type="button"
                onclick="${action.onclick}"
              >
                ${action.label}
              </button>
            `
          )
          .join("")}

      </div>
    `;

  }

  return `
    <strong>${title}</strong>

    <br><br>

    ${body}

    ${actionHTML}
  `;

}


/* =========================================================
   USHA SMART LEARNING BRAIN
========================================================= */

function getUshaReply(
  originalQuestion
) {

  const text =
    normalizeText(
      originalQuestion
    );


  /* -----------------------------------------
     GREETING
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "hello",
        "hi",
        "hey",
        "good morning",
        "good evening",
        "good afternoon",
        "assalamualaikum",
        "salam"
      ]
    )
  ) {

    return `
      <strong>Hello! 👋 I'm USHA.</strong><br><br>

      I'm the AI Learning Assistant from
      <strong>SNK IT Institute</strong>.

      <br><br>

      You can ask me to explain a topic,
      create a study plan, quiz you,
      or guide you from beginner to advanced.

      <br><br>

      <strong>What do you want to learn today?</strong>
    `;

  }


  /* -----------------------------------------
     BEGINNER
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "beginner",
        "complete beginner",
        "start learning",
        "where should i start",
        "how do i start",
        "new to",
        "i am new"
      ]
    )
  ) {

    return htmlResponse(
      "Start Your Learning Journey 🚀",
      `
        If you're a complete beginner,
        don't worry. Start with the basics
        and build one skill at a time.

        <br><br>

        <strong>Suggested path:</strong>

        <br><br>

        1. Computer Basics<br>
        2. Internet & Digital Skills<br>
        3. HTML<br>
        4. CSS<br>
        5. JavaScript<br>
        6. Small Projects

        <br><br>

        I can also create a personalized
        beginner study plan for you.
      `
    );

  }


  /* -----------------------------------------
     HTML
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "html",
        "learn html",
        "html course"
      ]
    )
  ) {

    return htmlResponse(
      "Let's Learn HTML 🌐",
      `
        <strong>HTML</strong> is used to create
        the structure of web pages.

        <br><br>

        A beginner HTML roadmap can be:

        <br><br>

        1. HTML document structure<br>
        2. Headings & paragraphs<br>
        3. Links & images<br>
        4. Lists<br>
        5. Tables<br>
        6. Forms<br>
        7. Semantic HTML<br>
        8. Build a complete webpage

        <br><br>

        <strong>Next step:</strong>
        Ask me: <em>"Teach me HTML from zero."</em>
      `
    );

  }


  /* -----------------------------------------
     CSS
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "css",
        "learn css",
        "css course"
      ]
    )
  ) {

    return htmlResponse(
      "Let's Learn CSS 🎨",
      `
        <strong>CSS</strong> controls the design
        and appearance of a webpage.

        <br><br>

        Start with:

        <br><br>

        1. Selectors<br>
        2. Colors<br>
        3. Fonts<br>
        4. Box Model<br>
        5. Flexbox<br>
        6. Grid<br>
        7. Responsive Design<br>
        8. Animations

        <br><br>

        Then build a responsive website
        from scratch.
      `
    );

  }


  /* -----------------------------------------
     JAVASCRIPT
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "javascript",
        "java script",
        "js",
        "learn javascript"
      ]
    )
  ) {

    return htmlResponse(
      "Let's Learn JavaScript ⚡",
      `
        JavaScript adds
        <strong>logic and interaction</strong>
        to websites.

        <br><br>

        Beginner roadmap:

        <br><br>

        1. Variables<br>
        2. Data types<br>
        3. Conditions<br>
        4. Functions<br>
        5. Arrays<br>
        6. Objects<br>
        7. DOM<br>
        8. Events<br>
        9. Local Storage<br>
        10. Build projects

        <br><br>

        Try asking:
        <em>"Explain JavaScript variables."</em>
      `
    );

  }


  /* -----------------------------------------
     STUDY PLAN / ROADMAP
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "study plan",
        "learning plan",
        "roadmap",
        "learning roadmap",
        "study roadmap",
        "make a plan",
        "create a plan"
      ]
    )
  ) {

    return htmlResponse(
      "Your Learning Roadmap 🗺️",
      `
        Here's a simple web-development
        learning roadmap:

        <br><br>

        <strong>Phase 1 — Foundation</strong><br>
        Computer Basics + Internet

        <br><br>

        <strong>Phase 2 — Web Basics</strong><br>
        HTML + CSS

        <br><br>

        <strong>Phase 3 — Programming</strong><br>
        JavaScript

        <br><br>

        <strong>Phase 4 — Projects</strong><br>
        Build real websites

        <br><br>

        <strong>Phase 5 — Advanced</strong><br>
        APIs + GitHub + modern web tools

        <br><br>

        Ask me your available study time
        and I can turn this into a daily plan.
      `
    );

  }


  /* -----------------------------------------
     QUIZ
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "quiz",
        "test me",
        "ask me questions",
        "question me"
      ]
    )
  ) {

    return htmlResponse(
      "Quiz Mode 🧠",
      `
        Great! Let's test your knowledge.

        <br><br>

        <strong>Question 1:</strong>

        <br><br>

        What does HTML mainly provide
        in a webpage?

        <br><br>

        A) Structure<br>
        B) Database<br>
        C) Internet connection<br>
        D) Operating system

        <br><br>

        Reply with <strong>A, B, C or D</strong>.
      `
    );

  }


  /* -----------------------------------------
     PRACTICE
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "practice",
        "practice task",
        "exercise",
        "give me an exercise"
      ]
    )
  ) {

    return htmlResponse(
      "Practice Challenge 💻",
      `
        Build a simple personal profile page.

        <br><br>

        Your page should contain:

        <br><br>

        • Your name<br>
        • A short introduction<br>
        • One profile image<br>
        • Three skills<br>
        • One contact button

        <br><br>

        Start with HTML first.
        Then use CSS to make it look modern.
      `
    );

  }


  /* -----------------------------------------
     COMPUTER BASICS
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "computer basics",
        "computer basic",
        "computer course",
        "computer"
      ]
    )
  ) {

    return htmlResponse(
      "Computer Basics 💻",
      `
        For beginners, learn these topics:

        <br><br>

        1. Computer hardware<br>
        2. Operating systems<br>
        3. Files & folders<br>
        4. Keyboard shortcuts<br>
        5. Internet basics<br>
        6. Email<br>
        7. Online safety<br>
        8. Basic productivity tools

        <br><br>

        These skills create a strong foundation
        for further IT learning.
      `
    );

  }


  /* -----------------------------------------
     COURSE
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "course",
        "courses",
        "free course",
        "free class",
        "classes"
      ]
    )
  ) {

    return htmlResponse(
      "SNK IT Institute Courses 🎓",
      `
        SNK IT Institute provides learning
        resources for students.

        <br><br>

        You can explore the free learning
        resources and recorded classes from
        the SNK platforms.

        <br><br>

        <strong>Free Course:</strong><br>
        Use the Free Course option from the
        SNK website.

        <br><br>

        You can also ask me:
        <em>"What should I learn first?"</em>
      `
    );

  }


  /* -----------------------------------------
     LIVE CLASS / ZOOM
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "live class",
        "live",
        "zoom",
        "join class",
        "join live"
      ]
    )
  ) {

    return htmlResponse(
      "Live Class 📺",
      `
        You can join the SNK IT Institute
        live class through Zoom.

        <br><br>

        Click the button below to join.

        <br><br>

        <button
          class="chat-action"
          type="button"
          onclick="openExternalLink(USHA_LINKS.zoom)"
        >
          <i class="fa-solid fa-video"></i>
          Join Zoom
        </button>
      `
    );

  }


  /* -----------------------------------------
     RECORDED
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "recorded",
        "recorded class",
        "youtube",
        "video class",
        "videos"
      ]
    )
  ) {

    return htmlResponse(
      "Recorded Learning ▶️",
      `
        You can learn through recorded
        classes on the SNK YouTube resources.

        <br><br>

        <button
          class="chat-action"
          type="button"
          onclick="openExternalLink(USHA_LINKS.freePlaylist)"
        >
          Free Classes
        </button>

        <button
          class="chat-action"
          type="button"
          onclick="openExternalLink(USHA_LINKS.paidPlaylist)"
        >
          Paid Classes
        </button>
      `
    );

  }


  /* -----------------------------------------
     SUPPORT
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "support",
        "help",
        "contact",
        "whatsapp",
        "need help"
      ]
    )
  ) {

    return htmlResponse(
      "SNK Support 💬",
      `
        If you need help from SNK IT Institute,
        you can contact the support team through
        WhatsApp.

        <br><br>

        <button
          class="chat-action"
          type="button"
          onclick="openExternalLink(USHA_LINKS.whatsapp)"
        >
          <i class="fa-brands fa-whatsapp"></i>
          Contact Support
        </button>
      `
    );

  }


  /* -----------------------------------------
     SHOPPING MELA
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "shopping",
        "shopping mela",
        "discount",
        "offer",
        "promo",
        "promotion",
        "coupon"
      ]
    )
  ) {

    return htmlResponse(
      "Shopping Mela 🛍️",
      `
        Shopping Mela is a local shopping
        and advertising platform project.

        <br><br>

        You can explore the website here:

        <br><br>

        <button
          class="chat-action"
          type="button"
          onclick="openExternalLink(USHA_LINKS.shopping)"
        >
          Open Shopping Mela
        </button>
      `
    );

  }


  /* -----------------------------------------
     FACEBOOK
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "facebook",
        "fb"
      ]
    )
  ) {

    return `
      <strong>SNK IT Institute on Facebook 📘</strong>
      <br><br>

      You can visit the official SNK Facebook page.

      <br><br>

      <button
        class="chat-action"
        type="button"
        onclick="openExternalLink(USHA_LINKS.facebook)"
      >
        Open Facebook
      </button>
    `;

  }


  /* -----------------------------------------
     THANKS
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "thank you",
        "thanks",
        "thank",
        "great",
        "awesome"
      ]
    )
  ) {

    return `
      You're welcome! 😊

      <br><br>

      I'm here whenever you want to learn.

      <br><br>

      Try asking:
      <strong>"Teach me HTML."</strong>
    `;

  }


  /* -----------------------------------------
     WHAT SHOULD I LEARN
  ----------------------------------------- */

  if (
    containsAny(
      text,
      [
        "what should i learn",
        "what can i learn",
        "which skill",
        "which course",
        "suggest a course"
      ]
    )
  ) {

    return htmlResponse(
      "Let's Choose Your Learning Path 🎯",
      `
        Your choice depends on your goal.

        <br><br>

        <strong>Want to build websites?</strong><br>
        Start with HTML → CSS → JavaScript.

        <br><br>

        <strong>Want basic computer skills?</strong><br>
        Start with Computer Basics.

        <br><br>

        <strong>Want practical IT skills?</strong><br>
        Start with Digital Skills and
        IT Fundamentals.

        <br><br>

        Tell me your goal and your current
        skill level, and I'll guide you.
      `
    );

  }


  /* -----------------------------------------
     DEFAULT
  ----------------------------------------- */

  return `
    <strong>I'm ready to help you learn. 🤖</strong>

    <br><br>

    I can help with:

    <br><br>

    • HTML<br>
    • CSS<br>
    • JavaScript<br>
    • Computer Basics<br>
    • IT Fundamentals<br>
    • Study Plans<br>
    • Learning Roadmaps<br>
    • Quizzes<br>
    • Practice Tasks<br>
    • SNK Courses<br>
    • Live Classes<br>
    • Recorded Classes

    <br><br>

    Try asking:

    <br><br>

    <em>
      "Teach me HTML from zero."
    </em>
  `;

}


/* =========================================================
   EXTERNAL LINK
========================================================= */

function openExternalLink(
  url
) {

  if (!url) return;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}


/* =========================================================
   TYPING INDICATOR
========================================================= */

function showTyping() {

  if (!typingIndicator) return;

  typingIndicator.classList.add(
    "active"
  );

  scrollMessagesToBottom();

}


function hideTyping() {

  if (!typingIndicator) return;

  typingIndicator.classList.remove(
    "active"
  );

}


/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage(
  customQuestion = ""
) {

  const question =
    customQuestion ||
    (chatInput
      ? chatInput.value.trim()
      : "");

  if (!question) return;

  openUshaChat();

  if (chatInput) {
    chatInput.value = "";
  }

  addMessage(
    "user",
    question
  );

  saveRecentQuestion(
    question
  );

  showTyping();

  /*
    Fake AI thinking delay.

    This is currently a frontend
    smart-demo brain.

    Real AI/API can be connected
    in a later version.
  */

  const delay =
    650 +
    Math.floor(
      Math.random() * 750
    );

  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        delay
      )
  );

  hideTyping();

  const reply =
    getUshaReply(
      question
    );

  addHTMLMessage(
    "assistant",
    reply
  );

}


/* =========================================================
   QUICK QUESTION
========================================================= */

function quickQuestion(
  question
) {

  if (!question) return;

  openUshaChat(
    question
  );

  setTimeout(
    () => {

      sendMessage(
        question
      );

    },
    150
  );

}


/* =========================================================
   MAIN QUESTION SUBMIT
========================================================= */

function askMainQuestion() {

  if (!mainQuestion) return;

  const question =
    mainQuestion.value.trim();

  if (!question) {

    mainQuestion.focus();

    return;
  }

  mainQuestion.value = "";

  openUshaChat();

  setTimeout(
    () => {

      sendMessage(
        question
      );

    },
    120
  );

}


/* =========================================================
   AUTO RESIZE TEXTAREA
========================================================= */

function autoResize(
  textarea
) {

  if (!textarea) return;

  textarea.style.height =
    "auto";

  textarea.style.height =
    Math.min(
      textarea.scrollHeight,
      170
    ) + "px";

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* -----------------------------------------
       LOAD HISTORY
    ----------------------------------------- */

    loadChatHistory();

    renderRecentQuestions();


    /* -----------------------------------------
       MAIN ASK BUTTON
    ----------------------------------------- */

    const askButton =
      getElement("askButton");

    if (askButton) {

      askButton.addEventListener(
        "click",
        askMainQuestion
      );

    }


    /* -----------------------------------------
       CHAT SEND BUTTON
    ----------------------------------------- */

    const sendButton =
      getElement("sendChat");

    if (sendButton) {

      sendButton.addEventListener(
        "click",
        () => sendMessage()
      );

    }


    /* -----------------------------------------
       CLOSE BUTTON
    ----------------------------------------- */

    const closeButton =
      getElement("closeChat");

    if (closeButton) {

      closeButton.addEventListener(
        "click",
        closeUshaChat
      );

    }


    /* -----------------------------------------
       CLEAR BUTTON
    ----------------------------------------- */

    const clearButton =
      getElement("clearChat");

    if (clearButton) {

      clearButton.addEventListener(
        "click",
        clearUshaChat
      );

    }


    /* -----------------------------------------
       MAIN QUESTION KEYBOARD
    ----------------------------------------- */

    if (mainQuestion) {

      mainQuestion.addEventListener(
        "input",
        () =>
          autoResize(
            mainQuestion
          )
      );

      mainQuestion.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter" &&
            !event.shiftKey
          ) {

            event.preventDefault();

            askMainQuestion();

          }

        }
      );

    }


    /* -----------------------------------------
       CHAT INPUT KEYBOARD
    ----------------------------------------- */

    if (chatInput) {

      chatInput.addEventListener(
        "input",
        () =>
          autoResize(
            chatInput
          )
      );

      chatInput.addEventListener(
        "keydown",
        event => {

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


    /* -----------------------------------------
       ESCAPE CLOSE
    ----------------------------------------- */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          chatOverlay &&
          chatOverlay.classList.contains(
            "active"
          )
        ) {

          closeUshaChat();

        }

      }
    );


    /* -----------------------------------------
       CLICK OUTSIDE CHAT
    ----------------------------------------- */

    if (chatOverlay) {

      chatOverlay.addEventListener(
        "click",
        event => {

          if (
            event.target ===
            chatOverlay
          ) {

            closeUshaChat();

          }

        }
      );

    }


    /* -----------------------------------------
       GLOBAL QUICK BUTTONS
    ----------------------------------------- */

    document
      .querySelectorAll(
        "[data-usha-question]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const question =
                button.dataset
                  .ushaQuestion;

              quickQuestion(
                question
              );

            }
          );

        }
      );


    /* -----------------------------------------
       GLOBAL EXTERNAL LINKS
    ----------------------------------------- */

    document
      .querySelectorAll(
        "[data-usha-link]"
      )
      .forEach(
        element => {

          element.addEventListener(
            "click",
            () => {

              const key =
                element.dataset
                  .ushaLink;

              if (
                USHA_LINKS[key]
              ) {

                openExternalLink(
                  USHA_LINKS[key]
                );

              }

            }
          );

        }
      );


    console.log(
      "USHA AI Learning Assistant loaded successfully."
    );

  }
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.openUshaChat =
  openUshaChat;

window.closeUshaChat =
  closeUshaChat;

window.clearUshaChat =
  clearUshaChat;

window.sendMessage =
  sendMessage;

window.quickQuestion =
  quickQuestion;

window.askMainQuestion =
  askMainQuestion;

window.openExternalLink =
  openExternalLink;

window.USHA_LINKS =
  USHA_LINKS;


/* =========================================================
   END OF USHA.JS
========================================================= */
