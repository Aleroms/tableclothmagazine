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
        SELECT * FROM articles ORDER BY release_date DESC LIMIT ${limit}`;
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

export async function getArticlesByWriterId(
  writerId: string
): Promise<Article[]> {
  try {
    const data = await sql`
    SELECT * FROM articles WHERE writer_id = ${writerId} ORDER BY release_date DESC`;
    return transformRowToArticleArray(data);
  } catch (error) {
    console.log(error);
    throw new Error(
      `Failed to fetch articles for writer ${writerId}: ${error}`
    );
  }
}

export async function createArticle(articleData: {
  issue_id: number;
  writer_id: string;
  title: string;
  markdown: string;
  release_date: Date;
}): Promise<Article> {
  try {
    const result = await sql`
      INSERT INTO articles (issue_id, writer_id, title, markdown, release_date)
      VALUES (${articleData.issue_id}, ${articleData.writer_id}, ${articleData.title}, 
              ${articleData.markdown}, ${articleData.release_date})
      RETURNING *`;
    return result[0] as Article;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to create article: ${error}`);
  }
}

export async function updateArticle(
  id: string,
  articleData: {
    issue_id?: number;
    title?: string;
    markdown?: string;
    release_date?: Date;
  }
): Promise<Article> {
  try {
    const updates: string[] = [];
    const values: (string | number | Date)[] = [];
    let paramCount = 1;

    if (articleData.issue_id !== undefined) {
      updates.push(`issue_id = $${paramCount++}`);
      values.push(articleData.issue_id);
    }
    if (articleData.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(articleData.title);
    }
    if (articleData.markdown !== undefined) {
      updates.push(`markdown = $${paramCount++}`);
      values.push(articleData.markdown);
    }
    if (articleData.release_date !== undefined) {
      updates.push(`release_date = $${paramCount++}`);
      values.push(articleData.release_date);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    // Add the id parameter
    values.push(id);
    const result = await sql`
      UPDATE articles 
      SET ${sql.unsafe(updates.join(", "))}
      WHERE id = $${paramCount}
      RETURNING *`;

    return result[0] as Article;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update article ${id}: ${error}`);
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    const result = await sql`
      DELETE FROM articles WHERE id = ${id}`;

    if (result.count === 0) {
      throw new Error("Article not found");
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to delete article ${id}: ${error}`);
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

export async function createUser(userData: {
  email: string;
  password: string;
  first_name: string;
  last_name?: string | null;
  role: string;
  auth_level: "admin" | "team" | "basic";
  pronouns?: string | null;
  fav_color?: string | null;
  description?: string | null;
  img_url?: string | null;
}): Promise<User> {
  try {
    // Hash the password
    const hashedPassword = await hash(userData.password, 12);

    const result = await sql`
      INSERT INTO users (
        email, 
        password, 
        first_name, 
        last_name, 
        role, 
        auth_level, 
        pronouns, 
        fav_color, 
        description, 
        img_url
      )
      VALUES (
        ${userData.email}, 
        ${hashedPassword}, 
        ${userData.first_name}, 
        ${userData.last_name || null}, 
        ${userData.role}, 
        ${userData.auth_level}, 
        ${userData.pronouns || null}, 
        ${userData.fav_color || null}, 
        ${userData.description || null}, 
        ${userData.img_url || null}
      )
      RETURNING *`;

    return result[0] as User;
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message.includes("duplicate key")) {
      throw new Error("A user with this email already exists");
    }
    throw new Error(`Failed to create user: ${error}`);
  }
}

export async function isUserAdmin(email: string): Promise<boolean> {
  try {
    const data = await sql`
    SELECT auth_level FROM users WHERE email = ${email}`;
    return data.length > 0 && data[0].auth_level === "admin";
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

// ISSUE MANAGEMENT (Additional functions)

export async function createIssue(issueData: {
  name: string;
  img_url: string | null;
  editors_note: string | null;
  editor_id: string;
  release_date: Date;
  description: string | null;
}): Promise<Issue> {
  try {
    // First, try to fix the sequence if needed
    await sql`
      SELECT setval('issues_id_seq', COALESCE((SELECT MAX(id) FROM issues), 0) + 1, false);
    `;

    const result = await sql`
      INSERT INTO issues (name, img_url, editors_note, editor_id, release_date, description)
      VALUES (${issueData.name}, ${issueData.img_url}, ${issueData.editors_note}, 
              ${issueData.editor_id}, ${issueData.release_date}, ${issueData.description})
      RETURNING *`;
    return result[0] as Issue;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to create issue: ${error}`);
  }
}

export async function resetIssuesSequence(): Promise<void> {
  try {
    await sql`
      SELECT setval('issues_id_seq', COALESCE((SELECT MAX(id) FROM issues), 0) + 1, false);
    `;
    console.log("Issues sequence reset successfully");
  } catch (error) {
    console.log("Error resetting issues sequence:", error);
    throw new Error(`Failed to reset issues sequence: ${error}`);
  }
}

export async function updateIssue(
  id: number,
  updates: {
    name?: string;
    img_url?: string;
    editors_note?: string;
    editor_id?: string;
    release_date?: Date;
    description?: string;
  }
): Promise<Issue> {
  try {
    const setClause = [];
    const values: (string | Date | number)[] = [];

    if (updates.name !== undefined) {
      setClause.push(`name = $${setClause.length + 1}`);
      values.push(updates.name);
    }
    if (updates.img_url !== undefined) {
      setClause.push(`img_url = $${setClause.length + 1}`);
      values.push(updates.img_url);
    }
    if (updates.editors_note !== undefined) {
      setClause.push(`editors_note = $${setClause.length + 1}`);
      values.push(updates.editors_note);
    }
    if (updates.editor_id !== undefined) {
      setClause.push(`editor_id = $${setClause.length + 1}`);
      values.push(updates.editor_id);
    }
    if (updates.release_date !== undefined) {
      setClause.push(`release_date = $${setClause.length + 1}`);
      values.push(updates.release_date);
    }
    if (updates.description !== undefined) {
      setClause.push(`description = $${setClause.length + 1}`);
      values.push(updates.description);
    }

    if (setClause.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const result = await sql.unsafe(
      `
      UPDATE issues 
      SET ${setClause.join(", ")}
      WHERE id = $${values.length}
      RETURNING *
    `,
      values
    );

    if (result.length === 0) {
      throw new Error("Issue not found");
    }

    return result[0] as unknown as Issue;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update issue ${id}: ${error}`);
  }
}

export async function checkIssueHasArticles(issueId: number): Promise<boolean> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM articles WHERE issue_id = ${issueId}`;
    return parseInt(result[0].count) > 0;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to check articles for issue ${issueId}: ${error}`);
  }
}

