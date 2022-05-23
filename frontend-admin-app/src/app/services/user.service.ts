import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private http: HttpClient, private router: Router) {}

	userID = localStorage.getItem('userID');
	userRole = localStorage.getItem('role');

	selectedUser = {};

	/* Register new user */
	registerUser(userData: any) {
		const logo_file = userData.logo_img;
		const email_file = userData.email_img;
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			for (const key in userData) {
				if (key !== 'logo_img' && key !== 'email_img') {
					formData.append(key, userData[key]);
				}
			}
			if (logo_file) {
				formData.append('logo_image', logo_file, logo_file.name);
			}

			if (email_file && typeof email_file !== 'string') {
				formData.append('email_image', email_file, email_file.name);
			}
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(JSON.parse(xhr.response));
					}
				}
			};
			const url = AppComponent.BACKEND_URL + '/register/user/';
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
			xhr.send(formData);
		});
	}

	/* Update user */
	updateUser(userData: any) {
		const logo_file = userData.logo_img;
		const email_file = userData.email_img;
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			for (const key in userData) {
				if (key !== 'logo_img' && key !== 'email_img') {
					formData.append(key, userData[key]);
				}
			}
			if (logo_file && typeof logo_file !== 'string') {
				formData.append('logo_image', logo_file, logo_file.name);
			}

			if (email_file && typeof email_file !== 'string') {
				formData.append('email_image', email_file, email_file.name);
			}
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(JSON.parse(xhr.response));
					}
				}
			};

			const url = AppComponent.BACKEND_URL + '/update/user';
			xhr.open('PUT', url, true);
			xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
			xhr.send(formData);
		});
	}

	getUserById(id: string) {
		return this.http.get(`${AppComponent.BACKEND_URL}/user/${id}`);
	}

	getUsers() {
		return this.http.get(`${AppComponent.BACKEND_URL}/users`);
	}

	getLogger(date) {
		return this.http.post(`${AppComponent.BACKEND_URL}/logger`, { date: date });
	}

	syncUserGmail(id: string) {
		return this.http.get(`${AppComponent.BACKEND_URL}/user/${id}/gmail_sync`);
	}

	sendURLAuth(id: string, key: string) {
		return this.http.post(`${AppComponent.BACKEND_URL}/user/${id}/gmail_sync/authurl`, { key: key });
	}

	changeAdminPassword(id: string, password: string) {
		return this.http.post(`${AppComponent.BACKEND_URL}/change_admin_password`, { id, password });
	}

	getDistributorUsers() {
		return this.http.get(`${AppComponent.BACKEND_URL}/users/distributors`);
	}

	checkEmail(id, email){
		return this.http.post(`${AppComponent.BACKEND_URL}/test/mail`, { id, email });
	}
}
