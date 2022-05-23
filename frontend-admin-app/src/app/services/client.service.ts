import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ClientService {
	constructor(private http: HttpClient, private router: Router) {}

	getClientById(id: string) {
		return this.http.get(`${AppComponent.BACKEND_URL}/client/${id}`);
	}

	getClients(storeID: string) {
		return this.http.get(
			`${AppComponent.BACKEND_URL}/clients?store_id=${storeID}`
		);
	}
}
