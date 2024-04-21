import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BookModel } from 'src/app/models/book-cover.model';
import { BookCoverService } from 'src/app/services/book-cover.service';

@Component({
  selector: 'app-single-view',
  templateUrl: './single-view.component.html',
  styleUrls: ['./single-view.component.scss'],
})
export class SingleViewComponent implements OnInit {
  book?: BookModel;

  readonly loading$ = this.bookCoverService.observeLoading();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private bookCoverService: BookCoverService
  ) {}

  ngOnInit() {
    if (!this.bookCoverService.books?.length) {
      this.bookCoverService.fetchAndSetBooks();
    }

    this.bookCoverService
      .observeBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((books) => {
        this.route.queryParams
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (queryParams) =>
              (this.book = books.find((b) => b.id === queryParams['bookId']))
          );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
