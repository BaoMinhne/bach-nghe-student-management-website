create database bach_nghe;
use bach_nghe;

create table student (
	student_code varchar(255) primary key,
    student_middle_name varchar(255) not null,
    student_name varchar(255) not null,
    student_date_of_birth date default null, 
    student_gender ENUM('male', 'female', 'other') DEFAULT null,
    student_address varchar(255) default null,
    student_email varchar(255) default null,
    student_phone varchar(255) default null,
    student_status varchar(255) default 'studying', -- inactive: tạm nghỉ, graduated: đã tốt nghiệp, dropout: bỏ học
    student_IDCard varchar(255) default null,
    student_country varchar(255) default null
);

-- insert --
INSERT INTO `student` VALUES ('0092/24-THUD','Dương Thị Thùy','Linh','2008-10-27','female','123 Nguyễn Văn Cừ, An Hòa, Ninh Kiều, Cần Thơ','duongthithuylinh@gmail.com','0987654567','studying','082276338767','Cần Thơ'),('0093/24-THUD','Nguyễn Thị Thúy','Linh','2009-03-06','female','123 Nguyễn Văn Cừ','nguyenthithuylinh@gmail.com','0987654567','studying','082276338767','Can Tho'),('0094/24-THUD','Trần Ngọc Phi','Long','2000-04-06','male',NULL,NULL,NULL,'studying',NULL,NULL),('0095/24-THUD','Võ Hữu','Lượng','2008-10-11','male',NULL,NULL,NULL,'studying',NULL,NULL),('0096/24-THUD','Lê Thị Xuân','Mai','2009-03-10','female',NULL,NULL,NULL,'studying',NULL,NULL),('0097/24-THUD','Hồ Duy','Mạnh','2009-04-17','male',NULL,NULL,NULL,'studying',NULL,NULL),('0098/24-THUD','Đỗ Quốc','Minh','2009-11-03','male',NULL,NULL,NULL,'studying',NULL,NULL),('0099/24-THUD','Lê Thị Sa','My','2009-09-25','female',NULL,NULL,NULL,'studying',NULL,NULL),('0100/24-THUD','Nguyễn Ngọc Ái','My','2009-03-05','female',NULL,NULL,NULL,'studying',NULL,NULL),('0101/24-THUD','Phạm Thị Diễm','My','2009-07-25','female',NULL,NULL,NULL,'studying',NULL,NULL),('0102/24-THUD','Phan Ngọc','My',NULL,'female',NULL,NULL,NULL,'studying',NULL,NULL),('0103/24-THUD','Tạ Diễm','My','2009-03-17','female',NULL,NULL,NULL,'studying',NULL,NULL),('0104/24-THUD','Nguyễn Trung','Nghĩa','2009-09-10','male',NULL,NULL,NULL,'studying',NULL,NULL),('0105/24-THUD','Nguyễn Hoàng Bảo','Ngọc','2009-10-27','female',NULL,NULL,NULL,'studying',NULL,NULL),('0106/24-THUD','Nguyễn Trần Hồng','Ngọc','2009-10-14','female',NULL,NULL,NULL,'studying',NULL,NULL),('0107/24-THUD','Lê Thành','Nhân','2009-08-11','male',NULL,NULL,NULL,'studying',NULL,NULL),('0108/24-THUD','Nguyễn Thành','Nhân','2005-09-07','male',NULL,NULL,NULL,'studying',NULL,NULL),('0109/24-THUD','Nguyễn Thiện','Nhân','2009-03-08','male',NULL,NULL,NULL,'studying',NULL,NULL),('0110/24-THUD','Trần Khánh','Nhi','2009-03-20','female',NULL,NULL,NULL,'studying',NULL,NULL),('0111/24-THUD','Nguyễn Ngọc','Nhiên','2009-10-15','female',NULL,NULL,NULL,'studying',NULL,NULL),('0112/24-THUD','Dương Tuyết','Nhung','2009-06-05','female',NULL,NULL,NULL,'studying',NULL,NULL),('0113/24-THUD','Đỗ Nguyễn Ngọc','Như','2008-11-02','female',NULL,NULL,NULL,'studying',NULL,NULL),('0114/24-THUD','Huỳnh Gia','Phú','2009-05-27','male',NULL,NULL,NULL,'studying',NULL,NULL),('0115/24-THUD','Lê Hoàng','Phú','2008-08-05','male',NULL,NULL,NULL,'studying',NULL,NULL),('0116/24-THUD','Nguyễn Thành','Phước','2008-06-23','male',NULL,NULL,NULL,'studying',NULL,NULL),('0117/24-THUD','Nguyễn Minh','Phương','2009-05-31','male',NULL,NULL,NULL,'studying',NULL,NULL),('0118/24-THUD','Nguyễn Xuân','Quốc','2009-07-04','male',NULL,NULL,NULL,'studying',NULL,NULL),('0119/24-THUD','Lê Tấn','Tài','2009-06-19','male',NULL,NULL,NULL,'studying',NULL,NULL),('0120/24-THUD','Trần Linh','Tâm','2006-07-29','male',NULL,NULL,NULL,'studying',NULL,NULL),('0121/24-THUD','Lê Như','Tiên','2009-12-25','female',NULL,NULL,NULL,'studying',NULL,NULL),('0122/24-THUD','Nguyễn Thị Cẩm','Tiên','2008-07-18','female',NULL,NULL,NULL,'studying',NULL,NULL),('0123/24-THUD','Đào Vũ','Thanh','2009-08-20','male',NULL,NULL,NULL,'studying',NULL,NULL),('0124/24-THUD','Nguyễn Minh','Thuận','2009-06-05','male',NULL,NULL,NULL,'studying',NULL,NULL),('0125/24-THUD','Nguyễn Phương','Thùy','2008-02-09','female',NULL,NULL,NULL,'studying',NULL,NULL),('0126/24-THUD','Nguyễn','Thư','2009-09-09','female',NULL,NULL,NULL,'studying',NULL,NULL),('0127/24-THUD','Nguyễn Hoài','Thương','2009-09-25','male',NULL,NULL,NULL,'studying',NULL,NULL),('0128/24-THUD','Huỳnh Diễm','Thy','2008-05-25','female',NULL,NULL,NULL,'studying',NULL,NULL),('0129/24-THUD','Võ Minh','Trí','2009-09-07','male',NULL,NULL,NULL,'studying',NULL,NULL),('0130/24-THUD','Đoàn Minh','Trực','2009-10-12','male',NULL,NULL,NULL,'studying',NULL,NULL),('0131/24-THUD','Lê Nhựt','Trường','2009-01-21','male',NULL,NULL,NULL,'studying',NULL,NULL),('0132/24-THUD','Dương Ngọc Phương','Uyên','2009-05-15','female',NULL,NULL,NULL,'studying',NULL,NULL),('0133/24-THUD','Võ Quang','Vinh','2009-04-03','male',NULL,NULL,NULL,'studying',NULL,NULL),('0134/24-THUD','Nguyễn Quốc','Vui','2009-04-24','male',NULL,NULL,NULL,'studying',NULL,NULL),('0135/24-THUD','Huỳnh Gia','Yến','2009-09-19','female',NULL,NULL,NULL,'studying',NULL,NULL);
-- select --
select * from student;
delete from student where student_code between '0139/24-THUD' and '239/25-THUD'; 
-- --- --- -

