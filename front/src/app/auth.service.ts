import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private dialog: MatDialog) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }

  login() {
  const dialogRef = this.dialog.open(LoginComponent, {
    width: '400px',
    disableClose: true,// Adjust the width as needed
    data: {} // You can pass data to the modal if needed
  });
  dialogRef.afterClosed().subscribe(result => {
    // Handle modal close event if needed
  });

  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('pseudo');
    localStorage.removeItem('email');
  }
}