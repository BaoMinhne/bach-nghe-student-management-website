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
    student_status varchar(255) default 'studying',
    student_IDCard varchar(255) default null,
    student_country varchar(255) default null
);
select * from student;
create table teacher (
	teacher_code varchar(255) primary key,
    teacher_name varchar(255) not null,
    teacher_date_of_birth date default null, 
    teacher_gender ENUM('male', 'female', 'other') DEFAULT null,
    teacher_address varchar(255) default null,
    teacher_email varchar(255) default null,
    teacher_phone varchar(255) default null,
    teacher_status varchar(255) default 'teaching'
);

create table system_user (
	user_id int auto_increment primary key,
    user_username varchar(255) not null unique,
    user_pass varchar(255) not null,
    user_role int not null default 1, -- 0: admin, 1: sinh viên, 2: giảng viên
    user_status int default 1 -- 1: active, 0: locked
);
select * from system_user;

create table course (
	course_id int auto_increment primary key,
    course_code varchar(255) not null unique,
    course_name varchar(255) not null,
    course_status int default 1 -- 1: active, 2: cancled 
);

create table location (
	loca_code varchar(255) primary key, 
    loca_name varchar(255) not null unique,
    loca_address varchar(255) default null
);

create table class (
	class_id int auto_increment primary key,
    class_code varchar(255) not null unique,
    class_name varchar(255) default null,
    class_course_id INT DEFAULT NULL,
    class_loca_code VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (class_course_id) REFERENCES course(course_id),
    FOREIGN KEY (class_loca_code) REFERENCES location(loca_code)
);

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

CREATE TABLE module (
    module_id INT AUTO_INCREMENT PRIMARY KEY,
    module_code VARCHAR(50) NOT NULL UNIQUE,        
    module_name VARCHAR(255) NOT NULL,              
    module_credit INT DEFAULT 1,                    
    module_status INT DEFAULT 1             -- 1: active, 0: inactive
);

CREATE TABLE class_student (
    class_student_id INT AUTO_INCREMENT PRIMARY KEY,
    class_subject_id INT NOT NULL,
    student_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (class_subject_id) REFERENCES class_subject(class_subject_id),
    FOREIGN KEY (student_code) REFERENCES student(student_code),
    UNIQUE (class_subject_id, student_code)
);

CREATE TABLE class_subject (
    class_subject_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    module_id INT NOT NULL,
    semester_id INT DEFAULT NULL,
    FOREIGN KEY (class_id) REFERENCES class(class_id),
    FOREIGN KEY (module_id) REFERENCES module(module_id),
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id)
);

 
CREATE TABLE teacher_subject_class (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_code VARCHAR(255) NOT NULL,
    class_subject_id INT NOT NULL,
    FOREIGN KEY (teacher_code) REFERENCES teacher(teacher_code),
    FOREIGN KEY (class_subject_id) REFERENCES class_subject(class_subject_id),
    UNIQUE (teacher_code, class_subject_id) -- Đảm bảo một giảng viên chỉ được gán một lần cho mỗi lớp học phần
);

CREATE TABLE score (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_subject_id INT NOT NULL,
    student_code VARCHAR(255) NOT NULL,
    score DECIMAL(5,2) DEFAULT NULL,
    FOREIGN KEY (class_subject_id) REFERENCES class_subject(class_subject_id),
    FOREIGN KEY (student_code) REFERENCES student(student_code),
    UNIQUE (class_subject_id, student_code)
);

INSERT INTO system_user (user_username, user_pass, user_role)
VALUES ('admin', 'admin', 0);

INSERT INTO location (loca_code, loca_name) VALUES
('PD', 'Phong Điền'),	
('BM', 'Bình Minh'),
('BT', 'Bình Tân'),
('TB', 'Tam Bình'),
('CT', 'Châu Thành'),
('NB', 'Ngã Bảy');

INSERT INTO course (course_code, course_name, course_status) VALUES
('HDDL', 'Hướng dẫn du lịch', 1),
('KTDN', 'Kế toán doanh nghiệp', 1),
('THUD', 'Tin học ứng dụng', 1);

INSERT INTO class (class_code, class_name, class_course_id, class_loca_code) VALUES
('PD-HDDL-01', 'HDDL Phong Điền', 1, 'PD'),
('TB-THUD-01', 'THUD Tam Bình', 3, 'TB'),
('NBHG-THK02-2', 'Lớp Tin học Ngã Bảy K02-2', 3, 'NB'),
('BT-HDDL-35', 'HDDL Bình Tân (35)', 1, 'BT'),
('BT-KTDN-01', 'KTDN Bình Tân', 2, 'BT');

