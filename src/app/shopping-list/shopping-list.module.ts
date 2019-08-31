import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { SharedModule } from '../shared/shared.module';

const appRoutes: Routes = [
    { path: '', component: ShoppingListComponent },
]

@NgModule({
    declarations: [
        ShoppingListComponent, 
        ShoppingEditComponent,    
    ],
    imports: [
      CommonModule,      
      FormsModule,
      RouterModule.forChild(appRoutes),
      SharedModule
    ]
})
export class ShoppingListModule {

}