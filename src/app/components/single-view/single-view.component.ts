import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { RouteData } from 'src/app/app-routing.module';
import { BookModel } from 'src/app/models/book-cover.model';
import { BookCoverService } from 'src/app/services/book-cover.service';

@Component({
  selector: 'app-single-view',
  templateUrl: './single-view.component.html',
  styleUrls: ['./single-view.component.scss'],
})
export class SingleViewComponent implements OnDestroy {
  currentBook?: BookModel;

  readonly loading$: Observable<boolean>;

  private books: BookModel[] = [];
  private bookChangeInterval?: NodeJS.Timeout;

  private readonly changeIntervalMs = 10 * 1000;
  private readonly destroy$ = new Subject<void>();

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly bookCoverService = inject(BookCoverService);

  constructor() {
    if (!this.bookCoverService.books?.length) {
      this.bookCoverService.fetchAndSetBooks();
    }

    const queryParams = this.activatedRoute.snapshot?.queryParams;
    const routeData: RouteData = this.activatedRoute.snapshot?.data;

    this.loading$ = this.bookCoverService
      .observeLoading()
      .pipe(takeUntil(this.destroy$));

    this.bookCoverService
      .observeBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((books) => {
        if (books?.length) {
          this.books = books;
          if (routeData.autoView) {
            this.setBookChangeInterval();
          } else {
            this.setBookById(queryParams?.['bookId']);
          }
        }
      });
  }

  ngOnDestroy() {
    clearInterval(this.bookChangeInterval);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setBookById(id = this.books[0]?.id) {
    this.currentBook = this.books.find((b) => b.id === id);
  }

  private setBookChangeInterval() {
    this.setBookById();
    let currentBookNr = 0;

    this.bookChangeInterval = setInterval(() => {
      let bookId: string;

      if (this.books[currentBookNr + 1] != null) {
        currentBookNr++;
        bookId = this.books[currentBookNr]?.id as string;
      }

      this.currentBook = undefined;
      setTimeout(() => this.setBookById(bookId));
    }, this.changeIntervalMs);
  }
}
