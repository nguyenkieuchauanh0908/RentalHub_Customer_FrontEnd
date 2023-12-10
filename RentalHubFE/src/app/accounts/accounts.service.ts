import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  // currentUser: any;
  currentUserId = new Subject<string>();
  private currentUser = new BehaviorSubject<User | null>(null);
  constructor(
    private http: HttpClient // private authService: AuthService
  ) {}

  getCurrentUser = this.currentUser.asObservable();
  setCurrentUser(updatedUser: User | null) {
    this.currentUser.next(updatedUser);
  }

  getCurrentUserId(route: ActivatedRoute): string | null {
    console.log('on getting current userId ...');
    // route.params.subscribe((params) => {
    //   let uId = params['uId'];
    //   // console.log('current uId: ', uId);
    //   this.currentUserId.next(uId);
    // });
    let uId: string | null | undefined = null;
    this.getCurrentUser.subscribe((user) => {
      uId = user?._id;
    });
    console.log('current uId: ', uId);
    return uId;
  }

  getProfile(uId: string) {
    console.log('current uId: ', uId);
    let profile: User | null = null;
    this.getCurrentUser.subscribe((user) => {
      profile = user;
    });
    return profile;
    // const queryParams = { uId: uId };
    // return this.http.get<resDataDTO>(
    //   environment.baseUrl + 'users/get-profile',
    //   {
    //     params: queryParams,
    //   }
    // );
  }

  updateProfile(updatedProfile: any) {
    console.log('on calling update profile api...', updatedProfile);
    let updatedtUser: User;
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'users/update-profile', {
        _fname: updatedProfile._fname,
        _lname: updatedProfile._lname,
        _dob: updatedProfile._dob,
        _address: '',
        _phone: updatedProfile._phone,
        _email: updatedProfile._email,
      })
      .pipe(
        tap((res) => {
          this.getCurrentUser.subscribe((currentUser) => {
            if (currentUser) {
              currentUser._avatar = res.data._avatar;
              updatedtUser = currentUser;
            }
          });
          this.setCurrentUser(updatedtUser);
        })
      );
  }

  updateAvatar(avatar: File) {
    console.log('Your updated avatar type: ', avatar);
    let body = new FormData();
    body.append('_avatar', avatar);
    const headers = new HttpHeaders().set(
      'content-type',
      'multipart/form-data'
    );
    let updatedtUser: User;
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'users/update-avatar', body, {
        headers: headers,
      })
      .pipe(
        tap((res) => {
          this.getCurrentUser.subscribe((currentUser) => {
            if (currentUser) {
              currentUser._avatar = res.data._avatar;
              updatedtUser = currentUser;
            }
          });
          this.setCurrentUser(updatedtUser);
        })
      );
  }

  verifyAccount(phone: string) {
    console.log('your phone is: ', phone);
    console.log('sending otp to mail ...');
    return this.http.post<resDataDTO>(
      environment.baseUrl + 'users/accounts/active-host',
      {
        _phone: phone,
      }
    );
  }

  confirmOtp(otp: string) {
    console.log('On verify otp...', otp);
    return this.http.post<resDataDTO>(
      environment.baseUrl + 'users/accounts/verify-host',
      {
        otp: otp,
      }
    );
    //Xử lý otp hết hạn hoặc yêu cầu gửi lại otp
  }

  resetOtp() {
    return this.http.post<resDataDTO>(
      environment.baseUrl + 'users/accounts/reset-otp',
      {}
    );
  }
}
