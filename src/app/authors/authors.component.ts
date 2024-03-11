import { Component, OnInit } from '@angular/core';
import { Author } from './author.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthorsActions from '../authors/author-store/author.actions';
import { Book } from '../books/book.model';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css',
})
export class AuthorsComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  cols: any[] = [];
  authors: Author[] = [];
  selectedAuthor: Author;
  subscription: Subscription;
  id: number;
  canDeleteAuthor: boolean;

  ngOnInit(): void {
    this.store.dispatch(new AuthorsActions.FetchAuthors());
    this.subscription = this.store
      .select('authors')
      .pipe(map((authorsState) => authorsState.authors))
      .subscribe((authors: Author[]) => {
        this.authors = authors;
      });
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.selectedAuthor = this.getAuthor(this.id);
    });
  }
  getAuthor(index: number) {
    return this.authors[index];
  }

  onSelect(i, author) {
    this.canDeleteAuthor = false;
    this.selectedAuthor = author;
    this.id = i;
    this.store
      .select('books')
      .pipe(map((booksState) => booksState.books))
      .subscribe((books: Book[]) => {
        if (books.some((book) => book.author.id == this.selectedAuthor.id)) {
          this.canDeleteAuthor = true;
        }
      });
  }

  onNewAuthor() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEditAuthor() {
    this.router.navigate(['./', this.id, 'edit'], { relativeTo: this.route });
  }

  onDelete() {
    this.store.dispatch(new AuthorsActions.DeleteAuthor(this.id));
    this.store.dispatch(new AuthorsActions.StoreAuthors());
  }
}
