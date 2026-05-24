import React from 'react';

export default function Header({ userRole, myRestaurant, setAuthView, handleLogout, setUserRole }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '15px 20px', borderRadius: '8px', color: 'white' }}>
      <h2 style={{ margin: 0, color: '#38bdf8', cursor: 'pointer' }} onClick={() => setUserRole('guest')}>
        DISHFLOW OPEN MARKETPLACE
      </h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        {userRole === 'guest' ? (
          <>
            <button onClick={() => setAuthView('login')} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Owner Sign In</button>
            <button onClick={() => setAuthView('register')} style={{ backgroundColor: '#0f766e', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Register My Restaurant</button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Active Manager: {myRestaurant?.name}</span>
            <button onClick={handleLogout} style={{ backgroundColor: '#dc2626', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout Account</button>
          </div>
        )}
      </div>
    </header>
  );
}