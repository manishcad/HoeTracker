"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState(initialData || {
    name: '',
    nickname: '',
    age: '',
    gender: '',
    location: '',
    occupation: '',
    instagram: '',
    snapchat: '',
    whatsapp: '',
    twitter: '',
    phoneNumber: '',
    rating: '',
    badBitch: '',
    status: 'Talking',
    interestLevel: 'Medium',
    notes: '',
    firstMet: '',
    lastContact: '',
    favorite: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const method = initialData ? 'PUT' : 'POST';
    const url = initialData ? `/api/person/${initialData.id}` : '/api/person';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save data');

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass animate-fade-in" style={{ padding: '2rem' }}>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name *</label>
          <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="input-field" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Nickname</label>
          <input type="text" name="nickname" value={formData.nickname || ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Age</label>
          <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Gender</label>
          <select name="gender" value={formData.gender || ''} onChange={handleChange} className="input-field">
            <option value="">Select...</option>
            <option value="Male 👨">Male 👨</option>
            <option value="Female 👩">Female 👩</option>
            <option value="Bisexual Bitch 💖💜💙">Bisexual Bitch 💖💜💙</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Location</label>
          <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Occupation</label>
          <input type="text" name="occupation" value={formData.occupation || ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Phone Number</label>
          <input type="tel" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className="input-field" />
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.125rem' }}>Social Media</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Instagram</label>
          <input type="text" name="instagram" value={formData.instagram || ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Snapchat</label>
          <input type="text" name="snapchat" value={formData.snapchat || ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>WhatsApp</label>
          <input type="text" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Twitter/X</label>
          <input type="text" name="twitter" value={formData.twitter || ''} onChange={handleChange} className="input-field" />
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.125rem' }}>Tracking Information</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Rating</label>
          <select name="rating" value={formData.rating || ''} onChange={handleChange} className="input-field">
            <option value="">Select...</option>
            {[1,2,3,4,5,6,7,8,9,10].map(num => <option key={num} value={num}>{num}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Bad Bitch</label>
          <select name="badBitch" value={formData.badBitch || ''} onChange={handleChange} className="input-field">
            <option value="">Select...</option>
            <option value="Yes 💅">Yes 💅</option>
            <option value="No 🙅‍♀️">No 🙅‍♀️</option>
            <option value="Maybe 🤔">Maybe 🤔</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="input-field">
            <option value="Talking">Talking</option>
            <option value="Dating">Dating</option>
            <option value="Friend">Friend</option>
            <option value="Ex">Ex</option>
            <option value="Ghosted">Ghosted</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Interest Level</label>
          <select name="interestLevel" value={formData.interestLevel} onChange={handleChange} className="input-field">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>First Met</label>
          <input type="date" name="firstMet" value={formData.firstMet ? formData.firstMet.split('T')[0] : ''} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Last Contact</label>
          <input type="date" name="lastContact" value={formData.lastContact ? formData.lastContact.split('T')[0] : ''} onChange={handleChange} className="input-field" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <input 
            type="checkbox" 
            name="favorite" 
            checked={formData.favorite || false} 
            onChange={(e) => setFormData(prev => ({ ...prev, favorite: e.target.checked }))} 
            style={{ width: '20px', height: '20px', accentColor: 'var(--accent-pink)', cursor: 'pointer' }}
          />
          <label style={{ fontSize: '1rem', fontWeight: '500', cursor: 'pointer' }} onClick={() => setFormData(prev => ({ ...prev, favorite: !prev.favorite }))}>Mark as Favorite ❤️</label>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Personal Notes</label>
        <textarea 
          name="notes" 
          value={formData.notes || ''} 
          onChange={handleChange} 
          className="input-field" 
          rows="5"
          placeholder="Memories, likes, dislikes, conversation notes..."
        />
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: '2rem', width: '100%' }} disabled={loading}>
        {loading ? 'Saving...' : (initialData ? 'Update Connection' : 'Add Connection')}
      </button>
    </form>
  );
}
