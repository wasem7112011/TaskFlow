"use client";

import { useState } from "react";
import { X, Trash2, Plus } from "lucide-react";
import api from "@/lib/api";
import { Task, User, Priority } from "@/lib/types";
import Avatar from "./Avatar";
import CommentSection from "./CommentSection";

interface Props {
  task: Task;
  members: User[];
  onClose: () => void;
  onUpdated: (task: Task) => void;
  onDeleted: (taskId: string) => void;
}

const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];

export default function TaskModal({ task, members, onClose, onUpdated, onDeleted }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [labelInput, setLabelInput] = useState("");

  async function patch(fields: Partial<Task>) {
    const res = await api.put(`/tasks/${task._id}`, fields);
    onUpdated(res.data);
  }

  function toggleAssignee(userId: string) {
    const current = task.assignees.map((a) => a.id);
    const next = current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId];
    patch({ assignees: next as any });
  }

  function addLabel(e: React.FormEvent) {
    e.preventDefault();
    if (!labelInput.trim()) return;
    patch({ labels: [...task.labels, labelInput.trim()] });
    setLabelInput("");
  }

  async function remove() {
    if (!confirm("Delete this task?")) return;
    await api.delete(`/tasks/${task._id}`);
    onDeleted(task._id);
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-xl2 shadow-floating w-full max-w-lg max-h-[88vh] overflow-y-auto animate-fade-in"
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <button onClick={remove} className="p-2 rounded-lg text-muted hover:text-signal-coral hover:bg-canvas transition-colors">
            <Trash2 size={16} />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title.trim() && title !== task.title && patch({ title })}
            className="w-full text-lg font-display font-semibold text-ink focus:outline-none bg-transparent"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => description !== (task.description || "") && patch({ description })}
            placeholder="Add a description…"
            rows={3}
            className="w-full text-sm text-ink bg-canvas rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => patch({ priority: e.target.value as Priority })}
                className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p[0].toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">Due date</label>
              <input
                type="date"
                value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
                onChange={(e) => patch({ dueDate: (e.target.value || null) as any })}
                className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-2">Assignees</label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => {
                const active = task.assignees.some((a) => a.id === m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleAssignee(m.id)}
                    className={`flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border text-xs transition-colors ${
                      active ? "border-accent bg-accent-light text-accent" : "border-line text-muted hover:text-ink"
                    }`}
                  >
                    <Avatar user={m} size={20} /> {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-2">Labels</label>
            <div className="flex flex-wrap items-center gap-1.5">
              {task.labels.map((l) => (
                <span key={l} className="text-xs bg-accent-light text-accent px-2 py-1 rounded-full">
                  {l}
                </span>
              ))}
              <form onSubmit={addLabel} className="flex items-center">
                <input
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  placeholder="Add label"
                  className="w-20 text-xs px-2 py-1 rounded-full border border-dashed border-line focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button type="submit" className="text-muted hover:text-accent ml-1">
                  <Plus size={14} />
                </button>
              </form>
            </div>
          </div>

          <hr className="border-line" />

          <CommentSection taskId={task._id} />
        </div>
      </div>
    </div>
  );
}
