import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {
	private storageSub = new Subject<boolean>();

	constructor() {}

	watchStorage(): Observable<any> {
		return this.storageSub.asObservable();
	}

	setItem(key: string, data: any) {
		localStorage.setItem(key, data);
		this.storageSub.next(true);
	}

	removeItem(key) {
		localStorage.removeItem(key);
		this.storageSub.next(true);
	}
}
