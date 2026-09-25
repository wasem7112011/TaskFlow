"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { Comment } from "@/lib/types";
import Avatar from "./Avatar";
import { Send } from "lucide-react";

export default function CommentSection({ taskId }: { taskId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/comments/task/${taskId}`).then((res) => setComments(res.data));

    const socket = getSocket();
    const onNew = (c: Comment) => {
      if (c.task === taskId) setComments((prev) => [...prev, c]);
    };
    socket.on("comment:new", onNew);
    return () => {
      socket.off("comment:new", onNew);
    };
  }, [taskId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      const res = await api.post("/comments", { task: taskId, text });
      setComments((prev) => (prev.find((c) => c._id === res.data._id) ? prev : [...prev, res.data]));
      setText("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Comments</h3>

      <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-3">
        {comments.length === 0 && <p className="text-sm text-muted">No comments yet.</p>}
        {comments.map((c) => (
          <div key={c._id} className="flex gap-2.5">
            <Avatar user={c.author} size={26} />
            <div className="flex-1 bg-canvas rounded-lg px-3 py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-medium text-ink">{c.author.name}</span>
                <span className="text-[10px] text-muted">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
              </div>
              <p className="text-sm text-ink mt-0.5">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          className="flex-1 px-3 py-2 rounded-lg border border-line bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={busy || !text.trim()}
          className="p-2 rounded-lg bg-accent hover:bg-accent-hover text-white disabled:opacity-50"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
