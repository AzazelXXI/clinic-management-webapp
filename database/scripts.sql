create database PhongKhamDB
go
use PhongKhamDB
go

create table Patient
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(255) not null,
	Password varchar(255) not null,
	Age int not null,
	Email nvarchar(255) not null,
	Phone int not null,
	Gender nvarchar(255) not null,
	Address nvarchar(255)
)

create table Staff
(
	Id varchar(255) not null primary key,
	Name nvarchar(255) not null,
	Password varchar(255) not null,
	Age int not null,
	Gender varchar(255) not null,
	Role varchar(255) not null,
	-- Doctor, Nurse, Receptionist, Pharmacist
	Salary int not null,
)

create table MedicalRecord
(
	Id int identity(1,1) not null primary key,
	PatientId int,
	StaffId varchar(255),
	Patient_Status nvarchar(255) not null,
	Start_Date datetime,
	End_Date datetime,

	foreign key (PatientId) references Patient (Id),
	foreign key (StaffId) references Staff (Id)
)

create table MedicalStorage
(
	Id varchar(255) not null primary key,
	StaffId varchar(255),
	Quantity int,
	Expire_Date datetime,
	Publisher nvarchar(255),
	Description nvarchar(255),

	foreign key (StaffId) references Staff (Id)
)

create table Room
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(255),
	StaffId varchar(255),
	DeviceId varchar(255),
	Status nvarchar(255),

	FOREIGN KEY (StaffId) REFERENCES Staff (Id),
	FOREIGN KEY (DeviceId) REFERENCES Device (DeviceId)
)

create table Appointment
(
	PatientId int,
	StaffId varchar(255),
	Start_Date datetime,
	Status varchar(255),

	FOREIGN KEY (PatientId) REFERENCES Patient (Id),
	FOREIGN KEY (StaffId) REFERENCES Staff (Id)
)

create table Device
(
	DeviceId varchar(255) primary key,
	Device_Name nvarchar(255) not null,
	Status nvarchar(255) not null,
	Type varchar(255) not null,
	Description varchar(255) not null
)

create table Shift
(
	StaffId varchar(255),
	Start_Date datetime,
	End_Date datetime,

	FOREIGN KEY (StaffId) REFERENCES Staff (Id)
)

CREATE INDEX IX_Appointment_PatientId ON Appointment (PatientId);
CREATE INDEX IX_Appointment_StaffId ON Appointment (StaffId);
CREATE INDEX IX_Appointment_StartDate ON Appointment (Start_Date);
CREATE INDEX IX_Patient_Email ON Patient (Email);
CREATE INDEX IX_Patient_Phone ON Patient (Phone);