export async function deleteIssue(id: number): Promise<void> {
  try {
    // First check if there are any articles associated with this issue
    const hasArticles = await checkIssueHasArticles(id);
    if (hasArticles) {
      throw new Error(
        "Cannot delete issue: There are articles associated with this issue"
      );
    }

    const result = await sql`
      DELETE FROM issues WHERE id = ${id}`;

    if (result.count === 0) {
      throw new Error("Issue not found");
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to delete issue ${id}: ${error}`);
  }
}

export async function deleteTeamMember(id: string): Promise<void> {
  try {
    // First check if the user exists
    const user = await getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if there are any issues or articles associated with this user
    const userIssues = await sql`
      SELECT COUNT(*) as count FROM issues WHERE editor_id = ${id}`;

    if (userIssues[0]?.count > 0) {
      throw new Error(
        "Cannot delete user: There are issues associated with this user. Please reassign or delete the issues first."
      );
    }

    // Check if there are any articles associated with this user
    const userArticles = await sql`
      SELECT COUNT(*) as count FROM articles WHERE writer_id = ${id}`;

    if (userArticles[0]?.count > 0) {
      throw new Error(
        "Cannot delete user: There are articles associated with this user. Please reassign or delete the articles first."
      );
    }

    // Delete the user
    const result = await sql`
      DELETE FROM users WHERE id = ${id}`;

    if (result.count === 0) {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to delete team member ${id}: ${error}`);
  }
}
