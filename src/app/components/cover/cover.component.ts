import { Component, Input, inject } from '@angular/core';
import { BookModel } from 'src/app/models/book-cover.model';
import { BookCoverService } from 'src/app/services/book-cover.service';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss'],
})
export class CoverComponent {
  @Input()
  book?: BookModel;

  readonly loading$ = inject(BookCoverService).observeLoading();
}
