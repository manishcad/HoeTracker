"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeletePersonButton({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this connection? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/person/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        alert("Failed to delete");
      }
    } catch (e) {
      alert("Error deleting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDelete} className="btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} disabled={loading}>
      <Trash2 size={16} style={{ marginRight: '0.5rem' }}/> {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
