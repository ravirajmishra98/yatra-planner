import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UnsplashService {
  private readonly accessKey = 'vUI3fq4l4ud-aQTA2iwxPiy90DT8PhBEHkfB_XMAVZw';
  private readonly apiUrl = 'https://api.unsplash.com/search/photos';

  constructor(private http: HttpClient) {}

  searchImages(query: string, perPage: number = 1): Observable<any> {
    return this.http.get(this.apiUrl, {
      params: {
        query,
        client_id: this.accessKey,
        per_page: perPage.toString(),
        orientation: 'landscape'
      }
    });
  }
}
