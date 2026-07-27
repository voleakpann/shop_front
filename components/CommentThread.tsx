"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchComments, type CommentThread as CommentThreadType } from "@/lib/api";
import CommentForm from "@/components/CommentForm";

function initials(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function countAll(comments: CommentThreadType[]): number {
  return comments.reduce((n, c) => n + 1 + countAll(c.replies), 0);
}

function CommentItem({
  comment,
  slug,
  onPosted,
}: {
  comment: CommentThreadType;
  slug: string;
  onPosted: () => void;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <li className="flex gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f2f3f5] text-sm font-medium text-ink">
        {initials(comment.userName)}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-ink">
          {comment.userName} <span className="ml-2 text-xs font-normal text-muted">{formatDate(comment.createdAt)}</span>
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{comment.content}</p>
        <button
          onClick={() => setReplying((r) => !r)}
          className="mt-1 text-xs font-medium text-brand hover:text-ink"
        >
          {replying ? "Cancel" : "Reply"}
        </button>

        {replying && (
          <div className="mt-3">
            <CommentForm
              slug={slug}
              parentId={comment.id}
              onCancel={() => setReplying(false)}
              onPosted={() => {
                setReplying(false);
                onPosted();
              }}
            />
          </div>
        )}

        {comment.replies.length > 0 && (
          <ul className="mt-6 space-y-6">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} slug={slug} onPosted={onPosted} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export default function CommentThread({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentThreadType[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setComments(await fetchComments(slug));
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    reload();
  }, [reload]);

  const total = countAll(comments);

  return (
    <div>
      <h3 className="mb-8 text-lg font-light uppercase tracking-[0.08em] text-ink">
        {loading ? "Comments" : `${total} Comment${total === 1 ? "" : "s"}`}
      </h3>

      {!loading && comments.length > 0 && (
        <ul className="space-y-6">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} slug={slug} onPosted={reload} />
          ))}
        </ul>
      )}

      {!loading && comments.length === 0 && (
        <p className="text-sm text-muted">Be the first to comment on this product.</p>
      )}

      <div className="mt-10">
        <h4 className="mb-6 text-sm font-medium uppercase tracking-[0.1em] text-ink">Leave A Comment</h4>
        <CommentForm slug={slug} onPosted={reload} />
      </div>
    </div>
  );
}
