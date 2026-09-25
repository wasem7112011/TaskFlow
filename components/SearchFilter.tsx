"use client";

import { Search } from "lucide-react";
import { User, Priority } from "@/lib/types";
import Avatar from "./Avatar";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  priority: Priority | "";
  onPriority: (v: Priority | "") => void;
  assignee: string;
  onAssignee: (v: string) => void;
  members: User[];
}

const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];

export default function SearchFilter({ search, onSearch, priority, onPriority, assignee, onAssignee, members }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tasks…"
          className="pl-9 pr-3 py-2 w-56 rounded-lg border border-line bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <select
        value={priority}
        onChange={(e) => onPriority(e.target.value as Priority | "")}
        className="px-3 py-2 rounded-lg border border-line bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p[0].toUpperCase() + p.slice(1)}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onAssignee("")}
          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
            assignee === "" ? "bg-accent text-white border-accent" : "bg-surface border-line text-muted hover:text-ink"
          }`}
        >
          Everyone
        </button>
        {members.map((m) => (
          <button key={m.id} onClick={() => onAssignee(assignee === m.id ? "" : m.id)} className="shrink-0">
            <div className={`rounded-full ${assignee === m.id ? "ring-2 ring-accent ring-offset-1" : ""}`}>
              <Avatar user={m} size={26} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
