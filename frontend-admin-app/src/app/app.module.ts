import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* HTTP and Routes */
import { RouterModule } from '@angular/router';

import { APP_ROUTING } from './app.routes';

/* Translations */
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/* HTTP Interceptors */
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { TokenInterceptor } from './services/token-interceptor';

/* Auth & guards services */
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './guards/auth-guard.service';
import { AdminGuardService } from './guards/admin-guard.service';

/* Components */
import { AppComponent } from './app.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';
import { StoresComponent } from './components/stores/stores.component';
import { StoreComponent } from './components/store/store.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LogComponent } from './components/log/log.component';
import { SettingsComponent } from './components/settings/settings.component';
import { EditorComponent } from './components/editor/editor.component';

import { FilterUsersPipe } from './pipes/filter-users.pipe';
/* Socket config */
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

/* Angular material modules */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { QuillModule } from 'ngx-quill';
import { QRCodeModule } from 'angular2-qrcode';

const config: SocketIoConfig = { url: AppComponent.SOCKET_URL, options: {} };

@NgModule({
	declarations: [
		AppComponent,
		FilterUsersPipe,
		HomeComponent,
		LoginComponent,
		NavbarComponent,
		UsersComponent,
		FilterUsersPipe,
		UserComponent,
		StoresComponent,
		StoreComponent,
		ProfileComponent,
		LogComponent,
		SettingsComponent,
		EditorComponent
	],
	imports: [
		APP_ROUTING,
		RouterModule,
		HttpClientModule,
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSnackBarModule,
		MatDialogModule,
		MatButtonModule,
		MatCheckboxModule,
		MatToolbarModule,
		MatCardModule,
		MatFormFieldModule,
		MatTabsModule,
		MatDatepickerModule,
		DragDropModule,
		MatNativeDateModule,
		MatProgressSpinnerModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (http: HttpClient) => {
					return new TranslateHttpLoader(http);
				},
				deps: [ HttpClient ]
			}
		}),
		SocketIoModule.forRoot(config),
		QuillModule.forRoot(),
		QRCodeModule
	],
	entryComponents: [],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		}
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
