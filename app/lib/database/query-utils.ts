import { RowList, Row } from "postgres";
import { Event, Article } from "../definitions";
export function transformRowToEventArray(rows: RowList<Row[]>): Event[] {
  return rows.map((row) => ({
    id: row.id,
    issue_id: row.issue_id,
    startDate: row.start_date,
    endDate: row.end_date,
    title: row.title,
    notes: row.notes,
    externalLink: row.external_link,
    duration: row.duration,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export function transformRowToArticleArray(rows: RowList<Row[]>): Article[] {
  return rows.map((row) => ({
    id: row.id,
    issue_id: row.issue_id,
    writer_id: row.writer_id,
    title: row.title,
    markdown: row.markdown,
    release_date: row.release_date,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}
