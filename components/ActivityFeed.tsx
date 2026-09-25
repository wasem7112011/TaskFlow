"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { ActivityEntry } from "@/lib/types";
import Avatar from "./Avatar";

function describe(entry: ActivityEntry): string {
  const title = entry.meta?.title ? `"${entry.meta.title}"` : "a task";
  switch (entry.action) {
    case "created_project":
      return "created this project";
    case "created_task":
      return `created ${title}`;
    case "updated_task":
      return `updated ${title}`;
    case "moved_task":
      return `moved ${title} from ${entry.meta?.from} to ${entry.meta?.to}`;
    case "assigned_user":
      return `updated assignees on ${title}`;
    case "added_member":
      return "added a member to the project";
    case "commented":
      return `commented: "${entry.meta?.snippet}"`;
    case "deleted_task":
      return `deleted ${title}`;
    default:
      return entry.action.replace(/_/g, " ");
  }
}

export default function ActivityFeed({ projectId }: { projectId: string }) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    api.get(`/activity/project/${projectId}`).then((res) => setEntries(res.data));

    const socket = getSocket();
    const onNew = (entry: ActivityEntry) => {
      if (entry.project === projectId) setEntries((prev) => [entry, ...prev].slice(0, 100));
    };
    socket.on("activity:new", onNew);
    return () => {
      socket.off("activity:new", onNew);
    };
  }, [projectId]);

  return (
    <div className="w-72 border-l border-line bg-surface p-4 overflow-y-auto shrink-0 hidden lg:block">
      <h2 className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">Activity</h2>
      <div className="space-y-4">
        {entries.length === 0 && <p className="text-sm text-muted">No activity yet.</p>}
        {entries.map((entry) => (
          <div key={entry._id} className="flex gap-2.5">
            <Avatar user={entry.actor} size={24} />
            <div>
              <p className="text-xs text-ink leading-snug">
                <span className="font-medium">{entry.actor.name}</span> {describe(entry)}
              </p>
              <p className="text-[10px] text-muted mt-0.5">{formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
