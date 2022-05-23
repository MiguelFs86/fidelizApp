import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
// import { FilterUsersPipe } from '../../pipes/filter-users.pipe';
import { AppComponent } from '../../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

class ImageSnippet {
	pending: boolean = false;
	status: string = 'init';

	constructor(public src: string, public file: File) {}
}

@Component({
	selector: 'app-stores',
	templateUrl: './stores.component.html',
	styleUrls: [ './stores.component.css' ]
})
export class StoresComponent implements OnInit {
	newStore: any = {
		username: '',
		password: '',
		name: '',
		email: '',
		database_url: '',
		database_name: '',
		database_port: '',
		database_username: '',
		database_password: '',
		background_img: [],
		logo_img: '',
		store_type: '',
		commerce_password: '',
		user: '',
		selected_free_fields: '',
		gpdr_text: ''
	};

	userList: any[];
	storeList: any[];
	stores: any[];

	imagePath = AppComponent.BACKEND_URL + '/files/store/logo/';
	BGimagePath = AppComponent.BACKEND_URL + '/files/store/background/';
	noImage = './assets/no-image.jpg';
	searchText = '';
	storesListFiltered: any[];
	selectedTab;
	showSpinner = false;
	currentUser = null;
	background_imgURL: any;
	logo_imgURL: any;
	message: any;
	commerce_password: boolean = false;
	storeTypes = [ 'FrontRetail/Manager', 'Manager', 'FrontRetail', 'FrontRest/Manager', 'FrontRest', 'Agora' ];
	selectedFiles: ImageSnippet[] = [];
	freeFields = [];
	connectionError = null;

	constructor(
		public auth: AuthService,
		private storeService: StoreService,
		private userService: UserService,
		// public filterUsersPipe: FilterUsersPipe,
		private router: Router,
		private translate: TranslateService,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit() {
		// for (var key in this.newStore) this.newStore[key] = '';
		this.newStore = {
			username: '',
			password: '',
			name: '',
			email: '',
			database_url: '',
			database_name: '',
			database_port: '',
			database_username: '',
			database_password: '',
			background_img: [],
			logo_img: '',
			store_type: '',
			commerce_password: '',
			user: ''
		};
		this.activatedRoute.params.subscribe((params) => {
			this.currentUser = params.id;
			this.getStores();
		});
		if (this.auth.isAdmin()) {
			this.userService.getUsers().subscribe((response: any) => {
				this.userList = response.users;
			});
		}
	}

	searchStores(text?: string) {}

	getStores() {
		if (this.currentUser) {
			this.storeService.getUserStores(this.currentUser).subscribe((response: any) => {
				this.storeList = response.stores;
			});
		} else {
			this.storeService.getStores().subscribe((response: any) => {
				this.storeList = response.stores;
			});
		}
	}

	registerStore() {
		for (let i = 0; i < this.selectedFiles.length; i++) {
			this.newStore.background_img.push(this.selectedFiles[i].file);
		}

		this.showSpinner = true;
		if (!this.newStore.user) {
			Swal.fire('Error', 'Debe seleccionar un usuario', 'error');
			return;
		}
		if (!this.newStore.store_type) {
			Swal.fire('Error', 'Debe seleccionar un tipo de tienda', 'error');
			return;
		}

		this.newStore.free_fields = this.freeFields.map((value: any) => {
			if (value && value.active) {
				return value;
			}
		});

		this.newStore.selected_free_fields = JSON.stringify(this.newStore.free_fields);

		this.storeService
			.registerStore(this.newStore)
			.then((response: any) => {
				this.showSpinner = false;
				const success_text = 'Store created successfully';
				Swal.fire('Exito', success_text, 'success').then(() => {
					this.ngOnInit();
					this.selectedTab = 0;
				});
			})
			.catch((error: any) => {
				this.showSpinner = false;
				const error_text = this.translate.instant(`ERRORS.ERROR_TYPE_${error.type}`);
				Swal.fire('Error', error_text, 'error');
			});
	}

	goToStore(store: any) {
		this.router.navigate([ '/store', store._id ]);
	}

	selectBGImage(event) {
		this.newStore.background_img = event.target.files[0];
	}

	selectLogoImage(event) {
		this.newStore.logo_img = event.target.files[0];
	}

	removeImage(type: number, index: number) {
		if (type === 0) {
			this.logo_imgURL = null;
			this.newStore.logo_img = null;
		} else {
			this.onError(index);
		}
	}

	preview(type: number, files: any, index: number) {
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
			if (type === 0) {
				this.logo_imgURL = reader.result;
			}
		};
	}

	private onSuccess(index: number) {
		this.selectedFiles[index].pending = false;
		this.selectedFiles[index].status = 'ok';
	}

	private onError(index: number) {
		if (this.selectedFiles[index]) {
			this.selectedFiles[index].pending = false;
			this.selectedFiles[index].status = 'fail';
			this.selectedFiles[index].src = '';
		} else {
			this.newStore.background_img[index] = '';
			this.selectedFiles[index].src = '';
		}
	}

	processFile(imageInput: any, index: number) {
		const file: File = imageInput.files[0];
		const reader = new FileReader();

		reader.addEventListener('load', (event: any) => {
			this.selectedFiles[index] = new ImageSnippet(event.target.result, file);
			this.selectedFiles[index].pending = true;
		});

		reader.readAsDataURL(file);
		// this.newStore.background_img[index] = null;
	}

	testConnection(type: string) {
		const data = {
			database_url: this.newStore.database_url,
			database_password: this.newStore.database_password,
			database_name: this.newStore.database_name,
			database_port: this.newStore.database_port,
			database_username: this.newStore.database_username
		};
		this.storeService.checkStoreConnection(data, type).subscribe((response: any) => {
			if (response.ok) {
				this.freeFields = response.free_fields.free_fields;
				Swal.fire('Exito', 'Conexión realizada', 'success').then(() => {
					this.connectionError = false;
				});
			} else {
				Swal.fire('Fallo', 'No es posible conectar con el servidor', 'error').then(() => {
					this.connectionError = true;
				});
			}
		});
	}
}
