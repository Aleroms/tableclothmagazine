CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    img_url TEXT,
    role TEXT DEFAULT 'user' NOT NULL,
    auth_level TEXT DEFAULT 'basic' NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    fav_color VARCHAR(7),
    pronouns TEXT
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    issue_id INT NOT NULL,
    writer_id UUID NOT NULL,
    title TEXT NOT NULL,
    markdown TEXT,
    release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (writer_id) REFERENCES users(id),
    FOREIGN KEY (issue_id) REFERENCES issues(id)
)

CREATE TABLE IF NOT EXISTS issues (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    img_url TEXT NOT NULl,
    editors_note TEXT NOT NULL,
    editor_id UUID NOT NULL,
    description TEXT,
    release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (editor_id) REFERENCES users(id)
)

CREATE TABLE IF NOT EXISTS showcases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    img_url TEXT NOT NULL,
    link TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    issue_id INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    title TEXT NOT NULL,
    notes TEXT,
    external_link TEXT,
    duration TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (issue_id) REFERENCES issues(id)
)