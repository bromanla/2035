CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(32) NOT NULL,
    team_description VARCHAR(256) NOT NULL,
    сurator_id SERIAL,
    leader_id SERIAL,
    archive BOOLEAN NOT NULL,

    FOREIGN KEY (сurator_id) REFERENCES users(id),
    FOREIGN KEY (leader_id) REFERENCES users(id)
);

insert into teams (team_name, team_description, сurator_id, leader_id, archive)
values ('iceCore', 'Разработка мобильного приложения для ведения и сопровождения проектной деятельности в Университете', 2, 1, 'false');

SELECT
    teams.team_name, team_description,
    students.name as leader_name, students.surname as leader_surname, students.patronymic as leader_patronymic,
    curators.name as curator_name, curators.surname as curator_surname, curators.patronymic as curator_patronymic
FROM teams
LEFT JOIN users curators_tem ON teams.сurator_id = curators_tem.id
LEFT JOIN curators ON curators_tem.id = curators.user_id
LEFT JOIN users students_tem ON teams.leader_id = students_tem.id
LEFT JOIN students ON students_tem.id = students.user_id
WHERE teams.id = 1