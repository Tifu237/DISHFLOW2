import React, { useState } from 'react';

export default function OwnerDashboard({ 
  handleAddCustomDish, 
  dishName, 
  setDishName, 
  dishPrice, 
  setDishPrice, 
  dishImage, 
  setDishImage, 
  dishDescription, 
  setDishDescription, 
  dishTypeOption, 
  setDishTypeOption, 
  handleWipeDailyMenu, 
  myRestaurant, 
  globalOrders, 
  handleUpdateOrderStatus,
  formIngredients,
  setFormIngredients
}) {
  const [newOptName, setNewOptName] = useState('');
  const [newOptCost, setNewOptCost] = useState('');
  const [newOptWarning, setNewOptWarning] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Rice');
  
  // 🧭 Track active view mode for the live streams column ('live' or 'archive')
  const [streamTab, setStreamTab] = useState('live');

  const addOptionToGroup = (e) => {
    e.preventDefault();
    if (!newOptName || !newOptCost) return;
    
    setFormIngredients([
      ...formIngredients,
      { 
        name: newOptName, 
        costValue: Number(newOptCost), 
        healthWarning: newOptWarning || 'None' 
      }
    ]);
    
    setNewOptName('');
    setNewOptCost('');
    setNewOptWarning('');
  };

  const removeOption = (indexToRemove) => {
    setFormIngredients(formIngredients.filter((_, index) => index !== indexToRemove));
  };

  // 🛡️ Data Streams Filters
  const restaurantOrders = globalOrders.filter(o => Number(o.vendorId) === Number(myRestaurant?.id));
  
  const activeQueueTickets = restaurantOrders.filter(o => o.status !== 'Completed');
  const archivedHistoryTickets = restaurantOrders.filter(o => o.status === 'Completed');

  return (
    <div style={{ padding: '32px', background: '#f5f0e6', minHeight: '100vh', color: '#2b1b11' }}>
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ebdcc5', paddingBottom: '20px' }}>
        <div>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px', fontWeight: '700', color: '#c25123' }}>Kitchen Manager Control</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: '800', color: '#2b1b11' }}>
            {myRestaurant?.restaurantName || myRestaurant?.name || 'My Kitchen Hub'}
          </h2>
        </div>
        <div style={{ background: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: '1px solid #ebdcc5', fontSize: '14px', fontWeight: '600', color: '#6e5e53' }}>
          🟢 Kitchen Status: <span style={{ color: '#4a6b42', fontWeight: '700' }}>Open & Receiving</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '35px' }}>
        {/* Left Column: Menu Customization & Creation */}
        <div style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 10px 25px rgba(43,27,17,0.03)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700', color: '#2b1b11' }}>Update Menu Specifications</h3>
          
          {/* Option Builder Box */}
          <div style={{ background: '#faf6f0', padding: '20px', borderRadius: '8px', border: '1px solid #ebdcc5', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#2b1b11' }}>👨‍🍳 Recipe & Ingredient Builder</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Ingredient / Customization (e.g. Extra Beef)" 
                  value={newOptName}
                  onChange={(e) => setNewOptName(e.target.value)}
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#ffffff', flex: 2, fontSize: '14px', outline: 'none', color: '#2b1b11' }}
                />
                <input 
                  type="number" 
                  placeholder="Cost (+ CFA)" 
                  value={newOptCost}
                  onChange={(e) => setNewOptCost(e.target.value)}
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#ffffff', flex: 1, fontSize: '14px', outline: 'none', color: '#2b1b11' }}
                />
              </div>
              <input 
                type="text" 
                placeholder="Medical/Allergen Warning note (e.g. High Sodium, Nuts)" 
                value={newOptWarning}
                onChange={(e) => setNewOptWarning(e.target.value)}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#ffffff', fontSize: '14px', outline: 'none', color: '#2b1b11' }}
              />
              <button 
                onClick={addOptionToGroup}
                style={{ padding: '12px', background: '#2b1b11', color: '#f5f0e6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'background 0.2s' }}
              >
                + Link Ingredient To Recipe State
              </button>
            </div>

            {/* Tags wrapper */}
            {formIngredients.length > 0 && (
              <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #ebdcc5', paddingTop: '12px' }}>
                {formIngredients.map((ing, idx) => (
                  <span key={idx} style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '30px', fontSize: '13px', border: '1px solid #ebdcc5', display: 'flex', alignItems: 'center', gap: '8px', color: '#2b1b11', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                    <strong>{ing.name}</strong> <span style={{ color: '#c25123', fontWeight: '600' }}>+{ing.costValue} CFA</span>
                    <button type="button" onClick={() => removeOption(idx)} style={{ border: 'none', background: 'none', color: '#a19388', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Core Creation Form */}
          <form onSubmit={handleAddCustomDish} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#6e5e53', marginBottom: '6px' }}>Dish Name</label>
              <input 
                type="text" 
                placeholder="e.g. Fufu Corn & Kati Kati" 
                value={dishName} 
                onChange={(e) => setDishName(e.target.value)} 
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', fontSize: '14px', color: '#2b1b11' }}
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#6e5e53', marginBottom: '6px' }}>Base Price</label>
              <div style={{ display: 'flex', borderRadius: '6px', border: '1px solid #ebdcc5', overflow: 'hidden' }}>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={dishPrice} 
                  onChange={(e) => setDishPrice(e.target.value)} 
                  style={{ width: '100%', border: 'none', padding: '12px', fontSize: '14px', outline: 'none', color: '#2b1b11' }}
                  required 
                />
                <span style={{ padding: '12px 16px', background: '#faf6f0', color: '#2b1b11', fontWeight: '700', fontSize: '14px', borderLeft: '1px solid #ebdcc5' }}>
                  {myRestaurant?.currency || 'CFA'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#6e5e53', marginBottom: '6px' }}>Menu Category</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', background: '#fff', fontSize: '14px', outline: 'none', color: '#2b1b11', fontWeight: '600' }}
                >
                  <option value="Rice">Rice Selections</option>
                  <option value="Pizza">Pizzas</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Local Dishes">Traditional Dishes</option>
                  <option value="Drinks">Beverages</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#6e5e53', marginBottom: '6px' }}>Availability Rotation</label>
                <select 
                  value={dishTypeOption} 
                  onChange={(e) => setDishTypeOption(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', background: '#fff', fontSize: '14px', outline: 'none', color: '#2b1b11', fontWeight: '600' }}
                >
                  <option value="permanent">Standard Daily Menu</option>
                  <option value="daily">Special Menu Rotation</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#6e5e53', marginBottom: '6px' }}>📸 Local Menu Asset Photo</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setDishImage(reader.result);
                    reader.readAsDataURL(file);
                  }
                }} 
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '6px', border: '1px solid #ebdcc5', background: '#faf6f0', fontSize: '13px', color: '#6e5e53' }}
              />
              {dishImage && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: '#faf6f0', padding: '10px', borderRadius: '6px', border: '1px solid #ebdcc5' }}>
                  <img src={dishImage} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  <span style={{ fontSize: '13px', color: '#4a6b42', fontWeight: '700' }}>✓ High-Quality Dish Photo Attached</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#6e5e53', marginBottom: '6px' }}>Description & Medical Ingredient Alerts</label>
              <textarea 
                placeholder="List clear flavor elements, recipe origins, and crucial ingredient warnings (e.g., safe for diabetic or hypertension customers)..." 
                value={dishDescription} 
                onChange={(e) => setDishDescription(e.target.value)} 
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', minHeight: '90px', fontSize: '14px', resize: 'vertical', color: '#2b1b11' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '14px', background: '#c25123', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', marginTop: '10px', boxShadow: '0 4px 12px rgba(194,81,35,0.15)' }}>
              Publish Dish to Active Menu
            </button>
          </form>

          <button 
            onClick={handleWipeDailyMenu} 
            style={{ width: '100%', marginTop: '12px', padding: '10px', background: 'none', color: '#a19388', border: '1px dashed #ebdcc5', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
          >
            Clear Out Special Menu Rotation
          </button>
        </div>

        {/* Right Column: Order Processing Streams with History Sorting */}
        <div>
          {/* 🧭 FILTER CONTROLS TABS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px', backgroundColor: '#ffffff', padding: '6px', borderRadius: '8px', border: '1px solid #ebdcc5' }}>
            <button
              onClick={() => setStreamTab('live')}
              style={{ padding: '10px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', backgroundColor: streamTab === 'live' ? '#2b1b11' : 'transparent', color: streamTab === 'live' ? '#f5f0e6' : '#6e5e53', transition: 'all 0.2s' }}
            >
              🍳 Active Queue ({activeQueueTickets.length})
            </button>
            <button
              onClick={() => setStreamTab('archive')}
              style={{ padding: '10px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', backgroundColor: streamTab === 'archive' ? '#6e5e53' : 'transparent', color: streamTab === 'archive' ? '#ffffff' : '#6e5e53', transition: 'all 0.2s' }}
            >
              📜 Past History ({archivedHistoryTickets.length})
            </button>
          </div>

          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700', color: '#2b1b11' }}>
            {streamTab === 'live' ? 'Live Kitchen Orders' : 'Historical Dispatch Record'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* VIEW A: LIVE ORDER QUEUE TRACKER */}
            {streamTab === 'live' && (
              activeQueueTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: '12px', border: '1px dashed #ebdcc5', color: '#6e5e53' }}>
                  <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', fontWeight: '600' }}>Waiting for fresh incoming client order tickets...</p>
                </div>
              ) : (
                activeQueueTickets.reverse().map(order => (
                  <div key={order.orderId} style={{ border: '1px solid #e1d8c7', padding: '20px', borderRadius: '12px', background: '#ffffff', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#2b1b11' }}>{order.itemName}</span>
                      <span style={{ 
                        background: order.status === 'Pending' || order.status === 'Placed' ? '#faf6f0' : '#fffbeb', 
                        color: order.status === 'Pending' || order.status === 'Placed' ? '#c25123' : '#b45309', 
                        padding: '4px 10px', borderRadius: '30px', fontSize: '12px', fontWeight: '700', border: '1px solid currentColor' 
                      }}>
                        ● {order.status === 'Placed' || order.status === 'Pending' ? 'Pending' : order.status}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', color: '#6e5e53', borderBottom: '1px solid #faf6f0', paddingBottom: '12px', marginBottom: '12px' }}>
                      <div>💰 <strong>Total Payout:</strong> {order.finalPrice} {myRestaurant?.currency || 'CFA'}</div>
                      <div>🥗 <strong>Patient Modifications:</strong> <span style={{ color: '#c25123', fontWeight: '600' }}>{order.modifications || 'Standard Preparation'}</span></div>
                      <div>📍 <strong>Delivery Target:</strong> {order.deliveryAddress}</div>
                      {order.placedAt && <div style={{ fontSize: '11px', color: '#a19388', marginTop: '2px' }}>⏱️ Logged Time Check: {order.placedAt}</div>}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {(order.status === 'Placed' || order.status === 'Pending') && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.orderId, 'Preparing')} 
                          style={{ flex: 1, padding: '10px', background: '#b45309', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
                        >
                          🍳 Start Preparing
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.orderId, 'Ready')} 
                          style={{ flex: 1, padding: '10px', background: '#4a6b42', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
                        >
                          📦 Mark as Ready
                        </button>
                      )}
                      {order.status === 'Ready' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.orderId, 'Completed')} 
                          style={{ flex: 1, padding: '10px', background: '#6e5e53', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}
                        >
                          🏁 Archive Ticket
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )
            )}

            {/* VIEW B: COMPLETED ARCHIVE RECORDS LIST */}
            {streamTab === 'archive' && (
              archivedHistoryTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: '12px', border: '1px dashed #ebdcc5', color: '#6e5e53' }}>
                  <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', fontWeight: '600' }}>No completed orders archived in this session ledger yet.</p>
                </div>
              ) : (
                archivedHistoryTickets.map(order => (
                  <div key={order.orderId} style={{ border: '1px solid #ebdcc5', padding: '16px', borderRadius: '8px', background: '#faf6f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.85 }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: '#2b1b11', marginBottom: '4px' }}>{order.itemName}</div>
                      <div style={{ fontSize: '13px', color: '#6e5e53' }}>
                        <div>📋 Modifications: {order.modifications || 'None'}</div>
                        <div style={{ fontSize: '11px', color: '#a19388', marginTop: '4px' }}>📍 Sent to: {order.deliveryAddress}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#4a6b42' }}>+{order.finalPrice} {myRestaurant?.currency || 'CFA'}</span>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#6e5e53', textTransform: 'uppercase', tracking: '0.05em' }}>✓ Settled</span>
                    </div>
                  </div>
                ))
              )
            )}

          </div>
        </div>
      </div>
    </div>
  );
}