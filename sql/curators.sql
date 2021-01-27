CREATE TABLE curators (
    id SERIAL PRIMARY KEY,
    name CHARACTER VARYING(32) NOT NULL,
    surname CHARACTER VARYING(32) NOT NULL,
    patronymic CHARACTER VARYING(32) NOT NULL,
    position CHARACTER VARYING(32) NOT NULL,
    user_id SERIAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

insert into curators (name, surname, patronymic, position, user_id) values ('Владимир', 'Иванов', 'Валерьевич', 'Работник РНИЦ', 2);