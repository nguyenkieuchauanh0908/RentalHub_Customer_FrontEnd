import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { handleError } from '../shared/handle-errors';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  //0: Đang đăng, 1: Khóa (do chủ bài đăng), 2: Bị report (đã được duyệt)
  constructor(private http: HttpClient) {}

  getSocialPosts(page: number, limit: number, status: number | null) {
    let queryParams = new HttpParams()
      .append('limit', limit)
      .append('page', page);
    if (status !== null) {
      queryParams = queryParams.append('status', status);
    }
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'social', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Get social posts successfully!');
          }
        })
      );
  }

  createSocialPost(form: any, image: File) {
    console.log(form);
    const headers = new HttpHeaders().set(
      'content-type',
      'multipart/form-data'
    );
    let body = new FormData();
    body.append('_title', form.titleInputControl);
    body.append('_content', form.contentInputControl);
    body.append('_image', image);
    return this.http
      .post<resDataDTO>(
        environment.baseUrl + 'social/create-social-post',
        body,
        {
          headers: headers,
        }
      )
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Create social post successfully...!');
          }
        })
      );
  }
}
