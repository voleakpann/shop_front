"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchComments, postComment, deleteComment, getAuthToken, type CommentThread as CommentThreadType } from "@/lib/api";

const MAX_DEPTH = 3;

function avatarColor(name: string) {
  const colors = ["#F97362", "#4C9AFF", "#57D9A3", "#FFAB00", "#998DD9", "#00C7E6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initial = name.trim()[0]?.toUpperCase() || "?";
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, background: avatarColor(name), fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function Composer({
  mentionUser,
  onSubmit,
  onCancel,
  autoFocus,
  isRoot,
  submitting,
}: {
  mentionUser?: string;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  isRoot?: boolean;
  submitting?: boolean;
}) {
  const [text, setText] = useState(mentionUser ? `@${mentionUser} ` : "");

  const submit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <div className="flex gap-2 items-center">
      <Avatar name="You" size={32} />
      {mentionUser && (
        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium shrink-0">
          @{mentionUser}
        </span>
      )}
      <input
        autoFocus={autoFocus}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape" && !isRoot) onCancel?.();
        }}
        placeholder={isRoot ? "Write a comment..." : "Write..."}
        className={`px-3 py-1.5 border-none rounded-full bg-gray-100 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${isRoot ? "flex-1 min-w-0" : "w-28"}`}
        type="text"
        disabled={submitting}
      />
      <button
        onClick={submit}
        disabled={!text.trim() || submitting}
        className="px-4 py-1.5 bg-black text-white rounded-full text-xs font-semibold hover:bg-gray-800 disabled:opacity-40 transition shrink-0"
      >
        {submitting ? "..." : isRoot ? "Post" : "Reply"}
      </button>
      {!isRoot && (
        <button
          aria-label="Cancel reply"
          className="text-gray-500 hover:opacity-70 text-sm shrink-0"
          onClick={onCancel}
        >
          ✕
        </button>
      )}
    </div>
  );
}

function findWithPath(node: CommentThreadType, id: number, path: CommentThreadType[] = []): CommentThreadType[] | null {
  if (node.id === id) return [...path, node];
  for (const child of node.replies || []) {
    const found = findWithPath(child, id, [...path, node]);
    if (found) return found;
  }
  return null;
}