INSERT INTO semester (class_id, semester_number, semester_start_date, semester_end_date) VALUES
(1, 1, '2024-10-01', '2025-03-01'),
(1, 2, '2025-03-15', '2025-09-15'),
(1, 3, '2025-09-29', '2026-03-01'),
(1, 4, '2026-03-15', '2026-10-14'),
(2, 1, '2024-10-29', '2025-03-29'),
(2, 2, '2025-04-12', '2025-10-13'),
(2, 3, '2025-10-27', '2026-01-31'),
(2, 4, '2026-02-14', '2026-08-14'),
(3, 1, '2025-01-21', '2025-06-21'),
(3, 2, '2025-07-05', '2026-01-04'),
(3, 3, '2026-01-18', '2026-07-19'),
(3, 4, '2026-08-02', '2027-02-01'),
(4, 1, '2024-11-07', '2025-04-07'),
(4, 2, '2025-04-21', '2025-10-21'),
(4, 3, '2025-11-04', '2026-04-04'),
(4, 4, '2026-04-18', '2026-10-19'),
(5, 1, '2024-11-07', '2025-04-07'),
(5, 2, '2025-04-21', '2025-10-21'),
(5, 3, '2025-11-04', '2026-04-04'),
(5, 4, '2026-04-18', '2026-10-19');

INSERT INTO module (module_code, module_name, module_credit, module_status) VALUES
('MH01', 'Giáo dục chính trị', 1, 1),
('MH05', 'Tin học', 2, 1),
('MH06', 'Tiếng Anh', 2, 1),
('MH07', 'Lập trình cơ bản', 3, 1);

INSERT INTO student (student_code, student_middle_name, student_name, student_date_of_birth, student_gender) VALUES
('0092/24-THUD', 'Dương Thị Thùy', 'Linh', '2008-11-01', 'female'),
('0093/24-THUD', 'Nguyễn Thị Thúy', 'Linh', '2009-03-06', 'female'),
('0094/24-THUD', 'Trần Ngọc Phi', 'Long', '2000-04-06', 'male'),
('0095/24-THUD', 'Võ Hữu', 'Lượng', '2008-10-11', 'male'),
('0102/24-THUD', 'Phan Ngọc', 'My', NULL, 'female');

