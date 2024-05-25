import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import components
import { HomeComponent } from './home/home.component';
import { WordleComponent } from './wordle/wordle.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'wordle', component: WordleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
