import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(_rout: ActivatedRouteSnapshot, _router: RouterStateSnapshot): boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | UrlTree {

    return this.authService
      .user
      .pipe(
        take(1),
        map(user => {
          const isAuth = Object.keys(user).length !== 0
          if (isAuth) {
            return true
          }
          return this.router.createUrlTree(['/auth'])
        }))
  }
}