create table teacher (
	teacher_code varchar(255) primary key,
    teacher_name varchar(255) not null,
    teacher_date_of_birth date default null, 
    teacher_gender ENUM('male', 'female', 'other') DEFAULT null,
    teacher_address varchar(255) default null,
    teacher_email varchar(255) default null,
    teacher_phone varchar(255) default null,
    teacher_status varchar(255) default 'teaching' -- on_leave: nghỉ phép, resigned: nghỉ việc, retired: nghỉ hưu
);

-- insert -- 
INSERT INTO `teacher` VALUES ('GV001','Nguyễn Văn A','1995-05-29','female','456 Trần Hoàng Na','nguyenvana@gmail.com','0795654231','teaching'),('GV002','Trần Thị B',NULL,NULL,NULL,NULL,NULL,'teaching'),('GV003','Trần Văn Thịnh',NULL,NULL,NULL,NULL,NULL,'teaching');
-- ---- --- -
-- select --
select * from teacher;
-- update --
UPDATE teacher 
SET 
  teacher_code = 'GV00003'
WHERE teacher_code = 'GV003';
-- --- --- -
-- delete --
delete from teacher where teacher_code = 'GV00004'; 
-- --- --- -

create table system_user (
	user_id int auto_increment primary key,
    user_username varchar(255) not null unique,
    user_pass varchar(255) not null,
    user_role int not null default 1, -- 0: admin, 1: sinh viên, 2: giảng viên
    user_status int default 1 -- 1: active, 0: locked
);

