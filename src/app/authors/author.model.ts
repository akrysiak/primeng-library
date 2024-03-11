export class Author {
  public id;
  public name;
  public surname;
  public year;

  constructor(id: number, name: string, surname: string, year: number) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.year = year;
  }
}
