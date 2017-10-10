import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import {appStoreProviders} from './app.store';

@NgModule({
  declarations: [
    AppComponent,
    ChatPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    appStoreProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
