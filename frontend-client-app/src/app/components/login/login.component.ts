import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SocketService } from '../../services/socket.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
	constructor(
		private auth: AuthService,
		private router: Router,
		private translate: TranslateService,
		private socket: SocketService
	) {}

	username = '';
	password = '';
	credentials: Object;
	showSpinner: boolean;
	elem;

	ngOnInit() {
		this.elem = document.documentElement;
		setTimeout(() => {
			// this.fullScreen();
		}, 350);
	}

	login(): void {
		this.showSpinner = true;
		this.credentials = { username: this.username, password: this.password };
		this.auth.login(this.credentials).subscribe(
			(res: any) => {
				if (res.ok) {
					this.showSpinner = false;
					// this.fullScreen();
					this.router.navigate([ '/slider' ]);
				} else {
					Swal.fire('Login incorrecto', res.error, 'error');
				}
			},
			(error) => {
				Swal.fire('Login incorrecto', error, 'error');
				this.showSpinner = false;
			}
		);
	}

	logout() {
		// this.auth.logout().subscribe(() => {});
		const notification = 'Hey hey';
		alert('Push received: ' + JSON.stringify(notification));
	}

	fullScreen() {
		if (this.elem.requestFullscreen) {
			this.elem.requestFullscreen();
		} else if (this.elem.mozRequestFullScreen) {
			/* Firefox */
			this.elem.mozRequestFullScreen();
		} else if (this.elem.webkitRequestFullscreen) {
			/* Chrome, Safari and Opera */
			this.elem.webkitRequestFullscreen();
		} else if (this.elem.msRequestFullscreen) {
			/* IE/Edge */
			this.elem.msRequestFullscreen();
		}
	}
}
