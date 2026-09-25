"use client";

import { Task } from "@/lib/types";
import Avatar from "./Avatar";
import { CalendarDays } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-slate-100 text-signal-slate",
  medium: "bg-blue-50 text-blue-600",
  high: "bg-amber-50 text-signal-amber",
  urgent: "bg-red-50 text-signal-coral",
};

export default function TaskCard({
  task,
  onOpen,
  onDragStart,
}: {
  task: Task;
  onOpen: () => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && isPast(due) && !isToday(due);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className="bg-surface border border-line rounded-xl2 p-3.5 shadow-card hover:shadow-floating cursor-pointer transition-shadow active:cursor-grabbing"
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-sm font-medium text-ink mb-2 leading-snug">{task.title}</p>

      {task.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((l) => (
            <span key={l} className="text-[10px] bg-accent-light text-accent px-1.5 py-0.5 rounded">
              {l}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        {due ? (
          <span className={`flex items-center gap-1 text-[11px] ${overdue ? "text-signal-coral" : "text-muted"}`}>
            <CalendarDays size={12} /> {format(due, "MMM d")}
          </span>
        ) : (
          <span />
        )}
        {task.assignees?.length > 0 && (
          <div className="flex -space-x-2">
            {task.assignees.slice(0, 3).map((a) => (
              <Avatar key={a.id} user={a} size={22} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
