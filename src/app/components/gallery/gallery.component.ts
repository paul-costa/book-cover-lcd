import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BookModel } from 'src/app/models/book-cover.model';
import { BookCoverService } from 'src/app/services/book-cover.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnDestroy {
  isAutoNavButtonVisible = true;

  readonly autoNavPrevBookIds$ = new BehaviorSubject<string[]>([]);
  readonly books$: Observable<BookModel[]> =
    this.bookCoverService.observeBooks();
  readonly loading$ = this.bookCoverService.observeLoading();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private bookCoverService: BookCoverService,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBookOpen(bookId: string) {
    if (!bookId) {
      return;
    }

    this.navigateToBook(bookId);
  }

  onStartAutoNavigation() {
    this.router.navigateByUrl('/auto-view');
    this.isAutoNavButtonVisible = false;
    this.autoNavPrevBookIds$.subscribe(() =>
      this.autoNavigation(this.bookCoverService.books)
    );
    this.autoNavigation(this.bookCoverService.books, 0);
  }

  private navigateToBook(id: string, delayInMs: number = 0): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.router.navigateByUrl('/single-view?bookId=' + id);
        resolve(true);
      }, delayInMs);
    });
  }

  private autoNavigation(books: BookModel[], delayInMs = 3 * 1000) {
    const nextBookIds = books
      .filter((book) => !this.autoNavPrevBookIds$.value.includes(book.id ?? ''))
      .map((book) => book.id ?? '')
      .filter(Boolean);

    if (nextBookIds.length > 0) {
      setTimeout(() => {
        this.navigateToBook(nextBookIds[nextBookIds.length - 1]).then(() => {
          this.autoNavPrevBookIds$.next([
            ...this.autoNavPrevBookIds$.value,
            nextBookIds[nextBookIds.length - 1],
          ]);
        });
      }, delayInMs);
    } else {
      this.autoNavPrevBookIds$.next([]);
    }
  }
}
