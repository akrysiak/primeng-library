import { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription, map } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/auth-store/auth.actions';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];
  isAuthenticated;
  userSub: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
        this.model = [
          {
            label: 'Menu',
            icon: 'pi pi-home',
            items: [
              {
                label: 'Books',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/books'],
                visible: this.isAuthenticated,
              },
              {
                label: 'Authors',
                icon: 'pi pi-fw pi-pencil',
                routerLink: ['/authors'],
                visible: this.isAuthenticated,
              },
              {
                label: 'Shelves',
                icon: 'pi pi-fw pi-bars',
                routerLink: ['/shelves'],
                visible: this.isAuthenticated,
              },
              {
                label: 'Readers',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/readers'],
                visible: this.isAuthenticated,
              },
              {
                label: 'Authenticate',
                icon: 'pi pi-fw pi-sign-in',
                routerLink: ['/auth'],
                visible: !this.isAuthenticated,
              },
              {
                label: 'Logout',
                icon: 'pi pi-fw pi-sign-out',
                visible: this.isAuthenticated,
                command: () => this.store.dispatch(new AuthActions.Logout()),
              },
            ],
          },
        ];
      });
  }
}
