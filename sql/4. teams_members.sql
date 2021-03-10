create table teams_members (
    id serial primary key,
    team_id serial references teams(id) on delete cascade,
    user_id serial references users(id) on delete cascade,
    team_role varchar(16) not null
);

-- @team_role
--     curator
--     leader
--     member