-- thêm sinh viên vào lớp 
INSERT INTO class_student (class_subject_id, student_code) VALUES
-- Lớp NBHG-THK02-2 (class_id = 3), HK1, các môn MH01, MH02, MH03
(1, '0092/24-THUD'), -- class_subject_id = 1, Giáo dục chính trị
(1, '0093/24-THUD'),
(1, '0094/24-THUD'),
(1, '0095/24-THUD'),
(1, '0102/24-THUD'),
(2, '0092/24-THUD'), -- class_subject_id = 2, Tin học
(2, '0093/24-THUD'),
(2, '0094/24-THUD'),
(2, '0095/24-THUD'),
(2, '0102/24-THUD'),
(3, '0092/24-THUD'), -- class_subject_id = 3, Tiếng Anh
(3, '0093/24-THUD'),
(3, '0094/24-THUD'),
(3, '0095/24-THUD'),
(3, '0102/24-THUD'),
-- Thêm các sinh viên khác trong class_id = 3
(1, '0096/24-THUD'),
(1, '0097/24-THUD'),
(1, '0098/24-THUD'),
(1, '0099/24-THUD'),
(1, '0100/24-THUD'),
(2, '0096/24-THUD'),
(2, '0097/24-THUD'),
(2, '0098/24-THUD'),
(2, '0099/24-THUD'),
(2, '0100/24-THUD'),
(3, '0096/24-THUD'),
(3, '0097/24-THUD'),
(3, '0098/24-THUD'),
(3, '0099/24-THUD'),
(3, '0100/24-THUD'),
-- ... tiếp tục cho các sinh viên từ 0101 đến 0135
(1, '0135/24-THUD'),
(2, '0135/24-THUD'),
(3, '0135/24-THUD'),
-- Lớp PD-HDDL-01 (class_id = 1), HK2, môn MH01, MH03
(5, '0092/24-THUD'), -- class_subject_id = 5, Giáo dục chính trị
(5, '0093/24-THUD'),
(5, '0094/24-THUD'),
(5, '0095/24-THUD'),
(5, '0096/24-THUD'),
(6, '0092/24-THUD'), -- class_subject_id = 6, Tiếng Anh
(6, '0093/24-THUD'),
(6, '0094/24-THUD'),
(6, '0095/24-THUD'),
(6, '0096/24-THUD'),
-- Lớp TB-THUD-01 (class_id = 2), HK1, HK2, môn MH01, MH02
(8, '0097/24-THUD'), -- class_subject_id = 8, Giáo dục chính trị
(8, '0098/24-THUD'),
(8, '0099/24-THUD'),
(8, '0100/24-THUD'),
(8, '0101/24-THUD'),
(9, '0097/24-THUD'), -- class_subject_id = 9, Tin học
(9, '0098/24-THUD'),
(9, '0099/24-THUD'),
(9, '0100/24-THUD'),
(9, '0101/24-THUD'),
-- Lớp BT-HDDL-35 (class_id = 4), HK1, HK2, môn MH01, MH02
(10, '0102/24-THUD'), -- class_subject_id = 10, Giáo dục chính trị
(10, '0103/24-THUD'),
(10, '0104/24-THUD'),
(10, '0105/24-THUD'),
(10, '0106/24-THUD'),
(11, '0102/24-THUD'), -- class_subject_id = 11, Tin học
(11, '0103/24-THUD'),
(11, '0104/24-THUD'),
(11, '0105/24-THUD'),
(11, '0106/24-THUD'),
-- Lớp BT-KTDN-01 (class_id = 5), HK1, HK2, môn MH03, MH04
(12, '0107/24-THUD'), -- class_subject_id = 12, Tiếng Anh
(12, '0108/24-THUD'),
(12, '0109/24-THUD'),
(12, '0110/24-THUD'),
(12, '0111/24-THUD'),
(13, '0107/24-THUD'), -- class_subject_id = 13, Lập trình cơ bản
(13, '0108/24-THUD'),
(13, '0109/24-THUD'),
(13, '0110/24-THUD'),
(13, '0111/24-THUD');

INSERT INTO class_subject (class_id, module_id, semester_id) VALUES
(3, 1, 9),  -- class_subject_id = 1 (giả sử), NBHG-THK02-2, Giáo dục chính trị, HK1
(3, 2, 9),  -- class_subject_id = 2, NBHG-THK02-2, Tin học, HK1
(3, 3, 9),  -- class_subject_id = 3, NBHG-THK02-2, Tiếng Anh, HK1
(3, 4, 10), -- class_subject_id = 4, NBHG-THK02-2, Lập trình cơ bản, HK2
(1, 1, 2),  -- class_subject_id = 5, PD-HDDL-01, Giáo dục chính trị, HK2
(1, 3, 2),  -- class_subject_id = 6, PD-HDDL-01, Tiếng Anh, HK2
(1, 4, 3),  -- class_subject_id = 7, PD-HDDL-01, Lập trình cơ bản, HK3
(2, 1, 5),  -- class_subject_id = 8, TB-THUD-01, Giáo dục chính trị, HK1
(2, 2, 6),  -- class_subject_id = 9, TB-THUD-01, Tin học, HK2
(4, 1, 13), -- class_subject_id = 10, BT-HDDL-35, Giáo dục chính trị, HK1
(4, 2, 14), -- class_subject_id = 11, BT-HDDL-35, Tin học, HK2
(5, 3, 17), -- class_subject_id = 12, BT-KTDN-01, Tiếng Anh, HK1
(5, 4, 18); -- class_subject_id = 13, BT-KTDN-01, Lập trình cơ bản, HK2


INSERT INTO teacher (teacher_code, teacher_name, teacher_status) VALUES
('GV001', 'Nguyễn Văn A', 'teaching'),
('GV002', 'Trần Thị B', 'teaching');

