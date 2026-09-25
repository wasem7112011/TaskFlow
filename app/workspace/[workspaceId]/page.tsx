"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft, KanbanSquare } from "lucide-react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { Project, Workspace } from "@/lib/types";
import Navbar from "@/components/Navbar";

export default function WorkspacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams<{ workspaceId: string }>();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api.get(`/workspaces/${params.workspaceId}`).then((res) => setWorkspace(res.data));
    api.get(`/projects/workspace/${params.workspaceId}`).then((res) => setProjects(res.data));
  }, [user, params.workspaceId]);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await api.post("/projects", { name, description, workspace: params.workspaceId });
    setProjects([res.data, ...projects]);
    setName("");
    setDescription("");
    setShowForm(false);
  }

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-4 w-fit">
          <ArrowLeft size={14} /> All workspaces
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">{workspace?.name || "Workspace"}</h1>
            <p className="text-sm text-muted mt-1">{workspace?.description || "Projects in this workspace."}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> New project
          </button>
        </div>

        {showForm && (
          <form onSubmit={createProject} className="bg-surface border border-line rounded-xl2 shadow-card p-5 mb-8 space-y-3 animate-fade-in">
            <input
              autoFocus
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="What's this project about? (optional)"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted hover:text-ink">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg font-medium">
                Create
              </button>
            </div>
          </form>
        )}

        {projects.length === 0 && !showForm ? (
          <div className="text-center py-20 border border-dashed border-line rounded-xl2">
            <p className="text-muted text-sm">No projects yet. Create one to start a kanban board.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <Link
                key={p._id}
                href={`/workspace/${params.workspaceId}/project/${p._id}`}
                className="bg-surface border border-line rounded-xl2 shadow-card p-5 hover:shadow-floating hover:-translate-y-0.5 transition-all"
              >
                <KanbanSquare size={22} className="text-accent mb-4" />
                <h3 className="font-display font-semibold text-ink mb-1">{p.name}</h3>
                <p className="text-sm text-muted line-clamp-2 min-h-[2.5rem]">{p.description || "No description yet."}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
