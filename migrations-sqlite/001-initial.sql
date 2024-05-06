-- Up
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    profile_img TEXT
);

CREATE TABLE workouts (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    targeted_areas TEXT,
    owner_id TEXT,
    owner TEXT,
    duration INTEGER,
    level TEXT,
    is_public BOOLEAN,
    time DATETIME,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE exercises (
    id TEXT PRIMARY KEY,
    workout_id TEXT,
    title TEXT,
    directions TEXT,
    duration INTEGER,
    time DATETIME,
    FOREIGN KEY (workout_id) REFERENCES workouts(id)
);

-- Down
DROP TABLE exercises;

DROP TABLE workouts;

DROP TABLE users;