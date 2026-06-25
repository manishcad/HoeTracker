import Link from 'next/link';
import { ShieldCheck, Users, BarChart3, Heart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '700' }}><Link href="/">HoeTracker</Link></h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" className="btn-secondary">Sign In</Link>
          <Link href="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <main style={{ marginTop: '4rem', textAlign: 'center' }} className="animate-fade-in">
        <h2 style={{ fontSize: 'clamp(2.25rem, 8vw, 4rem)', fontWeight: '700', lineHeight: 1.2, marginBottom: '1.5rem' }}>
          Keep Track Without <br/><span className="text-gradient">Losing Track.</span>
        </h2>
        <p className="text-muted" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', maxWidth: '600px', margin: '0 auto 2.5rem', padding: '0 1rem' }}>
          Organize your dating life, conversations, and connections in one private, secure, and beautiful place.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '6rem' }}>
          <Link href="/register" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Start Tracking Free</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          <FeatureCard 
            icon={<Users color="var(--accent-pink)" size={32} />}
            title="Relationship Tracking"
            description="Keep profiles, social links, and current status of everyone you interact with."
          />
          <FeatureCard 
            icon={<ShieldCheck color="var(--accent-purple)" size={32} />}
            title="Private Dashboard"
            description="Your data is completely private. Access your connections securely anywhere."
          />
          <FeatureCard 
            icon={<Heart color="var(--accent-pink)" size={32} />}
            title="Notes & Memories"
            description="Never forget a birthday, an anniversary, or a favorite food again."
          />
          <FeatureCard 
            icon={<BarChart3 color="var(--accent-purple)" size={32} />}
            title="Analytics"
            description="Visualize your dating habits and track active connections effortlessly."
          />
        </div>
      </main>

      <footer style={{ marginTop: '6rem', padding: '2rem 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <p className="text-muted">&copy; {new Date().getFullYear()} HoeTracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass feature-card" style={{ padding: '2rem', transition: 'transform 0.3s ease' }}>
      <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', display: 'inline-block', padding: '1rem', borderRadius: '12px' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  );
}
