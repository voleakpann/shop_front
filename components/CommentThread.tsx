"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { fetchComments, postComment, deleteComment, getAuthToken, fetchReactions, addReaction, removeReaction, pinComment, unpinComment, type CommentThread as CommentThreadType, type ReactionResponse } from "@/lib/api";
import LoginModal from "./LoginModal";

const MAX_DEPTH = 3;
const REACTIONS = ["❤️", "😂", "😮", "😢", "👏", "🔥"];

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

function ReactionPicker({ commentId }: { commentId: number }) {
  const [showPicker, setShowPicker] = useState(false);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [reactions, setReactions] = useState<ReactionResponse[]>([]);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadReactions = useCallback(async () => {
    if (loadingRef.current || loaded) return;
    loadingRef.current = true;
    const data = await fetchReactions(commentId);
    setReactions(data);
    setLoaded(true);

    // Track which emojis current user has reacted with
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userEmail = payload.sub;
        const userEmojis = new Set(
          data.filter((r) => r.userEmail === userEmail).map((r) => r.emoji)
        );
        setUserReactions(userEmojis);
      } catch {
        // Ignore token parse errors
      }
    }
  }, [commentId, loaded]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowReactionsModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInteraction = () => {
    if (!loaded) {
      loadReactions();
    }
  };

  const handleReact = async (emoji: string) => {
    const hasReacted = userReactions.has(emoji);

    if (hasReacted) {
      // Remove reaction
      const result = await removeReaction(commentId, emoji);
      if (result.ok) {
        loadReactions();
        setShowPicker(false);
      }
    } else {
      // Add reaction
      const result = await addReaction(commentId, emoji);
      if (result.ok) {
        loadReactions();
        setShowPicker(false);
      }
    }
  };

  // Group reactions by emoji
  const reactionsByEmoji = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push({ name: reaction.userName, email: reaction.userEmail });
    return acc;
  }, {} as Record<string, Array<{ name: string; email: string }>>);

  const totalReactions = reactions.length;
  const hasLiked = userReactions.has("❤️");
  const reactionsWithUsers = Object.entries(reactionsByEmoji).filter(([, users]) => users.length > 0);

  const handleLikeClick = async () => {
    if (hasLiked) {
      // If already liked, toggle modal
      if (totalReactions > 0) setShowReactionsModal(!showReactionsModal);
    } else {
      // If not liked, add heart reaction
      await handleReact("❤️");
    }
  };

  return (
    <div ref={pickerRef} className="relative" onMouseLeave={() => setShowPicker(false)}>
      <button
        onMouseEnter={() => {
          handleInteraction();
          setShowPicker(true);
        }}
        onClick={handleLikeClick}
        className={`font-medium transition flex items-center gap-1 ${
          hasLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-blue-600"
        }`}
      >
        {hasLiked ? "❤️" : "Like"}
        {totalReactions > 0 && <span className="text-xs">({totalReactions})</span>}
      </button>

      {/* Emoji picker on hover */}
      {showPicker && loaded && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-1 z-50">
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className="text-xl hover:scale-125 transition cursor-pointer"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Reactions modal */}
      {showReactionsModal && totalReactions > 0 && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Reactions</h3>
            <button onClick={() => setShowReactionsModal(false)} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          {/* Reaction tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setSelectedFilter("All")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedFilter === "All"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({totalReactions})
            </button>
            {reactionsWithUsers.map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => setSelectedFilter(emoji)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedFilter === emoji ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {emoji} {users.length}
              </button>
            ))}
          </div>

          {/* Users list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {reactionsWithUsers.map(([emoji, users]) => {
              if (selectedFilter !== "All" && selectedFilter !== emoji) return null;
              return users.map((user) => (
                <div key={`${emoji}-${user.email}`} className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                      style={{ background: avatarColor(user.name) }}
                    >
                      {user.name.trim()[0]?.toUpperCase() || "?"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-lg">{emoji}</span>
                </div>
              ));
            })}
          </div>
        </div>
      )}
    </div>
  );
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
  currentUserRole,
  onLoginRequired,
  onPinned,
}: {
  node: CommentThreadType;
  depth: number;
  isLast: boolean;
  collapsed: Set<number>;
  toggleCollapse: (id: number) => void;
  openReplyId: number | null;
  toggleReplyBox: (id: number) => void;
  closeReplyBox: () => void;
  onReply: (targetId: number, depth: number, content: string, parentId?: number) => void;
  onDelete: (id: number) => void;
  suppressOwnComposer: boolean;
  slug: string;
  currentUserEmail: string | null;
  currentUserRole: string | null;
  onLoginRequired: () => void;
  onPinned: () => void;
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
  const [isPinning, setIsPinning] = useState(false);

  const handleReplyClick = () => {
    if (!currentUserEmail) {
      onLoginRequired();
      return;
    }
    toggleReplyBox(node.id);
  };

  const handlePin = async () => {
    if (currentUserRole !== "ADMIN") {
      alert("Only admins can pin comments");
      return;
    }
    setIsPinning(true);
    if (node.pinned) {
      const result = await unpinComment(node.id);
      if (result.ok) {
        onPinned();
      } else {
        alert(result.error);
      }
    } else {
      const result = await pinComment(node.id);
      if (result.ok) {
        onPinned();
      } else {
        alert(result.error);
      }
    }
    setIsPinning(false);
  };

  const handleReply = async (content: string) => {
    setSubmitting(true);
    await onReply(composerTarget!.id, composerTargetDepth, content, composerTargetDepth >= MAX_DEPTH ? node.id : undefined);
    setSubmitting(false);
    closeReplyBox();
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
          <div className="flex-1">
            <span className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-gray-900">{node.userName}</span>
              {node.pinned && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  📌 Pinned
                </span>
              )}
              <span className="text-xs text-gray-500">· {timeAgo(node.createdAt)}</span>
            </span>
            <p className="text-sm text-gray-900 mt-0.5 break-words">{node.content}</p>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs leading-4">
            <ReactionPicker commentId={node.id} />
            <button
              className="font-medium text-gray-500 hover:text-blue-600 transition"
              onClick={handleReplyClick}
            >
              Reply
            </button>
            {currentUserEmail === node.userEmail && (
              <button
                className="font-medium text-red-400 hover:text-red-600 transition"
                onClick={() => onDelete(node.id)}
              >
                Delete
              </button>
            )}
            {currentUserRole === "ADMIN" && (
              <button
                className="font-medium text-amber-500 hover:text-amber-600 transition disabled:opacity-50"
                onClick={() => handlePin()}
                disabled={isPinning}
              >
                {isPinning ? "..." : node.pinned ? "📌 Pinned" : "📌 Pin"}
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
                  currentUserRole={currentUserRole}
                  onLoginRequired={onLoginRequired}
                  onPinned={onPinned}
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
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Ensure slug has proper prefix for products
  const fullSlug = !slug.startsWith('product-') && !slug.startsWith('blog-') ? `product-${slug}` : slug;

  const reload = useCallback(async () => {
    const comments = await fetchComments(fullSlug);
    setThread({
      id: 0,
      userName: "",
      userEmail: "",
      content: "",
      createdAt: new Date().toISOString(),
      replies: comments,
    });
    setLoading(false);
  }, [fullSlug]);

  useEffect(() => {
    reload();
    // Extract email and role from JWT
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserEmail(payload.sub || null);
        setCurrentUserRole(payload.role || null);
      } catch {
        setCurrentUserEmail(null);
        setCurrentUserRole(null);
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
    if (!currentUserEmail) {
      setShowLoginModal(true);
      return;
    }
    const result = await postComment(slug, content);
    if (result.ok) reload();
  };

  const addReply = async (targetId: number, depth: number, content: string, parentId?: number) => {
    const result = await postComment(slug, content, depth >= MAX_DEPTH ? parentId : targetId);
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
          {[...thread.replies].reverse().map((comment, i) => (
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
              currentUserRole={currentUserRole}
              onLoginRequired={() => setShowLoginModal(true)}
              onPinned={reload}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Be the first to comment.</p>
      )}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
