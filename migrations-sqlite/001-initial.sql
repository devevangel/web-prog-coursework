CREATE TABLE Category (
    id CHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE Area (
    id CHAR(36) PRIMARY KEY,
    cat_id CHAR(36) NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (cat_id) REFERENCES Category(id)
);