function CommentNode({
  node,
  depth,
  isLast,
  collapsed,
  toggleCollapse,
  openReplyId,
  toggleReplyBox,
  closeReplyBox,
  onReply,
  onDelete,
  suppressOwnComposer,
  slug,
  currentUserEmail,
}: {
  node: CommentThreadType;
  depth: number;
  isLast: boolean;
  collapsed: Set<number>;
  toggleCollapse: (id: number) => void;
  openReplyId: number | null;
  toggleReplyBox: (id: number) => void;
  closeReplyBox: () => void;
  onReply: (targetId: number, depth: number, content: string) => void;
  onDelete: (id: number) => void;
  suppressOwnComposer: boolean;
  slug: string;
  currentUserEmail: string | null;
}) {
  const children = node.replies || [];
  const hasChildren = children.length > 0;
  const isCollapsed = collapsed.has(node.id);
  const childDepth = depth >= MAX_DEPTH ? depth : depth + 1;
  const showElbow = depth > 1;

  const leafMatch = children.find((c) => (c.replies || []).length === 0 && c.id === openReplyId);
  const showOwnComposer = !suppressOwnComposer && (openReplyId === node.id || !!leafMatch);
  const composerTarget = openReplyId === node.id ? node : leafMatch;
  const composerTargetDepth = openReplyId === node.id ? depth : childDepth;

  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (content: string) => {
    setSubmitting(true);
    await onReply(composerTarget!.id, composerTargetDepth, content);
    setSubmitting(false);
  };

  return (
    <div className={showElbow ? "relative" : ""}>
      {showElbow && !isLast && (
        <span aria-hidden className="absolute bottom-0 w-0.5 bg-gray-200" style={{ left: -29, top: -8 }} />
      )}
      {showElbow && (
        <span
          aria-hidden
          className="absolute h-6 rounded-bl-xl border-l-2 border-b-2 border-gray-200"
          style={{ left: -29, top: -8, width: 29 }}
        />
      )}

      <div className="flex gap-3">
        <div className="flex flex-col shrink-0">
          <Avatar name={node.userName} />
          {hasChildren && !isCollapsed && <span aria-hidden className="w-0.5 flex-1 mt-1 mx-auto bg-gray-200" />}
        </div>
        <div className="flex-1 min-w-0">
          <div>
            <span className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-gray-900">{node.userName}</span>
              <span className="text-xs text-gray-500">· {timeAgo(node.createdAt)}</span>
            </span>
            <p className="text-sm text-gray-900 mt-0.5 break-words">{node.content}</p>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs leading-4">
            <button className="font-medium text-gray-500 hover:text-blue-600 transition">
              Like {node.likeCount ? `(${node.likeCount})` : ""}
            </button>
            <button
              className="font-medium text-gray-500 hover:text-blue-600 transition"
              onClick={() => toggleReplyBox(node.id)}
            >
              Reply
            </button>
            {currentUserEmail === node.userEmail && (
              <button
                className="font-medium text-red-400 hover:text-red-600 transition"
                onClick={() => {
                  if (confirm("Delete this comment?")) {
                    onDelete(node.id);
                  }
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {hasChildren && (
        <div className="pl-11 pt-1.5 space-y-2">
          <button
            className="text-xs font-semibold text-gray-500 hover:underline"
            onClick={() => toggleCollapse(node.id)}
          >
            {isCollapsed ? "Show replies" : "Hide replies"}
          </button>

          {!isCollapsed && (
            <div className={depth > 1 ? "pt-2 space-y-2 pl-11" : ""}>
              {children.map((child, i) => (
                <CommentNode
                  key={child.id}
                  node={child}
                  depth={childDepth}
                  isLast={i === children.length - 1}
                  collapsed={collapsed}
                  toggleCollapse={toggleCollapse}
                  openReplyId={openReplyId}
                  toggleReplyBox={toggleReplyBox}
                  closeReplyBox={closeReplyBox}
                  onReply={onReply}
                  onDelete={onDelete}
                  suppressOwnComposer={(child.replies || []).length === 0}
                  slug={slug}
                  currentUserEmail={currentUserEmail}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showOwnComposer && (
        <div className={hasChildren ? "pl-11 pt-2" : "mt-2"}>
          <div className={depth > 1 ? "relative" : ""}>
            {depth > 1 && (
              <span
                aria-hidden
                className="absolute h-6 rounded-bl-xl border-l-2 border-b-2 border-gray-200"
                style={{ left: -29, top: -8, width: 29 }}
              />
            )}
            <Composer
              mentionUser={composerTarget?.userName}
              autoFocus
              onCancel={closeReplyBox}
              onSubmit={(content) => handleReply(content)}
              submitting={submitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommentThreadComponent({ slug }: { slug: string }) {
  const [thread, setThread] = useState<CommentThreadType | null>(null);
  const [openReplyId, setOpenReplyId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(new Set<number>());
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const comments = await fetchComments(slug);
    if (comments.length > 0) {
      setThread({
        id: 0,
        userName: "",
        userEmail: "",
        content: "",
        createdAt: new Date().toISOString(),
        replies: comments,
      });
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    reload();
    // Extract email from JWT
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserEmail(payload.sub || null);
      } catch {
        setCurrentUserEmail(null);
      }
    }
  }, [reload]);

  const toggleReplyBox = (id: number) => setOpenReplyId((prev) => (prev === id ? null : id));
  const closeReplyBox = () => setOpenReplyId(null);
  const toggleCollapse = (id: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const addRootReply = async (content: string) => {
    const result = await postComment(slug, content);
    if (result.ok) reload();
  };

  const addReply = async (targetId: number, depth: number, content: string) => {
    const result = await postComment(slug, content, depth >= MAX_DEPTH ? undefined : targetId);
    if (result.ok) reload();
  };

  const handleDelete = async (commentId: number) => {
    const result = await deleteComment(commentId);
    if (result.ok) {
      reload();
    } else {
      alert(result.error);
    }
  };

  if (loading) return <p className="text-sm text-muted">Loading comments...</p>;
  if (!thread) return null;

  const totalComments = (node: CommentThreadType): number =>
    (node.replies || []).reduce((sum, r) => sum + 1 + totalComments(r), 0);

  return (
    <div className="max-w-2xl">
      <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.1em] text-ink">
        {totalComments(thread)} Comment{totalComments(thread) === 1 ? "" : "s"}
      </h3>

      <div className="mb-8 pb-6 border-b border-line">
        <Composer isRoot mentionUser={undefined} onSubmit={addRootReply} />
      </div>

      {thread.replies && thread.replies.length > 0 ? (
        <div className="space-y-6">
          {thread.replies.map((comment, i) => (
            <CommentNode
              key={comment.id}
              node={comment}
              depth={1}
              isLast={i === thread.replies!.length - 1}
              collapsed={collapsed}
              toggleCollapse={toggleCollapse}
              openReplyId={openReplyId}
              toggleReplyBox={toggleReplyBox}
              closeReplyBox={closeReplyBox}
              onReply={addReply}
              onDelete={handleDelete}
              suppressOwnComposer={false}
              slug={slug}
              currentUserEmail={currentUserEmail}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Be the first to comment.</p>
      )}
    </div>
  );
}
