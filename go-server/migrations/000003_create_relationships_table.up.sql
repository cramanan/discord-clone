CREATE TABLE IF NOT EXISTS relationships (
    id SERIAL PRIMARY KEY,
    requester_uuid UUID NOT NULL,
    addressee_uuid UUID NOT NULL,
    is_pending BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE,

    -- Prevent self-relationships
    CONSTRAINT relationships_no_self CHECK (requester_uuid <> addressee_uuid),

    -- Ensure uniqueness of a relationship pair
    CONSTRAINT relationships_unique_pair UNIQUE (requester_uuid, addressee_uuid)
);
