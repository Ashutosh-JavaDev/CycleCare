import { pool } from '../config/db.js';

export async function createPost({ userId, content, anonymous }) {
  const { rows } = await pool.query(
    'INSERT INTO posts (user_id, content, anonymous) VALUES ($1, $2, $3) RETURNING id',
    [userId, content, anonymous]
  );
  return { id: rows[0].id, userId, content, anonymous };
}

export async function listPosts() {
  const { rows } = await pool.query(
    `SELECT posts.*, users.name
     FROM posts
     JOIN users ON users.id = posts.user_id
     ORDER BY posts.created_at DESC`
  );
  return rows;
}

export async function createComment({ postId, userId, comment }) {
  const { rows } = await pool.query(
    'INSERT INTO comments (post_id, user_id, comment) VALUES ($1, $2, $3) RETURNING id',
    [postId, userId, comment]
  );
  return { id: rows[0].id, postId, userId, comment };
}
