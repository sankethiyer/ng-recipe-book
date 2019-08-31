import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from '../auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  isLoginMode = false;
  isLoading = false;
  error: string = null;
  closeSub: Subscription;
  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onAuthFormSubmit(form: NgForm) {
    this.isLoading = true;
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    var email = form.value.email;
    var password = form.value.password;
    let authObs = new Observable<AuthResponseData>();

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(email, password)
    }

    authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes'])
      },
      (errData) => {
        this.error = errData
        this.onShowError(errData);
        this.isLoading = false;
      }
    );

    form.reset();

  }

  onAlertClose() {
    this.error = null
  }

  onShowError(errorData: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = errorData;
    this.closeSub = componentRef.instance.close
      .subscribe(() => {
        this.closeSub.unsubscribe()
        hostViewContainerRef.clear()
      });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
  }
}
