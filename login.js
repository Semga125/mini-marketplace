const login = document.querySelector("#login5")
const password = document.querySelector("#password5")
const submit = document.querySelector("#submit-login")
submit.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:10000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        login: login.value,
        password: password.value
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const data = await res.json();
    console.log(data);


    window.location.href = "home.html";

  } catch (err) {
    console.error("Login error:", err.message);
  }
});