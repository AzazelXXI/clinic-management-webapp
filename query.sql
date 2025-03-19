create database PhongKhamDB
go
use PhongKhamDB
go

create table Patient
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(255) not null,
	Password nvarchar(255) not null,
	Age int not null,
	Email nvarchar(255) not null,
	Phone int not null,
	Gender nvarchar(255) not null,
	Status nvarchar(255) not null,
	Address nvarchar(255) not null,
)

create table Staff
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(255) not null,
	Age int not null,
	Gender nvarchar(255) not null,
	Role nvarchar(255) not null, -- Doctor or Nurse
	Salary int not null,
	Image nvarchar(255),
	Shift nvarchar(255) not null
)
-- Hồ sơ bệnh án bác sĩ dùng để ghi lại tình trạng của bệnh nhân sau khi khám
-- Khám trong khoảng thời gian nào và hoàn thành vào thời gian nào
create table MedicalRecord
(
	Id int identity(1,1) not null primary key,
	PatientId int,
	StaffId int,
	Status nvarchar(255) not null,
	Start_Date datetime,
	End_Date datetime

	foreign key (PatientId) references Patient (Id),
	foreign key (StaffId) references Staff (Id)
)

create table ListMedication
(
	Id int identity(1,1) not null primary key,
	Amount int,
	Expire_Date datetime,
	Publisher nvarchar(255),
	Description nvarchar(255)
)

create table Room
(
	Id int identity(1,1) not null primary key,
	BranchId int not null,
	Name nvarchar(255),
	Operator nvarchar(255),
	Status nvarchar(255)
)

create table Calendar
(
	PatientId int not null,
	StaffId int not null,
	Start_Date datetime,
	End_Date datetime
)

create table Statistic
(
	Device_ID int identity(1,1) primary key,
	Device_Name nvarchar(255) not null,
	Status nvarchar(255) not null,
	Type nvarchar(255) not null,
)

create table Shift
(
	StaffId int,
	Start_Date datetime,
	End_Date datetime
)

select * from Patient

insert into Patient(Name, Password, Age, Email, Phone, Gender, Status, Address)
values 
('Trung', '123', 21, 'trunghoang1124@gmail.com', 0123456789, 'Male', 'Good', 'TPHCM'),
('Hoàng', '456', 22, 'hoang4211@gmail.com', 0987654321, 'Male', 'Cancer', 'Hà Nội');

SELECT SERVERPROPERTY('IsIntegratedSecurityOnly')

ALTER LOGIN sa WITH PASSWORD = 'KiroHoang1124@hutech.dev';
