import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameSettingComponent } from './game-setting/game-setting.component';
import { GameHomeComponent } from './game-home/game-home.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    {path:"", redirectTo:"home", pathMatch:'full'},
    {path:"home", component: GameHomeComponent},
    {path:"game", component:GameBoardComponent},
    {path:"settings", component: GameSettingComponent},
    {path:"**", component: NotFoundComponent}
];
