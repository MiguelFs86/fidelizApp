import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
	constructor(private auth: AuthService, private router: Router, private translate: TranslateService) {}

	username = '';
	password = '';
	credentials: Object;
	showSpinner: boolean;

	ngOnInit(): void {
		localStorage.clear();
	}

	login(): void {
		this.showSpinner = true;
		this.credentials = { username: this.username, password: this.password };
		this.auth.login(this.credentials).subscribe(
			(res) => {
				if (res) {
					this.showSpinner = false;
					this.router.navigate([ '/home' ]);
				}
			},
			(error) => {
				const error_text = this.translate.instant(`ERRORS.ERROR_TYPE_${error.error.type}`);
				Swal.fire('Error', error_text, 'error').then(() => {
					this.showSpinner = false;
				});
			}
		);
	}
}
