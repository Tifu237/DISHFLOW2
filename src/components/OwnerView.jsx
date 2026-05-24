import React from 'react';

export default function OwnerView({
  handleAddCustomDish, dishName, setDishName, dishPrice, setDishPrice, dishImage, setDishImage,
  dishDescription, setDishDescription, dishTypeOption, setDishTypeOption, handleWipeDailyMenu,
  myRestaurant, globalOrders, handleUpdateOrderStatus
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr', gap: '20px', textAlign: 'left' }}>
      <div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
          <h3 style={{ marginTop: '0', color: '#0f766e' }}>Update Menu Specifications</h3>
          <form onSubmit={handleAddCustomDish} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Dish Name" value={dishName} onChange={(e) => setDishName(e.target.value)} required style={{ padding: '8px' }} />
            
            {/* 🚀 FIXED PRICE MODULE DISPLAYING DROPDOWN CURRENCY INSTEAD OF EMPTY SPACE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.5fr', gap: '10px' }}>
              <input type="number" placeholder="Base Price" value={dishPrice} onChange={(e) => setDishPrice(e.target.value)} required style={{ padding: '8px' }} />
              <input type="text" value={myRestaurant.currency || 'CFA'} disabled style={{ padding: '8px', textAlign: 'center', backgroundColor: '#e2e8f0', fontWeight: 'bold', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>

            <input type="text" placeholder="Image Link Path" value={dishImage} onChange={(e) => setDishImage(e.target.value)} style={{ padding: '8px' }} />
            <textarea placeholder="Description" value={dishDescription} onChange={(e) => setDishDescription(e.target.value)} style={{ padding: '8px', height: '40px', resize: 'none' }} />
            
            <div>
              <label style={{ marginRight: '10px', fontSize: '13px', fontWeight: 'bold' }}>Menu Classification Type:</label>
              <select value={dishTypeOption} onChange={(e) => setDishTypeOption(e.target.value)} style={{ padding: '6px' }}>
                <option value="permanent">Permanent Standard Menu</option>
                <option value="daily">Daily Rotational Special</option>
              </select>
            </div>

            <button type="submit" style={{ backgroundColor: '#0f766e', color: 'white', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Publish Dish to Server</button>
          </form>
          <hr style={{ margin: '20px 0' }} />
          <button onClick={handleWipeDailyMenu} style={{ backgroundColor: '#b45309', color: 'white', border: 'none', padding: '10px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>⚠️ Wipe Daily Menu Rotations Now</button>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ marginTop: '0' }}>Active Live Catalog Summary</h3>
          {myRestaurant.menu && myRestaurant.menu.map(item => (
            <div key={item.id} style={{ padding: '10px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name} <strong>({item.isPermanent ? 'Permanent' : 'Daily'})</strong></span>
              <span>{item.basePrice} {myRestaurant.currency || 'CFA'}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
        <h3 style={{ marginTop: '0', color: '#1e293b' }}>Incoming Production Pipeline Dashboard</h3>
        {globalOrders.filter(o => o.vendorId === myRestaurant.id).length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '13px' }}>Waiting for customers to process custom safe order recipes...</p>
        ) : globalOrders.filter(o => o.vendorId === myRestaurant.id).map(order => (
          <div key={order.orderId} style={{ border: '1px solid #94a3b8', padding: '15px', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#0f766e', fontSize: '15px' }}>📦 Order ID: {order.orderId}</span>
              <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#b45309' }}>Earned: {order.finalPrice} {myRestaurant.currency || 'CFA'}</span>
            </div>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}><strong>Target Item:</strong> {order.itemName}</div>
            <div style={{ fontSize: '13px', color: '#dc2626', backgroundColor: '#fff5f5', padding: '6px', borderRadius: '4px', margin: '5px 0' }}>
              ⚠️ <strong>Patient Recipe Customization Instructions:</strong> {order.modifications || 'Standard Cooking Recipe - No Modifications Requested.'}
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '5px' }}><strong>Deliver Destination Address:</strong> 📍 {order.deliveryAddress}</div>
            
            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
              <button onClick={() => handleUpdateOrderStatus(order.orderId, 'Preparing')} style={{ backgroundColor: '#fef9c3', border: '1px solid #ca8a04', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cook Dish</button>
              <button onClick={() => handleUpdateOrderStatus(order.orderId, 'Delivered')} style={{ backgroundColor: '#dcfce7', border: '1px solid #16a34a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Dispatch Out</button>
              <button onClick={() => handleUpdateOrderStatus(order.orderId, 'Cancelled')} style={{ backgroundColor: '#fee2e2', border: '1px solid #dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', color: '#dc2626' }}>Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}