"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, Home, Users, Heart, User as UserIcon, Menu, X } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === "loading") {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Sticky Header */}
      <header className="mobile-header">
        <h2 className="text-gradient" style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0 }}>HoeTracker</h2>
        <button onClick={() => setIsSidebarOpen(true)} className="menu-toggle" aria-label="Open menu">
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* Sidebar */}
      <aside className={`glass dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 className="text-gradient" style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>HoeTracker</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="menu-toggle"
            style={{ padding: "0.25rem" }}
            aria-label="Close menu"
          >
            <X size={24} style={{ display: "block" }} />
          </button>
        </div>
        
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/dashboard" onClick={() => setIsSidebarOpen(false)} className="sidebar-link">
            <Home size={20} /> Dashboard
          </Link>
          <Link href="/dashboard/add" onClick={() => setIsSidebarOpen(false)} className="sidebar-link">
            <Users size={20} /> Add Connection
          </Link>
          <Link href="/dashboard/favorites" onClick={() => setIsSidebarOpen(false)} className="sidebar-link">
            <Heart size={20} /> Favorites
          </Link>
          <Link href="/dashboard/ai" onClick={() => setIsSidebarOpen(false)} className="sidebar-link">
            <span style={{ fontSize: '1.25rem' }}>✨</span> AI Assistant
          </Link>
          <Link href="/profile" onClick={() => setIsSidebarOpen(false)} className="sidebar-link">
            <UserIcon size={20} /> Profile
          </Link>
        </nav>
        
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--glass-border)", paddingTop: "1rem" }}>
          <div style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
            <p className="text-muted">Logged in as</p>
            <p style={{ fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "196px" }}>{session?.user?.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-secondary" style={{ width: "100%", justifyContent: "flex-start", gap: "0.5rem", border: "none", padding: "0.5rem" }}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
