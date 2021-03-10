create table events_guests (
    id serial primary key,
    event_id serial references events(id) on delete cascade,
    user_id serial references users(id) on delete cascade
);