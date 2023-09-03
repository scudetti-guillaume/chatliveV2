// toast.service.ts
import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {

  constructor(private toastr: ToastrService) {}

    showSuccess(message: string, title: string) {
    const successOptions: any = {
      timeOut: 3000, 
      progressBar: true, 
      positionClass: 'toast-position', 
      extendedTimeOut:3000, 
      toastClass: 'toast-success',
      titleClass: 'toast-title-success',
      messageClass: 'toast-message-success',
      progressBarClass: 'toast-progress-bar-success',
      componentProps: {
        title: 'Succès',
        message: message,
        isSuccess: true, // Indiquer que c'est un toast de succès
      },
    };

    this.toastr.success(title, message, successOptions);
  }

   showError(message: string, title: string) {
    const errorOptions: any = {
      timeOut: 3000, // Durée d'affichage du toast en millisecondes
      progressBar: true, // Afficher la barre de progression
      positionClass: 'toast-position',
      toastClass: 'toast-error',
      progressBarClass: 'toast-progress-bar-error',
      titleClass: 'your-custom-title-class', // Classe CSS personnalisée pour le titre du toast
      messageClass: 'toast-message-error',// Position au milieu en haut
      extendedTimeOut:3000, // Durée supplémentaire pour la barre de progression
      componentProps: {
        title: 'Échec',
        message: message,
        isSuccess: false, // Indiquer que c'est un toast d'erreur
      },
    };

    this.toastr.error(title, '', errorOptions);
  }
}