-- thêm giảng viên vào lớp
INSERT INTO teacher_subject_class (teacher_code, class_subject_id) VALUES
('GV001', 1),  -- GV001 dạy Giáo dục chính trị, NBHG-THK02-2, HK1
('GV002', 2),  -- GV002 dạy Tin học, NBHG-THK02-2, HK1
('GV003', 3),  -- GV003 dạy Tiếng Anh, NBHG-THK02-2, HK1
('GV003', 4),  -- GV003 dạy Lập trình cơ bản, NBHG-THK02-2, HK2
('GV001', 5),  -- GV001 dạy Giáo dục chính trị, PD-HDDL-01, HK2
('GV003', 6),  -- GV003 dạy Tiếng Anh, PD-HDDL-01, HK2
('GV003', 7),  -- GV003 dạy Lập trình cơ bản, PD-HDDL-01, HK3
('GV001', 8),  -- GV001 dạy Giáo dục chính trị, TB-THUD-01, HK1
('GV002', 9),  -- GV002 dạy Tin học, TB-THUD-01, HK2
('GV001', 10), -- GV001 dạy Giáo dục chính trị, BT-HDDL-35, HK1
('GV002', 11), -- GV002 dạy Tin học, BT-HDDL-35, HK2
('GV003', 12), -- GV003 dạy Tiếng Anh, BT-KTDN-01, HK1
('GV003', 13); -- GV003 dạy Lập trình cơ bản, BT-KTDN-01, HK2

SELECT 
    l.loca_name AS 'Tên Trung Tâm',
    co.course_code AS 'Ngành học',
    MIN(s.semester_start_date) AS 'Khai giảng',
    MAX(CASE WHEN s.semester_number = 1 THEN s.semester_start_date END) AS 'HK1 Start',
    MAX(CASE WHEN s.semester_number = 1 THEN s.semester_end_date END) AS 'HK1 End',
    MAX(CASE WHEN s.semester_number = 2 THEN s.semester_start_date END) AS 'HK2 Start',
    MAX(CASE WHEN s.semester_number = 2 THEN s.semester_end_date END) AS 'HK2 End',
    MAX(CASE WHEN s.semester_number = 3 THEN s.semester_start_date END) AS 'HK3 Start',
    MAX(CASE WHEN s.semester_number = 3 THEN s.semester_end_date END) AS 'HK3 End',
    MAX(CASE WHEN s.semester_number = 4 THEN s.semester_start_date END) AS 'HK4 Start',
    MAX(CASE WHEN s.semester_number = 4 THEN s.semester_end_date END) AS 'HK4 End'
FROM 
    location l
    JOIN class c ON l.loca_code = c.class_loca_code
    JOIN course co ON c.class_course_id = co.course_id
    JOIN semester s ON c.class_id = s.class_id
GROUP BY 
    l.loca_name,
    co.course_code
ORDER BY 
    l.loca_name,
    co.course_code;


-- Truy vấn điểm môn học của sinh viên 
SELECT distinct
    s.student_code AS 'MÃ HS',
    s.student_middle_name AS 'HỌ ĐỆM',
    s.student_name AS 'TÊN',
    m.module_code AS 'Mã Môn học',
    m.module_name AS 'Tên Môn học',
    sc.score AS 'Tổng điểm'
FROM 
    student s
    JOIN class_student cs ON s.student_code = cs.student_code
    JOIN class_subject csj ON cs.class_subject_id = csj.class_subject_id
    JOIN class c ON csj.class_id = c.class_id
    JOIN module m ON csj.module_id = m.module_id
    LEFT JOIN score sc ON s.student_code = sc.student_code 
        AND csj.class_subject_id = sc.class_subject_id
	where m.module_code = 'MH01'
ORDER BY 
    s.student_code,
    m.module_code;


-- Truy vấn điểm môn học của 1 sinh viên
SELECT distinct
    s.student_code AS 'MÃ HS',
    s.student_middle_name AS 'HỌ ĐỆM',
    s.student_name AS 'TÊN',
    m.module_code AS 'Mã Môn học',
    m.module_name AS 'Tên Môn học',
    se.semester_number AS 'Học kỳ',
    se.semester_start_date AS 'Ngày bắt đầu',
    se.semester_end_date AS 'Ngày kết thúc',
    sc.score AS 'Tổng điểm'
FROM 
    student s
    JOIN class_student cs ON s.student_code = cs.student_code
    JOIN class_subject csj ON cs.class_subject_id = csj.class_subject_id
    JOIN class c ON csj.class_id = c.class_id
    JOIN module m ON csj.module_id = m.module_id
    JOIN semester se ON csj.semester_id = se.semester_id
    LEFT JOIN score sc ON s.student_code = sc.student_code 
        AND csj.class_subject_id = sc.class_subject_id
