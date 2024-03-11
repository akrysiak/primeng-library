import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { AuthorsComponent } from './authors/authors.component';
import { BookEditComponent } from './books/book-edit/book-edit.component';
import { BookDetailComponent } from './books/book-detail/book-detail.component';
import { BooksResolverService } from './books/books-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthorEditComponent } from './authors/author-edit/author-edit.component';
import { AuthorDetailComponent } from './authors/author-detail/author-detail.component';
import { ReadersComponent } from './readers/readers.component';
import { ReaderDetailComponent } from './readers/reader-detail/reader-detail.component';
import { ReaderEditComponent } from './readers/reader-edit/reader-edit.component';
import { ShelvesComponent } from './shelves/shelves.component';
import { ShelfEditComponent } from './shelves/shelf-edit/shelf-edit.component';
import { BookLendComponent } from './books/book-lend/book-lend.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { ShelfDetailComponent } from './shelves/shelf-detail/shelf-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: 'books', pathMatch: 'full' },
      {
        path: 'books',
        component: BooksComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'new', component: BookEditComponent },
          {
            path: ':id',
            component: BookDetailComponent,
            resolve: [BooksResolverService],
          },
          { path: ':id/lend', component: BookLendComponent },
          {
            path: ':id/edit',
            component: BookEditComponent,
            resolve: [BooksResolverService],
          },
        ],
      },
      {
        path: 'authors',
        component: AuthorsComponent,
        children: [
          { path: 'new', component: AuthorEditComponent },
          { path: ':id', component: AuthorDetailComponent },
          { path: ':id/edit', component: AuthorEditComponent },
        ],
      },
      {
        path: 'readers',
        component: ReadersComponent,
        children: [
          { path: 'new', component: ReaderEditComponent },
          { path: ':id', component: ReaderDetailComponent },
          { path: ':id/edit', component: ReaderEditComponent },
        ],
      },
      {
        path: 'shelves',
        component: ShelvesComponent,
        children: [
          { path: 'new', component: ShelfEditComponent },
          { path: ':id', component: ShelfDetailComponent },
          { path: ':id/edit', component: ShelfEditComponent },
        ],
      },
      { path: 'auth', component: AuthComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [BooksResolverService],
})
export class AppRoutingModule {}
