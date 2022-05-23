import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SliderComponent } from './components/slider/slider.component';
import { DirectAccessComponent } from './components/direct-access/direct-access.component';

const APP_ROUTES: Routes = [
	{ path: 'home', component: HomeComponent, canActivate: [ AuthGuardService ] },
	{ path: 'slider', component: SliderComponent, canActivate: [ AuthGuardService ] },
	{ path: 'login', component: LoginComponent },
	{ path: 'direct_access', component: DirectAccessComponent },
	{ path: '**', pathMatch: 'full', redirectTo: 'login' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
