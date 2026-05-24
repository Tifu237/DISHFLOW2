const FoodItem = require('./FoodItem');

class Restaurant {
  constructor(id, name, category, type, country, city, location, currency) {
    this.id = id;
    this.name = name;
    this.category = category; 
    this.type = type; 
    this.country = country;   
    this.city = city;         
    this.location = location; 
    this.currency = currency;   
    this.menu = []; 
  }

  addMenuItem(itemObject) {
    if (itemObject instanceof FoodItem) {
      this.menu.push(itemObject);
    }
  }
}

module.exports = Restaurant;