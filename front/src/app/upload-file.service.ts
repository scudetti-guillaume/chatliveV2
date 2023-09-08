import { Injectable } from '@angular/core';
import axios from 'axios';

const jwtToken = localStorage.getItem('token');
const userId = localStorage.getItem('id');

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor() { }

  async uploadFile(file: File,user:string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user);
    try {
      const response = await axios
        .post('backend/chatsocV2/upload', formData , {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

      return response.data;
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier :', error);
      throw error;
    }
  }
}