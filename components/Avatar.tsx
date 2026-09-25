import { User } from "@/lib/types";

export default function Avatar({ user, size = 28 }: { user: User; size?: number }) {
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      title={user.name}
      className="rounded-full flex items-center justify-center text-white font-medium shrink-0 ring-2 ring-white"
      style={{ backgroundColor: user.avatarColor, width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
