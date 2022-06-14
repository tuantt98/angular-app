import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from 'src/app/shared/recipe.model';

import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number | undefined;
  editMode = false;
  recipeForm!: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'] - 1;
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  private initForm() {
    let recipeName: string | undefined = ''

    let recipeImagePath: string | undefined = ''
    let recipeDescription: string | undefined = ''
    let recipeIngredients = new FormArray([]);

    if (this.editMode && (this.id === 0 || this.id)) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe?.name;
      recipeImagePath = recipe?.imagePath;
      recipeDescription = recipe?.description;

      if (recipe?.ingredients) {
        for (let ingredient of recipe.ingredients) {
          const { name, amount } = ingredient;
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(name, Validators.required),
              amount: new FormControl(amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          )
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  getControl() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
  onSubmit() {
    const value = this.recipeForm.value;
    // const newRecipe = new Recipe(
    //   value['name'],
    //   value['description'],
    //   value['imagePath'],
    //   value['ingredients']
    // );
    if(this.editMode && (this.id === 0 || this.id) ) {
      this.recipeService.updateRecipe(this.id, value);
    }else{
      this.recipeService.addRecipe(value);
    }
    this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
