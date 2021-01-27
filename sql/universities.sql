CREATE TABLE universities (
    id SERIAL PRIMARY KEY,
    university_name VARCHAR(40) NOT NULL,
    university_briefly VARCHAR(16) NOT NULL
);

insert into universities (university_name, university_briefly) values ('Институт информационных технологий', 'ИИТ');