// Add an event listener to the form with the ID 'appointment-form'
// This function runs when the form is submitted
document.getElementById("appointment-form").addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior (which would reload the page)
    event.preventDefault();

    const form = event.target; // Get the form element that triggered the event
    const formData = new FormData(form); // Create a FormData object from the form

    // Convert FormData into a plain JavaScript object
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // --- Data Collected from Form ---
    // data.name:   Patient's full name (string)
    // data.email:  Patient's email (string)
    // data.phone:  Patient's phone number (string)
    // data.date:   Appointment date (string, e.g., "2025-04-02")
    // data.time:   Appointment time (string, e.g., "14:30")
    // data.status: Description of patient's condition (string)
    // --- ---

    // Combine the date and time strings into a single ISO-like datetime string
    // This format (YYYY-MM-DDTHH:mm:ss) is commonly expected by backend APIs for datetime values
    data.Start_Date = `${data.date}T${data.time}:00`;

    // Remove the original date and time properties as they are now combined in Start_Date
    delete data.date;
    delete data.time;

    // --- Data Being Sent to API ---
    // data.name:        Patient's full name (string)
    // data.email:       Patient's email (string)
    // data.phone:       Patient's phone number (string)
    // data.Start_Date:  Combined date and time (string, e.g., "2025-04-02T14:30:00")
    // data.status:      Description of patient's condition (string)
    //
    // *** NOTE: This payload is MISSING PatientId and StaffId, which the Appointment table requires. ***
    // *** The backend API at '/api/appointment/book' MUST handle finding/creating the patient ***
    // *** and assigning a staff member based on the data received. ***
    // --- ---

    console.log("Data to send to backend:", data); // Log the data for debugging

    try {
        // Send the data to the backend API endpoint using a POST request
        const response = await fetch("http://localhost:3000/api/appointment/book", {
            method: "POST",
            headers: {
                // Indicate that the request body contains JSON data
                "Content-Type": "application/json"
            },
            // Convert the JavaScript data object into a JSON string for the request body
            body: JSON.stringify(data)
        });

        // Attempt to parse the response from the server as JSON
        // Use response.text() first to avoid errors if the response isn't valid JSON
        const responseBody = await response.text();
        let result = {};
        try {
            result = JSON.parse(responseBody);
        } catch (e) {
            console.error("Failed to parse response as JSON:", responseBody);
            result.error = `Server returned non-JSON response: ${response.status} ${response.statusText}`;
        }


        // Check if the request was successful (HTTP status code 200-299)
        if (response.ok) {
            // *** IMPORTANT: Replace alert() with a more user-friendly notification ***
            // alert("Appointment booked successfully!");
             // Show the confirmation message div
            form.style.display = 'none'; // Hide the form
            document.querySelector('.bap-form-header').style.display = 'none'; // Hide the header
            const confirmationDiv = document.getElementById('confirmation-message');
            if (confirmationDiv) {
                confirmationDiv.classList.remove('hidden'); // Make it visible
                confirmationDiv.style.display = 'block'; // Ensure it's displayed
            } else {
                 // Fallback if the confirmation div isn't found
                alert("Appointment booked successfully! Confirmation message element not found.");
                 window.location.href = "../index.html"; // Redirect fallback
            }
            // Optional: Redirect to another page after successful booking
            // window.location.href = "../index.html";
        } else {
            // If the request failed, show an error message
            // Use the error message from the server's JSON response if available, otherwise use a generic message
             // *** IMPORTANT: Replace alert() with a more user-friendly error display ***
            alert("Error booking appointment: " + (result.error || result.message || "An unknown error occurred on the server."));
        }
    } catch (error) {
        // Catch any network errors or errors during the fetch operation
        console.error("Error during booking fetch:", error);
         // *** IMPORTANT: Replace alert() with a more user-friendly error display ***
        alert("An error occurred while trying to connect to the server.");
    }
});

// --- Add CSS for the hidden class if it doesn't exist ---
// Ensure you have this style in your CSS file or add it here in a <style> tag in your HTML <head>
/*
.hidden {
    display: none;
}
*/
