"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { Workspace } from "@/lib/types";
import Navbar from "@/components/Navbar";

const COLORS = ["#5B54E8", "#F5A524", "#1FAE73", "#FF6B4A", "#3B82F6", "#EC4899"];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) api.get("/workspaces").then((res) => setWorkspaces(res.data));
  }, [user]);

  async function createWorkspace(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const res = await api.post("/workspaces", { name, description, color });
    setWorkspaces([res.data, ...workspaces]);
    setName("");
    setDescription("");
    setShowForm(false);
  }

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Your workspaces</h1>
            <p className="text-sm text-muted mt-1">Pick a workspace to see its projects and boards.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> New workspace
          </button>
        </div>

        {showForm && (
          <form onSubmit={createWorkspace} className="bg-surface border border-line rounded-xl2 shadow-card p-5 mb-8 space-y-3 animate-fade-in">
            <input
              autoFocus
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Workspace name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-canvas text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="What's this workspace for? (optional)"
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

        {workspaces.length === 0 && !showForm ? (
          <div className="text-center py-20 border border-dashed border-line rounded-xl2">
            <p className="text-muted text-sm">No workspaces yet. Create one to start organizing projects.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((ws) => (
              <Link
                key={ws._id}
                href={`/workspace/${ws._id}`}
                className="bg-surface border border-line rounded-xl2 shadow-card p-5 hover:shadow-floating hover:-translate-y-0.5 transition-all"
              >
                <div className="w-9 h-9 rounded-lg mb-4" style={{ backgroundColor: ws.color }} />
                <h3 className="font-display font-semibold text-ink mb-1">{ws.name}</h3>
                <p className="text-sm text-muted line-clamp-2 min-h-[2.5rem]">{ws.description || "No description yet."}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted mt-4">
                  <Users size={13} />
                  {Array.isArray(ws.members) ? ws.members.length : 0} member{(ws.members as any[])?.length === 1 ? "" : "s"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
