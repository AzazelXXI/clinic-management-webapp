use PhongKhamDB
go

select * from Patient
select * from Staff
select * from MedicalStorage
select * from MedicalRecord
select * from Room
select * from Appointment
select * from Device
select * from Shift

--------------------------------------------------------
-- 1. Insert data vào bảng Staff (Nhân viên)
--------------------------------------------------------
INSERT INTO Staff (Id, Name, Password, Age, Gender, Role, Salary) 
VALUES
('S001', 'Dr. John Smith', 'pass123', 45, 'Male', 'Doctor', 12000),
('S002', 'Nurse Emily', 'nurse456', 32, 'Female', 'Nurse', 8000),
('S003', 'Mr. David', 'reception789', 28, 'Male', 'Receptionist', 6000),
('S004', 'Ms. Anna', 'pharma000', 35, 'Female', 'Pharmacist', 9000);

--------------------------------------------------------
-- 2. Insert data vào bảng Patient (Bệnh nhân)
--------------------------------------------------------
INSERT INTO Patient (Name, Password, Age, Email, Phone, Gender, Address) 
VALUES
('Alice Brown', 'alicepw', 30, 'alice@email.com', 0912345678, 'Female', '123 Main St'),
('Bob Green', 'bobpass', 45, 'bob@email.com', 0987654321, 'Male', '456 Park Ave'),
('Charlie Black', 'charliepw', 28, 'charlie@email.com', 0974123654, 'Male', '789 Oak Rd');

--------------------------------------------------------
-- 3. Insert data vào bảng Device (Thiết bị)
--------------------------------------------------------
INSERT INTO Device (DeviceId, Device_Name, Status, Type, Description) 
VALUES
('D001', 'MRI Machine', 'Available', 'Imaging', 'High-field MRI Scanner'),
('D002', 'X-Ray Machine', 'In Use', 'Imaging', 'Digital X-Ray System'),
('D003', 'Ultrasound', 'Maintenance', 'Diagnostic', 'Portable Ultrasound Device');

--------------------------------------------------------
-- 4. Insert data vào bảng Room (Phòng)
--------------------------------------------------------
INSERT INTO Room (Name, StaffId, DeviceId, Status) 
VALUES
('MRI Room', 'S001', 'D001', 'Occupied'),
('X-Ray Room', 'S002', 'D002', 'Available'),
('Examination Room', 'S003', NULL, 'Ready');

--------------------------------------------------------
-- 5. Insert data vào MedicalStorage (Kho thuốc)
--------------------------------------------------------
INSERT INTO MedicalStorage (Id, StaffId, Quantity, Expire_Date, Publisher, Description) 
VALUES
('M001', 'S004', 100, '2025-12-31', 'Pharma Corp', 'Paracetamol 500mg'),
('M002', 'S004', 50, '2024-06-30', 'Medi Labs', 'Amoxicillin 250mg');

--------------------------------------------------------
-- 6. Insert data vào MedicalRecord (Hồ sơ bệnh án)
--------------------------------------------------------
INSERT INTO MedicalRecord (StaffId, Patient_Status, Start_Date, End_Date) 
VALUES
('S001', 'Stable', '2023-10-01 09:00:00', '2023-10-05 17:00:00'),
('S002', 'Recovering', '2023-10-02 10:30:00', NULL);

--------------------------------------------------------
-- 7. Insert data vào Appointment (Cuộc hẹn)
--------------------------------------------------------
INSERT INTO Appointment (PatientId, StaffId, Start_Date, Status) 
VALUES
(1, 'S001', '2023-11-01 14:00:00', 'Confirmed'),
(2, 'S002', '2023-11-02 10:00:00', 'Pending');

--------------------------------------------------------
-- 8. Insert data vào Shift (Ca làm việc) - ĐÃ SỬA LỖI
--------------------------------------------------------
INSERT INTO Shift (StaffId, Start_Date, End_Date) 
VALUES
('S001', '2023-10-10 08:00:00', '2023-10-10 16:00:00'), -- Giờ kết thúc 16:00
('S002', '2023-10-10 16:00:00', '2023-10-10 23:59:59'); -- Sửa 24:00 → 23:59:59

-- Tắt kiểm tra ràng buộc tạm thời (nếu cần)
EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'

-- 1. Xóa dữ liệu từ bảng Shift
DELETE FROM Shift;

-- 2. Xóa dữ liệu từ bảng Appointment
DELETE FROM Appointment;

-- 3. Xóa dữ liệu từ bảng MedicalRecord
DELETE FROM MedicalRecord;

-- 4. Xóa dữ liệu từ bảng MedicalStorage
DELETE FROM MedicalStorage;

-- 5. Xóa dữ liệu từ bảng Room
DELETE FROM Room;

-- 6. Xóa dữ liệu từ bảng Device
DELETE FROM Device;

-- 7. Xóa dữ liệu từ bảng Patient
DELETE FROM Patient;

-- 8. Cuối cùng xóa dữ liệu từ bảng Staff
DELETE FROM Staff;

-- Bật lại kiểm tra ràng buộc
EXEC sp_msforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL'