import React from 'react';

export default function Header({ userRole, myRestaurant, setAuthView, handleLogout, setUserRole }) {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      backgroundColor: '#2b1b11', // Deep roast espresso background
      padding: '12px 24px', 
      borderRadius: '6px', 
      color: '#f5f0e6', // Warm cream text
      boxShadow: '0 4px 12px rgba(43,27,17,0.05)'
    }}>
      {/* Sleek, minimal branding text */}
      <h2 
        style={{ 
          margin: 0, 
          fontSize: '20px', 
          fontWeight: '800', 
          letterSpacing: '0.5px',
          color: '#ffffff', 
          cursor: 'pointer' 
        }} 
        onClick={() => handleLogout()} // Clicking logo safely resets system state
      >
        Dishflow
      </h2>

      <div style={{ display: 'flex', gap: '10px' }}>
        {userRole === 'guest' ? (
          // 🚫 BUTTONS REMOVED COMPLETELY FOR GUESTS TO FIX THE DUPLICATION LOOP
          <span style={{ fontSize: '13px', color: '#ebdcc5', fontWeight: '600', fontStyle: 'italic' }}>
            Dietary Security Workspace
          </span>
        ) : (
          // Elegant active manager dashboard status layout
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700' }}>
              📍 {myRestaurant?.restaurantName || myRestaurant?.name || 'Kitchen Hub'}
            </span>
            <button 
              onClick={handleLogout} 
              style={{ 
                backgroundColor: 'transparent', 
                border: '1px solid #c25123', 
                color: '#c25123', 
                padding: '6px 14px', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                fontWeight: '700',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}