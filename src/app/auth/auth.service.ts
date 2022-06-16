import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";

import { User } from "./user.model";

export interface iAuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {

  private TOKEN = 'AIzaSyCrB_jgiBmLkO1Wf9c67Hiu6tW962Xv_-c'
  private URL_FIREBASE = 'https://identitytoolkit.googleapis.com'
  private URL = {
    SIGNUP: `${this.URL_FIREBASE}/v1/accounts:signUp?key=${this.TOKEN}`,
    SIGNIN: `${this.URL_FIREBASE}/v1/accounts:signInWithPassword?key=${this.TOKEN}`
  }
  private tokenExpirationTimer: any;

  user = new BehaviorSubject<User>({} as User);

  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.http
      .post<iAuthResponse>(this.URL.SIGNUP, {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          const { email, localId, idToken, expiresIn } = resData;
          this.handleAuthentication(email, localId, idToken, +expiresIn);
        })
      )
  }

  login(email: string, password: string) {
    return this.http
      .post<iAuthResponse>(this.URL.SIGNIN, {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          const { email, localId, idToken, expiresIn } = resData;
          this.handleAuthentication(email, localId, idToken, +expiresIn);
        })
      )
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData') || JSON.stringify({}));
    if (!userData) {
      return;
    }
    const { email, id, _token, _tokenExpirationDate } = userData;
    const loadedUser = new User(email, id, _token, new Date(_tokenExpirationDate));
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(_tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next({} as User);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: any) {
    console.log(errorRes);
    let errMsg = 'An unknown error occurred';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errMsg);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errMsg = 'Email already exists';
        break;
      case 'INVALID_PASSWORD':
      case 'EMAIL_NOT_FOUND':
      case 'USER_DISABLED':
        errMsg = 'Invalid credentials';
    }

    return throwError(errMsg);
  }
}
