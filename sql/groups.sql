CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    course integer NOT NULL,
    faculty_id SERIAL NOT NULL,
    group_name VARCHAR(32) NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id)
);

insert into groups (course, faculty_id, group_name) values (3, 1, 'Мехатроника и робототехника');