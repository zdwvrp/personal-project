import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import components
import { HomeComponent } from './home/home.component';
import { WordleComponent } from './wordle/wordle.component';
import { SnakeComponent } from './snake/snake.component';
import { MtgLifeCounterComponent } from './mtg-life-counter/mtg-life-counter.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'wordle', component: WordleComponent },
  { path: 'snake', component: SnakeComponent },
  { path: 'magic-life-counter', component: MtgLifeCounterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
