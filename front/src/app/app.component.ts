import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private socket: Socket,private authService: AuthService) {}
   ngOnInit() {
    if (this.authService.isAuthenticated()) {
     this.socket.emit('get-all-messages')
     this.socket.emit('get-all-user')
    
    
      // L'utilisateur est authentifié, vous pouvez permettre l'accès aux pages protégées ici
    } else {
      this.authService.login();
    }
  }
  
  
}
