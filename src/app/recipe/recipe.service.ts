import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';

@Injectable({
    providedIn: "root"
})
export class RecipeService {

    recipesChanged = new Subject<Recipe[]>();
    // private recipes: Recipe[] = [
    //     new Recipe(
    //         0,
    //         'Recipe Test 1',
    //         'This is the desc of test recipe',
    //         'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg',
    //         [
    //             new Ingredient("meat", 12),
    //             new Ingredient("potato", 2),
    //         ]),
    //     new Recipe(
    //         1,
    //         'Recipe Test 2',
    //         'This is the desc of test recipe 2',
    //         'https://c.pxhere.com/images/d0/54/15a09b734bfd3e341434c2191a94-1417896.jpg!d',
    //         [
    //             new Ingredient("tomato", 10),
    //             new Ingredient("cheese", 1),
    //         ])
    // ];
    private recipes: Recipe[] = [];

    constructor(private shoppingListService: ShoppingListService) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice())
    }

    getRecipes() {
        return this.recipes.slice()
    }

    addToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    getRecipe(id: number) {
        var recipe = this.recipes.find(
            (r) => {
                return r.id === id;
            }
        );

        return recipe;
    }

    addRecipe(recipe: Recipe) {
        recipe.id = Date.now(); // to generate unique timestamp number as id
        this.recipes.push(recipe)
        this.recipesChanged.next(this.recipes.slice())
    }

    updateRecipe(id: number, newRecipe: Recipe) {
        newRecipe.id = id;
        this.recipes[this.recipes.findIndex(el => el.id === id)] = newRecipe;
        this.recipesChanged.next(this.recipes.slice())
    }

    deleteRecipe(id: number) {
        var index = this.getRecipes().findIndex((recipe) => {
            return recipe.id === id;
        })
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice())
    }
}