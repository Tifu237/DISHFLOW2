import React, { useState } from 'react';

export default function AdminDashboard({ allShops, globalOrders, setAllShops }) {
  const [adminTab, setAdminTab] = useState('overview');

  // 📊 CENTRAL METRICS ANALYTICS ENGINE
  const totalRegisteredKitchens = allShops.length;
  const totalSystemTransactions = globalOrders.length;
  
  // Calculate total money flowing through the entire platform
  const totalPlatformVolume = globalOrders.reduce((acc, order) => acc + Number(order.finalPrice || 0), 0);
  const activePendingDispatches = globalOrders.filter(o => o.status !== 'Completed').length;

  // 🛠️ ADMIN CONTROL ACTION: Suspend or Reactivate a Kitchen for safety/compliance
  const toggleKitchenVerification = (shopId) => {
    const updatedShops = allShops.map(shop => {
      if (shop.id === shopId) {
        const currentStatus = shop.verifiedStatus === 'Suspended' ? 'Verified' : 'Suspended';
        alert(`🔒 Admin Security Override: Kitchen ID ${shopId} status updated to [${currentStatus}]`);
        return { ...shop, verifiedStatus: currentStatus };
      }
      return shop;
    });
    setAllShops(updatedShops);
  };

  return (
    <div style={{ padding: '32px', background: '#f5f0e6', minHeight: '100vh', color: '#2b1b11', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Admin Control Tower Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ebdcc5', paddingBottom: '20px' }}>
        <div>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px', fontWeight: '700', color: '#c25123' }}>System Core Management</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: '800', color: '#2b1b11' }}>💻 System Administrator Tower</h2>
        </div>
        <div style={{ background: '#2b1b11', padding: '10px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', color: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          🔐 Root Token Clearance: Granted
        </div>
      </div>

      {/* 🎛️ ADMINISTRATIVE CONTROL TABS */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
        <button 
          onClick={() => setAdminTab('overview')}
          style={{ padding: '12px 24px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', backgroundColor: adminTab === 'overview' ? '#2b1b11' : '#ffffff', color: adminTab === 'overview' ? '#f5f0e6' : '#6e5e53', border: '1px solid #ebdcc5', transition: 'all 0.2s' }}
        >
          📈 Ecosystem Overview
        </button>
        <button 
          onClick={() => setAdminTab('kitchens')}
          style={{ padding: '12px 24px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', backgroundColor: adminTab === 'kitchens' ? '#2b1b11' : '#ffffff', color: adminTab === 'kitchens' ? '#f5f0e6' : '#6e5e53', border: '1px solid #ebdcc5', transition: 'all 0.2s' }}
        >
          👨‍🍳 Audit Vendor Hubs ({totalRegisteredKitchens})
        </button>
        <button 
          onClick={() => setAdminTab('logs')}
          style={{ padding: '12px 24px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', backgroundColor: adminTab === 'logs' ? '#2b1b11' : '#ffffff', color: adminTab === 'logs' ? '#f5f0e6' : '#6e5e53', border: '1px solid #ebdcc5', transition: 'all 0.2s' }}
        >
          📑 Master System Traffic Ledger ({totalSystemTransactions})
        </button>
      </div>

      {/* VIEW PANEL TAB ROUTER */}
      {adminTab === 'overview' && (
        <div>
          {/* 📊 ANALYTICS STATS CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginBottom: '35px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#a19388', textTransform: 'uppercase' }}>Financial Volume</span>
              <h4 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '800', color: '#4a6b42' }}>{totalPlatformVolume} CFA</h4>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#a19388', textTransform: 'uppercase' }}>Registered Vendors</span>
              <h4 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '800', color: '#2b1b11' }}>{totalRegisteredKitchens} Units</h4>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#a19388', textTransform: 'uppercase' }}>Transactions Handled</span>
              <h4 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '800', color: '#c25123' }}>{totalSystemTransactions} Tickets</h4>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#a19388', textTransform: 'uppercase' }}>Active Pipelines</span>
              <h4 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '800', color: '#b45309' }}>{activePendingDispatches} Active</h4>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #e1d8c7' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700' }}>🛡️ Administrative Scope Summary</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#6e5e53', lineHeight: '1.6' }}>
              Welcome to the central tracking module. This panel processes metadata across all running kitchen configurations, tracks financial throughput inside operational zones, and serves as the database monitor interface for patient safety auditing compliance records. Use the tracking sub-menu headers above to dive into active directories.
            </p>
          </div>
        </div>
      )}

      {adminTab === 'kitchens' && (
        <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #e1d8c7' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>📋 System Vendor Compliance Auditing</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allShops.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#a19388' }}>No commercial hub documents mapped to the central ecosystem yet.</p>
            ) : (
              allShops.map(shop => (
                <div key={shop.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#faf6f0', border: '1px solid #ebdcc5', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '16px', color: '#2b1b11' }}>{shop.restaurantName || shop.name}</strong>
                    <div style={{ fontSize: '13px', color: '#6e5e53', marginTop: '2px' }}>📍 Operating Point: {shop.location || 'Bastos'}, {shop.city || 'Yaoundé'} | Currency: {shop.currency}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', backgroundColor: shop.verifiedStatus === 'Suspended' ? '#ebdcc5' : '#f0fdf4', color: shop.verifiedStatus === 'Suspended' ? '#c25123' : '#4a6b42', border: '1px solid currentColor' }}>
                      {shop.verifiedStatus || 'Verified'}
                    </span>
                    <button 
                      onClick={() => toggleKitchenVerification(shop.id)}
                      style={{ padding: '8px 14px', backgroundColor: '#2b1b11', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      {shop.verifiedStatus === 'Suspended' ? '✓ Reactivate Account' : '⚠️ Suspend Vendor'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {adminTab === 'logs' && (
        <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #e1d8c7' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>📑 Ecosystem Master Traffic Ledger</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {globalOrders.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#a19388', textAlign: 'center', padding: '20px' }}>No system transaction vouchers generated in this memory sequence.</p>
            ) : (
              globalOrders.slice().reverse().map((order) => (
                /* 🎯 FIXED: Replaced array fallback index key with structural entity orderId */
                <div key={order.orderId || Math.random()} style={{ padding: '14px', backgroundColor: '#faf6f0', border: '1px solid #ebdcc5', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#2b1b11' }}>{order.itemName} <span style={{ fontWeight: '500', color: '#6e5e53' }}>(ID: {order.orderId || 'Unmapped'})</span></div>
                    <div style={{ color: '#6e5e53', marginTop: '4px' }}>🔬 Calibration Rules: <span style={{ color: '#c25123', fontWeight: '600' }}>{order.modifications || 'Standard'}</span> | 📍 Destination: {order.deliveryAddress}</div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#4a6b42' }}>{order.finalPrice} CFA</strong>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#a19388' }}>Status: {order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}