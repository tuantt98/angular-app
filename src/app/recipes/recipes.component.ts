import { Component, OnInit } from '@angular/core';
import { Recipe } from '../shared/recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  selectedRecipe: Recipe = new Recipe('', '', '');
  constructor() {}

  ngOnInit(): void {}

  onRecipeSelected(data: Recipe) {
    this.selectedRecipe = data;
  }
}
