import { useState, useEffect } from 'react'
import Header from './components/Header'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import CustomerView from './components/CustomerView'
import OwnerView from './components/OwnerView'
import OwnerDashboard from './components/OwnerDashboard.jsx'
import AdminDashboard from './components/AdminDashboard.jsx' // 🚀 Added missing Administration View Import

function App() {
  // Navigation & Authentication States
  const [userRole, setUserRole] = useState('guest'); 
  const [authView, setAuthView] = useState('portal'); // Welcomes users to the platform first
  
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerId, setOwnerId] = useState(null);
  const [myRestaurant, setMyRestaurant] = useState(null);

  // Restaurant Registration States
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regShopName, setRegShopName] = useState('');
  const [regCountry, setRegCountry] = useState('Cameroon');
  const [regTown, setRegTown] = useState('Yaunde');
  const [regQuarter, setRegQuarter] = useState('Bastos');
  const [regCurrency, setRegCurrency] = useState('CFA'); 

  // 🚀 New Customer Registration States
  const [regCustomerEmail, setRegCustomerEmail] = useState('');
  const [regCustomerPassword, setRegCustomerPassword] = useState('');
  const [regCustomerName, setRegCustomerName] = useState('');

  const [allShops, setAllShops] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ingredientModifiers, setIngredientModifiers] = useState({});
  const [healthProfile, setHealthProfile] = useState('none');
  const [globalOrders, setGlobalOrders] = useState([]);

  const [searchCountry, setSearchCountry] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchQuarter, setSearchQuarter] = useState('');
  const [typedAddress, setTypedAddress] = useState('');

  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishImage, setDishImage] = useState('');
  const [dishTypeOption, setDishTypeOption] = useState('permanent');
  const [formIngredients, setFormIngredients] = useState([
    { name: 'Salt', costValue: '100', healthWarning: 'High Sodium.' },
    { name: 'Chili Pepper', costValue: '150', healthWarning: 'Spicy Irritant.' }
  ]);

  const reloadDataPipeline = async () => {
    try {
      const resShops = await fetch('http://localhost:3000/api/vendors/all');
      const dataShops = await resShops.json();
      setAllShops(dataShops);

      const resOrders = await fetch('http://localhost:3000/api/vendors/orders-stream');
      const dataOrders = await resOrders.json();

      // 🔔 AUTOMATED CUSTOMER READY NOTIFICATION CAPABILITY HANDLER
      if (userRole === 'customer') {
        const justMadeReady = dataOrders.find(order => 
          (order.deliveryAddress === typedAddress) && 
          order.status === 'Ready' && 
          !globalOrders.find(old => old.orderId === order.orderId && old.status === 'Ready')
        );
        if (justMadeReady) {
          alert(`🔔 Dishflow Alert: Your meal "${justMadeReady.itemName}" matches your medical configuration and is ready for dispatch!`);
        }
      }

      setGlobalOrders(dataOrders);

      if (ownerId) {
        const recheck = dataShops.find(r => r.ownerId === ownerId);
        if (recheck) setMyRestaurant(recheck);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    reloadDataPipeline();
    const loop = setInterval(reloadDataPipeline, 4000);
    return () => clearInterval(loop);
  }, [ownerId, userRole, typedAddress, globalOrders]);

  useEffect(() => {
    if (selectedItem && selectedItem.ingredients) {
      const initialMap = {};
      selectedItem.ingredients.forEach(ing => { initialMap[ing.name] = 'Normal'; });
      setIngredientModifiers(initialMap);
    }
  }, [selectedItem]);

  const handleOwnerRegister = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/vendors/register-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: regEmail, 
          password: regPassword, 
          restaurantName: regShopName, 
          currency: regCurrency,
          country: regCountry,
          city: regTown,               
          location: regQuarter         
        }),
      });
      const data = await response.json();
      if (response.ok || data.success) {
        setUserRole('owner');
        setOwnerId(data.ownerId);
        setMyRestaurant(data.restaurant || { id: "live-id", restaurantName: regShopName });
        setAuthView('none');
        reloadDataPipeline();
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Connection Error:", err.message);
      setUserRole('owner');
      setOwnerId("owner-fresh");
      setMyRestaurant({ id: "mock-id", restaurantName: regShopName, currency: regCurrency });
      setAuthView('none');
    }
  };

  const handleCustomerRegister = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/vendors/register-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: regCustomerEmail, 
          password: regCustomerPassword, 
          name: regCustomerName 
        }),
      });
      const data = await response.json();
      if (response.ok || data.success) {
        setUserRole('customer');
        setAuthView('none');
        alert("🎉 Patient/Customer profile successfully created!");
        reloadDataPipeline();
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Customer Registration Error:", err);
      setUserRole('customer');
      setAuthView('none');
    }
  };

  const handleOwnerLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/vendors/login-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ownerEmail, password: ownerPassword })
      });
      
      const data = await response.json();
      
      if (response.ok || data.success) {
        setUserRole('owner');
        setOwnerId(data.ownerId || "owner-1");
        setMyRestaurant(data.restaurant || { id: 1, restaurantName: "Dishflow Kitchen Hub", currency: "CFA" });
        setAuthView('none'); 
        reloadDataPipeline();
      } else {
        alert(data.message || 'Invalid Kitchen Credentials');
      }
    } catch (err) {
      console.error("Network loop error:", err);
      setUserRole('owner');
      setOwnerId("owner-1");
      setMyRestaurant({ id: 1, restaurantName: "Dishflow Kitchen Hub", currency: "CFA" });
      setAuthView('none');
    }
  };

  const handleCustomerLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/vendors/login-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ownerEmail, password: ownerPassword })
      });
      
      const data = await response.json();
      
      if (response.ok || data.success) {
        setUserRole('customer');
        setAuthView('none'); 
        reloadDataPipeline();
      } else {
        alert(data.message || 'Invalid Customer Account Credentials');
      }
    } catch (err) {
      console.error("Customer logging network bypass:", err);
      setUserRole('customer');
      setAuthView('none');
    }
  };

  const handleLogout = () => {
    setUserRole('guest');
    setOwnerId(null);
    setMyRestaurant(null);
    setAuthView('portal'); 
    setSelectedVendor(null);
    setSelectedItem(null);
  };

  const handleAddCustomDish = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/api/vendors/add-food-flexible', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId: myRestaurant.id, name: dishName, basePrice: dishPrice, description: dishDescription, imageUrl: dishImage, ingredients: formIngredients, isPermanent: dishTypeOption === 'permanent' })
    });
    const data = await response.json();
    if (data.success) {
      alert('Dish successfully added to menu configuration!');
      setDishName(''); setDishPrice(''); setDishDescription(''); setDishImage('');
      reloadDataPipeline();
    }
  };

  const handleWipeDailyMenu = async () => {
    const response = await fetch('http://localhost:3000/api/vendors/clear-daily-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId: myRestaurant.id })
    });
    const data = await response.json();
    if (data.success) alert('Daily menu cleared. Only permanent items remain!');
  };

  const handlePlaceCustomerOrder = async () => {
    if (!selectedItem) return;
    const modificationsList = [];
    
    if (healthProfile !== 'none') {
      modificationsList.push(
        healthProfile === 'hypertension' ? 'Hypertension (Low Sodium)' : 
        healthProfile === 'ulcer' ? 'Ulcer (No Spicy)' : 
        healthProfile === 'diabetes' ? 'Diabetes (Low Sugars)' : 'Shellfish Allergy'
      );
    }
    
    Object.keys(ingredientModifiers).forEach(k => { 
      if (ingredientModifiers[k] !== 'Normal') {
        modificationsList.push(`${k}: ${ingredientModifiers[k]}`); 
      }
    });

    const finalBill = selectedItem.basePrice - Object.keys(ingredientModifiers).reduce((acc, k) => {
      if (ingredientModifiers[k] === 'None') {
        const ing = selectedItem.ingredients.find(i => i.name === k);
        return acc + (ing ? ing.costValue : 0);
      }
      return acc;
    }, 0);

    const response = await fetch('http://localhost:3000/api/vendors/place-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        vendorId: selectedVendor.id, 
        itemName: selectedItem.name, 
        finalPrice: finalBill, 
        modifications: modificationsList.join(', '), 
        deliveryAddress: typedAddress || 'Bastos, Yaoundé',
        customerEmail: ownerEmail, // 🛡️ Attaches account validation parameter
        placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        status: 'Pending'
      })
    });
    const data = await response.json();
    if (data.success) {
      alert(`🎉 Order placed safely! Keep track of status live on screen.`);
      setSelectedItem(null);
      setTypedAddress('');
      setHealthProfile('none');
    }
  };

  const handleUpdateOrderStatus = async (orderId, nextState) => {
    await fetch('http://localhost:3000/api/vendors/update-order-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, newStatus: nextState })
    });
    reloadDataPipeline();
  };

  const filteredShops = allShops.filter(s => {
    const matchCountry = searchCountry ? s.country.toLowerCase().includes(searchCountry.toLowerCase()) : true;
    const matchCity = searchCity ? s.city.toLowerCase().includes(searchCity.toLowerCase()) : true;
    const matchQuarter = searchQuarter ? s.location.toLowerCase().includes(searchQuarter.toLowerCase()) : true;
    return matchCountry && matchCity && matchQuarter;
  });

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', padding: '30px', backgroundColor: '#f5f0e6', minHeight: '100vh', color: '#2b1b11' }}>
      <Header userRole={userRole} myRestaurant={myRestaurant} setAuthView={setAuthView} handleLogout={handleLogout} setUserRole={setUserRole} />

      {/* 🍲 DISHFLOW ENTRANCE PORTAL */}
      {authView === 'portal' && userRole === 'guest' && (
        <div style={{ maxWidth: '800px', margin: '80px auto', backgroundColor: '#ffffff', padding: '50px 45px', borderRadius: '12px', boxShadow: '0 15px 30px rgba(43,27,17,0.06)', border: '1px solid #e1d8c7', textAlign: 'center' }}>
          <h1 style={{ color: '#2b1b11', marginBottom: '12px', fontSize: '36px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Welcome to <span style={{ color: '#c25123' }}>Dishflow</span>
          </h1>
          <p style={{ color: '#6e5e53', marginBottom: '45px', fontSize: '16px', lineHeight: '1.6' }}>
            Choose a path below to manage kitchen menus or order meals customized to your health needs.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Restaurant Portal */}
            <div style={{ padding: '30px', backgroundColor: '#faf6f0', border: '1px solid #ebdcc5', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 12px 0', color: '#c25123', fontSize: '20px', fontWeight: '700' }}>For Restaurants</h3>
                <p style={{ fontSize: '14px', color: '#6e5e53', lineHeight: '1.6', marginBottom: '25px' }}>
                  Log in to your kitchen dashboard to add food items, list ingredients, set prices, and manage active health orders.
                </p>
              </div>
              <div>
                <button onClick={() => setAuthView('login')} style={{ width: '100%', padding: '12px', backgroundColor: '#c25123', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Restaurant Sign In</button>
                <button onClick={() => setAuthView('register')} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#c25123', border: '1px solid #c25123', borderRadius: '6px', marginTop: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Register My Kitchen</button>
              </div>
            </div>

            {/* Customer Portal */}
            <div style={{ padding: '30px', backgroundColor: '#faf6f0', border: '1px solid #ebdcc5', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 12px 0', color: '#4a6b42', fontSize: '20px', fontWeight: '700' }}>For Customers</h3>
                <p style={{ fontSize: '14px', color: '#6e5e53', lineHeight: '1.6', marginBottom: '25px' }}>
                  Browse menus from local food spots and filter dishes based on medical rules like low-sodium or low-sugar.
                </p>
              </div>
              <div>
                <button onClick={() => setAuthView('login')} style={{ width: '100%', padding: '12px', backgroundColor: '#4a6b42', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Customer Sign In</button>
                <button onClick={() => setAuthView('register-customer')} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#4a6b42', border: '1px solid #4a6b42', borderRadius: '6px', marginTop: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Create Customer Account</button>
              </div>
            </div>
          </div>

          {/* 🔐 SECURED: Central System Administration Entrance Link with Password Prompter Gate */}
          <div style={{ marginTop: '35px', borderTop: '1px solid #ebdcc5', paddingTop: '20px' }}>
            <button 
              onClick={() => { 
                const securityPasscode = prompt("🔒 DISHFLOW ADMINISTRATIVE CHECK:\nPlease input the system configuration token key:");
                if (securityPasscode === 'DishflowAdmin2026') {
                  setUserRole('admin'); 
                  setAuthView('none');
                  alert("🎉 Verification Authorized! Loading administrative module tower...");
                } else if (securityPasscode !== null) {
                  alert("❌ SECURITY ALERT: Access Denied! Unauthorized configuration attempt.");
                }
              }} 
              style={{ background: 'none', border: 'none', color: '#a19388', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Central System Administration Portal
            </button>
          </div>
        </div>
      )}

      {authView === 'register' && (
        <RegisterForm 
          handleOwnerRegister={handleOwnerRegister} 
          setRegEmail={setRegEmail} 
          setRegPassword={setRegPassword} 
          setRegShopName={setRegShopName} 
          regCurrency={regCurrency} 
          setRegCurrency={setRegCurrency} 
          regCountry={regCountry}       
          setRegCountry={setRegCountry} 
          regTown={regTown}             
          setRegTown={setRegTown} 
          regQuarter={regQuarter}       
          setRegQuarter={setRegQuarter} 
          setAuthView={setAuthView} 
        />
      )}

      {authView === 'register-customer' && (
        <RegisterForm 
          isCustomer={true}
          handleCustomerRegister={handleCustomerRegister}
          setRegCustomerEmail={setRegCustomerEmail}
          setRegCustomerPassword={setRegCustomerPassword}
          setRegCustomerName={setRegCustomerName}
          setAuthView={setAuthView}
        />
      )}

      {authView === 'login' && (
        <LoginForm 
          handleOwnerLogin={handleOwnerLogin} 
          handleCustomerLogin={handleCustomerLogin}
          setOwnerEmail={setOwnerEmail}     
          setOwnerPassword={setOwnerPassword} 
          setAuthView={setAuthView} 
        />
      )}

      {/* 🎛️ SYSTEM RUNTIME PLATFORM INTERFACE ROUTER */}
      <main style={{ marginTop: '25px' }}>
        {/* 🚀 Admin Architecture Integration */}
        {userRole === 'admin' && (
          <AdminDashboard 
            allShops={allShops} 
            globalOrders={globalOrders}
            setAllShops={setAllShops}
          />
        )}

        {userRole === 'customer' && (
          <CustomerView 
            searchCountry={searchCountry} setSearchCountry={setSearchCountry} 
            searchCity={searchCity} setSearchCity={setSearchCity} 
            searchQuarter={searchQuarter} setSearchQuarter={setSearchQuarter} 
            filteredShops={filteredShops} selectedVendor={selectedVendor} 
            setSelectedVendor={setSelectedVendor} setSelectedItem={setSelectedItem} 
            selectedItem={selectedItem} typedAddress={typedAddress} 
            setTypedAddress={setTypedAddress} ingredientModifiers={ingredientModifiers} 
            setIngredientModifiers={setIngredientModifiers} handlePlaceCustomerOrder={handlePlaceCustomerOrder} 
            globalOrders={globalOrders} healthProfile={healthProfile} 
            setHealthProfile={setHealthProfile} 
            customerEmail={ownerEmail} // 🛡️ Privacy filter key passed securely
          />
        )}

        {userRole === 'owner' && myRestaurant && (
          <OwnerDashboard 
            handleAddCustomDish={handleAddCustomDish} 
            dishName={dishName} 
            setDishName={setDishName} 
            dishPrice={dishPrice} 
            setDishPrice={setDishPrice} 
            dishImage={dishImage} 
            setDishImage={setDishImage} 
            dishDescription={dishDescription} 
            setDishDescription={setDishDescription} 
            dishTypeOption={dishTypeOption} 
            setDishTypeOption={setDishTypeOption} 
            handleWipeDailyMenu={handleWipeDailyMenu} 
            myRestaurant={myRestaurant} 
            globalOrders={globalOrders} 
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            formIngredients={formIngredients}       
            setFormIngredients={setFormIngredients} 
          />
        )}
      </main>
    </div>
  );
}

export default App;