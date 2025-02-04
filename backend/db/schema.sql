DROP TABLE IF EXISTS players;

CREATE TABLE players (
    number INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50),
    year VARCHAR(20),
    hometown VARCHAR(100),
    photo_url VARCHAR(255),  -- Store the URL/path to the photo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 