import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './auth/user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  "idToken": string,
  "email": string,
  "refreshToken": string,
  "expiresIn": number,
  "localId": string,
  "registered"?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  expirationTimer: any;
  userSubject = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseKey,
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(
        catchError(this.handleError),
        tap(responseData => {
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            responseData.expiresIn)
        })
      )
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseKey,
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(
        catchError(this.handleError),
        tap(responseData => {
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            responseData.expiresIn)
        })
      )
  }

  logout() {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (!this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);
    
    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _expirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._expirationDate));

    if (loadedUser.token) {
      this.userSubject.next(loadedUser);
      const expirationDuration =  new Date(userData._expirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration)
    }

  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiresIn: number) {

    const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
    const userObj = new User(email, id, token, expirationDate)
    console.log(userObj);
    this.userSubject.next(userObj);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(userObj));
  }

  private handleError(errData: HttpErrorResponse) {
    console.log(errData);
    let errorMsg = 'An unknow error occured';
    if (errData.error && errData.error.error) {
      switch (errData.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMsg = 'email already exists!'
          break;
        case 'EMAIL_NOT_FOUND':
          errorMsg = 'EMAIL_NOT_FOUND  exists!'
          break;
        case 'INVALID_PASSWORD':
          errorMsg = 'INVALID_PASSWORD  exists!'
          break;
      }
    }

    return throwError(errorMsg);
  }
}
