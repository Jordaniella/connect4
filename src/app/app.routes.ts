import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { GameRulesComponent } from './game-rules/game-rules.component';
import { GameHomeComponent } from './game-home/game-home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: GameHomeComponent },
  { path: 'rules', component: GameRulesComponent },
  { path: '**', component: NotFoundComponent },
];
