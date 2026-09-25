"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { Project, Task, User } from "@/lib/types";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

interface Props {
  project: Project;
  tasks: Task[];
  members: User[];
  onTasksChange: (tasks: Task[]) => void;
}

export default function KanbanBoard({ project, tasks, members, onTasksChange }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const columns = [...project.columns].sort((a, b) => a.order - b.order);

  const grouped = useMemo(() => {
    const map: Record<string, Task[]> = {};
    columns.forEach((c) => (map[c.id] = []));
    tasks.forEach((t) => {
      if (!map[t.status]) map[t.status] = [];
      map[t.status].push(t);
    });
    Object.values(map).forEach((list) => list.sort((a, b) => a.order - b.order));
    return map;
  }, [tasks, columns]);

  async function handleDrop(status: string, index: number) {
    if (!draggedId) return;
    setDragOverCol(null);
    const res = await api.post(`/tasks/${draggedId}/move`, { toStatus: status, toIndex: index });
    onTasksChange(res.data);
    setDraggedId(null);
  }

  async function createTask(status: string, e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const res = await api.post("/tasks", { title: newTitle, project: project._id, status });
    onTasksChange([...tasks, res.data]);
    setNewTitle("");
    setAddingTo(null);
  }

  function updateTaskLocal(task: Task) {
    onTasksChange(tasks.map((t) => (t._id === task._id ? task : t)));
    setActiveTask(task);
  }

  function removeTaskLocal(taskId: string) {
    onTasksChange(tasks.filter((t) => t._id !== taskId));
    setActiveTask(null);
  }

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {columns.map((col) => (
        <div
          key={col.id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverCol(col.id);
          }}
          onDragLeave={() => setDragOverCol((c) => (c === col.id ? null : c))}
          onDrop={() => handleDrop(col.id, grouped[col.id]?.length || 0)}
          className={`flex flex-col w-72 shrink-0 rounded-xl2 bg-canvas/60 border border-line/60 p-2.5 transition-colors ${
            dragOverCol === col.id ? "kanban-column-drop-active" : ""
          }`}
        >
          <div className="flex items-center justify-between px-1.5 py-1 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink">{col.title}</span>
              <span className="text-xs text-muted bg-surface border border-line rounded-full px-1.5">
                {grouped[col.id]?.length || 0}
              </span>
            </div>
            <button
              onClick={() => setAddingTo(addingTo === col.id ? null : col.id)}
              className="p-1 rounded text-muted hover:text-accent hover:bg-surface transition-colors"
            >
              <Plus size={15} />
            </button>
          </div>

          <div className="flex flex-col gap-2 flex-1 min-h-[4px]">
            {(grouped[col.id] || []).map((task, idx) => (
              <div
                key={task._id}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverCol(col.id);
                }}
                onDrop={(e) => {
                  e.stopPropagation();
                  handleDrop(col.id, idx);
                }}
              >
                <TaskCard task={task} onOpen={() => setActiveTask(task)} onDragStart={() => setDraggedId(task._id)} />
              </div>
            ))}
          </div>

          {addingTo === col.id && (
            <form onSubmit={(e) => createTask(col.id, e)} className="mt-2 animate-fade-in">
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={() => !newTitle.trim() && setAddingTo(null)}
                placeholder="Task title…"
                className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </form>
          )}
        </div>
      ))}

      {activeTask && (
        <TaskModal
          task={activeTask}
          members={members}
          onClose={() => setActiveTask(null)}
          onUpdated={updateTaskLocal}
          onDeleted={removeTaskLocal}
        />
      )}
    </div>
  );
}
