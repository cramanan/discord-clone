CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY NOT NULL,
    sender_uuid UUID NOT NULL,
    receiver_uuid UUID NOT NULL,
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP
);