﻿use PhongKhamDB
go

drop table Patient
drop table MedicalRecord
drop table Staff
drop table ListMedication
drop table Room
drop table Calendar
drop table Statistic
drop table Shift

select * from Patient
select * from Staff
select * from ListMedication
select * from MedicalRecord
select * from Room
select * from Calendar
select * from Statistic
select * from Shift

insert into Patient(Name, Password, Age, Email, Phone, Gender, Status, Address)
values 
('Trung', '123', 21, 'trunghoang1124@gmail.com', 0123456789, 'Male', 'Good', N'TPHCM'),
('Hoàng', '456', 22, 'hoang4211@gmail.com', 0987654321, 'Male', 'Cancer', N'Hà Nội');

SELECT SERVERPROPERTY('IsIntegratedSecurityOnly')

ALTER LOGIN sa WITH PASSWORD = 'KiroHoang1124@hutech.dev';