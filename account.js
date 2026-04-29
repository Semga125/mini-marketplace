async function loadProfile() {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    return window.location.href = "login.html";
  }

  let res = await fetch("http://localhost:10000/users/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // якщо токен не валідний → пробуємо refresh
  if (!res.ok) {
    const refresh = await fetch("http://localhost:10000/users/refresh", {
      method: "GET",
      credentials: "include"
    });

    if (!refresh.ok) {
      localStorage.removeItem("accessToken");
      return window.location.href = "login.html";
    }

    const data = await refresh.json();
    localStorage.setItem("accessToken", data.accessToken);

    res = await fetch("http://localhost:10000/users/me", {
      headers: {
        Authorization: `Bearer ${data.accessToken}`
      }
    });

    if (!res.ok) {
      localStorage.removeItem("accessToken");
      return window.location.href = "login.html";
    }
  }

  const data = await res.json();

  // 🔥 ВИВОДИМО ДАНІ
  document.getElementById("user-id").innerText =
    "ID: " + data.user.id;

  document.getElementById("user-login").innerText =
    "Login: " + data.user.login;
}

loadProfile();


// 🔥 LOGOUT
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  window.location.href = "register.html";
});