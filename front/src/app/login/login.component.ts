// login-modal.component.ts
import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MatDialogRef } from '@angular/material/dialog';
import { ToasterService } from '../toaster.service';
// import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  id : string = '';
  pseudo: string = '';
  email: string = '';
  password: string = '';


  constructor(private socket: Socket,private toaster: ToasterService,private dialogRef: MatDialogRef<LoginComponent>) {}

  closeModal() {
    this.dialogRef.close(); 
  }
  
  onSubmit() {
    const userId = localStorage.getItem('id');
    const loginData = {
      id: userId,
      pseudo: this.pseudo,
      email: this.email,
      password: this.password,
    };

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      this.toaster.showError('', 'Veuillez entrer une adresse email valide.' +""+ this.email);
      return;
    }
    
    this.socket.emit('login-user', loginData);
    this.socket.on('login-response', (response: any) => {
      if (response.success) {
       this.toaster.showSuccess('', 'Connexion réussie' +''+ response.loginData.pseudo);
        localStorage.setItem('id', response.loginData.id);
       localStorage.setItem('pseudo', response.loginData.pseudo);
       localStorage.setItem('email', response.loginData.email);
       localStorage.setItem('token', response.loginData.token);
        setTimeout(() => {
        this.pseudo = '';
        this.email = '';
        this.password = '';
       this.dialogRef.close();
       }, 3000);
        
   
  

      console.log('Login successful');
    
      }else {
        this.toaster.showError("Erreur lors de la connexion :" , response.error);
      }
    });
  }
}





