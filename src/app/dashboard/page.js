import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { User, MessageCircle, Ghost, Heart } from "lucide-react";
import DashboardGrid from "./DashboardGrid";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const userId = session.user.id;

  const totalConnections = await prisma.person.count({ where: { userId } });
  const activeConversations = await prisma.person.count({ where: { userId, status: { in: ['Talking', 'Dating'] } } });
  const ghosted = await prisma.person.count({ where: { userId, status: 'Ghosted' } });
  const favorites = await prisma.person.count({ where: { userId, favorite: true } });

  const people = await prisma.person.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Dashboard</h1>
        <Link href="/dashboard/add" className="btn-primary">+ Add Connection</Link>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard icon={<User color="var(--accent-purple)" size={24} />} title="Total Connections" value={totalConnections} />
        <StatCard icon={<MessageCircle color="var(--success)" size={24} />} title="Active Conversations" value={activeConversations} />
        <StatCard icon={<Ghost color="var(--text-muted)" size={24} />} title="Ghosted" value={ghosted} />
        <StatCard icon={<Heart color="var(--accent-pink)" size={24} />} title="Favorites" value={favorites} />
      </div>

      <DashboardGrid initialPeople={people} />
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>{icon}</div>
      <div>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</p>
      </div>
    </div>
  );
}
