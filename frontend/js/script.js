var api_url = 'http://localhost:3000/';
// Patients List
document.addEventListener('DOMContentLoaded', function () {
    fetch(api_url + 'api/patients/list') // Đảm bảo endpoint trùng với backend của bạn
        .then(response => response.json())
        .then(data => {
            const patientList = document.getElementById('patient-list');
            patientList.innerHTML = ""; // Xóa dữ liệu cũ (nếu có)
            data.forEach(patient => {
                // Tạo hàng cho mỗi bệnh nhân
                const tr = document.createElement('tr');

                // Tạo ô cho ID
                const tdId = document.createElement('td');
                tdId.textContent = patient.ID || patient.Id || '';

                // Tạo ô cho Name
                const tdName = document.createElement('td');
                tdName.textContent = patient.Name || '';

                // Tạo ô cho Age
                const tdAge = document.createElement('td');
                tdAge.textContent = patient.Age || '';

                // Tạo ô cho Email
                const tdEmail = document.createElement('td');
                tdEmail.textContent = patient.Email || '';

                // Tạo ô cho Phone
                const tdPhone = document.createElement('td');
                tdPhone.textContent = patient.Phone || '';

                // Tạo ô cho Gender
                const tdGender = document.createElement('td');
                tdGender.textContent = patient.Gender ||'';

                // Tạo ô cho Address
                const tdAddress = document.createElement('td');
                tdAddress.textContent = patient.Address || '';

                // Thêm các ô vào hàng theo thứ tự
                tr.appendChild(tdId);
                tr.appendChild(tdName);
                tr.appendChild(tdAge);
                tr.appendChild(tdEmail);
                tr.appendChild(tdPhone);
                tr.appendChild(tdGender);
                tr.appendChild(tdAddress);

                // Thêm hàng vào tbody của bảng
                patientList.appendChild(tr);
            });
        })
        .catch(error => console.error('There is some errors while taking patients data:', error));
});
// Register
document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn submit mặc định của form

    // Lấy dữ liệu từ form
    const form = event.target;
    const formData = new FormData(form);

    // Chuyển đổi FormData thành đối tượng JSON
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log("Dữ liệu gửi lên API:", data); // Kiểm tra dữ liệu có bị thiếu không

    // Gọi API đăng ký
    try {
        const response = await fetch("http://localhost:3000/api/patient/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Register successfully!");
            // Chuyển hướng sang trang đăng nhập
            window.location.href = "login.html";
        } else {
            const errorData = await response.json();
            alert("Error: " + (errorData.Error || errorData.error));
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred while registering.");
    }
});
