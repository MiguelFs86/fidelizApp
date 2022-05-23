import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient, private router: Router) {}

    storeInfo;

    login(credentials) {
        return this.http.post(AppComponent.BACKEND_URL + '/login/store', { credentials }).pipe(
            map((res: any) => {
                if (res.ok) {
                    this.storeInfo = res;
                    sessionStorage.setItem('token', this.storeInfo.token);
                    sessionStorage.setItem('session', res.session._id);
                    sessionStorage.setItem('bg_image', this.storeInfo.store.background_img);
                    sessionStorage.setItem('logo_image', this.storeInfo.store.logo_img);
                    sessionStorage.setItem('gpdr_text', this.storeInfo.store.gpdr_text);
                    sessionStorage.setItem('website', this.storeInfo.store.website);
                    return { ok: true, data: res };
                } else {
                    return { ok: false, error: res.message };
                }
            })
        );
    }

    directAccessLogin(storeID) {
        return this.http.post(AppComponent.BACKEND_URL + '/login/store/direct_access', { storeID }).pipe(
            map((res: any) => {
                if (res.ok) {
                    this.storeInfo = res;
                    sessionStorage.setItem('store', this.storeInfo.store._id);
                    sessionStorage.setItem('token', this.storeInfo.token);
                    sessionStorage.setItem('session', res.session._id);
                    sessionStorage.setItem('bg_image', this.storeInfo.store.background_img);
                    sessionStorage.setItem('logo_image', this.storeInfo.store.logo_img);
                    sessionStorage.setItem('gpdr_text', this.storeInfo.store.gpdr_text);
                    sessionStorage.setItem('website', this.storeInfo.store.website);
                    return { ok: true, data: res };
                } else {
                    return { ok: false, error: res.message };
                }
            })
        );
    }

    validateToken() {
        return this.http.get(AppComponent.BACKEND_URL + '/login/validate_token').pipe(
            map((res: any) => {
                return res;
            })
        );
    }

    logout() {
        let sessionID = sessionStorage.getItem('session');
        return this.http.get(AppComponent.BACKEND_URL + `/logout/store/${sessionID}`).pipe(
            map((res: any) => {
                if (res.ok) {
                    sessionStorage.clear();
                    this.router.navigate([ '/login' ]);
                }
            })
        );
    }

    getToken() {
        return sessionStorage.getItem('token') || null;
    }

    isAuthenticated(): boolean {
        const token = sessionStorage.getItem('token');

        if (token) {
            return true;
        } else {
            return false;
        }
    }

    isAdmin(): boolean {
        return sessionStorage.getItem('role') === 'ADMIN_ROLE';
    }
}
