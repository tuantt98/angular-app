import { EventEmitter } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService{

  ingredientsChanged = new EventEmitter<Ingredient[]>(true);

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  getIngredients(){
    return this.ingredients.slice();
  }

  addIngredient(item: Ingredient){
    this.ingredients.push(item);
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  addIngredients(items: Ingredient[]){
    this.ingredients.push(...items);
    this.ingredientsChanged.emit(this.ingredients.slice());
  }
}
