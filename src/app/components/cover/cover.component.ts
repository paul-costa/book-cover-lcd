import { Component, Input } from '@angular/core';
import { BookModel } from 'src/app/models/book-cover.model';

/**
 * TODO:
 *  title
 *  author
 *  rating (stars)
 *  goodreadsUrl
 */

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss'],
})
export class CoverComponent {
  @Input()
  book?: BookModel;
}
