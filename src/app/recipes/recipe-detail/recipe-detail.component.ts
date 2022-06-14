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
  id: number | undefined;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.id = id - 1;
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

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    if (this.id === 0 || this.id) {
      this.recipeService.deleteRecipe(this.id);
      this.router.navigate(['/recipes'], { relativeTo: this.route });
    }
  }
}
