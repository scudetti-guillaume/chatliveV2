import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToasterService } from '../toaster.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { FileUploadService } from '../upload-file.service';

interface ChatMessage {
  text: string;
  pseudo: string;
  userId: string;
  date: string;
  pictureUser: string;
}

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  private socket!: Socket;
  pseudo = localStorage.getItem('pseudo');
  email = localStorage.getItem('email');
  userId = localStorage.getItem('id');
  token = localStorage.getItem('token');
  pictureUser = localStorage.getItem('picture');
  messages: { pictureUser: string, userId: string, date: string, pseudo: string, text: string; type: 'incoming' | 'outgoing' }[] = [];
  newMessage: string = '';
  displayStyle = "none";
  displayStyleUser = "none";
  userProfileData: any = {};
  selectedFile: File | null = null;
  users: any = [];


  constructor(private socketService: Socket, private toaster: ToasterService, private datePipe: DatePipe, private fileUploadService: FileUploadService) { }


  openPopup(id: string) {
    this.userProfileData = { userId: id, pseudo: this.pseudo, picture: this.pictureUser };
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (allowedExtensions.includes('.' + fileExtension)) {
      this.selectedFile = file;
      // console.log(file);

    } else {
      this.toaster.showError('', "les formats acceptés sont : '.jpg', '.jpeg', '.png', '.gif'");
      console.error('Extension de fichier non autorisée');
    }
  }


  updateProfile() {
    if (this.selectedFile && this.userId) {
      this.fileUploadService.uploadFile(this.selectedFile, this.userId).then((response) => {
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
        this.closePopup()
        this.updateProfilPicture()
        this.socket.emit('get-all-messages')
      });
    }
  }

  updateProfilPicture() {
    this.socket.emit('get-user', this.userId,);
    this.socket.on('user', (user: any) => {
      localStorage.setItem('picture', user.user.pictureUser);
      this.pictureUser = localStorage.getItem('picture');
    })
  }

  formatDate(dateString: string): string {
    const messageDate = new Date(dateString);
    const currentDate = new Date();

    if (this.isToday(messageDate, currentDate)) {
      return `Aujourd'hui à ${this.datePipe.transform(messageDate, 'HH:mm:ss')}`;
    } else if (this.isYesterday(messageDate, currentDate)) {
      return `Hier à ${this.datePipe.transform(messageDate, 'HH:mm:ss')}`;
    } else {
      return `Le ${this.datePipe.transform(messageDate, 'dd MMM yyyy HH:mm:ss')} || '';`
    }
  }

  isToday(messageDate: Date, currentDate: Date): boolean {
    return (
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getFullYear() === currentDate.getFullYear()
    );
  }

  isYesterday(messageDate: Date, currentDate: Date): boolean {
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    return (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnInit(): void {
    this.socket = this.socketService;

    this.socket.on('chat-message-resend', (message: ChatMessage) => {
      if (message.userId === undefined && message.pseudo === undefined) {
        this.toaster.showError('', 'Veuillez vous identifier pour envoyer un message');
      }
      if (message.userId === this.userId) {
        this.messages.push({ pictureUser: message.pictureUser, userId: message.userId, date: this.formatDate(message.date), pseudo: message.pseudo, text: message.text, type: 'outgoing' });
      } else {
        this.messages.push({ pictureUser: message.pictureUser, userId: message.userId, date: this.formatDate(message.date), pseudo: message.pseudo, text: message.text, type: 'incoming' });
      }
    });
    this.socket.emit('get-all-message');
    this.socket.on('chat-message-resend-all', (messageAll: any) => {
      this.messages = [];
      messageAll.messagesArray.forEach((message: {
        pictureUser: string, userId: string, date: string; pseudo: any; text: any;
      }) => {

        if (message.userId === this.userId) {
          this.messages.push({ pictureUser: message.pictureUser, userId: message.userId, date: this.formatDate(message.date), pseudo: message.pseudo, text: message.text, type: 'outgoing' });
        } else {
          this.messages.push({ pictureUser: message.pictureUser, userId: message.userId, date: this.formatDate(message.date), pseudo: message.pseudo, text: message.text, type: 'incoming' });
        }
      });
    });
    // this.socket.emit('get-all-user')
    // this.socket.on('All-user', (users: any) => {
    // this.users = [];
    // users.userArray.forEach((user: { _id: string; pseudo: string; pictureUser: string; email: string}) => {
    //     this.users.push(user);
    // })
    // });





  }

  ngOnDestroy(): void { }



  sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }
    const messageData: ChatMessage = {
      text: this.newMessage,
      pseudo: this.pseudo || '',
      userId: this.userId || '',
      date: this.datePipe.transform(new Date(), 'dd MMM yyyy HH:mm:ss') || '',
      pictureUser: this.pictureUser || '',
    };
    if (messageData.userId === '' && messageData.pseudo === '') {
      this.toaster.showError('', 'Veuillez vous identifier pour envoyer un message');
    } else {
      this.socket.emit('chat-message-send', messageData);
      // this.socket.emit('get-all-message')
      this.newMessage = '';
    }
  }
}