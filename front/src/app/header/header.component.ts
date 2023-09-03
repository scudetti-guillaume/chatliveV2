import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
constructor(private dialog: MatDialog) {}
openLoginModal(): void {
  const dialogRef = this.dialog.open(LoginComponent, {
    width: '400px', // Adjust the width as needed
    data: {} // You can pass data to the modal if needed
  });

  dialogRef.afterClosed().subscribe(result => {
    // Handle modal close event if needed
  });
}

openRegisterModal(): void {
  const dialogRef = this.dialog.open(RegisterComponent, {
    width: '400px', // Adjust the width as needed
    data: {} // You can pass data to the modal if needed
  });

  dialogRef.afterClosed().subscribe(result => {
    // Handle modal close event if needed
  });
}


}
