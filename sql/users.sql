CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username CHARACTER VARYING(16) UNIQUE NOT NULL,
    password CHARACTER VARYING(255) NOT NULL,
    role smallint NOT NULL
);

insert into users (username, password, role) values ('bromanla', '$2a$10$.J5h/Zmod1uooJpQRBN6A.YFx2CvGN8tYwrYk5xziPaPuW.XMHUNi', '2');
insert into users (username, password, role) values ('vova', '$2a$10$.J5h/Zmod1uooJpQRBN6A.YFx2CvGN8tYwrYk5xziPaPuW.XMHUNi', '3');