import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LobbyComponent} from "../lobby/lobby.component";
import {GameComponent} from "../game/game.component";
import {ChatComponent} from "../chat/chat.component";

const routes: Routes = [
  {path: 'chat', component: ChatComponent},
  {path: 'lobby', component: LobbyComponent},
  {path: 'game/:user', component: GameComponent},
  {path: '', redirectTo: 'lobby', pathMatch: 'full'},
  {path: '**', redirectTo: 'lobby', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
