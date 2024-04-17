const form = document.querySelector(".form");
const errorEmail = document.querySelector(".error.email");
const errorPassword = document.querySelector(".error.password");
const successEl = document.querySelector(".success");

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  errorEmail.textContent = errorPassword.textContent = "";

  const email = form.email.value;
  const password = form.password.value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.user) {
    successEl.classList.remove("hidden");
    setTimeout(() => {
      location.assign("/");
      successEl.classList.add("hidden");
    }, 3000);
  } else if (data.errors) {
    console.log(data.errors);
    errorPassword.classList.remove("hidden");
    errorPassword.textContent = "Wrong email or password";
  }
});
