CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name CHARACTER VARYING(32) NOT NULL,
    surname CHARACTER VARYING(32) NOT NULL,
    patronymic CHARACTER VARYING(32) NOT NULL,
    user_id SERIAL NOT NULL,
    group_id SERIAL NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

insert into students (name, surname, patronymic, user_id, group_id) values ('Roman', 'Zhukov', 'Sergeevich', 1, 1);

#team_id