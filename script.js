const form = document.getElementById("verifyForm");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // Simulate sending verification code
  step1.classList.add("hidden");
  step2.classList.remove("hidden");
});

document.getElementById("codeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const code = document.getElementById("code").value.trim();

  if (code.length !== 6 || isNaN(code)) {
    alert("Please enter a valid 6-digit code.");
    return;
  }

  // Simulated success
  alert("Account verified successfully!");
});
