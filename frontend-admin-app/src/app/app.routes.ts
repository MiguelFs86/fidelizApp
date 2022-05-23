import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './guards/auth-guard.service';
import { AdminGuardService } from './guards/admin-guard.service';

import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { StoresComponent } from './components/stores/stores.component';
import { StoreComponent } from './components/store/store.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LogComponent } from './components/log/log.component';
import { SettingsComponent } from './components/settings/settings.component';

const APP_ROUTES: Routes = [
	{ path: 'home', component: HomeComponent, canActivate: [ AuthGuardService ] },
	{ path: 'users', component: UsersComponent, canActivate: [ AuthGuardService ] },
	{ path: 'user/:id', component: UserComponent, canActivate: [ AuthGuardService ] },
	{ path: 'stores', component: StoresComponent, canActivate: [ AuthGuardService ] },
	{ path: 'stores/:id', component: StoresComponent, canActivate: [ AuthGuardService ] },
	{ path: 'store/:id', component: StoreComponent, canActivate: [ AuthGuardService ] },
	{ path: 'login', component: LoginComponent },
	{ path: 'profile', component: ProfileComponent, canActivate: [ AuthGuardService ] },
	{ path: 'settings', component: SettingsComponent, canActivate: [ AdminGuardService ] },
	{ path: 'log', component: LogComponent, canActivate: [ AdminGuardService ] },
	{ path: '**', pathMatch: 'full', redirectTo: 'login' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
