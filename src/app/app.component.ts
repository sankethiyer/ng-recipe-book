import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.authService.autoLogin()
    }
    console.log("in appcomponent ts...");
    
  }

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId
  ) { }

}
