import { Component, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToasterService } from '../toaster.service'

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
  pseudo = localStorage.getItem('pseudo');
  email = localStorage.getItem('email');
  userId = localStorage.getItem('id');
  token = localStorage.getItem('token');



  constructor(private socketService: Socket, private toaster: ToasterService,) {}

  ngOnInit(): void {
    // Connectez-vous au serveur Socket.io
    this.socket = this.socketService;

    // Écoutez les événements
    this.socket.on('chat-message-resend', (message:ChatMessage) => {
      console.log('Message reçu : ' + message.pseudo);
      if(message.id === undefined && message.pseudo === undefined){
        this.toaster.showError("", 'Veuillez vous identifier pour envoyer un message')
      }
      if(message.id === this.userId){
      this.messages.push({ pseudo : message.pseudo, text : message.text , type: 'outgoing' });
      }else{
      this.messages.push({  pseudo : message.pseudo,text : message.text , type: 'incoming' });
      }
    });
  }

  ngOnDestroy(): void {
    // Vous n'avez pas besoin de déconnecter manuellement avec ngx-socket-io
  }

  messages: { pseudo: string, text: string; type: 'incoming' | 'outgoing' }[] = [];
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
  if(messageData.id === null && messageData.pseudo === null){
       this.toaster.showError("", 'Veuillez vous identifier pour envoyer un message')
      }else{
    this.socket.emit('chat-message-send', (messageData));
    console.log('Received message:', messageData);
    this.newMessage = '';
    }
  }
}
