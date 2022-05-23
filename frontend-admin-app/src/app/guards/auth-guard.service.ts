import { Injectable } from '@angular/core';

import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
	constructor(private auth: AuthService, private router: Router) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.auth.isAuthenticated()) {
			return true;
		} else {
			// localStorage.clear();
			this.router.navigate([ '/login' ]);
			return false;
		}
	}
}
