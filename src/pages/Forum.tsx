import React, { useMemo, useState } from 'react';
import { MessageCircle, ThumbsUp, Send, Shield, UserRound } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useApp } from '../store/AppContext';

const categories = ['General', 'Health', 'Lifestyle', 'Success Stories'];

export const Forum: React.FC = () => {
  const { posts, addPost, upvotePost, addComment, user } = useApp();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [anonymous, setAnonymous] = useState(true);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [sortMode, setSortMode] = useState<'recent' | 'popular'>('popular');

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => (
      sortMode === 'popular'
        ? b.upvotes - a.upvotes || b.timestamp.localeCompare(a.timestamp)
        : b.timestamp.localeCompare(a.timestamp)
    )),
    [posts, sortMode]
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addPost({
      author: anonymous ? 'Anonymous' : user?.name || 'CycleCare User',
      anonymous,
      content: content.trim(),
      category,
    });

    setContent('');
    setCategory('General');
    setAnonymous(true);
  };

  const handleCommentSubmit = (postId: number) => {
    const draft = commentDrafts[postId]?.trim();
    if (!draft) return;
    addComment(postId, draft);
    setCommentDrafts(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="max-w-5xl">
        <p className="text-sm uppercase tracking-[0.24em] text-pink-500/70">Community Forum</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800">Anonymous support, honest questions, student-safe conversations.</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500">
          Share what you are experiencing, ask for peer support, and discover practical tips from others tracking their cycle.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleCreatePost} className="rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Create a New Post</h2>
              <p className="text-sm text-slate-500">Start a conversation with the CycleCare community.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              placeholder="What would you like support or advice on today?"
              className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
            />
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-400"
                >
                  {categories.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={e => setAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded border-pink-300 text-pink-500 focus:ring-pink-300"
                />
                Post anonymously
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-pink-200"
              >
                Share Post
              </button>
            </div>
          </div>
        </form>

        <div className="rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Community Guidelines</h2>
              <p className="text-sm text-slate-500">Built for respectful, health-focused support.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-pink-50/70 px-4 py-3">
              Keep posts kind, non-judgmental, and supportive.
            </div>
            <div className="rounded-2xl bg-purple-50/70 px-4 py-3">
              Avoid sharing private contact details or identifying information.
            </div>
            <div className="rounded-2xl bg-rose-50/70 px-4 py-3">
              Medical emergencies should always go to a licensed healthcare professional.
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <button onClick={() => setSortMode('popular')} className={`px-3 py-1.5 rounded-xl text-sm ${sortMode === 'popular' ? 'bg-pink-500 text-white' : 'bg-white border border-pink-200 text-pink-500'}`}>
            Sort by popularity
          </button>
          <button onClick={() => setSortMode('recent')} className={`px-3 py-1.5 rounded-xl text-sm ${sortMode === 'recent' ? 'bg-pink-500 text-white' : 'bg-white border border-pink-200 text-pink-500'}`}>
            Sort by recent
          </button>
        </div>
        {sortedPosts.map(post => (
          <article key={post.id} className="rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 text-white">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{post.author}</p>
                    <p className="text-xs text-slate-400">{format(parseISO(post.timestamp), 'MMM d, yyyy')}</p>
                  </div>
                  <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">{post.category}</span>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{post.content}</p>
              </div>

              <button
                onClick={() => upvotePost(post.id)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  post.userUpvoted
                    ? 'bg-pink-500 text-white'
                    : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                {post.upvotes}
              </button>
            </div>

            <div className="mt-6 space-y-3 border-t border-pink-50 pt-5">
              {post.comments.map(comment => (
                <div key={comment.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-700">{comment.author}</span>
                    <span className="text-xs text-slate-400">{format(parseISO(comment.timestamp), 'MMM d')}</span>
                  </div>
                  {comment.text}
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <input
                  value={commentDrafts[post.id] || ''}
                  onChange={e => setCommentDrafts(prev => ({ ...prev, [post.id]: e.target.value }))}
                  placeholder="Write a supportive comment"
                  className="flex-1 rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-pink-400"
                />
                <button
                  type="button"
                  onClick={() => handleCommentSubmit(post.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white transition hover:shadow-lg hover:shadow-pink-200"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};