create table events (
    id serial primary key,
    event_name varchar(32) not null,
    event_description varchar(256) not null,
    event_start timestamp,
    event_end timestamp,
    completed boolean default false
);

-- insert into events (event_name, event_description, event_start) values ('Краштест#2', 'IT команды', '2021-02-06 16:17:00');