WHERE 
    s.student_code = '0092/24-THUD' AND se.semester_number = '1'
ORDER BY 
    m.module_code;

select * from semester;
select * from student
order by student_code;
select * from teacher;
select * from teacher_subject_class;

select * from teacher_subject_class c
join module m on c.module_id = m.module_id;

select * from class;

SELECT distinct
    c.class_code, c.class_name, m.module_id, m.module_name, cst.student_code, 
    s.student_middle_name, s.student_name, tsc.teacher_code, t.teacher_name, 
    sc.score, se.semester_number, se.semester_id 
FROM class_subject cs
JOIN module m ON cs.module_id = m.module_id
JOIN class c ON cs.class_id = c.class_id
JOIN class_student cst ON cs.class_subject_id = cst.class_subject_id
JOIN student s ON cst.student_code = s.student_code
JOIN teacher_subject_class tsc ON cs.class_subject_id = tsc.class_subject_id
JOIN teacher t ON tsc.teacher_code = t.teacher_code 
LEFT JOIN score sc ON s.student_code = sc.student_code 
     AND cs.class_subject_id = sc.class_subject_id
JOIN semester se ON cs.semester_id = se.semester_id
WHERE s.student_code = '0092/24-THUD';


select * from teacher_subject_class;

select * from student where student_code = '0092/24-THUD';
select * from score where student_code = '0102/24-THUD' and module_id = 1;
insert into teacher (teacher_code, teacher_name) value ('GV003', 'Trần Văn Thịnh');


INSERT INTO student (student_code, student_middle_name, student_name, student_date_of_birth, student_gender) VALUES
('0096/24-THUD', 'Lê Thị Xuân', 'Mai', '2009-03-10', 'female'),
('0097/24-THUD', 'Hồ Duy', 'Mạnh', '2009-04-17', 'male'),
('0098/24-THUD', 'Đỗ Quốc', 'Minh', '2009-11-03', 'male'),
('0099/24-THUD', 'Lê Thị Sa', 'My', '2009-09-25', 'female'),
('0100/24-THUD', 'Nguyễn Ngọc Ái', 'My', '2009-03-05', 'female'),
('0101/24-THUD', 'Phạm Thị Diễm', 'My', '2009-07-25', 'female'),
('0103/24-THUD', 'Tạ Diễm', 'My', '2009-03-17', 'female'),
('0104/24-THUD', 'Nguyễn Trung', 'Nghĩa', '2009-09-10', 'male'),
('0105/24-THUD', 'Nguyễn Hoàng Bảo', 'Ngọc', '2009-10-27', 'female'),
('0106/24-THUD', 'Nguyễn Trần Hồng', 'Ngọc', '2009-10-14', 'female'),
('0107/24-THUD', 'Lê Thành', 'Nhân', '2009-08-11', 'male'),
('0108/24-THUD', 'Nguyễn Thành', 'Nhân', '2005-09-07', 'male'),
('0109/24-THUD', 'Nguyễn Thiện', 'Nhân', '2009-03-08', 'male'),
('0110/24-THUD', 'Trần Khánh', 'Nhi', '2009-03-20', 'female'),
('0111/24-THUD', 'Nguyễn Ngọc', 'Nhiên', '2009-10-15', 'female'),
('0112/24-THUD', 'Dương Tuyết', 'Nhung', '2009-06-05', 'female'),
('0113/24-THUD', 'Đỗ Nguyễn Ngọc', 'Như', '2008-11-02', 'female'),
('0114/24-THUD', 'Huỳnh Gia', 'Phú', '2009-05-27', 'male'),
('0115/24-THUD', 'Lê Hoàng', 'Phú', '2008-08-05', 'male'),
('0116/24-THUD', 'Nguyễn Thành', 'Phước', '2008-06-23', 'male'),
('0117/24-THUD', 'Nguyễn Minh', 'Phương', '2009-05-31', 'male'),
('0118/24-THUD', 'Nguyễn Xuân', 'Quốc', '2009-07-04', 'male'),
('0119/24-THUD', 'Lê Tấn', 'Tài', '2009-06-19', 'male'),
('0120/24-THUD', 'Trần Linh', 'Tâm', '2006-07-29', 'male'),
('0121/24-THUD', 'Lê Như', 'Tiên', '2009-12-25', 'female'),
('0122/24-THUD', 'Nguyễn Thị Cẩm', 'Tiên', '2008-07-18', 'female'),
('0123/24-THUD', 'Đào Vũ', 'Thanh', '2009-08-20', 'male'),
('0124/24-THUD', 'Nguyễn Minh', 'Thuận', '2009-06-05', 'male'),
('0125/24-THUD', 'Nguyễn Phương', 'Thùy', '2008-02-09', 'female'),
('0126/24-THUD', 'Nguyễn', 'Thư', '2009-09-09', 'female'),
('0127/24-THUD', 'Nguyễn Hoài', 'Thương', '2009-09-25', 'male'),
('0128/24-THUD', 'Huỳnh Diễm', 'Thy', '2008-05-25', 'female'),
('0129/24-THUD', 'Võ Minh', 'Trí', '2009-09-07', 'male'),
('0130/24-THUD', 'Đoàn Minh', 'Trực', '2009-10-12', 'male'),
('0131/24-THUD', 'Lê Nhựt', 'Trường', '2009-01-21', 'male'),
('0132/24-THUD', 'Dương Ngọc Phương', 'Uyên', '2009-05-15', 'female'),
('0133/24-THUD', 'Võ Quang', 'Vinh', '2009-04-03', 'male'),
('0134/24-THUD', 'Nguyễn Quốc', 'Vui', '2009-04-24', 'male'),
('0135/24-THUD', 'Huỳnh Gia', 'Yến', '2009-09-19', 'female');


