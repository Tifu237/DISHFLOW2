import React from 'react';

export default function LoginForm({ handleOwnerLogin, setOwnerEmail, setOwnerPassword, setAuthView }) {
  return (
    <div style={{ backgroundColor: '#e2e8f0', padding: '20px', borderRadius: '8px', textAlign: 'left', maxWidth: '400px', margin: '15px auto' }}>
      <h4>Sign In to Restaurant Control Deck</h4>
      <form onSubmit={handleOwnerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="Email" onChange={(e) => setOwnerEmail(e.target.value)} required style={{ padding: '8px' }} />
        <input type="password" placeholder="Password" onChange={(e) => setOwnerPassword(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ backgroundColor: '#0f766e', color: 'white', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Access System</button>
        <button type="button" onClick={() => setAuthView('none')} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px' }}>Cancel</button>
      </form>
    </div>
  );
}