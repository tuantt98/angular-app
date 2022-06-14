import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm | undefined;

  subscription: Subscription | undefined;
  editMode = false
  editItemIndex: number | undefined;
  editedItem: Ingredient | undefined;
  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editItemIndex = index;
        this.editedItem = this.slService.getIngredient(index);

        const { name, amount } = this.editedItem;
        this.slForm?.setValue({
          name: name,
          amount: amount
        });
      }
    )
  }

  onSubmit(form: NgForm) {
    const { name, amount } = form.value;
    const newIngredient = new Ingredient(name, amount);

    if (this.editMode && this.editItemIndex) {
      this.slService.updateIngredient(this.editItemIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm?.reset();
    this.editMode = false;
  }

  onDelete() {
    if (this.editItemIndex === 0 || this.editItemIndex) {
      this.slService.deleteIngredient(this.editItemIndex);
      this.onClear();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
