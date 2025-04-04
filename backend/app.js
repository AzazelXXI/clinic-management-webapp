const express = require('express');
const sql = require('mssql');
const config = require('./config')
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());  // Chặn lỗi req.body là undefined
app.use(express.urlencoded({ extended: true })); // Hỗ trợ dữ liệu từ form HTML

const port = 3000;

app.get('/api/patients/list', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM Patient');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi truy vấn dữ liệu từ SQL Server');
    }
});


app.post('/api/patient/add', async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { Name, Password, Age, Email, Phone, Gender, Address } = req.body;

        if (!Name || !Password || !Age || !Email || !Phone || !Gender || !Address) {
            return res.status(400).json({ Error: "Missing fields of data input" });
        }

        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Name', sql.NVarChar, Name)
            .input('Password', sql.VarChar, Password)
            .input('Age', sql.Int, parseInt(Age))  // chuyển đổi sang số
            .input('Email', sql.NVarChar, Email)
            .input('Phone', sql.Int, parseInt(Phone)) // chuyển đổi sang số
            .input('Gender', sql.NVarChar, Gender)
            .input('Address', sql.NVarChar, Address)
            .query('INSERT INTO Patient (Name, Password, Age, Email, Phone, Gender, Address) VALUES (@Name, @Password, @Age, @Email, @Phone, @Gender, @Address)');
        res.status(200).json({ message: "Patient added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Couldn't add Patient" });
    }
});
// Login
app.post('/api/patient/login', async (req, res) => {
    try {
        const { Name, Password } = req.body;

        // Kiểm tra nếu thiếu dữ liệu
        if (!Name || !Password) {
            return res.status(400).json({ Error: "Missing username or password" });
        }

        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Name', sql.NVarChar, Name)
            .input('Password', sql.VarChar, Password)
            .query('SELECT * FROM Patient WHERE Name = @Name AND Password = @Password');

        if (result.recordset.length > 0) {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});
// Booking appointment
app.post('/api/book-appointment', async (req, res) => {
    const { name, email, phone, date, time, status } = req.body;
    const start_date = `${date} ${time}:00`;

    try {
        // 1. Tìm ID của bệnh nhân dựa trên tên
        const patientResult = await db.query('SELECT Id FROM Patient WHERE Name = ?', [name]);

        if (patientResult && patientResult.length > 0) {
            const patientId = patientResult[0].Id;

            // 2. Lưu thông tin lịch hẹn vào bảng Appointment
            const appointmentResult = await db.query(
                'INSERT INTO Appointment (PatientId, Start_Date, Status) VALUES (?, ?, ?)',
                [patientId, start_date, status]
            );

            if (appointmentResult.rowsAffected && appointmentResult.rowsAffected[0] > 0) {
                res.status(200).json({ message: 'Appointment booked successfully!' });
            } else {
                res.status(500).json({ error: 'Failed to book appointment.' });
            }
        } else {
            res.status(404).json({ error: 'Patient not found with the provided name.' });
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


app.put('/api/patient/update/:Id', async (req, res) => {
    try {
        let Id = req.params.Id; // take id from the url
        const { Name, Password, Age, Email, Phone, Gender, Status, Address } = req.body;

        if (!Id) {
            return res.status(404).json({ message: "Id not found!" });
        }

        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Id', sql.Int, Id)
            .input('Name', sql.NVarChar, Name)
            .input('Password', sql.NVarChar, Password)
            .input('Age', sql.Int, Age)
            .input('Email', sql.NVarChar, Email)
            .input('Phone', sql.Int, Phone)
            .input('Gender', sql.NVarChar, Gender)
            .input('Status', sql.NVarChar, Status)
            .input('Address', sql.NVarChar, Address)
            .query('update Patient set Name = @Name, Password = @Password, Age = @Age, Email = @Email, Phone = @Phone, Gender = @Gender, Status = @Status, Address = @Address where Id = @Id');

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ error: "Patient not found" });
        }

        res.status(200).json({ message: "Patient updated" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Couldn't update patient" });
    }
});

app.delete('/api/patient/delete/:Id', async (req, res) => {
    try {
        let Id = req.params.Id;

        console.log(Id)
        console.log(typeof Id)
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Id', sql.Int, Id)
            .query('delete from Patient where Id = @Id')
        res.status(200).json({ message: 'Deleted patient' });
    } catch (error) {
        console.log('Error: ' + error);
        res.status(500).json({ error: "Couldn't delete patient" });
    }
});
/*
    Staff API
*/
app.get('/api/staff/list', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('select * from Staff');

        res.json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error while taking data" });
    }
});

app.post('/api/staff/add', async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { Id, Name, Password, Age, Gender, Role, Salary } = req.body;

        // Kiểm tra nếu thiếu bất kỳ trường nào
        if (!Id || !Name || !Password || !Age || !Gender || !Role || !Salary) {
            return res.status(400).json({ error: "Missing fields of data input" });
        }

        let pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.VarChar, Id)
            .input('Name', sql.NVarChar, Name)
            .input('Password', sql.NVarChar, Password)
            .input('Age', sql.Int, Age)
            .input('Gender', sql.NVarChar, Gender)
            .input('Role', sql.NVarChar, Role)
            .input('Salary', sql.Int, Salary)
            .query('INSERT INTO Staff (Id, Name, Password, Age, Gender, Role, Salary) VALUES (@Id, @Name, @Password, @Age, @Gender, @Role, @Salary)');

        res.status(200).json({ message: "Staff added successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Couldn't add staff" });
    }
});
app.post('/api/staff/login', async (req, res) => {
    try {
        const { Name, Password } = req.body;

        // Kiểm tra nếu thiếu dữ liệu
        if (!Name || !Password) {
            return res.status(400).json({ Error: "Missing username or password" });
        }

        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Name', sql.NVarChar, Name)
            .input('Password', sql.VarChar, Password)
            .query('SELECT * FROM Staff WHERE Name = @Name AND Password = @Password');

        if (result.recordset.length > 0) {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

/*
    Shift API
*/
// API lấy danh sách ca làm việc
app.get('/api/shifts', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query(`
            SELECT 
                s.StaffId,
                st.Name AS StaffName,
                FORMAT(s.Start_Date, 'yyyy-MM-dd HH:mm:ss') AS StartDate,
                FORMAT(s.End_Date, 'yyyy-MM-dd HH:mm:ss') AS EndDate
            FROM Shift s
            INNER JOIN Staff st ON s.StaffId = st.Id
            ORDER BY s.Start_Date DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi truy vấn dữ liệu ca làm việc');
    }
});
// API thêm ca làm việc
app.post('/api/shifts', async (req, res) => {
    try {
        console.log('Request body:', req.body); // Thêm dòng này để debug

        const { staffId, startDate, endDate } = req.body;

        // Validation
        if (!staffId || !startDate || !endDate) {
            console.log('Validation failed: Missing fields');
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        console.log('Datetime values:', { start, end }); // Debug datetime

        if (start >= end) {
            console.log('Validation failed: End time before start time');
            return res.status(400).json({ error: 'Thời gian kết thúc phải sau thời gian bắt đầu' });
        }

        await sql.connect(config);

        // Kiểm tra staffId
        const staffCheck = await sql.query`SELECT Id FROM Staff WHERE Id = ${staffId}`;
        console.log('Staff check result:', staffCheck.recordset); // Debug staff check

        if (staffCheck.recordset.length === 0) {
            console.log('Validation failed: Staff not found');
            return res.status(404).json({ error: 'Staff ID không tồn tại' });
        }

        // Thực thi query
        const result = await sql.query`
            INSERT INTO Shift (StaffId, Start_Date, End_Date)
            VALUES (${staffId}, ${startDate}, ${endDate})
        `;
        console.log('Insert result:', result); // Debug kết quả insert

        res.status(201).json({ message: 'Ca làm việc đã được tạo' });
    } catch (err) {
        console.error('Error details:', { // Log chi tiết lỗi
            message: err.message,
            stack: err.stack,
            code: err.code
        });
        res.status(500).json({ error: 'Lỗi server khi tạo ca làm việc' });
    }
});

/*
    Medical Record API
    - Lấy danh sách hồ sơ bệnh án
    - Thêm hồ sơ bệnh án mới
*/
// API endpoint để lấy danh sách hồ sơ bệnh án từ database
app.get('/api/medical-records', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('select * from MedicalRecord');

        res.json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error while taking data" });
    }
});

// API endpoint để thêm một hồ sơ bệnh án mới vào database
app.post('/api/medical-records', async (req, res) => {
    try {
        const { patientId, staffId, Patient_Status, Start_Date, End_Date } = req.body;

        if (!patientId || !staffId || !Patient_Status || !Start_Date || !End_Date) {
            return res.status(400).json({ Error: "Vui lòng cung cấp đầy đủ thông tin: patientId, staffId, Patient_Status, Start_Date" });
        }

        // ... phần còn lại của code, sử dụng patientId và staffId (chữ thường)
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('PatientId', sql.Int, parseInt(patientId)) // Sử dụng patientId ở đây
            .input('StaffId', sql.VarChar, staffId)       // Sử dụng staffId ở đây
            .input('Patient_Status', sql.NVarChar, Patient_Status)
            .input('Start_Date', sql.DateTime, new Date(Start_Date))
            .input('End_Date', sql.DateTime, End_Date ? new Date(End_Date) : null)
            .query('INSERT INTO MedicalRecord (PatientId, StaffId, Patient_Status, Start_Date, End_Date) VALUES (@PatientId, @StaffId, @Patient_Status, @Start_Date, @End_Date)');

        res.status(200).json({ message: "Hồ sơ bệnh án đã được thêm thành công" });

    } catch (error) {
        console.error("Lỗi khi thêm hồ sơ bệnh án:", error);
        res.status(500).json({ error: "Không thể thêm hồ sơ bệnh án" });
    }
});

/*
    Start Server for api
*/
app.listen(port, () => {
    console.log("Server chạy tại http://localhost:3000")
});