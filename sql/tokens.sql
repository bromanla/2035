CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    user_id integer,
    token uuid,
    agent VARCHAR(32),
    ip VARCHAR(32),
    expires_in bigint NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

insert into tokens (user_id, token) values (1, 'b6b2390b-2e0c-4397-af61-21845c346071');