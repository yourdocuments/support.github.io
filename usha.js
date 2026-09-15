
// ============================================================
// USHA AI — SNK IT Institute
// Step 5.4 — Real AI Connection
// ============================================================

"use strict";

/* ============================================================
   USHA LINKS
============================================================ */

const USHA_LINKS = {
  snk: "https://snkitinstitute.github.io/",
  freeCourse: "https://snkguideup.github.io/",
  zoom: "https://us05web.zoom.us/j/84311190995?pwd=d0j0VRyKL6Zxg5qN6rIaxAJb9Dk8rf.1",
  whatsapp: "https://wa.me/8801636363801",
  freePlaylist: "https://www.youtube.com/playlist?list=PLJe-RU9VQd38",
  paidPlaylist: "https://www.youtube.com/playlist?list=PLfz6zuYhx-uU",
  facebook: "https://www.facebook.com/snkitinstitute",
  youtube: "https://www.youtube.com/@snkguideup",
  whatsappChannel: "https://whatsapp.com/channel/0029VbD6LlH6RGJJ1QsBN93x",
  shopping: "https://yourdocuments.github.io/shopingmela/",
  shoppingGroup: "https://www.facebook.com/groups/shopingnmela"
};


/* ============================================================
   STORAGE
============================================================ */

const CHAT_STORAGE_KEY = "ushaAIChatHistory_v3";
const RECENT_STORAGE_KEY = "ushaAIRecentQuestions_v3";


/* ============================================================
   DOM HELPERS
============================================================ */

function getElement(id) {
  return document.getElementById(id);
}

const chatOverlay = getElement("chatOverlay");
const chatInput = getElement("chatInput");
const mainQuestion = getElement("mainQuestion");
const messages = getElement("messages");
const typingIndicator = getElement("typingIndicator");
const recentSection = getElement("recentSection");
const recentList = getElement("recentList");


/* ============================================================
   OPEN / CLOSE CHAT
============================================================ */

function openUshaChat(question = "") {

  if (!chatOverlay) return;

  chatOverlay.classList.add("active");

  document.body.classList.add("usha-chat-open");

  setTimeout(() => {

    if (question && chatInput) {
      chatInput.value = question;
      autoResize(chatInput);
      chatInput.focus();
    } else if (chatInput) {
      chatInput.focus();
    }

  }, 100);

}


function closeUshaChat() {

  if (!chatOverlay) return;

  chatOverlay.classList.remove("active");

  document.body.classList.remove("usha-chat-open");

}


/* ============================================================
   CLEAR CHAT
============================================================ */

function clearUshaChat() {

  if (!messages) return;

  localStorage.removeItem(CHAT_STORAGE_KEY);

  messages.innerHTML = "";

  addHTMLMessage(
    "assistant",
    `
      <div class="usha-message-card">
        <strong>Hello! I'm USHA 👋</strong>
        <p>
          I'm your AI Learning Assistant from SNK IT Institute.
        </p>
        <p>
          Ask me anything about HTML, CSS, JavaScript,
          web development, computer basics, or learning plans.
        </p>
      </div>
    `,
    null
  );

}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* ============================================================
   FORMAT TEXT
============================================================ */

