create table vote_audience (
    id serial primary key,
    team_id serial references teams(id) on delete cascade,
    user_id serial references users(id) on delete cascade,
    vote boolean default false
);
