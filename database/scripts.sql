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
	Status nvarchar(255),
	Address nvarchar(255),
)

create table Staff
(
	Id int identity(1,1) not null primary key,
	Name nvarchar(255) not null,
	Age int not null,
	Gender nvarchar(255) not null,
	Role nvarchar(255) not null,
	-- Doctor or Nurse
	Salary int not null,
	Shift nvarchar(255)
)

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
	Name nvarchar(255),
	StaffId int,
	Status nvarchar(255)

	FOREIGN KEY (StaffId) REFERENCES Staff (Id)
)

create table Calendar
(
	PatientId int,
	StaffId int,
	Start_Date datetime,

	FOREIGN KEY (PatientId) REFERENCES Patient (Id),
	FOREIGN KEY (StaffId) REFERENCES Staff (Id)
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

	FOREIGN KEY (StaffId) REFERENCES Staff (Id)
)
