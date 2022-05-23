import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	currentUser = {};
	constructor(private http: HttpClient, private router: Router) {}

	login(credentials) {
		return this.http.post(AppComponent.BACKEND_URL + '/login/user', { credentials }).pipe(
			map((res: any) => {
				const data = res;
				this.currentUser = res;
				localStorage.setItem('token', data.token);
				localStorage.setItem('user', data.user.name);
				localStorage.setItem('userID', data.user._id);
				localStorage.setItem('role', data.user.role);
				return true;
			})
		);
	}

	logout() {
		// localStorage.clear();
		this.router.navigate([ '/login' ]);
	}

	getToken() {
		return localStorage.getItem('token') || null;
	}

	isAuthenticated(): boolean {
		const token = localStorage.getItem('token');

		if (token) {
			return true;
		} else {
			return false;
		}
	}

	isAdmin(): boolean {
		return localStorage.getItem('role') === 'ADMIN_ROLE';
	}
}
