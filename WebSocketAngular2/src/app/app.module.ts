import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import {FormsModule} from "@angular/forms";
import { GameComponent } from './game/game.component';
import { EnemyFieldComponent } from './enemy-field/enemy-field.component';
import { LobbyComponent } from './lobby/lobby.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    GameComponent,
    EnemyFieldComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [EnemyFieldComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
