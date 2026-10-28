(() => {
  const launcher = document.createElement("button");
  launcher.className = "er-chat-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "er-chat-window");
  launcher.setAttribute("aria-label", "Open Elegance Rentals chat assistant");
  launcher.innerHTML = '<span aria-hidden="true">✦</span><span>Need help?</span>';

  const panel = document.createElement("section");
  panel.className = "er-chat-window";
  panel.id = "er-chat-window";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Elegance Rentals chat assistant");
  panel.innerHTML = `
    <header class="er-chat-header">
      <div><h2 class="er-chat-title">Elegance Assistant</h2><p class="er-chat-status">Quick answers about renting</p></div>
      <button class="er-chat-close" type="button" aria-label="Close chat">×</button>
    </header>
    <div class="er-chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
    <form class="er-chat-form">
      <input class="er-chat-input" type="text" maxlength="300" placeholder="Ask a question…" aria-label="Your question" autocomplete="off" required>
      <button class="er-chat-send" type="submit">Send</button>
    </form>`;
  document.body.append(launcher, panel);

  const messages = panel.querySelector(".er-chat-messages");
  const input = panel.querySelector(".er-chat-input");
  const closeButton = panel.querySelector(".er-chat-close");

  function addMessage(text, sender = "bot") {
    const bubble = document.createElement("div");
    bubble.className = `er-chat-message ${sender}`;
    bubble.textContent = text;
    messages.append(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function addContactLink() {
    const bubble = document.createElement("div");
    bubble.className = "er-chat-message bot";
    bubble.append(document.createTextNode("For more help, "));
    const link = document.createElement("a");
    link.className = "er-chat-contact";
    link.href = "mailto:support@elegancerentals.com?subject=Rental%20support";
    link.textContent = "contact our team";
    bubble.append(link, document.createTextNode("."));
    messages.append(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function addSuggestions() {
    const wrap = document.createElement("div");
    wrap.className = "er-chat-suggestions";
    ["How does renting work?", "What is the deposit?", "How do I contact you?"].forEach((label) => {
      const button = document.createElement("button");
      button.className = "er-chat-suggestion";
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => handleQuestion(label));
      wrap.append(button);
    });
    messages.append(wrap);
  }

  function answerFor(question) {
    const q = question.toLowerCase();
    if (/\b(hello|hi|hey|help)\b/.test(q)) return "Hi! I can help with rentals, deposits, returns, and orders. What would you like to know?";
    if (/rent|how.*work|process|book|order/.test(q)) return "Choose an outfit to see its rental price, deposit, and available sizes. Add it to your cart, then enter your delivery details and place the order.";
    if (/deposit|security|refund/.test(q)) return "The deposit amount is shown on each outfit’s details page. The listed rental terms say eligible deposits are refunded within 3–5 business days after the outfit is returned.";
    if (/size|fit|measurement/.test(q)) return "Open an outfit’s details page to see its available sizes. If you need fit or measurement help, contact our team.";
    if (/deliver|shipping|address/.test(q)) return "Enter your delivery address during checkout. For delivery availability or timing in your area, please contact our team.";
    if (/return|late|damage|cancel/.test(q)) return "You can review the full rental and cancellation terms using the Terms & Conditions button on the home page. The terms include return, late-fee, damage, and cancellation details.";
    if (/payment|pay|upi|card|cash/.test(q)) return "Available payment options are shown at checkout. Select the option you prefer before placing your order.";
    if (/track|status|my order/.test(q)) return "For help with an existing order, email support@elegancerentals.com with your order details.";
    if (/contact|support|human|email|phone/.test(q)) return "You can reach Elegance Rentals at support@elegancerentals.com or +91 98765 43210, Monday–Saturday 10 AM–8 PM and Sunday 11 AM–6 PM.";
    return null;
  }

  function handleQuestion(question) {
    addMessage(question, "user");
    const answer = answerFor(question);
    if (answer) addMessage(answer);
    else {
      addMessage("I’m a basic automated assistant and don’t have that information yet.");
      addContactLink();
    }
  }

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
    else launcher.focus();
  }

  launcher.addEventListener("click", () => setOpen(panel.hidden));
  closeButton.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
  panel.querySelector(".er-chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    input.value = "";
    handleQuestion(question);
  });

  addMessage("Welcome! Ask me about renting, sizes, deposits, delivery, or returns.");
  addSuggestions();
})();
