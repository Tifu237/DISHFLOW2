class Ingredient {
  constructor(name, status = 'Normal', costValue = 0, healthWarning = '') {
    this.name = name;          
    this.status = status;      
    this.costValue = costValue; 
    this.healthWarning = healthWarning; 
  }
}

module.exports = Ingredient;