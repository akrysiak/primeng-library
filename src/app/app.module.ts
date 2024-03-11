import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BooksComponent } from './books/books.component';
import { AuthorsComponent } from './authors/authors.component';
import { TableModule } from 'primeng/table';
import { BookEditComponent } from './books/book-edit/book-edit.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookDetailComponent } from './books/book-detail/book-detail.component';

import { AuthComponent } from './auth/auth.component';
import { MessagesModule } from 'primeng/messages';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthorDetailComponent } from './authors/author-detail/author-detail.component';
import { AuthorEditComponent } from './authors/author-edit/author-edit.component';

import { ReadersComponent } from './readers/readers.component';
import { ReaderEditComponent } from './readers/reader-edit/reader-edit.component';
import { ReaderDetailComponent } from './readers/reader-detail/reader-detail.component';

import { ShelvesComponent } from './shelves/shelves.component';

import { DropdownModule } from 'primeng/dropdown';
import { ShelfEditComponent } from './shelves/shelf-edit/shelf-edit.component';
import { BookLendComponent } from './books/book-lend/book-lend.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { ShelfDetailComponent } from './shelves/shelf-detail/shelf-detail.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import * as fromApp from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BookEffects } from './books/book-store/book.effects';
import { AuthEffects } from './auth/auth-store/auth.effects';
import { AuthorEffects } from './authors/author-store/author.effects';
import { ReaderEffects } from './readers/reader-store/reader.effects';
import { ShelfEffects } from './shelves/shelf-store/shelf.effects';

@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    AuthorsComponent,
    BookEditComponent,
    BookDetailComponent,
    AuthComponent,
    AuthorDetailComponent,
    AuthorEditComponent,
    ReadersComponent,
    ReaderEditComponent,
    ReaderDetailComponent,
    ShelvesComponent,
    ShelfEditComponent,
    BookLendComponent,
    ShelfDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    StyleClassModule,
    SidebarModule,
    MenuModule,
    BrowserAnimationsModule,
    TableModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MessagesModule,
    DropdownModule,
    AppLayoutModule,
    AutoCompleteModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([
      AuthEffects,
      BookEffects,
      AuthorEffects,
      ReaderEffects,
      ShelfEffects,
    ]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
