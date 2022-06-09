import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Recipe } from 'src/app/shared/recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe = new Recipe('', '', '', []);

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      const result = this.recipeService.getRecipe(id - 1);
      if (!result) {
        // redirect to /recipes
        this.router.navigate(['/recipes']);
        return;
      }
      this.recipe = result;
    }
    );

  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    alert("Added ingredients to shopping list successfully!");
  }

  onEditRecipe(){
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
}
