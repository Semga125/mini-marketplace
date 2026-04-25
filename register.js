const input1 = document.querySelector("#username1");
const input2 = document.querySelector("#password1");
const submit = document.querySelector("#submit-register");

submit.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        const username = input1.value;
        const password = input2.value;

        if (username.length <= 3 || password.length <= 3) {
            throw new Error("Enter all fields");
        }

        const res = await fetch("http://localhost:10000/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                login: username,
                password: password
            })
        });

        const data = await res.json();
        console.log("Server response:", data);

    } catch (err) {
        console.error("Error:", err);
    }
});
