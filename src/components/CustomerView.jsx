import React from 'react';

export default function CustomerView({
  searchCountry, setSearchCountry, searchCity, setSearchCity, searchQuarter, setSearchQuarter,
  filteredShops, selectedVendor, setSelectedVendor, setSelectedItem, selectedItem,
  typedAddress, setTypedAddress, ingredientModifiers, setIngredientModifiers,
  handlePlaceCustomerOrder, globalOrders, healthProfile, setHealthProfile
}) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '15px', backgroundColor: '#cbd5e1', padding: '12px 20px', borderRadius: '6px', marginBottom: '20px', textAlign: 'left', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#0f172a' }}>📍 TARGET REGION ROUTER:</span>
        <input type="text" placeholder="Filter Country" value={searchCountry} onChange={(e) => setSearchCountry(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #94a3b8' }} />
        <input type="text" placeholder="Filter City" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #94a3b8' }} />
        <input type="text" placeholder="Filter Quarter" value={searchQuarter} onChange={(e) => setSearchQuarter(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #94a3b8' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          {!selectedVendor ? (
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ marginTop: '0' }}>Browse Kitchen Market</h3>
              {filteredShops.map(shop => (
                <div key={shop.id} style={{ padding: '15px', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{shop.name}</h4>
                    <small style={{ color: '#64748b' }}>Location Hub: {shop.location}, {shop.city} ({shop.country})</small>
                  </div>
                  <button onClick={() => setSelectedVendor(shop)} style={{ backgroundColor: '#0f766e', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Open Menu</button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'left' }}>
              <button onClick={() => { setSelectedVendor(null); setSelectedItem(null); }} style={{ color: '#0f766e', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>← Back to Restaurant Hubs</button>
              <h3>{selectedVendor.name} Catalog</h3>
              {selectedVendor.menu.map(item => (
                <div key={item.id} onClick={() => setSelectedItem(item)} style={{ padding: '15px', border: selectedItem?.id === item.id ? '2px solid #0f766e' : '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '10px', cursor: 'pointer', backgroundColor: selectedItem?.id === item.id ? '#f0fdf4' : 'white' }}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', maxHeight: '110px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: '0' }}>{item.name} <small style={{ color: '#0284c7' }}>({item.isPermanent ? 'Permanent' : 'Daily Special'})</small></h4>
                    <strong>{item.basePrice} {selectedVendor.currency || 'CFA'}</strong>
                  </div>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
            <h3 style={{ marginTop: '0', color: '#0f766e' }}>Dietary Customizer Deck</h3>
            {selectedItem ? (
              <div>
                <h4>Modify Recipe: {selectedItem.name}</h4>
                <input type="text" placeholder="Enter precise drop-off delivery address" value={typedAddress} onChange={(e) => setTypedAddress(e.target.value)} style={{ width: '95%', padding: '8px', marginBottom: '15px' }} />
                
                <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px', marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', marginBottom: '6px', color: '#334155' }}>🩺 AUTO-ADJUST HEALTH PROFILE PRESETS:</label>
                  <select 
                    value={healthProfile} 
                    onChange={(e) => {
                      const pId = e.target.value;
                      setHealthProfile(pId);
                      
                      // Auto-adjust ingredients map
                      const initialMap = {};
                      selectedItem.ingredients.forEach(ing => {
                        initialMap[ing.name] = 'Normal';
                      });

                      if (pId === 'hypertension') {
                        selectedItem.ingredients.forEach(ing => {
                          if (ing.name.toLowerCase().includes('salt') || ing.name.toLowerCase().includes('sodium')) {
                            initialMap[ing.name] = 'Low';
                          }
                        });
                      } else if (pId === 'ulcer') {
                        selectedItem.ingredients.forEach(ing => {
                          if (ing.name.toLowerCase().includes('pepper') || ing.name.toLowerCase().includes('chili') || ing.name.toLowerCase().includes('spicy')) {
                            initialMap[ing.name] = 'None';
                          }
                        });
                      } else if (pId === 'diabetes') {
                        selectedItem.ingredients.forEach(ing => {
                          if (ing.name.toLowerCase().includes('sugar') || ing.name.toLowerCase().includes('plantain')) {
                            initialMap[ing.name] = 'Low';
                          }
                        });
                      } else if (pId === 'shellfish') {
                        selectedItem.ingredients.forEach(ing => {
                          if (ing.name.toLowerCase().includes('prawn') || ing.name.toLowerCase().includes('shrimp') || ing.name.toLowerCase().includes('shellfish')) {
                            initialMap[ing.name] = 'None';
                          }
                        });
                      }

                      setIngredientModifiers(initialMap);
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #94a3b8', fontSize: '13px', backgroundColor: 'white', cursor: 'pointer' }}
                  >
                    <option value="none">Standard Diet / No Medical Alert</option>
                    <option value="hypertension">Hypertension (Auto-sets Salts to Low)</option>
                    <option value="ulcer">Gastric Ulcer (Auto-removes Hot Peppers)</option>
                    <option value="diabetes">Diabetes (Auto-reduces Sugars & Plantains)</option>
                    <option value="shellfish">Shellfish Allergy (Auto-removes Shellfish/Prawns)</option>
                  </select>
                </div>

                {healthProfile !== 'none' && (
                  <div style={{ padding: '10px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '4px', marginBottom: '15px', fontSize: '12px', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🛡️ <strong>Health Guard:</strong> Recipe optimized automatically for {healthProfile === 'hypertension' ? 'Hypertension (Low Sodium)' : healthProfile === 'ulcer' ? 'Gastric Ulcer (Gastric-safe)' : healthProfile === 'diabetes' ? 'Diabetes (Low Glycemic/Carb)' : 'Shellfish Allergy (Allergen-free)'}!
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedItem.ingredients.map(ing => {
                    const status = ingredientModifiers[ing.name] || 'Normal';
                    return (
                      <div key={ing.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        <span><strong>{ing.name}</strong> {status === 'None' && `(-${ing.costValue})`}</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {['None', 'Low', 'Normal'].map(m => (
                            <button key={m} onClick={() => setIngredientModifiers(p => ({ ...p, [ing.name]: m }))} style={{ fontSize: '11px', backgroundColor: status === m ? '#1e293b' : 'white', color: status === m ? 'white' : 'black' }}>{m}</button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={handlePlaceCustomerOrder} style={{ width: '100%', backgroundColor: '#0f766e', color: 'white', border: 'none', padding: '12px', marginTop: '15px', fontWeight: 'bold', cursor: 'pointer' }}>Submit Safe Recipe Order</button>
              </div>
            ) : <p style={{ color: '#64748b', fontSize: '13px' }}>Select an open menu dish item to apply healthcare modification metrics.</p>}
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
            <h3>Your Live Order Pipeline Monitor</h3>
            {globalOrders.length === 0 ? <p style={{ fontSize: '12px', color: '#64748b' }}>No active processing orders found in network.</p> : globalOrders.map(order => (
              <div key={order.orderId} style={{ padding: '10px', borderBottom: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{order.orderId} - {order.itemName}</strong>
                  <div style={{ fontSize: '11px', color: '#475569' }}>Adjustments: {order.modifications || 'None'}</div>
                </div>
                <span style={{ backgroundColor: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Cancelled' ? '#fee2e2' : '#fef9c3', color: 'black', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>{order.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}