-- thêm điểm cho sinh viên
INSERT INTO score (class_subject_id, student_code, score) VALUES
(1, '0092/24-THUD', 8.50), -- class_subject_id = 1, Giáo dục chính trị, HK1
(2, '0092/24-THUD', 7.75), -- class_subject_id = 2, Tin học, HK1
(1, '0093/24-THUD', 9.00),
(2, '0093/24-THUD', 8.25),
(3, '0094/24-THUD', 6.90), -- class_subject_id = 3, Tiếng Anh, HK1
(3, '0094/24-THUD', 7.50),
(3, '0095/24-THUD', 8.00),
(1, '0095/24-THUD', 8.50),
(3, '0102/24-THUD', 7.40),
(3, '0102/24-THUD', 8.20);

-- Lớp PD-HDDL-01 (class_id = 1)
INSERT INTO score (class_subject_id, student_code)
SELECT 5, cs.student_code -- class_subject_id = 5, Giáo dục chính trị, HK2
FROM class_student cs
WHERE cs.class_subject_id = 5;

INSERT INTO score (class_subject_id, student_code)
SELECT 6, cs.student_code -- class_subject_id = 6, Tiếng Anh, HK2
FROM class_student cs
WHERE cs.class_subject_id = 6;

INSERT INTO score (class_subject_id, student_code)
SELECT 7, cs.student_code -- class_subject_id = 7, Lập trình cơ bản, HK3
FROM class_student cs
WHERE cs.class_subject_id = 7;

-- Lớp TB-THUD-01 (class_id = 2)
INSERT INTO score (class_subject_id, student_code)
SELECT 8, cs.student_code -- class_subject_id = 8, Giáo dục chính trị, HK1
FROM class_student cs
WHERE cs.class_subject_id = 8;

INSERT INTO score (class_subject_id, student_code)
SELECT 9, cs.student_code -- class_subject_id = 9, Tin học, HK2
FROM class_student cs
WHERE cs.class_subject_id = 9;

-- Lớp BT-HDDL-35 (class_id = 4)
INSERT INTO score (class_subject_id, student_code)
SELECT 10, cs.student_code -- class_subject_id = 10, Giáo dục chính trị, HK1
FROM class_student cs
WHERE cs.class_subject_id = 10;

INSERT INTO score (class_subject_id, student_code)
SELECT 11, cs.student_code -- class_subject_id = 11, Tin học, HK2
FROM class_student cs
WHERE cs.class_subject_id = 11;

-- Lớp BT-KTDN-01 (class_id = 5)
INSERT INTO score (class_subject_id, student_code)
SELECT 12, cs.student_code -- class_subject_id = 12, Tiếng Anh, HK1
FROM class_student cs
WHERE cs.class_subject_id = 12;

INSERT INTO score (class_subject_id, student_code)
SELECT 13, cs.student_code -- class_subject_id = 13, Lập trình cơ bản, HK2
FROM class_student cs
WHERE cs.class_subject_id = 13;
select * from score;