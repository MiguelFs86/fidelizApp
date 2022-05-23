import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private http: HttpClient, private router: Router) {}

	storeID = sessionStorage.getItem('userID');

	/* Register client */
	registerClient(clientData: any) {
		const signature_file = clientData.signature;
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			for (var key in clientData) {
				if (key !== 'signature') {
					formData.append(key, clientData[key]);
				}
			}
			if (signature_file) {
				formData.append('signature', signature_file, signature_file.name);
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
			const url = AppComponent.BACKEND_URL + '/register/client/';
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'));
			xhr.send(formData);
		});
	}

	test(clientData: any) {
		const signature_file = clientData.signature;
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			for (var key in clientData) {
				if (key !== 'signature') {
					formData.append(key, clientData[key]);
				}
			}
			if (signature_file) {
				formData.append('signature', signature_file, signature_file.name);
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
			const url = AppComponent.BACKEND_URL + '/register/test/';
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'));
			xhr.send(formData);
		});
	}
}
