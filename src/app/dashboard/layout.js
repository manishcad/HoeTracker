"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, Home, Users, Heart, User as UserIcon } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: "250px", borderRight: "1px solid var(--glass-border)", padding: "2rem", display: "flex", flexDirection: "column", borderRadius: "0" }}>
        <h2 className="text-gradient" style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "2rem" }}>HoeTracker</h2>
        
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/dashboard" className="sidebar-link"><Home size={20} /> Dashboard</Link>
          <Link href="/dashboard/add" className="sidebar-link"><Users size={20} /> Add Connection</Link>
          <Link href="/dashboard/favorites" className="sidebar-link"><Heart size={20} /> Favorites</Link>
          <Link href="/dashboard/ai" className="sidebar-link"><span style={{ fontSize: '1.25rem' }}>✨</span> AI Assistant</Link>
          <Link href="/profile" className="sidebar-link"><UserIcon size={20} /> Profile</Link>
        </nav>
        
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--glass-border)", paddingTop: "1rem" }}>
          <div style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
            <p className="text-muted">Logged in as</p>
            <p style={{ fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis" }}>{session?.user?.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-secondary" style={{ width: "100%", justifyContent: "flex-start", gap: "0.5rem", border: "none", padding: "0.5rem" }}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