function formatText(text) {

  if (!text) return "";

  let safe = escapeHTML(text);

  safe = safe.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  safe = safe.replace(
    /`([^`]+)`/g,
    "<code>$1</code>"
  );

  safe = safe.replace(
    /\n/g,
    "<br>"
  );

  return safe;
}


/* ============================================================
   CURRENT TIME
============================================================ */

function getCurrentTime() {

  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

}


/* ============================================================
   ADD NORMAL MESSAGE
============================================================ */

function addMessage(role, text, save = true) {

  if (!messages) return;

  const wrapper = document.createElement("div");

  wrapper.className =
    `message ${role === "user" ? "user-message" : "assistant-message"}`;

  const bubble = document.createElement("div");

  bubble.className = "message-bubble";

  bubble.innerHTML = formatText(text);

  const time = document.createElement("div");

  time.className = "message-time";

  time.textContent = getCurrentTime();

  wrapper.appendChild(bubble);
  wrapper.appendChild(time);

  messages.appendChild(wrapper);

  if (save) {
    saveChatMessage(role, text);
  }

  scrollMessagesToBottom();

}


/* ============================================================
   ADD HTML MESSAGE
============================================================ */

function addHTMLMessage(role, html, saveText = null) {

  if (!messages) return;

  const wrapper = document.createElement("div");

  wrapper.className =
    `message ${role === "user" ? "user-message" : "assistant-message"}`;

  const bubble = document.createElement("div");

  bubble.className = "message-bubble";

  bubble.innerHTML = html;

  const time = document.createElement("div");

  time.className = "message-time";

  time.textContent = getCurrentTime();

  wrapper.appendChild(bubble);
  wrapper.appendChild(time);

  messages.appendChild(wrapper);

  if (saveText) {
    saveChatMessage(role, saveText);
  }

  scrollMessagesToBottom();

}


/* ============================================================
   SCROLL
============================================================ */

function scrollMessagesToBottom() {

  if (!messages) return;

  requestAnimationFrame(() => {
    messages.scrollTop = messages.scrollHeight;
  });

}


/* ============================================================
   SAVE CHAT
============================================================ */

function saveChatMessage(role, text) {

  if (!text) return;

  try {

    const history =
      JSON.parse(
        localStorage.getItem(CHAT_STORAGE_KEY) || "[]"
      );

    history.push({
      role,
      content: text,
      timestamp: Date.now()
    });

    const trimmed = history.slice(-30);

    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(trimmed)
    );

  } catch (error) {

    console.error(
      "Could not save chat history:",
      error
    );

  }

}


/* ============================================================
   LOAD CHAT HISTORY
============================================================ */

function loadChatHistory() {

  if (!messages) return;

  messages.innerHTML = "";

  let history = [];

  try {

    history =
      JSON.parse(
        localStorage.getItem(CHAT_STORAGE_KEY) || "[]"
      );

  } catch (error) {

    history = [];

  }


  if (!Array.isArray(history) || history.length === 0) {

    addHTMLMessage(
      "assistant",
      `
        <div class="usha-message-card">
          <strong>Hello! I'm USHA 👋</strong>

          <p>
            I'm your AI Learning Assistant from
            SNK IT Institute.
          </p>

          <p>
            Ask me anything about HTML, CSS,
            JavaScript, web development,
            computer basics, or study planning.
          </p>
        </div>
      `,
      null
    );

    return;
  }


  history.forEach(item => {

    if (
      !item ||
      !item.role ||
      typeof item.content !== "string"
    ) {
      return;
    }

    addMessage(
      item.role,
      item.content,
      false
    );

  });

}


/* ============================================================
   NORMALIZE TEXT
============================================================ */

function normalizeText(text) {

  return String(text || "")
    .toLowerCase()
    .trim();

}


/* ============================================================
   RECENT QUESTIONS
============================================================ */

function saveRecentQuestion(question) {

  const cleanQuestion =
    String(question || "").trim();

  if (!cleanQuestion) return;

  try {

    let recent =
      JSON.parse(
        localStorage.getItem(RECENT_STORAGE_KEY) || "[]"
      );

    if (!Array.isArray(recent)) {
      recent = [];
    }

    recent =
      recent.filter(
        item =>
          normalizeText(item) !==
          normalizeText(cleanQuestion)
      );

    recent.unshift(cleanQuestion);

    recent = recent.slice(0, 8);

    localStorage.setItem(
      RECENT_STORAGE_KEY,
      JSON.stringify(recent)
    );

    renderRecentQuestions();

  } catch (error) {

    console.error(
      "Could not save recent question:",
      error
    );

  }

}


function renderRecentQuestions() {

  if (!recentList) return;

  let recent = [];

  try {

    recent =
      JSON.parse(
        localStorage.getItem(RECENT_STORAGE_KEY) || "[]"
      );

  } catch (error) {

    recent = [];

  }

  if (!Array.isArray(recent) || recent.length === 0) {

    if (recentSection) {
      recentSection.style.display = "none";
    }

    return;
  }

  if (recentSection) {
    recentSection.style.display = "";
  }

  recentList.innerHTML = "";

  recent.forEach(question => {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className = "recent-question";

    button.textContent = question;

    button.addEventListener(
      "click",
      () => quickQuestion(question)
    );

    recentList.appendChild(button);

  });

}


/* ============================================================
   TYPING INDICATOR
============================================================ */

function showTyping() {

  if (!typingIndicator) return;

  typingIndicator.classList.add("active");

  scrollMessagesToBottom();

}


function hideTyping() {

  if (!typingIndicator) return;

  typingIndicator.classList.remove("active");

}


/* ============================================================
   REAL AI REQUEST
============================================================ */

async function askRealAI(message) {

  let history = [];

  try {

    history =
      JSON.parse(
        localStorage.getItem(CHAT_STORAGE_KEY) || "[]"
      );

  } catch (error) {

    history = [];

  }


  const cleanHistory =
    Array.isArray(history)
      ? history
          .filter(item =>
            item &&
            (item.role === "user" ||
             item.role === "assistant") &&
            typeof item.content === "string"
          )
          .slice(-12)
          .map(item => ({
            role: item.role,
            content: item.content
          }))
      : [];


  const response =
    await fetch("/api/usha", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message,
        history: cleanHistory
      })

    });


  let data = {};

  try {

    data = await response.json();

  } catch (error) {

    throw new Error(
      "Invalid response from USHA server."
    );

  }


  if (!response.ok || !data.success) {

    throw new Error(
      data.error ||
      "USHA could not answer right now."
    );

  }


  return data.answer;

}


/* ============================================================
   SEND MESSAGE
============================================================ */

async function sendMessage(customQuestion = "") {

  const typedQuestion =
    customQuestion ||
    (chatInput ? chatInput.value : "");

  const question =
    String(typedQuestion || "").trim();

  if (!question) return;


  openUshaChat();


  // Clear input
  if (chatInput) {
    chatInput.value = "";
    autoResize(chatInput);
  }


  // Show user message
  addMessage(
    "user",
    question,
    true
  );


  // Save recent question
  saveRecentQuestion(question);


  // Show AI thinking
  showTyping();


  try {

    const answer =
      await askRealAI(question);

    hideTyping();


    addMessage(
      "assistant",
      answer,
      true
    );


  } catch (error) {

    console.error(
      "USHA AI error:",
      error
    );

    hideTyping();


    addHTMLMessage(
      "assistant",
      `
        <div class="usha-error-card">
          <strong>USHA is temporarily unavailable.</strong>

          <p>
            I couldn't connect to the AI service right now.
            Please try again in a moment.
          </p>

          <small>
            If this is the first setup, please check the
            backend deployment and API configuration.
          </small>
        </div>
      `,
      "USHA is temporarily unavailable. I couldn't connect to the AI service right now."
    );

  }

}


/* ============================================================
   QUICK QUESTION
============================================================ */

function quickQuestion(question) {

  if (!question) return;

  openUshaChat();

  setTimeout(() => {
    sendMessage(question);
  }, 150);

}


/* ============================================================
   MAIN QUESTION
============================================================ */

function askMainQuestion() {

  if (!mainQuestion) return;

  const question =
    mainQuestion.value.trim();

  if (!question) {

    mainQuestion.focus();

    return;
  }

  mainQuestion.value = "";

  autoResize(mainQuestion);

  quickQuestion(question);

}


/* ============================================================
   AUTO RESIZE
============================================================ */

function autoResize(textarea) {

  if (!textarea) return;

  textarea.style.height = "auto";

  textarea.style.height =
    Math.min(
      textarea.scrollHeight,
      220
    ) + "px";

}


/* ============================================================
   OPEN EXTERNAL LINK
============================================================ */

function openExternalLink(url) {

  if (!url) return;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}


/* ============================================================
   KEYBOARD SHORTCUTS
============================================================ */

function handleEnterKey(event) {

  if (event.key !== "Enter") return;

  if (event.shiftKey) return;

  event.preventDefault();

  sendMessage();

}


/* ============================================================
   INITIALIZE
============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    // Load chat
    loadChatHistory();

    // Render recent questions
    renderRecentQuestions();


    // Main Ask button
    const askButton =
      getElement("askButton");

    if (askButton) {

      askButton.addEventListener(
        "click",
        askMainQuestion
      );

    }


    // Chat send button
    const sendChat =
      getElement("sendChat");

    if (sendChat) {

      sendChat.addEventListener(
        "click",
        () => sendMessage()
      );

    }


    // Close chat
    const closeChat =
      getElement("closeChat");

    if (closeChat) {

      closeChat.addEventListener(
        "click",
        closeUshaChat
      );

    }


    // Clear chat
    const clearChat =
      getElement("clearChat");

    if (clearChat) {

      clearChat.addEventListener(
        "click",
        clearUshaChat
      );

    }


    // Main textarea
    if (mainQuestion) {

      mainQuestion.addEventListener(
        "input",
        () => autoResize(mainQuestion)
      );

      mainQuestion.addEventListener(
        "keydown",
        handleEnterKey
      );

    }


    // Chat textarea
    if (chatInput) {

      chatInput.addEventListener(
        "input",
        () => autoResize(chatInput)
      );

      chatInput.addEventListener(
        "keydown",
        handleEnterKey
      );

    }


    // Quick question buttons
    document
      .querySelectorAll("[data-usha-question]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const question =
              button.getAttribute(
                "data-usha-question"
              );

            if (question) {
              quickQuestion(question);
            }

        });

      });


    // External resource links
    document
      .querySelectorAll("[data-usha-link]")
      .forEach(element => {

        element.addEventListener(
          "click",
          () => {

            const url =
              element.getAttribute(
                "data-usha-link"
              );

            if (url) {
              openExternalLink(url);
            }

          }
        );

      });


    // Escape closes chat
    document.addEventListener(
      "keydown",
      event => {

        if (event.key === "Escape") {
          closeUshaChat();
        }

      }
    );


    // Click outside chat window
    if (chatOverlay) {

      chatOverlay.addEventListener(
        "click",
        event => {

          if (
            event.target === chatOverlay
          ) {
            closeUshaChat();
          }

        }
      );

    }

  }
);


/* ============================================================
   GLOBAL EXPORTS
============================================================ */

window.openUshaChat = openUshaChat;
window.closeUshaChat = closeUshaChat;
window.clearUshaChat = clearUshaChat;
window.sendMessage = sendMessage;
window.quickQuestion = quickQuestion;
window.askMainQuestion = askMainQuestion;
window.openExternalLink = openExternalLink;
window.USHA_LINKS = USHA_LINKS;
```
