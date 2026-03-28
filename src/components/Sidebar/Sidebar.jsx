import { NavLink } from "react-router-dom";
import { Users, FileCheck, MessageSquare, CreditCard, LayoutDashboard } from "lucide-react";

export function Sidebar() {
  const links = [
    { to: "/", icon: <LayoutDashboard className="mr-2 h-4 w-4" />, label: "Dashboard" },
    { to: "/users", icon: <Users className="mr-2 h-4 w-4" />, label: "Users" },
    { to: "/verifications", icon: <FileCheck className="mr-2 h-4 w-4" />, label: "Verifications" },
    { to: "/chat", icon: <MessageSquare className="mr-2 h-4 w-4" />, label: "Chat" },
    { to: "/subscriptions", icon: <CreditCard className="mr-2 h-4 w-4" />, label: "Subscriptions" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
      <div className="font-bold text-2xl mb-8 text-center text-blue-400">Bitobbu Admin</div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
