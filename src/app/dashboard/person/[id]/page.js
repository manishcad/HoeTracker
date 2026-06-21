import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import DeletePersonButton from "./DeletePersonButton";

export default async function PersonDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const person = await prisma.person.findUnique({
    where: { id: id, userId: session.user.id },
    include: {
      timelineEvents: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!person) {
    return <div>Person not found</div>;
  }

  return (
    <div className="animate-fade-in">
      <Link href="/dashboard" className="btn-secondary" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}><ArrowLeft size={16} style={{ marginRight: '0.5rem' }}/> Back to Dashboard</Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{person.name} {person.favorite && '❤️'}</h1>
          {person.nickname && <p className="text-muted" style={{ fontSize: '1.25rem' }}>"{person.nickname}"</p>}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href={`/dashboard/edit/${person.id}`} className="btn-secondary"><Edit size={16} style={{ marginRight: '0.5rem' }}/> Edit</Link>
          <DeletePersonButton id={person.id} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Info Card */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {person.age && <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Age</span> {person.age}</p>}
            {person.gender && <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Gender</span> {person.gender}</p>}
            {person.phoneNumber && <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Phone</span> {person.phoneNumber}</p>}
            {person.location && <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Location</span> {person.location}</p>}
            {person.occupation && <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Occupation</span> {person.occupation}</p>}
            {person.rating && <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Rating</span> {person.rating}/10</p>}
            {person.badBitch && <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Bad Bitch</span> {person.badBitch}</p>}
            <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Status</span> <span style={{ fontWeight: '600', color: 'var(--accent-pink)' }}>{person.status}</span></p>
            <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Interest</span> {person.interestLevel}</p>
            {person.firstMet && <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>First Met</span> {person.firstMet.toLocaleDateString()}</p>}
            {person.lastContact && <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Last Contact</span> {person.lastContact.toLocaleDateString()}</p>}
          </div>
        </div>

        {/* Social Card */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Social Media</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {person.instagram ? <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Instagram</span> {person.instagram}</p> : null}
            {person.snapchat ? <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Snapchat</span> {person.snapchat}</p> : null}
            {person.whatsapp ? <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>WhatsApp</span> {person.whatsapp}</p> : null}
            {person.twitter ? <p><span className="text-muted" style={{ display: 'inline-block', width: '100px' }}>Twitter/X</span> {person.twitter}</p> : null}
            {!person.instagram && !person.snapchat && !person.whatsapp && !person.twitter && <p className="text-muted">No social links added.</p>}
          </div>
        </div>

        {/* Notes Card */}
        <div className="glass" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Personal Notes</h2>
          {person.notes ? (
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{person.notes}</p>
          ) : (
            <p className="text-muted">No notes added.</p>
          )}
        </div>

        {/* Timeline */}
        <div className="glass" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Timeline</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {person.timelineEvents.map(event => (
              <div key={event.id} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '100px', flexShrink: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {event.createdAt.toLocaleDateString()}
                </div>
                <div style={{ borderLeft: '2px solid var(--accent-purple)', paddingLeft: '1rem' }}>
                  <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{event.eventType}</p>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>{event.description}</p>
                </div>
              </div>
            ))}
            {person.timelineEvents.length === 0 && <p className="text-muted">No timeline events.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
