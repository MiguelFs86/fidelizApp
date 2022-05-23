import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: [ './navbar.component.css' ]
})
export class NavbarComponent implements OnInit {
	activeLang = 'es';

	constructor(
		public auth: AuthService,
		public router: Router,
		private translate: TranslateService,
		public location: Location
	) {
		this.translate.setDefaultLang(this.activeLang);
	}

	ngOnInit() {}

	changeLanguage(lang: string) {
		this.activeLang = lang;
		this.translate.use(lang);
	}

	registerUser() {
		this.router.navigate([ '/register' ]);
	}

	userProfile() {
		this.router.navigate([ '/profile' ]);
	}

	users() {
		this.router.navigate([ '/users' ]);
	}

	stores() {
		this.router.navigate([ '/stores' ]);
	}

	home() {
		this.router.navigate([ '/home' ]);
	}

	login() {
		this.router.navigate([ '/login' ]);
	}

	logout() {
		this.auth.logout();
	}
}
