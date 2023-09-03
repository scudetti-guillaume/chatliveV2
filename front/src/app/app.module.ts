import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ToasterService } from './toaster.service';


const jwtToken = localStorage.getItem('token');

const customSocketConfig: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
    transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${jwtToken}` 
          }
        }
      }
  },
  
};

// const customToastConfig = {
//       positionClass: 'toast-top-center', 
//       progressBar: true, 
//       preventDuplicates: true, 
//       closeButton: false,
// }

@NgModule({
  declarations: [
    AppComponent,
    ChatFormComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(customSocketConfig),
    ToastrModule.forRoot(), // Affiche un bouton de fermeture pour chaque toast  
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [ToasterService],
  bootstrap: [AppComponent]
})
export class AppModule { }