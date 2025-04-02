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
app.post('/api/appointment/book', async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { Name, Email, Phone, Start_Date, Status } = req.body;

        // Kiểm tra các trường dữ liệu yêu cầu
        if (!Name || !Email || !Phone || !Start_Date || !Status) {
            return res.status(400).json({ error: "Missing fields of data input" });
        }

        // Lấy ID bệnh nhân dựa trên email (giả sử email là duy nhất)
        let pool = await sql.connect(config);
        let patientResult = await pool.request()
            .input('Email', sql.NVarChar, Email)
            .query('SELECT Id FROM Patient WHERE Email = @Email');

        if (patientResult.recordset.length === 0) {
            return res.status(404).json({ error: "Patient not found" });
        }

        const PatientId = patientResult.recordset[0].Id;

        // Giả định StaffId là một bác sĩ mặc định (sau này có thể cho người dùng chọn)
        const defaultStaffId = "DOC123";

        // Thêm cuộc hẹn vào bảng Appointment
        await pool.request()
            .input('PatientId', sql.Int, PatientId)
            .input('StaffId', sql.NVarChar, defaultStaffId)
            .input('Start_Date', sql.DateTime, Start_Date)
            .input('Status', sql.NVarChar, Status)  // Truyền thông tin Status (tình trạng bệnh nhân)
            .query('INSERT INTO Appointment (PatientId, StaffId, Start_Date, Status) VALUES (@PatientId, @StaffId, @Start_Date, @Status)');

        res.status(200).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Couldn't book appointment" });
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
    Start Server for api
*/
app.listen(port, () => {
    console.log("Server chạy tại http://localhost:3000")
});