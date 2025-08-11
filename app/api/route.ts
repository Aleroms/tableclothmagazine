import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import postgres from "postgres";


// this is a test script that inserts into the DB a new user with
// hashed pw

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export async function GET() {
  const pw = "test";
  const hash = await bcrypt.hash(pw, 10);

  try {
    await sql`
  INSERT INTO users (
    id, email, password, first_name, last_name, auth_level
  ) VALUES (
    uuid_generate_v4(), 'admin@example.com', ${hash}, 'TESTEXAMPLE', 'EXAMPLE', 'admin'
  );
`;
    return NextResponse.json({ ok: "good" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error });
  }
}
