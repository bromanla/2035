create table teams (
    id serial primary key,
    team_name varchar(32) not null,
    team_description varchar(256) not null,
    team_icon varchar(42) default 'default.jpg',
    archive boolean not null,
    customer varchar(128)
);

-- insert into teams (team_name, team_description, сurator_id, leader_id, archive)
-- values ('iceCore', 'Разработка мобильного приложения для ведения и сопровождения проектной деятельности в Университете', 2, 1, 'false');
