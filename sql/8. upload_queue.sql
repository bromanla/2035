create table upload_queue (
    id serial primary key,
    type varchar(16) not null,
    file_name varchar(42) not null,
    uploaded_by serial references users(id)
);
