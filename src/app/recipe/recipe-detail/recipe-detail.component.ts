import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id = '';

  //constructor(private shoppingListService: ShoppingListService) { }
  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.recipe = this.recipeService.getRecipe(+this.id);
      }
    )
  }

  addToShoppingList() {
    console.log(this.recipe.ingredients);
    this.recipeService.addToShoppingList(this.recipe.ingredients);
    // this.recipe.ingredients.forEach(ingredient => {
    //   this.shoppingListService.updateList(ingredient);
    // });
  }

  editRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  deleteRecipe(){
    this.recipeService.deleteRecipe(+this.id);
    this.router.navigate(['recipes'])
  }
}
