import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { SingleViewComponent } from './components/single-view/single-view.component';

export interface RouteData {
  autoView?: boolean;
}

const routes: Routes = [
  {
    path: 'single-view',
    component: SingleViewComponent,
  },
  {
    path: 'auto-view',
    component: SingleViewComponent,
    data: <RouteData>{
      autoView: true,
    },
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
