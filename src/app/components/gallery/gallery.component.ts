import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BookModel } from 'src/app/models/book-cover.model';
import { BookCoverService } from 'src/app/services/book-cover.service';

enum ScrollType {
  Last = 1,
  First = 2,
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnDestroy {
  isAutoScrollActive = false;
  isAutoScrollEnabled = true;

  readonly books$: Observable<BookModel[]>;
  readonly loading$: Observable<boolean>;

  private autoScrollInterval?: NodeJS.Timeout;

  private readonly autoScrollStepSizeInPx = 10;
  private readonly autoScrollIntervalTimeInMs = 50;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private bookCoverService: BookCoverService,
    private router: Router
  ) {
    this.books$ = this.bookCoverService
      .observeBooks()
      .pipe(takeUntil(this.destroy$));

    this.loading$ = this.bookCoverService
      .observeLoading()
      .pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy() {
    clearInterval(this.autoScrollInterval);
    this.autoScrollInterval = undefined;
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBookOpen(bookId: string) {
    if (!bookId) {
      return;
    }
    this.router.navigateByUrl('/single-view?bookId=' + bookId);
  }

  onStartAutoScroll() {
    this.isAutoScrollActive = !this.isAutoScrollActive;
    if (this.isAutoScrollActive) {
      this.scrollTo(ScrollType.Last);
    } else {
      this.isAutoScrollEnabled = false;
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = undefined;

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.isAutoScrollEnabled = true;
      }, 1000);
    }
  }

  onStartAutoNavigation() {
    this.router.navigateByUrl('/auto-view');
  }

  private scrollTo(type: ScrollType, delayInMs: number = 0) {
    let topTarget = type === ScrollType.Last ? 0 : document.body.scrollHeight;

    setTimeout(() => {
      this.autoScrollInterval = setInterval(() => {
        if (
          type === ScrollType.Last
            ? topTarget <= document.body.scrollHeight
            : topTarget >= 0
        ) {
          type === ScrollType.Last
            ? (topTarget += this.autoScrollStepSizeInPx)
            : (topTarget -= this.autoScrollStepSizeInPx);
        } else {
          clearInterval(this.autoScrollInterval);
          this.autoScrollInterval = undefined;
        }

        if (this.isAutoScrollActive) {
          if (type === ScrollType.Last && !this.autoScrollInterval) {
            this.scrollTo(ScrollType.First);
          } else if (type === ScrollType.First && !this.autoScrollInterval) {
            this.scrollTo(ScrollType.Last, 5000);
          } else {
            window.scrollTo({ top: topTarget, behavior: 'smooth' });
          }
        }
      }, this.autoScrollIntervalTimeInMs);
    }, delayInMs);
  }
}
