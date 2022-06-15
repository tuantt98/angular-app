import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface iAuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) { }

  private URL_SIGNUP: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCrB_jgiBmLkO1Wf9c67Hiu6tW962Xv_-c'

  signUp(email: string, password: string) {
    return this.http
      .post<iAuthResponse>(this.URL_SIGNUP, {
        email,
        password,
        returnSecureToken: true
      })
  }
}
