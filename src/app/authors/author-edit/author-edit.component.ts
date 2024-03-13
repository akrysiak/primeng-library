import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Author } from '../author.model';
import * as uuid from 'uuid';
import * as fromApp from '../../store/app.reducer';
import * as AuthorsActions from '../../authors/author-store/author.actions';
import * as BooksActions from '../../books/book-store/book.actions';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Book } from '../../books/book.model';
import copy from 'fast-copy';

@Component({
  selector: 'app-author-edit',
  templateUrl: './author-edit.component.html',
  styleUrl: './author-edit.component.css',
})
export class AuthorEditComponent implements OnInit {
  id: number;
  editMode = false;
  authorForm: FormGroup;
  selectedAuthor: Author;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    let name = '';
    let surname = '';
    let year = '';

    if (this.editMode) {
      this.store
        .select('authors')
        .pipe(
          map((authorState) => {
            return authorState.authors.find((author, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe((author) => {
          this.selectedAuthor = author;
          name = author.name;
          surname = author.surname;
          year = author.year;
        });
    }

    this.authorForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      surname: new FormControl(surname, Validators.required),
      year: new FormControl(year, Validators.pattern(/^[1-9]+[0-9]*$/)),
    });
  }

  onSubmit() {
    let id =
      this.selectedAuthor && this.selectedAuthor.id
        ? this.selectedAuthor.id
        : uuid.v4();
    const newAuthor = new Author(
      id,
      this.authorForm.value['name'],
      this.authorForm.value['surname'],
      this.authorForm.value['year']
    );
    if (this.editMode) {
      this.store.dispatch(
        new AuthorsActions.UpdateAuthor({
          index: this.id,
          newAuthor: this.authorForm.value,
        })
      );
      let booksToUpdate = [];
      this.store.dispatch(new BooksActions.FetchBooks());
      this.store
        .select('books')
        .pipe(map((booksState) => booksState.books))
        .subscribe((books: Book[]) => {
          booksToUpdate = copy(books);
        });
      booksToUpdate.forEach((book, index) => {
        if (book.author.id === newAuthor.id) {
          book.author = newAuthor;
          this.store.dispatch(
            new BooksActions.UpdateBook({
              index: index,
              newBook: book,
            })
          );
        }
      });
      this.store.dispatch(new BooksActions.StoreBooks());
    } else {
      this.store.dispatch(new AuthorsActions.AddAuthor(newAuthor));
    }
    this.store.dispatch(new AuthorsActions.StoreAuthors());
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
