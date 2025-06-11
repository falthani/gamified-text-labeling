import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.scss'],
})
export class ImageGeneratorComponent {
  inputText: string = '';
  imageUrl: string = '';
  isLoading: boolean = false;

  apiUrl = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';


  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { 
 }
  
  generateImage() {
    if (!this.inputText) return;

    this.isLoading = true;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer REDACTED_API_KEY' // Replace with your actual API key
    };

    const requestBody = {
      inputs: this.inputText
    };

    this.http.post(this.apiUrl, requestBody, { headers, responseType: 'blob' })
      .subscribe((blob: Blob) => {
        this.imageUrl = URL.createObjectURL(blob);
        this.isLoading = false;
      });
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
}

}





