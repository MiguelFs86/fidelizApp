import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
	constructor(public auth: AuthService, private router: Router) {}

	ngOnInit() {}

	goToUsers() {
		this.router.navigate([ '/users' ]);
	}

	goToStores() {
		this.router.navigate([ '/stores' ]);
	}

	goToLog() {
		this.router.navigate([ '/log' ]);
	}

	goToProfile() {
		this.router.navigate([ '/profile' ]);
	}

	goToSettings() {
		this.router.navigate([ '/settings' ]);
	}

	logout() {
		this.auth.logout();
	}
}
