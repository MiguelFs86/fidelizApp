import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { StoreService } from '../../services/store.service';
import { AppComponent } from '../../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
// import * as html2canvas from 'html2canvas';

declare let $;
declare let html2canvas: any;

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: [ './user.component.css' ]
})
export class UserComponent implements OnInit {
	constructor(
		public auth: AuthService,
		private userService: UserService,
		private storeService: StoreService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {}

	user: any;
	distributorList: any;
	public imagePath;
	background_imgURL: any;
	backendImgUrl = AppComponent.BACKEND_URL + '/files/user/';
	backendImgEmailUrl = AppComponent.BACKEND_URL + '/files/user/email/';
	logo_imgURL: any;
	email_imgURL: any;
	public message: string;
	showSpinner = false;
	noImage = 'assets/no-image.png';
	oldPassword = '';
	gmailSyncFlag = false;

	showURL = false;
	authURL = '';

	blankEditor = true;
	blankQRrcode = true;
	qrCode = '';
	abc = '';

	section = 0;

	testEmail = '';

	userRoles = [ 'USER_ROLE', 'DISTRIBUTOR_ROLE' ];

	preview(type: any, files: any) {
		if (files.length === 0) {
			return;
		}

		const mimeType = files[0].type;
		if (mimeType.match(/image\/*/) == null) {
			this.message = 'Only images are supported.';
			return;
		}

		const reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files[0]);
		reader.onload = (_event) => {
			if (type === 'logo') {
				this.logo_imgURL = reader.result;
			}

			if (type === 'email') {
				this.email_imgURL = reader.result;
			}
		};
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params) => {
			const id = params.id;
			this.userService.getUserById(id).subscribe((user: any) => {
				if (user.ok) {
					this.user = user.user;
					if (this.user.googleSync) {
						this.gmailSyncFlag = true;
					}
					if (!this.user.emailConfig) {
						this.user.emailConfig = {
							smtp: '',
							port: '',
							emailAccount: '',
							emailPassword: ''
						};
					}
					// this.user.emailConfig = JSON.parse(this.user.emailConfig);
				} else {
					alert('Error');
				}
			});
			this.userService.getDistributorUsers().subscribe((users: any) => {
				this.distributorList = users.users;
			});
		});
	}

	selectLogoImage(event) {
		this.user.logo_img = event.target.files[0];
	}

	selectEmailImage(event) {
		this.user.email_img = event.target.files[0];
	}

	removeLogoImage(type: number) {
		if (type === 0) {
			this.logo_imgURL = null;
			this.user.logo_img = null;
		}
	}

	removeEmailImage(type: number) {
		if (type === 0) {
			this.email_imgURL = null;
			this.user.email_img = null;
		}
	}

	updateUser() {
		if (this.gmailSyncFlag) {
			this.user.googleSync = true;
		} else {
			this.user.googleSync = false;
		}
		this.user.emailConfig = JSON.stringify(this.user.emailConfig);
		this.userService
			.updateUser(this.user)
			.then((response: any) => {
				const success_text = 'Usuario modificado con éxito';
				Swal.fire('Exito', success_text, 'success').then(() => {
					this.router.navigate([ '/users' ]);
				});
			})
			.catch((error: any) => {
				const error_text = 'Ocurrió un problema al modificar el usuario';
				Swal.fire('Error', error_text, 'error').then(() => {
					this.router.navigate([ '/users' ]);
				});
			});
	}

	gmailSync(id: string) {
		this.showSpinner = true;
		this.userService.syncUserGmail(id).subscribe((response: any) => {
			this.showSpinner = false;
			if (response.ok) {
				Swal.fire('Success', `Synced ${response.count} contacts`, 'success');
			} else {
				if (response.message) {
					Swal.fire({
						title: 'Authorize Google account:',
						html: `Please, visit the following URL and copy the code in the box below: <br><br> <a target="_blank" href=${response.message}> Authorize Google Account</a>`,
						icon: 'info',
						input: 'text'
					}).then((resp) => {
						if (resp.value) {
							this.sendAuth(id, resp.value);
						}
					});
				} else {
					Swal.fire('Info', `${response.error}`, 'info');
				}
			}
		});
	}

	sendAuth(id: string, key: string) {
		this.userService.sendURLAuth(id, key).subscribe((response: any) => {
			this.showSpinner = false;
			if (response.ok) {
				Swal.fire('Success', 'Google account successfully synced', 'success');
			} else {
				Swal.fire('Error', response.message, 'error');
			}
		});
	}

	updatePreview(data) {
		if (data) {
			this.blankEditor = false;
			data = data.replace(/<img/g, '<img style="width: auto; max-width: 100%"');
			data = data.replace(/ql-align-center/g, 'text-center');
			data = data.replace(/ql-align-right/g, 'text-right');
			data = data.replace(/ql-align-justify/g, 'text-justify');
			$('#editorPreview').html(data);
		}
	}

	downloadImage() {
		const element = document.getElementById('editorPreview');
		html2canvas(element).then(function(canvas) {
			var a = document.createElement('a');
			// toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
			a.href = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
			a.download = 'promocion.jpg';
			a.click();
		});
	}

	updateQRrcode(text) {
		console.log('launch');
		this.blankQRrcode = false;
		this.qrCode = text;
	}

	downloadQRrcode() {
		const element: any = document.getElementById('qrCodePreview').childNodes[0].childNodes[0];
		let t = '';
		html2canvas(element).then((canvas) => {
			var a = document.createElement('a');
			a.href = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
			a.download = 'qrcode.jpg';
			t = a.href;
			a.click();
		});
	}

	showSection(value) {
		this.section = value;
		console.log(value);
	}

	checkEmail(){
		if (this.testEmail.length < 3){
			return;
		}
		this.userService.checkEmail(this.user._id, this.testEmail).subscribe((response: any) => {
			if (response.ok){
				Swal.fire('Success', 'Mail enviado correctamente', 'success');
			} else {
				Swal.fire('Error', 'Error enviando mail', 'error');
			}
		})
	}
}
