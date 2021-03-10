create table tokens (
    id serial primary key,
    user_id serial references users(id) on delete cascade,
    token uuid,
    agent varchar(32),
    ip varchar(32),
    expires_in bigint
);

-- insert into tokens (user_id, token) values (1, 'b6b2390b-2e0c-4397-af61-21845c346071');