let currentUser = null;

async function checkAuth() {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    return window.location.href = "login.html";
  }

  let res = await fetch("http://localhost:10000/users/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });


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
  currentUser = data.user;

  console.log("USER:", currentUser);
}

checkAuth();



document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("account-button");

  if (btn) {
    btn.addEventListener("click", () => {
      window.location.href = "account.html";
    });
  }
});



async function loadPosts(search = "") {
  const res = await fetch(
    `http://localhost:10000/users/posts?search=${search}`
  );

  const posts = await res.json();

  const container = document.getElementById("posts");
  container.innerHTML = "";
if (posts.length === 0) {
  container.innerHTML = "<h3>Нічого не знайдено</h3>";
  return;
}
  posts.forEach(post => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      <h4>${post.price || ""} $</h4>
      <hr>
    `;

    container.appendChild(div);
  });
} 

loadPosts();


const input = document.getElementById("search");

input.addEventListener("input", () => {
  loadPosts(input.value);
});
document.querySelector("#watch").addEventListener("click", () => {
  const phones = document.querySelector("#phones");

  const current = getComputedStyle(phones).display;

  if (current === "none") {
    phones.style.display = "block";
  } else {
    phones.style.display = "none";
  }
});