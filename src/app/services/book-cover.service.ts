import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookModel } from '../models/book-cover.model';
import { FireStoreService } from './fire-store.service';

@Injectable({
  providedIn: 'root',
})
export class BookCoverService {
  private readonly books$ = new BehaviorSubject<BookModel[]>([]);
  private readonly loading$ = new BehaviorSubject<boolean>(false);
  private readonly fireStoreService = inject(FireStoreService);

  fetchAndSetBooks() {
    this.loading$.next(true);

    this.fireStoreService.getData().then((books) => {
      this.books$.next(
        books.map((b) => ({
          ...b,
          coverUrl: this.fireStoreService
            .getCoverUrl(b.id ?? '')
            .finally(() => this.loading$.next(false)),
        }))
      );
    });
  }

  get books(): BookModel[] {
    return this.books$.value;
  }

  observeBooks(): Observable<BookModel[]> {
    return this.books$.asObservable();
  }

  getBookById(id: string): BookModel | undefined {
    return this.books.find((book) => book.id === id);
  }

  observeLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
