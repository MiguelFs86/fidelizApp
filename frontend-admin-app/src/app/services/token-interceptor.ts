import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(public auth: AuthService, private router: Router) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let headers: any;
		if (localStorage.getItem('token')) {
			// Attach headers to request
			headers = new HttpHeaders({
				Authorization: localStorage.getItem('token'),
				'Content-Type': 'application/json',
				Accept: 'application/json'
			});
		} else {
			headers = new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json'
			});
		}
		const cloneReq = request.clone({ headers });

		return next.handle(cloneReq).pipe(
			map((event) => {
				return event;
			}),
			catchError((err: any) => {
				if (err.status === 401) {
					if (err.error.err.err.message === 'invalid signature') {
						Swal.fire('Error', 'Token no válido. Inicie sesión nuevamente', 'error').then(() => {
							this.router.navigate([ '/login' ]);
						});
					}
					if (err.error.err.err.message === 'jwt expired') {
						Swal.fire('Error', 'Su sesión ha expirado', 'error').then(() => {
							this.router.navigate([ '/login' ]);
						});
					}
					return throwError(err);
				} else {
					return throwError(err);
				}
			}),
			finalize(() => {})
		);
	}
}
