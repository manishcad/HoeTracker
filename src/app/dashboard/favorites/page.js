import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DashboardGrid from "../DashboardGrid";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const userId = session.user.id;

  const people = await prisma.person.findMany({
    where: { userId, favorite: true },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Favorites</h1>
        <Link href="/dashboard/add" className="btn-primary">+ Add Connection</Link>
      </div>

      <DashboardGrid initialPeople={people} />
    </div>
  );
}
