const Ingredient = require('./Ingredient');

class FoodItem {
  constructor(id, name, basePrice, unitType, description) {
    this.id = id;
    this.name = name;
    this.basePrice = basePrice;
    this.unitType = unitType; 
    this.description = description;
    this.ingredients = []; 
    this.imageUrl = ''; 
  }

  addIngredientRecipe(name, costValue, healthWarning) {
    this.ingredients.push(new Ingredient(name, 'Normal', costValue, healthWarning));
  }
}

module.exports = FoodItem;