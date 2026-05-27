// backend/config/db.js
const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'db_store.json');

// Initial seed data with realistic Cameroonian cuisine
const SEED_DATA = {
  vendors: [
    {
      id: 1,
      ownerId: "owner-1",
      email: "owner1@dishflow.com",
      password: "password123",
      name: "La Chaumière Bastos",
      shop_name: "La Chaumière Bastos",
      town: "Yaoundé, Bastos",
      city: "Yaoundé",
      location: "Bastos",
      country: "Cameroon",
      currency: "CFA",
      menu: [
        {
          id: 101,
          name: "Poulet DG",
          basePrice: 4500,
          description: "Delicious traditional Cameroonian chicken cooked with ripe plantains, bell peppers, carrots, and sweet spices.",
          imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80",
          isPermanent: true,
          ingredients: [
            { name: "Plantain", costValue: 500, healthWarning: "High glycemic index if fried." },
            { name: "Chicken", costValue: 1500, healthWarning: "None." },
            { name: "Carrots", costValue: 200, healthWarning: "None." },
            { name: "Green Peppers", costValue: 300, healthWarning: "None." }
          ]
        },
        {
          id: 102,
          name: "Ndolé Crevettes",
          basePrice: 5500,
          description: "A rich Cameroonian peanut and bitterleaf stew cooked with succulent prawns and spices.",
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
          isPermanent: false,
          ingredients: [
            { name: "Bitterleaf", costValue: 400, healthWarning: "None." },
            { name: "Peanuts", costValue: 500, healthWarning: "High fats." },
            { name: "Prawns", costValue: 2000, healthWarning: "Allergen warning: shellfish." }
          ]
        }
      ]
    },
    {
      id: 2,
      ownerId: "owner-2",
      email: "owner2@dishflow.com",
      password: "password123",
      name: "Burger Hub Douala",
      shop_name: "Burger Hub Douala",
      town: "Douala, Akwa",
      city: "Douala",
      location: "Akwa",
      country: "Cameroon",
      currency: "CFA",
      menu: [
        {
          id: 201,
          name: "Gourmet Double Cheese",
          basePrice: 3500,
          description: "Two flame-grilled beef patties with double melted cheddar, crisp lettuce, pickles, and our signature burger sauce.",
          imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
          isPermanent: true,
          ingredients: [
            { name: "Beef Patty", costValue: 1000, healthWarning: "High calorie density." },
            { name: "Cheddar Cheese", costValue: 500, healthWarning: "High dairy fats." },
            { name: "Burger Sauce", costValue: 200, healthWarning: "Contains egg/mayo allergen." }
          ]
        },
        {
          id: 202,
          name: "Crispy Chicken Wrap",
          basePrice: 2800,
          description: "Crispy golden fried chicken tenders wrapped with fresh leaf lettuce, ripe tomatoes, and light garlic herb mayo.",
          imageUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=400&q=80",
          isPermanent: false,
          ingredients: [
            { name: "Chicken Tenders", costValue: 800, healthWarning: "Fried product." },
            { name: "Tortilla Wrap", costValue: 300, healthWarning: "Contains gluten." },
            { name: "Lettuce", costValue: 100, healthWarning: "None." }
          ]
        }
      ]
    }
  ],
  orders: []
};

// Initialize JSON database file if it doesn't exist
if (!fs.existsSync(STORE_PATH)) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(SEED_DATA, null, 2), 'utf8');
}

function loadDB() {
  try {
    const data = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON database file:", err);
    return SEED_DATA;
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing JSON database file:", err);
  }
}

// Database helper functions
const db = {
  getVendors: () => {
    return loadDB().vendors;
  },
  saveVendors: (vendors) => {
    const data = loadDB();
    data.vendors = vendors;
    saveDB(data);
  },
  getOrders: () => {
    return loadDB().orders;
  },
  saveOrders: (orders) => {
    const data = loadDB();
    data.orders = orders;
    saveDB(data);
  },
  // compatibility query method for promise-based call signatures
  query: async (sql, params = []) => {
    const data = loadDB();
    const sqlLower = sql.toLowerCase().trim();

    if (sqlLower.startsWith('select * from vendors where shop_name = ?') || sqlLower.startsWith('select * from vendors where email = ?')) {
      const match = data.vendors.filter(v => v.shop_name.toLowerCase() === params[0].toLowerCase() || (v.email && v.email.toLowerCase() === params[0].toLowerCase()));
      return [match];
    }

    if (sqlLower.startsWith('select * from vendors where id = ?')) {
      const match = data.vendors.filter(v => Number(v.id) === Number(params[0]));
      return [match];
    }

    if (sqlLower.startsWith('select * from vendors')) {
      return [data.vendors];
    }

    if (sqlLower.startsWith('insert into vendors')) {
      const newId = data.vendors.length > 0 ? Math.max(...data.vendors.map(v => v.id)) + 1 : 1;
      const newVendor = {
        id: newId,
        ownerId: `owner-${newId}`,
        email: params[0] + "@dishflow.com",
        password: "password123",
        name: params[0],
        shop_name: params[0],
        town: params[1],
        currency: params[2] || 'CFA',
        country: 'Cameroon',
        city: 'Yaounde',
        location: 'Bastos',
        menu: []
      };
      data.vendors.push(newVendor);
      saveDB(data);
      return [{ insertId: newId }];
    }

    if (sqlLower.startsWith('insert into dishes')) {
      const vendorId = params[0];
      const dishName = params[1];
      const basePrice = params[2];
      
      const vendor = data.vendors.find(v => Number(v.id) === Number(vendorId));
      if (vendor) {
        const newDishId = Date.now();
        vendor.menu.push({
          id: newDishId,
          name: dishName,
          basePrice: Number(basePrice),
          description: '',
          imageUrl: '',
          isPermanent: true,
          ingredients: []
        });
        saveDB(data);
      }
      return [{}];
    }

    throw new Error(`Unsupported mock query: ${sql}`);
  },
  promise: () => {
    return db;
  }
};

module.exports = db;