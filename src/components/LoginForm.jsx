import React, { useState } from 'react';

function LoginForm({ handleOwnerLogin, handleCustomerLogin, setOwnerEmail, setOwnerPassword, setAuthView }) {
  // 🧭 Tracks whether the user wants to sign in as an Owner or a Patient/Customer
  const [loginRole, setLoginRole] = useState('owner'); // 'owner' or 'customer'

  const onSubmitClick = (e) => {
    e.preventDefault(); 
    if (loginRole === 'owner') {
      handleOwnerLogin();
    } else {
      handleCustomerLogin();
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', backgroundColor: '#ffffff', padding: '35px', borderRadius: '12px', boxShadow: '0 15px 30px rgba(43,27,17,0.06)', border: '1px solid #ebdcc5', fontFamily: '"Inter", sans-serif' }}>
      
      {/* 🧭 PREMIUM ROLE SELECTOR TABS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '25px', backgroundColor: '#faf6f0', padding: '4px', borderRadius: '6px', border: '1px solid #ebdcc5' }}>
        <button
          type="button"
          onClick={() => setLoginRole('owner')}
          style={{ padding: '8px', borderRadius: '4px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer', backgroundColor: loginRole === 'owner' ? '#c25123' : 'transparent', color: loginRole === 'owner' ? '#ffffff' : '#6e5e53', transition: 'all 0.2s' }}
        >
          👨‍🍳 Restaurant Login
        </button>
        <button
          type="button"
          onClick={() => setLoginRole('customer')}
          style={{ padding: '8px', borderRadius: '4px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer', backgroundColor: loginRole === 'customer' ? '#4a6b42' : 'transparent', color: loginRole === 'customer' ? '#ffffff' : '#6e5e53', transition: 'all 0.2s' }}
        >
          🥗 Customer Login
        </button>
      </div>

      <h3 style={{ color: '#2b1b11', margin: '0 0 6px 0', textAlign: 'center', fontWeight: '800', fontSize: '22px' }}>
        {loginRole === 'owner' ? 'Kitchen Portal' : 'Market Portal'}
      </h3>
      <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#a19388', textAlign: 'center' }}>
        Please input your account metrics to proceed safely.
      </p>
      
      <form onSubmit={onSubmitClick}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#6e5e53', fontSize: '13px', fontWeight: '700' }}>Email Address</label>
          <input 
            type="email" 
            placeholder={loginRole === 'owner' ? "chef@yourkitchen.com" : "customer@dishflow.com"}
            onChange={(e) => setOwnerEmail(e.target.value)}
            required
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', border: '1px solid #ebdcc5', borderRadius: '6px', backgroundColor: '#faf6f0', color: '#2b1b11', outline: 'none', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#6e5e53', fontSize: '13px', fontWeight: '700' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            onChange={(e) => setOwnerPassword(e.target.value)}
            required
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', border: '1px solid #ebdcc5', borderRadius: '6px', backgroundColor: '#faf6f0', color: '#2b1b11', outline: 'none', fontSize: '14px' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '14px', backgroundColor: loginRole === 'owner' ? '#c25123' : '#4a6b42', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          Secure Entry Authorization
        </button>
      </form>

      {/* 🎯 FIXED: Directs user dynamically to the right registration flow based on active toggle selection */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button 
          type="button"
          onClick={() => setAuthView(loginRole === 'owner' ? 'register' : 'register-customer')} 
          style={{ background: 'none', padding: '4px', color: loginRole === 'owner' ? '#c25123' : '#4a6b42', border: 'none', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', fontWeight: '600' }}
        >
          Create a fresh profile here
        </button>
      </div>

      <button 
        type="button"
        onClick={() => setAuthView('portal')} 
        style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#a19388', border: 'none', marginTop: '8px', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', fontWeight: '600' }}
      >
        Back to Portal Selection
      </button>
    </div>
  );
}

export default LoginForm;