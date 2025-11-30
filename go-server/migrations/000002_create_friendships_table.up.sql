CREATE TABLE IF NOT EXISTS friendships (
    id SERIAL PRIMARY KEY,
    requester_uuid UUID NOT NULL,
    addressee_uuid UUID NOT NULL,
    is_pending BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,

     -- Prevent a user from friending themselves
    CONSTRAINT no_self_friendship CHECK (requester_uuid <> addressee_uuid),

    -- Ensure requester-addressee pair is unique
    CONSTRAINT unique_friendship_pair UNIQUE (requester_uuid, addressee_uuid)
);