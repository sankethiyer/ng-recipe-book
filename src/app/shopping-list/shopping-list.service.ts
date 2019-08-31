import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: "root" })
export class ShoppingListService {
    ingredientAdded = new Subject<Ingredient[]>();
    editingIngredient  = new Subject<number>();
    private ingredients: Ingredient[] = [
        new Ingredient('apples', 5),
        new Ingredient('tomatoes', 10)
    ];

    getIngredient(index:number){
        return this.ingredients[index];
    }

    updateList(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientAdded.next(this.ingredients.slice())
    }

    updateIngrediant(index:number, newIngrediant: Ingredient) {
        this.ingredients[index] = newIngrediant;
        this.ingredientAdded.next(this.ingredients.slice())
    }

    deleteIngrediant(index:number) {
        this.ingredients.splice(index,1);
        this.ingredientAdded.next(this.ingredients.slice())
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientAdded.next(this.ingredients.slice())
    }


    getList(){
        return this.ingredients.slice()
    }
}