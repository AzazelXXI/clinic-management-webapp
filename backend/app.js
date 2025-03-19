const express = require('express');
const sql = require('mssql');
const config = require('./config')

const app = express();
const port = 3000;

app.get('/api/get-patients-list', async (req, res) => {
    try {
        // Connection to SQL Server
        let pool = await sql.connect(config);
        // Access data from patient table
        let result = await pool.request().query('select * from Patient');

        // Return data as Json
        res.json(result.recordset);
    } catch (error) {
        console.log('Lỗi truy xuất dữ liệu: ', error);
        res.status(500).json({ error: 'Có lỗi xảy ra trong quá trình lấy dữ liệu từ bảng Patient'});
    }
});

app.post('/api/add-patient')

app.listen(port, () =>{
    console.log("Server chạy tại http://localhost:3000")
});