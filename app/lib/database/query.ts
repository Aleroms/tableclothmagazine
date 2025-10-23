import {
  Showcase,
  Event,
  Article,
  User,
  Issue,
  IssueThumbnail,
} from "../definitions";
import {
  transformRowToArticleArray,
  transformRowToEventArray,
} from "./query-utils";
import sql from "./db";
import { hash } from "bcrypt";

// SHOWCASE

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
    throw new Error(`Failed to fetch showcases: ${error}`);
  }
};

// ARTICLE

export async function getMarkdownByArticleId(
  articleId: string
): Promise<string> {
  try {
    const rows = await sql<Article[]>`
        SELECT markdown 
        FROM articles 
        WHERE id = ${articleId}`;
    return rows[0]?.markdown;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch markdown for article:${articleId} \n
            ${error}`);
  }
}

export async function getLatestArticles(limit: number): Promise<Article[]> {
  try {
    const rows = await sql`
        SELECT * FROM articles ORDER BY release_date LIMIT ${limit}`;
    return transformRowToArticleArray(rows);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch articles limit:${limit} \n
            ${error}`);
  }
}

export async function getArticlesByIssueId(id: number): Promise<Article[]> {
  try {
    const rows = await sql`
    SELECT * FROM articles WHERE issue_id = ${id} 
    `;
    return transformRowToArticleArray(rows);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch article with issue_id ${id} \n
            ${error}`);
  }
}

export async function getArticleById(id: string): Promise<Article> {
  try {
    const data = await sql`
    SELECT * FROM articles WHERE id = ${id}`;
    return data[0] as Article;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch article with id ${id} \n
            ${error}`);
  }
}

// EVENTS

export async function getUpcomingEvents(limit: number = 5): Promise<Event[]> {
  try {
    const rows = await sql`
        SELECT *
        FROM events
        WHERE start_date > NOW()
        ORDER BY start_date ASC
        LIMIT ${limit}`;

    return transformRowToEventArray(rows);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to latest ${limit} events ${error}`);
  }
}

export async function getUpcomingEventsForCurrentIssue(
  limit: number = 0
): Promise<Event[]> {
  try {
    let query = sql`
        SELECT * 
        FROM events 
        WHERE issue_id = (
          SELECT MAX(id) FROM issues
        )
        AND start_date > NOW()
        ORDER BY start_date ASC
      `;

    if (limit > 0) {
      query = sql`
      ${query}
      LIMIT ${limit}
    `;
    }

    const rows = await query;

    return transformRowToEventArray(rows);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch events for current issue: ${error}`);
  }
}

export async function getPastEvents(): Promise<Event[]> {
  try {
    const data = await sql`
    SELECT * FROM events WHERE start_date < NOW()
    ORDER BY start_date DESC`;
    return transformRowToEventArray(data);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch past events: ${error}`);
  }
}

// USERS

export async function getTableclothTeam(): Promise<User[]> {
  try {
    return await sql`
    SELECT * FROM users WHERE auth_level IN ('team', 'admin')`;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch tablecloth team members ${error}`);
  }
}

export async function getUserById(id: string): Promise<User> {
  try {
    const data = await sql`
    SELECT * FROM users WHERE id = ${id}`;
    return data[0] as User;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch user ${id} ${error}`);
  }
}

export async function getUserByEmail(email: string): Promise<User> {
  try {
    const data = await sql`
    SELECT * FROM users WHERE email = ${email}`;
    return data[0] as User;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch user email ${email} ${error}`);
  }
}

export async function isUserAdmin(email: string): Promise<boolean> {
  try {
    const data = await sql`
    SELECT auth_level FROM users WHERE email = ${email}`;
    return data.length > 0 && data[0].auth_level === 'admin';
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to determine if user ${email} is admin`);
  }
}

export async function updateUserProfile(
  email: string,
  profileData: {
    img_url?: string | null;
    first_name: string;
    last_name?: string | null;
    pronouns?: string | null;
    fav_color?: string | null;
    description?: string | null;
    email: string;
  }
): Promise<void> {
  try {
    await sql`
      UPDATE users 
      SET 
        img_url = ${profileData.img_url || null},
        first_name = ${profileData.first_name}, 
        last_name = ${profileData.last_name || null},
        pronouns = ${profileData.pronouns || null},
        fav_color = ${profileData.fav_color || null},
        description = ${profileData.description || null},
        email = ${profileData.email},
        updated_at = NOW()
      WHERE email = ${email}`;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update user profile for ${email}: ${error}`);
  }
}

export async function updateUserPassword(
  email: string,
  newPassword: string
): Promise<void> {
  try {
    const hashedPassword = await hash(newPassword, 10);
    await sql`
      UPDATE users 
      SET password = ${hashedPassword}
      WHERE email = ${email}`;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update password for ${email}: ${error}`);
  }
}

// ISSUES

export async function getAllIssues(): Promise<Issue[]> {
  try {
    return await sql`
    SELECT * FROM issues ORDER BY id DESC`;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch all issues ${error}`);
  }
}

export async function getIssueById(id: number): Promise<Issue> {
  try {
    const data = await sql`
    SELECT * FROM issues WHERE id = ${id}`;
    return data[0] as Issue;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetchissue id=${id} ${error}`);
  }
}

export async function getIssuesThumbnail(): Promise<IssueThumbnail[]> {
  try {
    return await sql`
    SELECT id, name, img_url FROM issues ORDER BY id DESC`;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch issue thumbnail ${error}`);
  }
}

// TEAM MANAGEMENT

export async function updateTeamMember(
  id: string,
  updates: {
    role?: string;
    auth_level?: "admin" | "team" | "basic";
    first_name?: string;
    last_name?: string | null;
    pronouns?: string | null;
    fav_color?: string | null;
    description?: string | null;
  }
): Promise<void> {
  try {
    const setClause = [];
    const values: (string | null)[] = [];

    if (updates.role !== undefined) {
      setClause.push(`role = $${setClause.length + 1}`);
      values.push(updates.role);
    }
    if (updates.auth_level !== undefined) {
      setClause.push(`auth_level = $${setClause.length + 1}`);
      values.push(updates.auth_level);
    }
    if (updates.first_name !== undefined) {
      setClause.push(`first_name = $${setClause.length + 1}`);
      values.push(updates.first_name);
    }
    if (updates.last_name !== undefined) {
      setClause.push(`last_name = $${setClause.length + 1}`);
      values.push(updates.last_name);
    }
    if (updates.pronouns !== undefined) {
      setClause.push(`pronouns = $${setClause.length + 1}`);
      values.push(updates.pronouns);
    }
    if (updates.fav_color !== undefined) {
      setClause.push(`fav_color = $${setClause.length + 1}`);
      values.push(updates.fav_color);
    }
    if (updates.description !== undefined) {
      setClause.push(`description = $${setClause.length + 1}`);
      values.push(updates.description);
    }

    if (setClause.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    await sql.unsafe(
      `
      UPDATE users 
      SET ${setClause.join(", ")}
      WHERE id = $${values.length}
    `,
      values
    );
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update team member ${id}: ${error}`);
  }
}