-- insert --
INSERT INTO `system_user` VALUES 
 (1,'admin','admin',0,1),(2,'0092/24-THUD','1',1,1),(3,'GV00002','1',2,1), (4,'GV00003','1',2,1);
-- select --
select * from system_user;
update system_user
set user_username = 'GV00003' where user_id = 4;
-- ---- --- -

create table course (
	course_id int auto_increment primary key,
    course_code varchar(255) not null unique,
    course_name varchar(255) not null,
    course_status int default 1 -- 1: active, 2: cancled 
);

-- insert --
INSERT INTO `course` VALUES (1,'HDDL','Hướng dẫn du lịch',1),(2,'KTDN','Kế toán doanh nghiệp',1),(3,'THUD','Tin học ứng dụng',1);
-- --- --- ---

create table location (
	loca_code varchar(255) primary key, 
    loca_name varchar(255) not null unique,
    loca_address varchar(255) default null
);

-- insert --
INSERT INTO `location` VALUES ('BM','Bình Minh',NULL),('BT','Bình Tân',NULL),('CT','Châu Thành',NULL),('NB','Ngã Bảy',NULL),('PD','Phong Điền',NULL),('TB','Tam Bình',NULL);
-- --- --- -

create table class (
	class_id int auto_increment primary key,
    class_code varchar(255) not null unique,
    class_name varchar(255) default null,
    class_course_id INT DEFAULT NULL,
    class_loca_code VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (class_course_id) REFERENCES course(course_id),
    FOREIGN KEY (class_loca_code) REFERENCES location(loca_code)
);

-- insert --
INSERT INTO `class` VALUES (1,'PD-HDDL-01','HDDL Phong Điền',1,'PD'),(2,'TB-THUD-01','THUD Tam Bình',3,'TB'),(3,'NBHG-THK02-2','Lớp Tin học Ngã Bảy K02-2',3,'NB'),(4,'BT-HDDL-35','HDDL Bình Tân (35)',1,'BT'),(5,'BT-KTDN-01','KTDN Bình Tân',2,'BT');
-- -- -- --

-- Bảng semester
CREATE TABLE semester (
    semester_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    semester_number INT NOT NULL, -- 1, 2, 3, 4
    semester_start_date DATE DEFAULT NULL,
    semester_end_date DATE DEFAULT NULL,
    FOREIGN KEY (class_id) REFERENCES class(class_id),
    UNIQUE (class_id, semester_number)
);

-- insert --
INSERT INTO `semester` VALUES (1,1,1,'2024-10-01','2025-03-01'),(2,1,2,'2025-03-15','2025-09-15'),(3,1,3,'2025-09-29','2026-03-01'),(4,1,4,'2026-03-15','2026-10-14'),(5,2,1,'2024-10-29','2025-03-29'),(6,2,2,'2025-04-12','2025-10-13'),(7,2,3,'2025-10-27','2026-01-31'),(8,2,4,'2026-02-14','2026-08-14'),(9,3,1,'2025-01-21','2025-06-21'),(10,3,2,'2025-07-05','2026-01-04'),(11,3,3,'2026-01-18','2026-07-19'),(12,3,4,'2026-08-02','2027-02-01'),(13,4,1,'2024-11-07','2025-04-07'),(14,4,2,'2025-04-21','2025-10-21'),(15,4,3,'2025-11-04','2026-04-04'),(16,4,4,'2026-04-18','2026-10-19'),(17,5,1,'2024-11-07','2025-04-07'),(18,5,2,'2025-04-21','2025-10-21'),(19,5,3,'2025-11-04','2026-04-04'),(20,5,4,'2026-04-18','2026-10-19');
-- --- --- -

CREATE TABLE module (
    module_id INT AUTO_INCREMENT PRIMARY KEY,
    module_code VARCHAR(50) NOT NULL UNIQUE,        
    module_name VARCHAR(255) NOT NULL,              
    module_credit INT DEFAULT 1,                    
    module_status INT DEFAULT 1             -- 1: active, 0: inactive
);

