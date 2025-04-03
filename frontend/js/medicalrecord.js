document.addEventListener('DOMContentLoaded', function () {
    loadMedicalRecords(); // Gọi hàm load dữ liệu khi trang tải xong

    const addMedicalRecordForm = document.getElementById('addMedicalRecordForm');
    if (addMedicalRecordForm) {
        addMedicalRecordForm.addEventListener('submit', handleAddMedicalRecordSubmit);
    }
});

async function loadMedicalRecords() {
    try {
        const response = await fetch('http://localhost:3000/api/medical-records');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const records = await response.json();
        console.log("Dữ liệu nhận được từ API:", records);
        displayMedicalRecordsDynamically(records); // Gọi hàm hiển thị mới
    } catch (error) {
        console.error('Không thể tải hồ sơ bệnh án:', error);
        alert('Không thể tải hồ sơ bệnh án.');
    }
}

function displayMedicalRecordsDynamically(records) {
    const medicalRecordsTableBody = document.getElementById('medicalRecordsTableBody');
    if (!medicalRecordsTableBody) return;
    medicalRecordsTableBody.innerHTML = ""; // Xóa dữ liệu cũ

    records.forEach(record => {
        const tr = document.createElement('tr');

        // Tạo ô cho ID
        const tdId = document.createElement('td');
        tdId.textContent = record.Id || '';

        // Tạo ô cho Patient ID
        const tdPatientId = document.createElement('td');
        tdPatientId.textContent = record.PatientId || '';

        // Tạo ô cho Staff ID
        const tdStaffId = document.createElement('td');
        tdStaffId.textContent = record.StaffId || '';

        // Tạo ô cho Patient Status
        const tdPatientStatus = document.createElement('td');
        tdPatientStatus.textContent = record.Patient_Status || '';

        // Tạo ô cho Start Date
        const tdStartDate = document.createElement('td');
        // Định dạng ngày tháng nếu cần
        tdStartDate.textContent = record.Start_Date ? new Date(record.Start_Date).toLocaleDateString() : '';

        // Tạo ô cho End Date
        const tdEndDate = document.createElement('td');
        tdEndDate.textContent = record.End_Date ? new Date(record.End_Date).toLocaleDateString() : 'N/A';

        // Tạo ô cho Actions
        const tdActions = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm me-2'; // Thêm class 'me-2' để tạo khoảng cách
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Delete';

        tdActions.appendChild(editButton);
        tdActions.appendChild(deleteButton);

        // Thêm các ô vào hàng
        tr.appendChild(tdId);
        tr.appendChild(tdPatientId);
        tr.appendChild(tdStaffId);
        tr.appendChild(tdPatientStatus);
        tr.appendChild(tdStartDate);
        tr.appendChild(tdEndDate);
        tr.appendChild(tdActions);

        // Thêm hàng vào tbody
        medicalRecordsTableBody.appendChild(tr);
    });
}


async function handleAddMedicalRecordSubmit(event) {
    event.preventDefault();

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // Lấy giá trị từ các trường input trong modal
    const patientId = document.getElementById('patientId').value.trim();
    const staffId = document.getElementById('staffId').value.trim();
    const patientStatus = document.getElementById('patientStatus').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    let isValid = true;
    if (!patientId) {
        document.getElementById('patientIdError').textContent = 'Vui lòng nhập Patient ID';
        isValid = false;
    }
    if (!staffId) {
        document.getElementById('staffIdError').textContent = 'Vui lòng nhập Staff ID';
        isValid = false;
    }
    if (!patientStatus) {
        document.getElementById('patientStatusError').textContent = 'Vui lòng nhập Patient Status';
        isValid = false;
    }
    if (!startDate) {
        document.getElementById('startDateError').textContent = 'Vui lòng chọn Start Date';
        isValid = false;
    }
    if (!endDate) {
        document.getElementById('endDateError').textContent = 'Vui lòng chọn End Date';
    }

    if (!isValid) return;
    // Trong hàm handleAddMedicalRecordSubmit trước khi gọi fetch
    console.log("Dữ liệu gửi đi:", JSON.stringify({
        patientId: patientId,
        staffId: staffId,
        patientStatus: patientStatus,
        startDate: startDate,
        endDate: endDate
    }));

    try {
        const response = await fetch('http://localhost:3000/api/medical-records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patientId: patientId, // Gửi dữ liệu trùng với tên trường trong API
                staffId: staffId,
                patientStatus: patientStatus,
                startDate: startDate,
                endDate: endDate
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Lỗi khi thêm hồ sơ bệnh án');
        }

        const result = await response.json();
        console.log(result.message);
        loadMedicalRecords(); // Tải lại danh sách sau khi thêm thành công

        // Đóng modal và reset form
        const addMedicalRecordModal = bootstrap.Modal.getInstance(document.getElementById('addMedicalRecordModal'));
        if (addMedicalRecordModal) {
            addMedicalRecordModal.hide();
        }
        document.getElementById('addMedicalRecordForm').reset();

    } catch (error) {
        console.error('Lỗi khi thêm hồ sơ bệnh án:', error);
        alert(error.message);
    }
}