import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function CommentSection({ comments = [], onAddComment }) {
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    onAddComment({
      author: authorName.trim() || 'Tech Reader',
      content: commentText.trim(),
    });

    setCommentText('');
    setIsSubmitting(false);
  };

  return (
    <section className="comments-container" aria-label="Article Discussion">
      <h3 className="comments-header">
        <MessageSquare size={20} />
        <span>Discussion ({comments.length})</span>
      </h3>

      <form className="new-comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="comment-input-author"
          placeholder="Your Name / Handle (e.g., Alex Vance)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          aria-label="Commenter Name"
        />
        <textarea
          className="comment-input-textarea"
          placeholder="Share your thoughts, architectural critique, or questions..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
          aria-label="Comment message"
        />
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={isSubmitting || !commentText.trim()}
        >
          <Send size={15} />
          <span>Post Insight</span>
        </button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="comment-avatar"
            />
            <div className="comment-content-area">
              <div className="comment-meta">
                <span className="comment-author-name">{comment.author}</span>
                <span className="comment-date">{comment.date}</span>
              </div>
              <p className="comment-text">{comment.content}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No comments yet. Be the first to start the engineering conversation!
          </p>
        )}
      </div>
    </section>
  );
}
