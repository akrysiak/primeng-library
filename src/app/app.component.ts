import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/auth-store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>) {}
  ngOnInit(): void {
    this.store.dispatch(new AuthActions.AutoLogin());
  }
  title = 'primeng-project';
}