-- insert --
INSERT INTO `module` VALUES (1,'MH01','Giáo dục chính trị',1,1),(2,'MH05','Tin học',2,1),(3,'MH06','Tiếng Anh',2,1),(4,'MH07','Lập trình cơ bản',3,1),(34,'MH02','Giáo dục thể chất',1,1),(35,'MH03','Quản lý doanh nghiệp',3,1),(36,'MH08','Cấu trúc dữ liệu & giải thuật',4,1),(37,'MH09','Phân tích thiết kế thuật toán',4,1),(38,'MH10','Cơ sở dữ liệu',4,1),(39,'MH11','Xác xuất thống kê',2,1),(40,'MH12','Toán rời rạc',2,1),(41,'MH13','Lập trình hướng đối tượng',4,1),(42,'MH14','Hệ quản trị cơ sở dữ liệu',4,1),(43,'MH15','Lập trình Web',4,1),(44,'MH16','Công nghệ và dịch vụ Web',4,1),(45,'MH17','Lập trình cho các thiết bị di động',4,1),(46,'MH18','Nguyên lý máy học',2,1),(47,'MH04','Tiếng Pháp',2,1);
-- --- -- --
select * from module;
-- --- -- --

CREATE TABLE class_student (
    class_student_id INT AUTO_INCREMENT PRIMARY KEY,
    class_subject_id INT NOT NULL,
    student_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (class_subject_id) REFERENCES class_subject(class_subject_id),
    FOREIGN KEY (student_code) REFERENCES student(student_code),
    UNIQUE (class_subject_id, student_code)
);

-- insert --
INSERT INTO `class_student` VALUES (2,1,'0093/24-THUD'),(3,1,'0094/24-THUD'),(4,1,'0095/24-THUD'),(16,1,'0096/24-THUD'),(17,1,'0097/24-THUD'),(18,1,'0098/24-THUD'),(19,1,'0099/24-THUD'),(20,1,'0100/24-THUD'),(5,1,'0102/24-THUD'),(31,1,'0135/24-THUD'),(6,2,'0092/24-THUD'),(7,2,'0093/24-THUD'),(8,2,'0094/24-THUD'),(9,2,'0095/24-THUD'),(21,2,'0096/24-THUD'),(22,2,'0097/24-THUD'),(23,2,'0098/24-THUD'),(24,2,'0099/24-THUD'),(25,2,'0100/24-THUD'),(10,2,'0102/24-THUD'),(32,2,'0135/24-THUD'),(83,3,'0092/24-THUD'),(12,3,'0093/24-THUD'),(13,3,'0094/24-THUD'),(14,3,'0095/24-THUD'),(26,3,'0096/24-THUD'),(27,3,'0097/24-THUD'),(28,3,'0098/24-THUD'),(29,3,'0099/24-THUD'),(30,3,'0100/24-THUD'),(15,3,'0102/24-THUD'),(33,3,'0135/24-THUD'),(34,5,'0092/24-THUD'),(35,5,'0093/24-THUD'),(36,5,'0094/24-THUD'),(37,5,'0095/24-THUD'),(38,5,'0096/24-THUD'),(85,6,'0092/24-THUD'),(40,6,'0093/24-THUD'),(41,6,'0094/24-THUD'),(42,6,'0095/24-THUD'),(43,6,'0096/24-THUD'),(80,7,'0092/24-THUD'),(81,8,'0092/24-THUD'),(44,8,'0097/24-THUD'),(45,8,'0098/24-THUD'),(46,8,'0099/24-THUD'),(47,8,'0100/24-THUD'),(48,8,'0101/24-THUD'),(82,9,'0092/24-THUD'),(49,9,'0097/24-THUD'),(50,9,'0098/24-THUD'),(51,9,'0099/24-THUD'),(52,9,'0100/24-THUD'),(53,9,'0101/24-THUD'),(54,10,'0102/24-THUD'),(55,10,'0103/24-THUD'),(56,10,'0104/24-THUD'),(57,10,'0105/24-THUD'),(58,10,'0106/24-THUD'),(59,11,'0102/24-THUD'),(60,11,'0103/24-THUD'),(61,11,'0104/24-THUD'),(62,11,'0105/24-THUD'),(63,11,'0106/24-THUD'),(64,12,'0107/24-THUD'),(65,12,'0108/24-THUD'),(66,12,'0109/24-THUD'),(67,12,'0110/24-THUD'),(68,12,'0111/24-THUD'),(69,13,'0107/24-THUD'),(70,13,'0108/24-THUD'),(71,13,'0109/24-THUD'),(72,13,'0110/24-THUD'),(73,13,'0111/24-THUD'),(79,19,'0130/24-THUD'),(78,19,'0131/24-THUD'),(77,19,'0132/24-THUD'),(76,19,'0133/24-THUD'),(75,19,'0134/24-THUD'),(74,19,'0135/24-THUD'),(86,20,'0092/24-THUD'),(87,20,'0093/24-THUD'),(88,20,'0094/24-THUD'),(89,20,'0095/24-THUD'),(90,20,'0096/24-THUD'),(91,20,'0097/24-THUD'),(92,21,'0092/24-THUD'),(93,21,'0093/24-THUD'),(94,21,'0094/24-THUD'),(95,21,'0095/24-THUD'),(96,21,'0096/24-THUD'),(97,21,'0097/24-THUD'),(98,22,'0092/24-THUD'),(99,22,'0093/24-THUD'),(100,22,'0094/24-THUD'),(101,22,'0095/24-THUD'),(102,22,'0096/24-THUD'),(103,22,'0097/24-THUD'),(104,23,'0092/24-THUD'),(105,23,'0093/24-THUD'),(106,23,'0094/24-THUD'),(107,23,'0095/24-THUD'),(108,23,'0096/24-THUD'),(109,23,'0097/24-THUD');
-- --- -- --
-- select --
select * from class_student where class_subject_id = 23;
-- -- - --- -
-- delete --
delete from class_student where class_student_id between 2 and 169;
-- --- --- -

