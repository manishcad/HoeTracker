"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Camera } from "lucide-react";

export default function ProfileForm({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password: password ? password : undefined, profileImage })
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
        setPassword("");
        router.refresh();
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      setMessage("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (result) => {
    if (result.info && result.info.secure_url) {
      setProfileImage(result.info.secure_url);
    }
  };

  return (
    <div className="glass" style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      {message && <div style={{ marginBottom: "1rem", color: message.includes("success") ? "var(--success)" : "var(--danger)", textAlign: 'center' }}>{message}</div>}
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: '1rem', border: '2px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {profileImage ? (
             <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
             <Camera size={40} color="var(--text-muted)" />
          )}
        </div>
        
        <CldUploadWidget 
           uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset_here"} 
           onSuccess={handleImageUpload}
           options={{ maxFiles: 1, resourceType: "image" }}
        >
          {({ open }) => {
            return (
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); open(); }}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                {profileImage ? 'Change Picture' : 'Upload Picture'}
              </button>
            );
          }}
        </CldUploadWidget>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Email</label>
          <input type="email" value={user.email} disabled className="input-field" style={{ opacity: 0.7 }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>New Password (leave blank to keep current)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  );
}
