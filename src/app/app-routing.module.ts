import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { SingleViewComponent } from './components/single-view/single-view.component';

const routes: Routes = [
  {
    path: 'single-view',
    component: SingleViewComponent,
  },
  {
    path: 'gallery',
    component: GalleryComponent,
  },
  {
    path: '**',
    redirectTo: 'gallery',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
