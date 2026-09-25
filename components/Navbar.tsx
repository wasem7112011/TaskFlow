"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import Avatar from "./Avatar";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header className="h-14 border-b border-line bg-surface flex items-center justify-between px-5 shrink-0">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-accent" />
        <span className="font-display font-bold text-ink">TaskFlow</span>
      </Link>
      <div className="flex items-center gap-3">
        <Avatar user={user} size={30} />
        <span className="text-sm text-ink font-medium hidden sm:inline">{user.name}</span>
        <button
          onClick={logout}
          className="p-2 rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
