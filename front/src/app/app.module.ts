import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { HeaderComponent } from './header/header.component';
import { UserListComponent } from './user-list/user-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
const customSocketConfig: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
  }
};

@NgModule({
  declarations: [
    AppComponent,
    MessagesListComponent,
    ChatFormComponent,
    HeaderComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(customSocketConfig),
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }