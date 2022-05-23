import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';
import { FilterUsersPipe } from '../../pipes/filter-users.pipe';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: [ './users.component.css' ],
	providers: [ FilterUsersPipe ]
})
export class UsersComponent implements OnInit {
	constructor(
		public userService: UserService,
		public filterUsersPipe: FilterUsersPipe,
		private router: Router,
		private translate: TranslateService,
		public auth: AuthService
	) {}

	users: any[];
	userList: any[];
	logo_imgURL: any;
	email_imgURL: any;
	uploaded_URL: any;
	imagePath = AppComponent.BACKEND_URL + '/files/user/';
	imageEmailPath = AppComponent.BACKEND_URL + '/files/user/email/';
	noImage = './assets/no-image.jpg';
	searchText = '';
	usersListFiltered: any[];
	selectedTab;
	message: any;
	userRoles = [ 'USER_ROLE', 'DISTRIBUTOR_ROLE' ];
	distributorList: any;
	gmailSyncFlag = false;

	testEmail = '';

	user: any = {
		username: '',
		password: '',
		name: '',
		email: '',
		logo_img: '',
		email_img: '',
		role: '',
		address: '',
		twitter: '',
		facebook: '',
		instagram: '',
		youtube: '',
		email_text: '',
		emailConfig: {
			smtp: '',
			port: '',
			emailAccount: '',
			emailPassword: ''
		}
	};

	showSpinner = false;

	ngOnInit() {
		this.clearUser();
		this.getUsers();
		this.userService.getDistributorUsers().subscribe((users: any) => {
			this.distributorList = users.users;
		});
	}

	clearUser() {
		this.user = {
			username: '',
			password: '',
			name: '',
			email: '',
			logo_img: '',
			email_img: '',
			role: '',
			address: '',
			twitter: '',
			facebook: '',
			instagram: '',
			website: '',
			youtube: '',
			emailConfig: {
				smtp: '',
				port: '',
				emailAccount: '',
				emailPassword: ''
			}
		};
	}

	getUsers() {
		this.userService.getUsers().subscribe((response: any) => {
			this.users = response.users;
			this.userList = response.users;
		});
	}

	searchUsers(text?: string) {
		/* Search filter */
		if (text !== '' && text !== undefined && text !== null) {
			this.userList = this.users;
			this.searchText = text;
			this.usersListFiltered = this.filterUsersPipe.transform(this.userList, this.searchText);
			this.userList = this.usersListFiltered;
		} else {
			this.searchText = '';
			this.userList = this.users;
		}
		if (!this.usersListFiltered) {
			return;
		}
	}

	userDetail(id: string) {
		this.router.navigate([ '/user/', id ]);
	}

	userStores(user: any) {
		// localStorage.setItem('selectedUserID', user._id);
		this.router.navigate([ '/stores/', user._id ]);
	}

	registerUser() {
		this.user.emailConfig = JSON.stringify(this.user.emailConfig);
		this.showSpinner = true;
		this.userService
			.registerUser(this.user)
			.then((response: any) => {
				this.showSpinner = false;
				const success_text = this.translate.instant('SUCCESS.REGISTER_USER');
				Swal.fire('Exito', success_text, 'success').then(() => {
					this.ngOnInit();
					this.selectedTab = 0;
				});
			})
			.catch((error) => {
				this.showSpinner = false;
				const success_text = this.translate.instant(`ERRORS.ERROR_TYPE_${error.type}`);
				Swal.fire('Error', success_text, 'error');
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
		this.uploaded_URL = files;
		reader.readAsDataURL(files[0]);
		reader.onload = (_event) => {
			if (type === 'email') {
				this.email_imgURL = reader.result;
			}
			if (type === 'logo') {
				this.logo_imgURL = reader.result;
			}
		};
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
