import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "./recipe.model";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  URL = 'https://recipes-54032-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json';

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http
      .put(this.URL, recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(this.URL)
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      )
  }
}