CREATE TABLE class_subject (
    class_subject_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    module_id INT NOT NULL,
    semester_id INT DEFAULT NULL,
    class_status ENUM('active', 'inactive', 'completed', 'draft') DEFAULT 'active', 
    FOREIGN KEY (class_id) REFERENCES class(class_id),
    FOREIGN KEY (module_id) REFERENCES module(module_id),
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id)
);

/*
ALTER TABLE class_subject ADD COLUMN class_status ENUM(
  'active',       -- Đang hoạt động
  'inactive',     -- Tạm dừng hoạt động
  'completed',    -- Đã kết thúc (học xong)
  'draft'         -- Đang chuẩn bị, chưa chính thức
) DEFAULT 'active';
*/

-- insert --
INSERT INTO `class_subject` VALUES (1,3,1,9),(2,3,2,9),(3,3,3,9),(4,1,1,2),(5,3,1,9),(6,3,2,9),(7,3,3,9),(8,3,4,10),(9,1,1,2),(10,1,3,2),(11,1,4,3),(12,2,1,5),(13,2,2,6),(15,4,2,14),(16,5,3,17),(17,5,4,18),(18,4,3,13),(19,4,3,13),(20,5,46,1),(21,5,45,17),(22,2,41,5),(23,2,42,5);
-- --- --- -
-- select --
select * from class_subject;
-- delete --
delete from class_subject where class_subject_id between 1 and 28;
-- --- --- -

 
CREATE TABLE teacher_subject_class (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_code VARCHAR(255) NOT NULL,
    class_subject_id INT NOT NULL,
    FOREIGN KEY (teacher_code) REFERENCES teacher(teacher_code) ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (class_subject_id) REFERENCES class_subject(class_subject_id),
    UNIQUE (teacher_code, class_subject_id) -- Đảm bảo một giảng viên chỉ được gán một lần cho mỗi lớp học phần
);

-- insert -- 
INSERT INTO `teacher_subject_class` VALUES (1,'GV001',1),(5,'GV001',5),(8,'GV001',8),(10,'GV001',10),(2,'GV002',2),(9,'GV002',9),(11,'GV002',11),(15,'GV002',19),(16,'GV002',20),(17,'GV002',21),(18,'GV002',22),(19,'GV002',23),(3,'GV003',3),(4,'GV003',4),(6,'GV003',6),(7,'GV003',7),(12,'GV003',12),(13,'GV003',13);
-- --- --- -
-- select --
select * from teacher_subject_class;
-- --- -- --
-- delete --
delete from teacher_subject_class where id between 1 and 24;
-- --- --- -

CREATE TABLE score (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_subject_id INT NOT NULL,
    student_code VARCHAR(255) NOT NULL,
    score DECIMAL(5,2) DEFAULT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_subject_id) REFERENCES class_subject(class_subject_id),
    FOREIGN KEY (student_code) REFERENCES student(student_code),
    UNIQUE (class_subject_id, student_code)
);

