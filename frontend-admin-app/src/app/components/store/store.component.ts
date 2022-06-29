import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { UserService } from '../../services/user.service';
import { ClientService } from '../../services/client.service';
import { AppComponent } from '../../app.component';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import * as moment from 'moment';
registerLocaleData(localeEs, 'es');

class ImageSnippet {
	pending: boolean = false;
	status: string = 'init';

	constructor(public src: string, public file: File) {}
}

declare let html2canvas: any;

@Component({
	selector: 'app-store',
	templateUrl: './store.component.html',
	styleUrls: [ './store.component.css' ]
})
export class StoreComponent implements OnInit {
	store = {
		_id: '',
		username: '',
		password: '',
		name: '',
		email: '',
		user: '',
		logo_img: '',
		background_img: [],
		gpdr_text: '',
		allowed_connections: 5000000
	};
	userList: any;
	logo_imgURL: any;
	background_imgURL: any[];
	showSpinner: boolean;
	imagePath = AppComponent.BACKEND_URL + '/files/store/logo/';
	BGimagePath = AppComponent.BACKEND_URL + '/files/store/background/';
	noImage = './assets/no-image.jpg';
	message = '';
	clients = [];
	commerce_password = false;
	signaturePath = AppComponent.BACKEND_URL + '/files/client/signature/';
	user_role = localStorage.getItem('role');
	freeFields = [];
	connectionError = null;
	connectionList = [];
	storeQRcode = '';
	directAccessURL = 'https://fidelizapp.serantes.pro/#/direct_access?id=';

	selectedFiles: ImageSnippet[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private storeService: StoreService,
		private clientService: ClientService,
		private userService: UserService,
		private router: Router,
		private translate: TranslateService,
		public auth: AuthService,
		private socket: SocketService
	) {}

	ngOnInit() {
		if (this.auth.isAdmin()) {
			this.userService.getUsers().subscribe((users: any) => {
				this.userList = users.users;
			});
		} else {
			this.userList = [];
		}
		this.activatedRoute.params.subscribe((params) => {
			const id = params.id;
			this.storeService.getStoreById(id).subscribe((response: any) => {
				this.store = response.store;
				this.storeQRcode = this.directAccessURL + id;
				this.background_imgURL = [ ...this.store.background_img ];
				this.clientService.getClients(this.store._id).subscribe((response_clients: any) => {
					this.clients = response_clients.clients;
				});
			});
		});

		this.socket.listen('session created').subscribe((message: any) => {
			if (message.store === this.store._id) {
				this.connectionList.push(message);
			}
		});

		this.socket.listen('session destroy').subscribe((message: any) => {
			if (message.store === this.store._id) {
				this.connectionList = this.connectionList.filter((conn) => {
					return conn._id !== message._id;
				});
			}
		});
	}

	clientDetail(client) {
		Swal.fire({
			title: client.name,
			text: client.phone + '  -  ' + client.email,
			imageUrl: this.signaturePath + client.signature,
			imageWidth: 400,
			imageHeight: 200,
			imageAlt: client.name,
			customClass: {
				image: 'custom-swal2-image'
			}
		});
	}

	updateStore() {
		for (let i = 0; i < this.selectedFiles.length; i++) {
			if (!this.store.background_img[i]) {
				this.store.background_img[i] = this.selectedFiles[i].file;
			}
		}
		// return;
		this.showSpinner = true;
		if (!this.store.user) {
			Swal.fire('Error', 'Debe seleccionar un usuario', 'error');
			return;
		}

		this.storeService
			.updateStore(this.store, this.store._id)
			.then((response: any) => {
				this.showSpinner = false;
				const success_text = 'Store created successfully';
				Swal.fire('Exito', success_text, 'success').then(() => {
					this.router.navigate([ '/stores' ]);
				});
			})
			.catch((error: any) => {
				this.showSpinner = false;
				const error_text = this.translate.instant(`ERRORS.ERROR_TYPE_${error.type}`);
				Swal.fire('Error', error_text, 'error').then(() => {
					this.router.navigate([ '/stores' ]);
				});
			});
	}

	selectLogoImage(event) {
		this.store.logo_img = event.target.files[0];
	}

	removeImage(type: number, index: number) {
		if (type === 0) {
			this.logo_imgURL = null;
			this.store.logo_img = null;
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
			this.store.background_img[index] = '';
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
		this.store.background_img[index] = null;
	}

	getConnections(event) {
		if (event.index === 2) {
			this.storeService.getStoreConnections(this.store._id).subscribe((connections: any) => {
				if (connections.ok) {
					this.connectionList = connections.sessions;
				}
			});
		}
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

	exportToExcel() {
		const clientList = [];
		moment.locale('es');
		this.clients.forEach(c => {
			clientList.push({
				nombre: c.name,
				email: c.email,
				telefono: c.phone,
				fechaAlta: moment(c.created_date).format('DD MMM YYYY HH:mm:ss')
			})
		})
		import("xlsx").then(xlsx => {
				const worksheet = xlsx.utils.json_to_sheet(clientList);
				const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
				const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
				this.saveAsExcelFile(excelBuffer, "clientes");
		});
	}

	saveAsExcelFile(buffer: any, fileName: string): void {
		import("file-saver").then(FileSaver => {
			let EXCEL_TYPE =
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
			let EXCEL_EXTENSION = ".xlsx";
			const data: Blob = new Blob([buffer], {
				type: EXCEL_TYPE
			});
			FileSaver.saveAs(
				data,
				fileName + "lista_clientes_" + moment().format('DD-MM-YYYY HH:mm:ss') + EXCEL_EXTENSION
			);
		});
	}
}
