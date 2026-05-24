import React from 'react';

export default function RegisterForm({
  handleOwnerRegister, setRegEmail, setRegPassword, setRegShopName,
  regCurrency, setRegCurrency, setRegCountry, setRegTown, setRegQuarter, setAuthView
}) {
  return (
    <div style={{ backgroundColor: '#e2e8f0', padding: '20px', borderRadius: '8px', textAlign: 'left', maxWidth: '400px', margin: '15px auto' }}>
      <h4>Create New Restaurant Manager Account</h4>
      <form onSubmit={handleOwnerRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="Login Email Account" onChange={(e) => setRegEmail(e.target.value)} required style={{ padding: '8px' }} />
        <input type="password" placeholder="Secure Password Access" onChange={(e) => setRegPassword(e.target.value)} required style={{ padding: '8px' }} />
        <input type="text" placeholder="Restaurant Display Name" onChange={(e) => setRegShopName(e.target.value)} required style={{ padding: '8px' }} />
        
        {/* 🚀 NEW UPGRADE: DYNAMIC OPERATIONAL CURRENCY SELECTOR */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>Operational Base Currency:</label>
          <select value={regCurrency} onChange={(e) => setRegCurrency(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <option value="CFA">CFA (Central Africa)</option>
            <option value="USD ($)">USD ($ - United States)</option>
            <option value="EUR (€)">EUR (€ - Eurozone)</option>
            <option value="GBP (£)">GBP (£ - United Kingdom)</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
          <input type="text" placeholder="Country" onChange={(e) => setRegCountry(e.target.value)} style={{ padding: '5px' }} />
          <input type="text" placeholder="City" onChange={(e) => setRegTown(e.target.value)} style={{ padding: '5px' }} />
          <input type="text" placeholder="Quarter" onChange={(e) => setRegQuarter(e.target.value)} style={{ padding: '5px' }} />
        </div>
        <button type="submit" style={{ backgroundColor: '#0f766e', color: 'white', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Complete Profile Registration</button>
        <button type="button" onClick={() => setAuthView('none')} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px' }}>Cancel</button>
      </form>
    </div>
  );
}