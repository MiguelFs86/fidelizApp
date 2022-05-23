import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-direct-access',
	templateUrl: './direct-access.component.html',
	styleUrls: [ './direct-access.component.css' ]
})
export class DirectAccessComponent implements OnInit {
	constructor(private router: Router,
				private activatedRoute: ActivatedRoute,
				private auth: AuthService) {}

	ngOnInit() {
		let id;
		this.activatedRoute.queryParams.subscribe((params) => {
			id = params['id'];
			this.auth.directAccessLogin(id).subscribe((response) => {
				if (response.ok){
					this.router.navigate(['/home']);
				}
			})
		});
	}


}
