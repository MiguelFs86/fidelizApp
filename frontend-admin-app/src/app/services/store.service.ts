import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class StoreService {
	constructor(private http: HttpClient, private router: Router) {}

	userID = localStorage.getItem('userID');

	selectedUser = {};
	/* Register client */
	registerClient(userData: any) {
		const signature_file = userData.signature;
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			for (const key in userData) {
				if (key !== 'signature') {
					formData.append(key, userData[key]);
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
			xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
			xhr.send(formData);
		});
	}

	/* Register new store */
	registerStore(storeData: any) {
		const bg_files = storeData.background_img;
		const logo_file = storeData.logo_img;
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			for (const key in storeData) {
				if (key !== 'background_img' && key !== 'logo_img') {
					formData.append(key, storeData[key]);
				}
			}
			for (let i = 0; i < bg_files.length; i++) {
				if (bg_files[i] && typeof bg_files[i] !== 'string') {
					formData.append(`background_img_${i + 1}`, bg_files[i], bg_files[i].name);
				}
			}
			if (logo_file && typeof logo_file !== 'string') {
				formData.append('logo_image', logo_file, logo_file.name);
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
			const url = AppComponent.BACKEND_URL + '/register/store/';
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
			xhr.send(formData);
		});
	}

	/* Update store */
	updateStore(storeData: any, storeID: string) {
		const bg_files = storeData.background_img;
		const logo_file = storeData.logo_img;
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			for (const key in storeData) {
				if (key !== 'background_img' && key !== 'logo_img') {
					formData.append(key, storeData[key]);
				}
			}

			for (let i = 0; i < bg_files.length; i++) {
				if (bg_files[i] && typeof bg_files[i] !== 'string') {
					formData.append(`background_img_${i + 1}`, bg_files[i], bg_files[i].name);
				}
			}

			if (logo_file && typeof logo_file !== 'string') {
				formData.append('logo_image', logo_file, logo_file.name);
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
			const url = AppComponent.BACKEND_URL + '/update/store/' + storeID;
			xhr.open('PUT', url, true);
			xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
			xhr.send(formData);
		});
	}

	getStoreById(id: string) {
		return this.http.get(`${AppComponent.BACKEND_URL}/store/${id}`);
	}

	getUserStores(userID: string) {
		return this.http.get(`${AppComponent.BACKEND_URL}/stores?user_id=${userID}`);
	}

	getStores() {
		return this.http.get(`${AppComponent.BACKEND_URL}/stores`);
	}

	checkStoreConnection(data: any, type: string) {
		return this.http.post(`${AppComponent.BACKEND_URL}/store/check_connection/${type}`, {
			data
		});
	}

	getStoreConnections(id: string) {
		return this.http.get(`${AppComponent.BACKEND_URL}/store/${id}/connections`);
	}
}
