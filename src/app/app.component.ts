import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BookCoverService } from './services/book-cover.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  title = 'lcd-books';

  private readonly destroy$ = new Subject<void>();

  constructor(private bookCoverService: BookCoverService) {}

  ngOnInit() {
    this.bookCoverService.fetchAndSetBooks();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
