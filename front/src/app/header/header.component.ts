import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    width: '400px', 
    data: {} 
  });

  dialogRef.afterClosed().subscribe(result => {});
}

logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('pseudo');
  localStorage.removeItem('email');
  window.location.reload();
  }

}
