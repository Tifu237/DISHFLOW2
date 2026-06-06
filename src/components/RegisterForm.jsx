import React, { useState, useEffect } from 'react';

export default function RegisterForm({
  isCustomer = false,
  handleOwnerRegister, setRegEmail, setRegPassword, setRegShopName, regCurrency, setRegCurrency, regCountry, setRegCountry, regTown, setRegTown, regQuarter, setRegQuarter,
  handleCustomerRegister, setRegCustomerEmail, setRegCustomerPassword, setRegCustomerName,
  setAuthView
}) {
  const [formRole, setFormRole] = useState(isCustomer ? 'customer' : 'owner');

  useEffect(() => {
    setFormRole(isCustomer ? 'customer' : 'owner');
  }, [isCustomer]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (formRole === 'owner') {
      handleOwnerRegister(e);
    } else {
      handleCustomerRegister(e);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '35px', borderRadius: '12px', textAlign: 'left', maxWidth: '450px', margin: '40px auto', boxShadow: '0 15px 30px rgba(43,27,17,0.06)', border: '1px solid #e1d8c7', fontFamily: '"Inter", sans-serif', color: '#2b1b11' }}>
      
      <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800', textAlign: 'center' }}>
        {formRole === 'owner' ? 'Register Your Kitchen' : 'Create Customer Account'}
      </h3>
      <p style={{ margin: '0 0 25px 0', fontSize: '14px', color: '#6e5e53', textAlign: 'center', lineHeight: '1.4' }}>
        {formRole === 'owner' 
          ? 'Set up your digital restaurant profile to begin listing dishes.' 
          : 'Join the dietary market to calibrate individual recipes safely matching your medical limits.'}
      </p>

      <form onSubmit={onFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#6e5e53' }}>Account Email</label>
          <input 
            type="email" 
            placeholder="user@dishflow.com" 
            onChange={(e) => formRole === 'owner' ? setRegEmail(e.target.value) : setRegCustomerEmail(e.target.value)} 
            required 
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '14px', outline: 'none' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#6e5e53' }}>Secure Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            onChange={(e) => formRole === 'owner' ? setRegPassword(e.target.value) : setRegCustomerPassword(e.target.value)} 
            required 
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '14px', outline: 'none' }} 
          />
        </div>

        {formRole === 'customer' ? (
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#6e5e53' }}>Full Name / Patient Alias</label>
            <input 
              type="text" 
              placeholder="e.g. Bertrand" 
              onChange={(e) => setRegCustomerName(e.target.value)} 
              required 
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '14px', outline: 'none' }} 
            />
          </div>
        ) : (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#6e5e53' }}>Restaurant / Kitchen Name</label>
              <input type="text" placeholder="e.g. Mama's Culinary Delights" onChange={(e) => setRegShopName(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '14px', outline: 'none' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#6e5e53' }}>Operational Menu Currency</label>
              <select value={regCurrency} onChange={(e) => setRegCurrency(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#ffffff', color: '#2b1b11', fontSize: '14px', fontWeight: '600', outline: 'none' }}>
                <option value="CFA">CFA (Central Africa)</option>
                <option value="USD">USD ($ - United States)</option>
                <option value="EUR">EUR (€ - Eurozone)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#6e5e53' }}>Kitchen Location Details</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <input type="text" placeholder="Country" value={regCountry} onChange={(e) => setRegCountry(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '13px', outline: 'none' }} />
                <input type="text" placeholder="City" value={regTown} onChange={(e) => setRegTown(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '13px', outline: 'none' }} />
                <input type="text" placeholder="Quarter" value={regQuarter} onChange={(e) => setRegQuarter(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '13px', outline: 'none' }} />
              </div>
            </div>
          </>
        )}

        <button 
          type="submit" 
          style={{ width: '100%', padding: '14px', backgroundColor: formRole === 'owner' ? '#c25123' : '#4a6b42', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          {formRole === 'owner' ? 'Complete Kitchen Setup' : 'Complete Account Registration'}
        </button>

        <button type="button" onClick={() => setAuthView('portal')} style={{ background: 'none', border: 'none', color: '#a19388', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', marginTop: '4px' }}>
          Cancel and Return
        </button>
      </form>
    </div>
  );
}