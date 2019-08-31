import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: import("@angular/common/http").HttpRequest<any>,
    next: import("@angular/common/http").HttpHandler)
    : import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {

    return this.authService.userSubject.pipe(
      take(1),
      exhaustMap(user => {

        if (!user) {
          return next.handle(req);
        }
        const modifReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifReq);

      }))
  }

  constructor(private authService: AuthService) { }
}
