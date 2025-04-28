import {
  articlePlaceholder,
  eventsPlaceholder,
  issuesPlaceholder,
  showcasePlaceholder,
  usersPlaceholder,
} from "@/app/lib/placeholder-data";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function prepareDatabase() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

interface PostgresError extends Error {
  code?: string;
}

async function clearTables() {
  try {
    await sql`
      TRUNCATE TABLE
        events,
        articles,
        issues,
        showcases,
        users
      RESTART IDENTITY CASCADE
    `;
  } catch (error: unknown) {
    const err = error as PostgresError;
    if (err.code === "42P01") {
      console.warn("Skipping truncate — tables do not exist yet.");
    } else {
      throw error;
    }
  }
}

async function seedUsers() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    img_url TEXT,
    role TEXT DEFAULT 'user' NOT NULL,
    auth_level TEXT DEFAULT 'basic' NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    fav_color VARCHAR(7),
    description TEXT,
    pronouns TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  await Promise.all(
    usersPlaceholder.map(
      (user) =>
        sql`INSERT INTO users (
      id,
      img_url,
      role, 
      auth_level, 
      first_name, 
      last_name, 
      fav_color, 
      description,
      pronouns
      ) VALUES (
       ${user.id}, 
       ${user.img_url || null},
       ${user.role},
       ${user.auth_level},
       ${user.first_name},
       ${user.last_name || null},
       ${user.fav_color || null},
       ${user.description || null},
       ${user.pronouns || null}
       )`
    )
  );
  console.log("✅ Seeded users");
}

async function seedShowcase() {
  await sql`
  CREATE TABLE IF NOT EXISTS showcases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    img_url TEXT NOT NULL,
    link TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
  `;

  await Promise.all(
    showcasePlaceholder.map(
      (showcase) => sql`
    INSERT INTO showcases (id, img_url, link, name)
    VALUES (${showcase.id}, ${showcase.img_url}, ${showcase.link}, ${showcase.name})`
    )
  );
  console.log("✅ Seeded showcase");
}

async function seedArticle() {
  await sql`CREATE TABLE IF NOT EXISTS articles (
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
    )`;
  await Promise.all(
    articlePlaceholder.map(
      (article) =>
        sql`INSERT INTO articles (
        id,
        issue_id,
        writer_id,
        title,
        markdown,
        release_date
        ) VALUES (
        ${article.id},
        ${article.issue_id},
        ${article.writer_id},
        ${article.title},
        ${article.markdown || null},
        ${article.release_date}
        )`
    )
  );
  console.log("✅ Seeded articles");
}

async function seedIssue() {
  await sql`CREATE TABLE IF NOT EXISTS issues (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    img_url TEXT NOT NULL,
    editors_note TEXT NOT NULL,
    editor_id UUID NOT NULL,
    description TEXT,
    release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (editor_id) REFERENCES users(id)
    )`;
  await Promise.all(
    issuesPlaceholder.map(
      (issue) =>
        sql`INSERT INTO issues (
      id,
      name,
      img_url,
      editors_note,
      editor_id,
      release_date,
      description
      ) VALUES (
       ${issue.id},
       ${issue.name},
       ${issue.img_url},
       ${issue.editors_note},
       ${issue.editor_id},
       ${issue.release_date},
       ${issue.description})
      `
    )
  );
  console.log("✅ Seeded issues");
}

async function seedEvents() {
  await sql`CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    issue_id INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    title TEXT NOT NULL,
    notes TEXT,
    external_link TEXT,
    duration TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id)
)`;
  await Promise.all(
    eventsPlaceholder.map(
      (event) =>
        sql`INSERT INTO events (
  id,
  issue_id,
  start_date,
  end_date,
  title,
  notes,
  external_link,
  duration
  ) VALUES (
  ${event.id},
  ${event.issue_id},
  ${event.startDate},
  ${event.endDate || null},
  ${event.title},
  ${event.notes || null},
  ${event.externalLink || null},
  ${event.duration || null})`
    )
  );
  console.log("✅ Seeded events");
}

export async function GET() {
  try {
    await prepareDatabase(); // create extensions if missing

    await sql.begin(async () => {
      await clearTables(); // ⚡ clear old data

      await seedUsers(); // 🥇 users first
      await seedIssue(); // 🥈 issues second
      await seedArticle(); // 🥉 articles third
      await seedEvents(); // 🏅 events fourth
      await seedShowcase(); // 🏅 showcase last
    });

    return Response.json({ message: "Database reset and seeded successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
