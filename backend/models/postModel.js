import { pool } from '../config/db.js';

export async function createPost({ userId, content, anonymous }) {
  const [result] = await pool.query(
    'INSERT INTO posts (user_id, content, anonymous) VALUES (?, ?, ?)',
    [userId, content, anonymous]
  );
  return { id: result.insertId, userId, content, anonymous };
}

export async function listPosts() {
  const [rows] = await pool.query(
    `SELECT posts.*, users.name
     FROM posts
     JOIN users ON users.id = posts.user_id
     ORDER BY posts.created_at DESC`
  );
  return rows;
}

export async function createComment({ postId, userId, comment }) {
  const [result] = await pool.query(
    'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)',
    [postId, userId, comment]
  );
  return { id: result.insertId, postId, userId, comment };
}