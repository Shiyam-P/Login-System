function togglePassword() {
  const pw = document.getElementById("password");
  const icon = document.getElementById("eyeIcon");
  if (pw.type === "password") {
    pw.type = "text";
    icon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    pw.type = "password";
    icon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>`;
  }
}

function syntaxHighlight(json) {
  const escaped = JSON.stringify(json, null, 2)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "num";
      if (/^"/.test(match)) cls = /:$/.test(match) ? "key" : "str";
      else if (/true|false/.test(match)) cls = "bool";
      else if (/null/.test(match)) cls = "err";
      return `<span class="${cls}">${match}</span>`;
    },
  );
}

async function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("loginBtn");
  const alertBox = document.getElementById("alertBox");
  const card = document.getElementById("card");

  // Clear previous state
  alertBox.className = "alert";
  alertBox.textContent = "";

  if (!email || !password) {
    alertBox.className = "alert error";
    alertBox.textContent = "⚠ Please enter both email and password.";
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 400);
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Authenticating...';

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Show JSON panel
    document.getElementById("jsonOutput").innerHTML = syntaxHighlight(data);
    document.getElementById("jsonPanel").classList.add("visible");

    if (data.success) {
      // Swap form for success overlay
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("successName").textContent =
        `Welcome, ${data.user.name}!`;
      document.getElementById("successSub").textContent =
        `Notification sent to ${data.user.email}`;
      document.getElementById("successOverlay").classList.add("visible");
      document.querySelector(".hint").style.display = "none";
    } else {
      alertBox.className = "alert error";
      alertBox.textContent = "✕ " + data.message;
      card.classList.add("shake");
      setTimeout(() => card.classList.remove("shake"), 400);
      btn.disabled = false;
      btn.innerHTML = "Sign In";
    }
  } catch (err) {
    alertBox.className = "alert error";
    alertBox.textContent = "⚠ Cannot reach server. Is it running?";
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 400);
    btn.disabled = false;
    btn.innerHTML = "Sign In";
  }
}

// Allow Enter key to submit
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleLogin();
});
