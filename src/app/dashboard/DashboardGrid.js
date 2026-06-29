"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function DashboardGrid({ initialPeople }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredPeople = initialPeople.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (person.nickname && person.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'All' || person.status === filterStatus || (filterStatus === 'Favorites' && person.favorite);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name or nickname..." 
            className="input-field" 
            style={{ paddingLeft: '3rem', marginBottom: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="input-field" 
          style={{ width: 'auto', marginBottom: 0 }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Favorites">Favorites</option>
          <option value="Talking">Talking</option>
          <option value="Dating">Dating</option>
          <option value="Friend">Friend</option>
          <option value="Ex">Ex</option>
          <option value="Ghosted">Ghosted</option>
        </select>
      </div>

      {filteredPeople.length === 0 ? (
        <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>No connections found.</p>
          {initialPeople.length === 0 && <Link href="/dashboard/add" className="btn-primary">Add Your First Connection</Link>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredPeople.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}

function PersonCard({ person }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Dating': return 'var(--accent-pink)';
      case 'Talking': return 'var(--success)';
      case 'Ghosted': return 'var(--danger)';
      case 'Ex': return 'var(--text-muted)';
      default: return 'var(--accent-purple)';
    }
  };

  return (
    <div className="glass feature-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--text-muted)' }}>
            {person.profileImage ? (
              <Image src={person.profileImage} alt={`${person.name} profile`} width={64} height={64} style={{ objectFit: 'cover' }} />
            ) : (
              person.name?.charAt(0).toUpperCase() || 'P'
            )}
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{person.name} {person.favorite && '❤️'}</h3>
            {person.nickname && <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>
              "{person.nickname}"
            </p>}
          </div>
        </div>
        <span style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '999px', 
          fontSize: '0.75rem', 
          fontWeight: '600',
          color: getStatusColor(person.status),
          border: `1px solid ${getStatusColor(person.status)}`
        }}>
          {person.status}
        </span>
      </div>
      
      <div style={{ flex: 1, marginBottom: '1.5rem' }}>
        {person.age && <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}><span className="text-muted">Age:</span> {person.age}</p>}
        {person.location && <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}><span className="text-muted">Location:</span> {person.location}</p>}
        {person.lastContact && <p style={{ fontSize: '0.875rem' }}><span className="text-muted">Last Contact:</span> {new Date(person.lastContact).toLocaleDateString()}</p>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <Link href={`/dashboard/person/${person.id}`} className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}>View</Link>
        <Link href={`/dashboard/edit/${person.id}`} className="btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}>Edit</Link>
      </div>
    </div>
  );
}
