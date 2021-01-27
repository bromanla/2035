CREATE TABLE faculties (
    id SERIAL PRIMARY KEY,
    faculty_name VARCHAR(40) NOT NULL,
    university_id SERIAL NOT NULL,
    FOREIGN KEY (university_id) REFERENCES universities(id)
);

insert into faculties (faculty_name, university_id ) values ('Автоматизация и Управление', 1);