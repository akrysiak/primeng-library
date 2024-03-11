import { Reader } from '../readers/reader.model';
import { Shelf } from '../shelves/shelf.model';

export class Book {
  public id;
  public title;
  public author;
  public isbn;
  public shelf;
  public isLent;
  public reader;

  constructor(
    id: number,
    title: string,
    author: string,
    isbn: number,
    shelf: Shelf,
    isLent: boolean,
    reader: Reader
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.shelf = shelf;
    this.isLent = isLent;
    this.reader = reader;
  }
}
