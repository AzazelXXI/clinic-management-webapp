use PhongKhamDB
go

drop table MedicalRecord
drop table Calendar
drop table Room
drop table Patient
drop table Shift
drop table Staff
drop table ListMedication
drop table Device

select * from Patient
select * from Staff
select * from MedicalStorage
select * from MedicalRecord
select * from Room
select * from Appointment
select * from Device
select * from Shift

insert into Patient(Name, Password, Age, Email, Phone, Gender, Address)
values 
('John Doe', '123', 21, 'trunghoang1124@gmail.com', 0123456789, 'Male', 'New York'),
('Mr.EHe', '456', 22, 'hoang4211@gmail.com', 0987654321, 'Male', 'Canada');
