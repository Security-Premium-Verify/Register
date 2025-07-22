document.getElementById("verificationForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // Simulated submission (replace with actual logic/server call)
  console.log("Submitted:", { username, email, password });
  alert("Verification submitted successfully.");
});
