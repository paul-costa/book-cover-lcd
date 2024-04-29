import { Component, OnInit, inject } from '@angular/core';
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
export class SingleViewComponent implements OnInit {
  currentBook?: BookModel;

  readonly loading$: Observable<boolean>;

  private books: BookModel[] = [];
  private bookChangeInterval?: NodeJS.Timeout;

  private readonly changeIntervalMs = 4 * 1000;

  private readonly bookCoverService = inject(BookCoverService);
  private readonly destroy$ = new Subject<void>();
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.loading$ = this.bookCoverService.observeLoading();

    const queryParams = this.activatedRoute.snapshot?.queryParams;
    const routeData: RouteData = this.activatedRoute.snapshot?.data;

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

  ngOnInit() {
    if (!this.bookCoverService.books?.length) {
      this.bookCoverService.fetchAndSetBooks();
    }
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
      let bookId;

      if (this.books[currentBookNr + 1] != null) {
        currentBookNr++;
        bookId = this.books[currentBookNr]?.id;
      }

      this.setBookById(bookId);
    }, this.changeIntervalMs);
  }
}
