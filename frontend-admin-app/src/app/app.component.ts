import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent {
	title = 'frontend-admin-app';
	static BACKEND_URL = 'http://backend.fidelizapp.serantes.pro';
	static SOCKET_URL = 'http://backend.fidelizapp.serantes.pro';
	// static BACKEND_URL = 'http://localhost:3000';
	// static SOCKET_URL = 'http://localhost:3000';
}
