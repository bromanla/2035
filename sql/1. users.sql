create table users (
    id serial primary key,
    username varchar(16) unique not null,
    password varchar(255) not null,
    role varchar(16) default 'student',
    name varchar(32),
    surname varchar(32),
    patronymic varchar(32),
    small_photo varchar(42) default 'default.jpg',
    description varchar(128),
    archive boolean default false
);

-- @role
--     admin
--     moderator
--     curator
--     student
--     guest
