import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { LoginService } from '../components/login/login.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(
      private loginService: LoginService, 
      private session: SessionStorageService,
      private  router: Router) {}

  canActivate(): boolean {
    if (this.session.get("logged") === true) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}