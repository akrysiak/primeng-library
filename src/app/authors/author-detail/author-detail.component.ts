import { Component, OnInit } from '@angular/core';
import { Author } from '../author.model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.component.html',
  styleUrl: './author-detail.component.css',
})
export class AuthorDetailComponent implements OnInit {
  author: Author;
  id: number;
  selectedAuthor: Author;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => {
          return +params['id'];
        }),
        switchMap((id) => {
          this.id = id;
          return this.store.select('authors');
        }),
        map((authorsState) => {
          return authorsState.authors.find((author, index) => {
            return index === this.id;
          });
        })
      )
      .subscribe((author) => {
        this.selectedAuthor = author;
      });
  }
}
