var api_url = 'http://localhost:3000/';
// Patients List
document.addEventListener('DOMContentLoaded', function () {
    fetch(api_url + 'api/patients/list') // Đảm bảo endpoint trùng với backend của bạn
        .then(response => response.json())
        .then(data => {
            const patientList = document.getElementById('patient-list');
            patientList.innerHTML = ""; // Xóa dữ liệu cũ (nếu có)
            data.forEach(patient => {
                const li = document.createElement('li');
                // Hiển thị thông tin của bệnh nhân, ví dụ: Tên, Email và SĐT
                li.textContent = `${patient.Name} - ${patient.Email} - ${patient.Phone}`;
                patientList.appendChild(li);
            });
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu bệnh nhân:', error));
});
