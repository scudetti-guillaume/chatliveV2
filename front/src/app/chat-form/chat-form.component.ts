import { Component, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit, OnDestroy {
  private socket!: Socket;

  constructor(private socketService: Socket) {}

  ngOnInit(): void {
    // Connectez-vous au serveur Socket.io
    this.socket = this.socketService;

    // Écoutez les événements
    this.socket.on('chat-message-resend', (message: string) => {
      console.log('Message reçu : ' + message);

      // Traitez le message reçu, par exemple, en l'ajoutant à votre liste de messages
      this.messages.push({ text: message, type: 'incoming' });
    });
  }

  ngOnDestroy(): void {
    // Vous n'avez pas besoin de déconnecter manuellement avec ngx-socket-io
  }

  messages: { text: string; type: 'incoming' | 'outgoing' }[] = [];
  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }
    this.socket.emit('chat-message-send', this.newMessage);

    // Ajoutez le message à la liste des messages sortants
    this.messages.push({ text: this.newMessage, type: 'outgoing' });

    this.newMessage = '';
  }
}