-- insert --
INSERT INTO `score` VALUES (11,5,'0092/24-THUD',8.90),(12,5,'0093/24-THUD',NULL),(13,5,'0094/24-THUD',NULL),(14,5,'0095/24-THUD',NULL),(15,5,'0096/24-THUD',NULL),(19,6,'0093/24-THUD',NULL),(20,6,'0094/24-THUD',NULL),(21,6,'0095/24-THUD',NULL),(22,6,'0096/24-THUD',NULL),(25,8,'0097/24-THUD',NULL),(26,8,'0098/24-THUD',NULL),(27,8,'0099/24-THUD',NULL),(28,8,'0100/24-THUD',NULL),(29,8,'0101/24-THUD',NULL),(32,9,'0097/24-THUD',9.00),(33,9,'0098/24-THUD',NULL),(34,9,'0099/24-THUD',NULL),(35,9,'0100/24-THUD',NULL),(36,9,'0101/24-THUD',NULL),(39,10,'0102/24-THUD',NULL),(40,10,'0103/24-THUD',NULL),(41,10,'0104/24-THUD',NULL),(42,10,'0105/24-THUD',NULL),(43,10,'0106/24-THUD',NULL),(46,11,'0102/24-THUD',1.00),(47,11,'0103/24-THUD',6.00),(48,11,'0104/24-THUD',7.00),(49,11,'0105/24-THUD',8.00),(50,11,'0106/24-THUD',9.00),(53,12,'0107/24-THUD',NULL),(54,12,'0108/24-THUD',NULL),(55,12,'0109/24-THUD',NULL),(56,12,'0110/24-THUD',NULL),(57,12,'0111/24-THUD',NULL),(60,13,'0107/24-THUD',NULL),(61,13,'0108/24-THUD',NULL),(62,13,'0109/24-THUD',NULL),(63,13,'0110/24-THUD',NULL),(64,13,'0111/24-THUD',NULL),(67,7,'0092/24-THUD',3.90),(68,8,'0092/24-THUD',6.50),(71,6,'0092/24-THUD',7.80),(72,20,'0092/24-THUD',4.00),(73,20,'0093/24-THUD',NULL),(74,20,'0094/24-THUD',NULL),(75,20,'0095/24-THUD',NULL),(76,20,'0096/24-THUD',NULL),(77,20,'0097/24-THUD',NULL),(78,21,'0092/24-THUD',5.00),(79,21,'0093/24-THUD',NULL),(80,21,'0094/24-THUD',NULL),(81,21,'0095/24-THUD',NULL),(82,21,'0096/24-THUD',NULL),(83,21,'0097/24-THUD',NULL),(84,22,'0092/24-THUD',6.00),(85,22,'0093/24-THUD',NULL),(86,22,'0094/24-THUD',NULL),(87,22,'0095/24-THUD',NULL),(88,22,'0096/24-THUD',NULL),(89,22,'0097/24-THUD',NULL),(90,23,'0092/24-THUD',9.00),(91,23,'0093/24-THUD',9.50),(92,23,'0094/24-THUD',NULL),(93,23,'0095/24-THUD',NULL),(94,23,'0096/24-THUD',NULL),(95,23,'0097/24-THUD',NULL),(100,9,'0092/24-THUD',9.00),(101,19,'0130/24-THUD',2.00),(102,19,'0131/24-THUD',3.00),(103,19,'0132/24-THUD',1.00),(104,19,'0133/24-THUD',NULL),(105,19,'0134/24-THUD',NULL),(106,19,'0135/24-THUD',NULL),(108,2,'0092/24-THUD',2.00),(109,2,'0093/24-THUD',10.00),(110,2,'0094/24-THUD',7.50),(111,2,'0095/24-THUD',NULL),(112,2,'0096/24-THUD',NULL),(113,2,'0097/24-THUD',NULL),(114,2,'0098/24-THUD',NULL),(115,2,'0099/24-THUD',NULL),(116,2,'0100/24-THUD',NULL),(117,2,'0102/24-THUD',NULL),(118,2,'0135/24-THUD',NULL);
-- --- --- -
-- select -- 
select * from score;
-- delete --
delete from score where id between 12 and 172;
-- --- --- -

CREATE TABLE certificate (
    certificate_id INT AUTO_INCREMENT PRIMARY KEY,
    student_code VARCHAR(255) NOT NULL,
    class_subject_id INT NOT NULL,
    cert_number VARCHAR(100) UNIQUE NOT NULL, -- số hiệu chứng chỉ
    issued_date DATE NOT NULL,
    note TEXT DEFAULT NULL,
    FOREIGN KEY (student_code) REFERENCES student(student_code),
    FOREIGN KEY (class_subject_id) REFERENCES class_subject(class_subject_id)
);
-- --- --- -
-- select -- 
select * from certificate;
-- -- - --- -