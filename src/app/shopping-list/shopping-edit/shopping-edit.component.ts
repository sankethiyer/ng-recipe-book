import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) form: NgForm;
  editedIngredient: Ingredient;
  editMode = false;
  editingSubscription: Subscription;
  editIndex: number;
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {

    this.editingSubscription = this.shoppingListService.editingIngredient.subscribe((index: number) => {
      this.editedIngredient = this.shoppingListService.getIngredient(index);
      this.form.setValue(this.editedIngredient)
      this.editMode = true;
      this.editIndex = index;
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    var ingredient = new Ingredient(
      value.name,
      parseInt(value.amount)
    );
    if (this.editMode) {
      this.shoppingListService.updateIngrediant(this.editIndex, ingredient);
    } else {
      this.shoppingListService.updateList(ingredient);
    }

    this.resetForm(form);
  }

  resetForm(form: NgForm) {    
    this.editMode = false;
    form.reset();
  }

  onDelete(){
    if (this.editMode) {
      this.shoppingListService.deleteIngrediant(this.editIndex);      
    }
    this.resetForm(this.form);
  }

  ngOnDestroy(): void {
    this.editingSubscription.unsubscribe()
  }

}
