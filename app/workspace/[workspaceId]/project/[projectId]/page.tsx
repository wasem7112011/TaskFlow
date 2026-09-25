"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { Project, Task, User, Priority } from "@/lib/types";
import Navbar from "@/components/Navbar";
import KanbanBoard from "@/components/KanbanBoard";
import SearchFilter from "@/components/SearchFilter";
import ActivityFeed from "@/components/ActivityFeed";

export default function ProjectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams<{ workspaceId: string; projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [directory, setDirectory] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  const loadTasks = useCallback(() => {
    const q: Record<string, string> = {};
    if (search) q.search = search;
    if (priority) q.priority = priority;
    if (assignee) q.assignee = assignee;
    const qs = new URLSearchParams(q).toString();
    api.get(`/tasks/project/${params.projectId}${qs ? `?${qs}` : ""}`).then((res) => setTasks(res.data));
  }, [params.projectId, search, priority, assignee]);

  useEffect(() => {
    if (!user) return;
    api.get(`/projects/${params.projectId}`).then((res) => setProject(res.data));
    api.get(`/auth/users`).then((res) => setDirectory(res.data));
  }, [user, params.projectId]);

  useEffect(() => {
    if (user) loadTasks();
  }, [user, loadTasks]);

  // Real-time: join the project's room and reconcile local task state on server events
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    socket.emit("project:join", params.projectId);

    const onCreated = (task: Task) => setTasks((prev) => (prev.find((t) => t._id === task._id) ? prev : [...prev, task]));
    const onUpdated = (task: Task) => setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    const onDeleted = ({ id }: { id: string }) => setTasks((prev) => prev.filter((t) => t._id !== id));
    const onReordered = (all: Task[]) => setTasks(all);
    const onProjectUpdated = (p: Project) => setProject(p);

    socket.on("task:created", onCreated);
    socket.on("task:updated", onUpdated);
    socket.on("task:deleted", onDeleted);
    socket.on("tasks:reordered", onReordered);
    socket.on("project:updated", onProjectUpdated);

    return () => {
      socket.emit("project:leave", params.projectId);
      socket.off("task:created", onCreated);
      socket.off("task:updated", onUpdated);
      socket.off("task:deleted", onDeleted);
      socket.off("tasks:reordered", onReordered);
      socket.off("project:updated", onProjectUpdated);
    };
  }, [user, params.projectId]);

  async function addMember(userId: string) {
    const res = await api.post(`/projects/${params.projectId}/members`, { userId });
    setProject(res.data);
  }

  if (loading || !user || !project) return null;

  const nonMembers = directory.filter((d) => !project.members.some((m) => m.id === d.id));

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 pt-6">
            <Link
              href={`/workspace/${params.workspaceId}`}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-3 w-fit"
            >
              <ArrowLeft size={14} /> Back to projects
            </Link>
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-display text-xl font-bold text-ink">{project.name}</h1>
              {nonMembers.length > 0 && (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-line rounded-lg px-3 py-1.5">
                    <UserPlus size={13} /> Add member
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-surface border border-line rounded-lg shadow-floating py-1 w-48 hidden group-hover:block z-10">
                    {nonMembers.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => addMember(d.id)}
                        className="w-full text-left px-3 py-1.5 text-sm text-ink hover:bg-canvas"
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mb-5">
              <SearchFilter
                search={search}
                onSearch={setSearch}
                priority={priority}
                onPriority={setPriority}
                assignee={assignee}
                onAssignee={setAssignee}
                members={project.members}
              />
            </div>
          </div>

          <div className="flex-1 px-6 pb-6 min-h-0">
            <KanbanBoard project={project} tasks={tasks} members={project.members} onTasksChange={setTasks} />
          </div>
        </div>

        <ActivityFeed projectId={params.projectId} />
      </div>
    </div>
  );
}
