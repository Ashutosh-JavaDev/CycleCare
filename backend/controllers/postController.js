import { createComment, createPost, listPosts } from '../models/postModel.js';

export async function getPosts(_req, res) {
  const rows = await listPosts();
  return res.json(rows);
}

export async function addPost(req, res) {
  const { content, anonymous = true } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Post content is required.' });
  }

  const post = await createPost({ userId: req.user.id, content, anonymous });
  return res.status(201).json(post);
}

export async function addPostComment(req, res) {
  const { comment } = req.body;
  const { id } = req.params;

  if (!comment) {
    return res.status(400).json({ message: 'Comment is required.' });
  }

  const savedComment = await createComment({ postId: Number(id), userId: req.user.id, comment });
  return res.status(201).json(savedComment);
}