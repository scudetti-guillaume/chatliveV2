import { Component, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';

interface ChatMessage {
  text: string;
  pseudo: string;
  id: string;
  date: Date; 
}

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})


export class ChatFormComponent implements OnInit, OnDestroy {
  private socket!: Socket;
  private pseudo: string | null = localStorage.getItem('pseudo'); // Get pseudonym from local storage
  private userId: string | null = localStorage.getItem('id'); 


  constructor(private socketService: Socket) {}

  ngOnInit(): void {
    // Connectez-vous au serveur Socket.io
    this.socket = this.socketService;

    // Écoutez les événements
    this.socket.on('chat-message-resend', (message:ChatMessage) => {
      
      console.log('Message reçu : ' + message.text);
      // Traitez le message reçu, par exemple, en l'ajoutant à votre liste de messages
      this.messages.push({ text : message.text , type: 'incoming' });
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
    const messageData = {
    text: this.newMessage,
    pseudo: this.pseudo, // Assuming you have a 'pseudo' property in your component
    id: this.userId, // Assuming you have a 'userId' property in your component
    timestamp: new Date().toISOString() // Current timestamp
  };
    this.socket.emit('chat-message-send', (messageData));
        console.log('Received message:', messageData);
    // Ajoutez le message à la liste des messages sortants
    this.messages.push({ text: this.newMessage, type: 'outgoing' });

    this.newMessage = '';
  }
}
