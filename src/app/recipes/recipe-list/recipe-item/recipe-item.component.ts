import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from 'src/app/shared/recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe = new Recipe('', '', '');
  @Output() recipeSelected = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onSelect() {
    this.recipeSelected.emit();
  }
}
