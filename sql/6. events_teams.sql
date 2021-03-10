create table events_teams (
    id serial primary key,
    event_id serial references events(id) on delete cascade,
    team_id serial references teams(id) on delete cascade
);

-- insert into events_teams (event_id, team_id) values ('1', '12');
-- insert into events_teams (event_id, team_id) values ('1', '16');
-- insert into events_teams (event_id, team_id) values ('1', '18');