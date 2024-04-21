export interface BookModel {
  id?: string;
  title?: string;
  author?: AuthorModel;
  coverUrl?: Promise<string>;
  rating?: number;
  goodreadsUrl?: string;
}

export interface AuthorModel {
  firstName?: string;
  lastName?: string;
}
