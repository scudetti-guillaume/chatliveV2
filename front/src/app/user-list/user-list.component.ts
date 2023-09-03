import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  userOnline: any[] = [];
  userOffline: any[] = [];

  constructor(private socket: Socket) { }

  ngOnInit(): void {
    this.socket.on('All-user', (data: any[string]) => {
      this.userOffline = [];
      this.userOnline = [];
      data.userArray.forEach((user: { login: boolean; }) => {
        console.log(user);
        this.users = data.userArray;
        if (user.login === true) {
          this.userOnline.push(user);
        } else {
          this.userOffline.push(user);
        }
      })
    });
  }
}
