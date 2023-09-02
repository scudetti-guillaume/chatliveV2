import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatFormComponent } from './chat-form/chat-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private socket: Socket) {}
}
