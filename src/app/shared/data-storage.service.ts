import { Injectable } from '@angular/core';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipe/recipe.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipe/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private recipeService: RecipeService, private http: HttpClient, private authService: AuthService) { }

  storeData() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(
      'https://ng-recipe-book-95471.firebaseio.com/recipes.json',
      recipes
    ).subscribe(response => {
      console.log(response);
    })
  }

  fetchData() {
    return this.http.get<Recipe[]>(
      'https://ng-recipe-book-95471.firebaseio.com/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ingredients: [],
              ...recipe
            }
          })
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      )
  }
}
