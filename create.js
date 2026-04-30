document.getElementById("create-btn").addEventListener("click", async (event) => {
  const token = localStorage.getItem("accessToken");

  console.log("TOKEN:", token); 

  const title = document.querySelector("#title").value;
  const description = document.querySelector("#desc").value;
 const price = Number(document.querySelector("#price").value);
  const res = await fetch("http://localhost:10000/users/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
  title,
  description,
  price
})
  });

  if (res.ok) {
    window.location.href = "home.html";
  } else {
    console.log("error");
  }
});