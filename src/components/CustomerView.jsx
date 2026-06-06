import React from 'react';

export default function CustomerView({
  searchCountry, setSearchCountry,
  searchCity, setSearchCity,
  searchQuarter, setSearchQuarter,
  filteredShops,
  selectedVendor, setSelectedVendor,
  selectedItem, setSelectedItem,
  typedAddress, setTypedAddress,
  ingredientModifiers, setIngredientModifiers,
  handlePlaceCustomerOrder,
  globalOrders,
  healthProfile, setHealthProfile,
  customerEmail // 🚀 NEW PROP: Receives the logged-in user's identity string
}) {

  // Quick helper to handle the dynamic item ingredient customization logic
  const handleModifierChange = (ingredientName, value) => {
    setIngredientModifiers({
      ...ingredientModifiers,
      [ingredientName]: value
    });
  };

  // 🛡️ SECURITY PATTERN: Filter the system stream down to only this user's records
  const userSpecificOrders = globalOrders.filter(order => {
    // If you track by a unique customer account key on your backend order documents:
    if (order.customerEmail && customerEmail) {
      return order.customerEmail === customerEmail;
    }
    // Fallback security matching against local input configurations for safety:
    return typedAddress && order.deliveryAddress === typedAddress;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', fontFamily: '"Inter", sans-serif' }}>
      
      {/* LEFT COLUMN: KITCHEN SEARCH & MENU CATALOGUE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* 🔍 REGIONAL KITCHEN FILTERS HEADER */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 10px 25px rgba(43,27,17,0.02)' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', fontWeight: '700', color: '#c25123', display: 'block', marginBottom: '8px' }}>Locate Certified Kitchens</span>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '22px', fontWeight: '800', color: '#2b1b11' }}>Regional Culinary Router</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search Country (e.g. Cameroon)" 
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '14px', outline: 'none' }}
            />
            <input 
              type="text" 
              placeholder="📍 Search City (e.g. Yaoundé)" 
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '14px', outline: 'none' }}
            />
            <input 
              type="text" 
              placeholder="🏘️ Search Quarter (e.g. Bastos)" 
              value={searchQuarter}
              onChange={(e) => setSearchQuarter(e.target.value)}
              style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </div>

        {/* 🏪 AVAILABLE KITCHENS STREAM LIST */}
        {!selectedVendor ? (
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 10px 25px rgba(43,27,17,0.02)' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: '700', color: '#2b1b11' }}>Browse Registered Food Spots</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredShops.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#a19388', fontSize: '14px' }}>No certified kitchens matching the routing criteria currently live.</p>
              ) : (
                filteredShops.map(shop => (
                  <div key={shop.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#faf6f0', border: '1px solid #ebdcc5', borderRadius: '8px' }}>
                    <div>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#2b1b11' }}>{shop.restaurantName || shop.name}</h5>
                      <span style={{ fontSize: '13px', color: '#6e5e53' }}>📍 Hub: {shop.location || shop.town}, {shop.city} ({shop.country})</span>
                    </div>
                    <button 
                      onClick={() => setSelectedVendor(shop)}
                      style={{ padding: '10px 20px', backgroundColor: '#c25123', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    >
                      View Menu Cards
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* 🍽️ SELECTED KITCHEN INNER MENU DISPLAY CASE */
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 10px 25px rgba(43,27,17,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #ebdcc5', paddingBottom: '15px' }}>
              <div>
                <button onClick={() => { setSelectedVendor(null); setSelectedItem(null); }} style={{ border: 'none', background: 'none', color: '#c25123', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'block', marginBottom: '4px', textDecoration: 'underline' }}>← Back to All Kitchens</button>
                <h4 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#2b1b11' }}>{selectedVendor.restaurantName || selectedVendor.name}</h4>
              </div>
              <span style={{ fontSize: '13px', color: '#6e5e53', background: '#faf6f0', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ebdcc5', fontWeight: '600' }}>Base Currency: {selectedVendor.currency}</span>
            </div>

            <h5 style={{ margin: '0 0 15px 0', fontSize: '15px', fontWeight: '700', color: '#6e5e53', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Menu Selection</h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {(!selectedVendor.menu || selectedVendor.menu.length === 0) ? (
                <p style={{ fontStyle: 'italic', color: '#a19388', fontSize: '14px', gridColumn: 'span 2' }}>This restaurant hasn't uploaded dishes to their active menu deck yet.</p>
              ) : (
                selectedVendor.menu.map(item => (
                  <div key={item.id} style={{ padding: '20px', backgroundColor: '#faf6f0', border: '1px solid #ebdcc5', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px', border: '1px solid #ebdcc5' }} />}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#2b1b11' }}>{item.name}</span>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#c25123' }}>{item.basePrice} {selectedVendor.currency}</span>
                      </div>
                      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6e5e53', lineHeight: '1.5' }}>{item.description || 'No specific description provided.'}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedItem(item)}
                      style={{ width: '100%', padding: '10px', backgroundColor: '#2b1b11', color: '#f5f0e6', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    >
                      Calibrate & Order
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: CLINICAL DIETARY PROFILE & BILL DECK */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* 🏥 CLINICAL DIETARY PROFILER */}
        <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 10px 25px rgba(43,27,17,0.02)' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '700', color: '#2b1b11' }}>🩺 Patient Health Framework</h4>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6e5e53', lineHeight: '1.4' }}>Select a clinical criteria block to automatically tag or filter matching allergen warnings.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'none', label: 'Standard Dining Profile (No Filters)', color: '#6e5e53' },
              { id: 'hypertension', label: 'Hypertension Framework (Low Sodium)', color: '#c25123' },
              { id: 'ulcer', label: 'Gastric Ulcer Protection (Anti-Spicy)', color: '#b45309' },
              { id: 'diabetes', label: 'Diabetic Compliance (Sugar Tracking)', color: '#4a6b42' }
            ].map(prof => (
              <button
                key={prof.id}
                onClick={() => setHealthProfile(prof.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: healthProfile === prof.id ? `2px solid ${prof.color}` : '1px solid #ebdcc5',
                  backgroundColor: healthProfile === prof.id ? '#faf6f0' : '#ffffff',
                  color: '#2b1b11',
                  fontWeight: healthProfile === prof.id ? '700' : '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {healthProfile === prof.id ? '✓ ' : ''}{prof.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🛒 ACTIVE RECIPE CUSTOMIZATION MODULE */}
        <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 10px 25px rgba(43,27,17,0.02)' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '700', color: '#2b1b11' }}>🛒 Custom Ingredient Matrix</h4>
          
          {!selectedItem ? (
            <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#faf6f0', borderRadius: '8px', border: '1px dashed #ebdcc5', color: '#6e5e53', fontSize: '13px', fontStyle: 'italic' }}>
              Select an active menu item card from a registered kitchen to configure dynamic recipe ingredients.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#faf6f0', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#6e5e53', display: 'block', textTransform: 'uppercase' }}>Target Recipe</span>
                <strong style={{ fontSize: '15px', color: '#2b1b11' }}>{selectedItem.name}</strong>
              </div>

              {/* Dynamic Ingredient Looper */}
              <div>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#6e5e53', marginBottom: '8px' }}>Calibrate Components:</span>
                {(!selectedItem.ingredients || selectedItem.ingredients.length === 0) ? (
                  <span style={{ fontSize: '13px', color: '#a19388', fontStyle: 'italic' }}>Standard default recipe structure (no adjustments needed).</span>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedItem.ingredients.map((ing, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#faf6f0', borderRadius: '6px', border: '1px solid #ebdcc5' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#2b1b11' }}>{ing.name}</div>
                          {ing.healthWarning && <span style={{ fontSize: '11px', color: '#c25123', fontWeight: '500' }}>⚠️ {ing.healthWarning}</span>}
                        </div>
                        <select
                          value={ingredientModifiers[ing.name] || 'Normal'}
                          onChange={(e) => handleModifierChange(ing.name, e.target.value)}
                          style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ebdcc5', fontSize: '12px', fontWeight: '600', backgroundColor: '#ffffff', color: '#2b1b11' }}
                        >
                          <option value="Normal">Include (Normal)</option>
                          <option value="None">Exclude (-{ing.costValue} CFA)</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#6e5e53', marginBottom: '6px' }}>Delivery Destination Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. Street 402, Bastos, Yaoundé" 
                  value={typedAddress}
                  onChange={(e) => setTypedAddress(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '6px', border: '1px solid #ebdcc5', backgroundColor: '#faf6f0', color: '#2b1b11', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <button 
                onClick={handlePlaceCustomerOrder}
                style={{ width: '100%', padding: '14px', backgroundColor: '#4a6b42', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(74,107,66,0.15)' }}
              >
                Dispatch Health Monitored Order Ticket
              </button>
            </div>
          )}
        </div>

        {/* 📋 LIVE CLIENT TRACKING TICKET FEED */}
        <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e1d8c7', boxShadow: '0 10px 25px rgba(43,27,17,0.02)' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '700', color: '#2b1b11' }}>📋 Live Order Processing Monitor</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {userSpecificOrders.length === 0 ? (
              <p style={{ margin: 0, fontStyle: 'italic', color: '#a19388', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No active outgoing dispatch tickets listed for your profile session.</p>
            ) : (
              userSpecificOrders.slice(-3).reverse().map(order => (
                <div key={order.orderId} style={{ padding: '12px', backgroundColor: '#faf6f0', border: '1px solid #ebdcc5', borderRadius: '6px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', marginBottom: '4px' }}>
                    <span style={{ color: '#2b1b11' }}>{order.itemName}</span>
                    <span style={{ color: order.status === 'Completed' ? '#4a6b42' : '#c25123' }}>[{order.status}]</span>
                  </div>
                  <div style={{ color: '#6e5e53', fontSize: '12px', lineHeight: '1.4' }}>
                    <div>📋 Calibration Profile: {order.modifications || 'Standard Preparation'}</div>
                    <div>📍 Target Location: {order.deliveryAddress}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}