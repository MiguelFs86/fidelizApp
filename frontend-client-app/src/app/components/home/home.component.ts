import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
	@ViewChild(SignaturePad, { static: true })
	signaturePad: SignaturePad;

	constructor(
		public userService: UserService,
		private router: Router,
		private translate: TranslateService,
		private auth: AuthService
	) {}

	selectedFile: any;
	imagePath = AppComponent.BACKEND_URL + '/files/store/background/';
	logoPath = AppComponent.BACKEND_URL + '/files/store/logo/';
	backgroundImg = '';
	logoImg = '';
	loading = false;

	client = {
		email: '',
		name: '',
		phone: '',
		signature: new Blob(),
		gpdr: false
	};

	store: any;

	drawStatus = false;

	public signaturePadOptions: Object = {
		minWidth: 5,
		canvasWidth: 305,
		canvasHeight: 100,
		backgroundColor: 'white',
		dotSize: 2,
		border: '1px solid black',
	};

	// tslint:disable-next-line: use-life-cycle-interface
	ngAfterViewInit() {
		// this.signaturePad is now available
		this.signaturePad.set('minWidth', 0.5); // set szimek/signature_pad options at runtime
		this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
		$('canvas').css('border', '1px solid #d7d7d7');
		$('canvas').css('border-radius', '.1rem');
	}

	drawComplete() {
		// will be notified of szimek/signature_pad's onEnd event
	}

	drawStart() {
		this.drawStatus = true;
		// will be notified of szimek/signature_pad's onBegin event
	}

	ngOnInit() {
		this.auth.validateToken().subscribe((response: any) => {});
		if (sessionStorage.getItem('bg_image')) {
			this.backgroundImg =
				this.imagePath + sessionStorage.getItem('bg_image');
		} else {
			this.backgroundImg = '../../../assets/bg-heading-03.jpg';
		}

		if (sessionStorage.getItem('logo_image')) {
			this.logoImg = this.logoPath + sessionStorage.getItem('logo_image');
		} else {
			this.logoImg = '../../../assets/bg-heading-03.jpg';
		}
	}

	registerClient() {
		if (!this.client.name) {
			const name_text = this.translate.instant('ERRORS.NAME');
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: name_text,
				heightAuto: false,
			});
			return;
		}

		if (!this.client.email) {
			const email_text = this.translate.instant('ERRORS.EMAIL');
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: email_text,
				heightAuto: false,
			});
			return;
		}

		if (!this.validateEmail(this.client.email)) {
			const email_valid_text = this.translate.instant(
				'ERRORS.VALID_EMAIL'
			);
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: email_valid_text,
				heightAuto: false,
			});
			return;
		}

		if (!this.client.phone) {
			const phone_text = this.translate.instant('ERRORS.PHONE');
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: phone_text,
				heightAuto: false,
			});
			return;
		}

		if (!this.validatePhone(this.client.phone)) {
			const phone_valid_text = this.translate.instant(
				'ERRORS.VALID_PHONE'
			);
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: phone_valid_text,
				heightAuto: false,
			});
			return;
		}

		if (this.signaturePad.toData().length === 0) {
			const signature_text = this.translate.instant('ERRORS.SIGNATURE');
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: signature_text,
				heightAuto: false,
			});
			return;
		}

		if (!this.client.gpdr) {
			const gpdr_text = this.translate.instant('ERRORS.GPDR_ACCEPT');
			Swal.fire({
				title: 'Error',
				icon: 'error',
				text: gpdr_text,
				heightAuto: false,
			});
			return;
		}
		this.loading = true;
		this.client.signature = this.dataURItoBlob(
			this.signaturePad.toDataURL('image/png')
		);
		this.userService
			.registerClient(this.client)
			.then((response) => {
				this.loading = false;
				const success_text = 'Cliente creado con exito';
				Swal.fire({
					title: 'Exito',
					text: success_text,
					icon: 'success',
					heightAuto: false,
				}).then(() => {
					this.flip();
				});
			})
			.catch((error) => {
				this.loading = false;
				let error_text = '';
				if (error.type) {
					error_text = this.translate.instant(
						`ERRORS.ERROR_TYPE_${error.type}`
					);
				} else {
					error_text = 'Error al guardar el cliente';
				}
				Swal.fire({
					title: 'Error',
					text: error_text,
					icon: 'error',
					heightAuto: false,
				});
			});
	}

	clearForm() {
		this.client = {
			email: '',
			name: '',
			phone: '',
			signature: new Blob(),
			gpdr: false
		};
		this.drawStatus = false;
		this.signaturePad.clear();
		if ($('#collapseExample').hasClass('show')) {
			$('.btn.btn-light.mb-1').click();
		}
		setTimeout(() => {
			window.location.href = sessionStorage.getItem('website');
			// this.router.navigate([ '/slider' ]);
		}, 1500);
	}

	clearSignaturePad() {
		this.drawStatus = false;
		this.signaturePad.clear();
	}

	flip() {
		// $('.card').addClass('flip');
		// $('.image-side, .form-side').addClass('opacity');
		// $('.card').addClass('bg-transparent');
		setTimeout(() => {
			// $('.image-side, .form-side').removeClass('opacity');
			// $('.card').removeClass('bg-transparent');
			this.clearForm();
		}, 800);
		// setTimeout(() => {
		// $('.card').removeClass('flip');
		// }, 2000);
	}

	showGPDR(active) {
		if (active) {
			const gpdr_text = JSON.stringify(
				sessionStorage.getItem('gpdr_text')
			);
			Swal.fire({
				title: 'Acuerdo general de protección de datos',
				text: gpdr_text,
				heightAuto: true,
			});
			$('.swal2-html-container').css('font-size', '10px');
			$('.swal2-html-container').css('text-align', 'justify');
			$('.swal2-header').css('font-size', '10px');
			$('.swal2-container').css('overflow-y', 'auto');
		}
	}

	dataURItoBlob(dataURI) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		let byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0) {
			byteString = atob(dataURI.split(',')[1]);
		} else {
			byteString = unescape(dataURI.split(',')[1]);
		}

		// separate out the mime component
		const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		const ia = new Uint8Array(byteString.length);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], { type: mimeString });
	}

	validateEmail(mail) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
			return true;
		}
		return false;
	}

	validatePhone(phone) {
		if (!/^\d{9}$/.test(phone)) {
			return false;
		}
		return true;
	}
}
