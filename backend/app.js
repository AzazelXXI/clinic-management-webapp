const express = require('express');
const sql = require('mssql');
const config = require('./config')
const cors = require('cors');

const app = express();
app.use(cors());
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
            res.status(400).json({ Error: "Missing fields of data input" });
        }

        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Name', sql.NVarChar, Name)
            .input('Password', sql.VarChar, Password)
            .input('Age', sql.Int, Age)
            .input('Email', sql.NVarChar, Email)
            .input('Phone', sql.Int, Phone)
            .input('Gender', sql.NVarChar, Gender)
            .input('Address', sql.NVarChar, Address)
            .query('insert into Patient (Name, Password, Age, Email, Phone, Gender, Address) values (@Name, @Password, @Age, @Email, @Phone, @Gender, @Address)');
        res.status(200).json({ message: "Patient addded" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Couldn't add Patient" });
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
        const { Name, Password, Age, Email, Phone, Gender, Address } = req.body;

        if (!Name || !Password || !Age || !Email || !Phone || !Gender || !Address) {
            res.status(400).json({ Error: "Missing fields of data input" });
        }

        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Name', sql.NVarChar, Name)
            .input('Password', sql.NVarChar, Password)
            .input('Age', sql.Int, Age)
            .input('Email', sql.NVarChar, Email)
            .input('Phone', sql.Int, Phone)
            .input('Gender', sql.NVarChar, Gender)
            .input('Address', sql.NVarChar, Address)
            .query('insert into Patient (Name, Password, Age, Email, Phone, Gender, Address) values (@Name, @Password, @Age, @Email, @Phone, @Gender, @Address)');
        res.status(200).json({ message: "Patient addded" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Couldn't add Patient" });
    }
});

/*
    Start Server for api
*/
app.listen(port, () => {
    console.log("Server chạy tại http://localhost:3000")
});