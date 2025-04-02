document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn form gửi theo cách mặc định

    const form = event.target;
    const formData = new FormData(form);

    // Chuyển FormData thành JSON
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch("http://localhost:3000/api/patient/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Login successful!");
            window.location.href = "index.html"; // Chuyển hướng khi đăng nhập thành công
        } else {
            alert("Error: " + (result.error || "Invalid username or password"));
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred while logging in.");
    }
});

