import bcrypt from 'bcrypt'
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const pw = "test"
const hash = await bcrypt.hash(pw, 10)

await sql`
  INSERT INTO users (
    id, email, password_hash, first_name, auth_level
  ) VALUES (
    uuid_generate_v4(), 'admin@example.com', ${hash}, 'Admin', 'admin'
  );
`;