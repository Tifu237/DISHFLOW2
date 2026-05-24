import { useState, useEffect } from 'react'
import Header from './components/Header'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import CustomerView from './components/CustomerView'
import OwnerView from './components/OwnerView'

function App() {
  // Navigation & Authentication States
  const [userRole, setUserRole] = useState('guest'); // 'guest' or 'owner'
  const [authView, setAuthView] = useState('none');  // 'none', 'login', 'register'
  
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerId, setOwnerId] = useState(null);
  const [myRestaurant, setMyRestaurant] = useState(null);

  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regShopName, setRegShopName] = useState('');
  const [regCountry, setRegCountry] = useState('Cameroon');
  const [regTown, setRegTown] = useState('Yaounde');
  const [regQuarter, setRegQuarter] = useState('Bastos');
  const [regCurrency, setRegCurrency] = useState('CFA'); // Currency hook state

  const [allShops, setAllShops] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ingredientModifiers, setIngredientModifiers] = useState({});
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
  }, [ownerId]);

  useEffect(() => {
    if (selectedItem && selectedItem.ingredients) {
      const initialMap = {};
      selectedItem.ingredients.forEach(ing => { initialMap[ing.name] = 'Normal'; });
      setIngredientModifiers(initialMap);
    }
  }, [selectedItem]);

  // 🚀 SEAMLESS ONBOARDING PIPELINE: NO POPUPS, IMMEDIATE DASHBOARD ROUTING
  const handleOwnerRegister = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/api/vendors/register-owner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: regEmail, password: regPassword, restaurantName: regShopName, country: regCountry, city: regTown, location: regQuarter, currency: regCurrency })
    });
    const data = await response.json();
    if (data.success) {
      setUserRole('owner');
      setOwnerId(data.ownerId);
      setMyRestaurant(data.restaurant);
      setAuthView('none'); // Instantly dismisses form layer window without alerts
      reloadDataPipeline();
    } else {
      alert(data.message);
    }
  };

  const handleOwnerLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/vendors/login-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ownerEmail, password: ownerPassword })
      });
      const data = await response.json();
      if (data.success) {
        setUserRole('owner');
        setOwnerId(data.ownerId);
        setMyRestaurant(data.restaurant);
        setAuthView('none');
      }
    } catch (err) {
      alert('Invalid Account Match');
    }
  };

  const handleLogout = () => {
    setUserRole('guest');
    setOwnerId(null);
    setMyRestaurant(null);
    setAuthView('none');
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
      alert('Dish successfully added to menu state configuration!');
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
    Object.keys(ingredientModifiers).forEach(k => { modificationsList.push(`${k}: ${ingredientModifiers[k]}`); });

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
      body: JSON.stringify({ vendorId: selectedVendor.id, itemName: selectedItem.name, finalPrice: finalBill, modifications: modificationsList.join(', '), deliveryAddress: typedAddress || 'Bastos, Yaoundé' })
    });
    const data = await response.json();
    if (data.success) {
      alert(`🎉 Order placed safely! Keep track of status live on screen.`);
      setSelectedItem(null);
      setTypedAddress('');
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
    <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Header userRole={userRole} myRestaurant={myRestaurant} setAuthView={setAuthView} handleLogout={handleLogout} setUserRole={setUserRole} />

      {authView === 'register' && (
        <RegisterForm handleOwnerRegister={handleOwnerRegister} setRegEmail={setRegEmail} setRegPassword={setRegPassword} setRegShopName={setRegShopName} regCurrency={regCurrency} setRegCurrency={setRegCurrency} setRegCountry={setRegCountry} setRegTown={setRegTown} setRegQuarter={setRegQuarter} setAuthView={setAuthView} />
      )}

      {authView === 'login' && (
        <LoginForm handleOwnerLogin={handleOwnerLogin} setOwnerEmail={setOwnerEmail} setOwnerPassword={setOwnerPassword} setAuthView={setAuthView} />
      )}

      <main style={{ marginTop: '20px' }}>
        {userRole === 'guest' ? (
          <CustomerView searchCountry={searchCountry} setSearchCountry={setSearchCountry} searchCity={searchCity} setSearchCity={setSearchCity} searchQuarter={searchQuarter} setSearchQuarter={setSearchQuarter} filteredShops={filteredShops} selectedVendor={selectedVendor} setSelectedVendor={setSelectedVendor} setSelectedItem={setSelectedItem} selectedItem={selectedItem} typedAddress={typedAddress} setTypedAddress={setTypedAddress} ingredientModifiers={ingredientModifiers} setIngredientModifiers={setIngredientModifiers} handlePlaceCustomerOrder={handlePlaceCustomerOrder} globalOrders={globalOrders} />
        ) : (
          myRestaurant && <OwnerView handleAddCustomDish={handleAddCustomDish} dishName={dishName} setDishName={setDishName} dishPrice={dishPrice} setDishPrice={setDishPrice} dishImage={dishImage} setDishImage={setDishImage} dishDescription={dishDescription} setDishDescription={setDishDescription} dishTypeOption={dishTypeOption} setDishTypeOption={setDishTypeOption} handleWipeDailyMenu={handleWipeDailyMenu} myRestaurant={myRestaurant} globalOrders={globalOrders} handleUpdateOrderStatus={handleUpdateOrderStatus} />
        )}
      </main>
    </div>
  );
}

export default App;