import postgres from "postgres";
import { Showcase } from "./definitions";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export const getShowcase = async (limit: number = 5) => {
  try {
    const data = await sql<Showcase[]>`
        SELECT * 
        FROM showcases
        ORDER BY created_at DESC
        LIMIT ${limit}`;
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch showcase data.");
  }
};
