
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor( private authService: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if( this.authService.isAuth()) {
            return true;
        } else {
            return this.router.navigate(['/']);
        }


    // constructor(authService, router) {
    //     this.authService = authService;
    //     this.router = router;
    // }
    // canActivate(route, router) {
    //     if (this.authService.isAuth()) {
    //         return true;
    //     }
    //     else {
    //         this.router.navigate(['/login']);
    //     }
    }
}