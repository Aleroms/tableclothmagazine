import { showcasePlaceholder } from "@/app/lib/placeholder-data";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function seedshowcase() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
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

  const showcase = await Promise.all(
    showcasePlaceholder.map((showcase)=> sql`
    INSERT INTO showcases ()`)
  )
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => []);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
