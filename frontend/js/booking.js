document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointment-form');
    const confirmationMessage = document.getElementById('confirmation-message');
  
    appointmentForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const status = document.getElementById('status').value;
  
      const appointmentData = {
        name: name,
        email: email, // Bạn có thể không cần gửi email và phone nếu chỉ cần tìm PatientId theo tên
        phone: phone, // Tương tự như email
        date: date,
        time: time,
        status: status
      };
  
      fetch('http://localhost:3000/api/book-appointment', { // Đảm bảo cổng này trùng với cổng bạn cấu hình ở backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Appointment booked successfully!') {
          appointmentForm.style.display = 'none';
          confirmationMessage.classList.remove('hidden');
        } else {
          alert('Failed to book appointment: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error booking appointment:', error);
        alert('An error occurred while booking the appointment.');
      });
    });
  });