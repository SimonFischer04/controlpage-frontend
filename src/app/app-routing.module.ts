import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomePageComponent} from './sites/home-page/home-page.component';
import {ViewPageComponent} from './sites/view-page/view-page.component';


const routes: Routes = [
  {path: 'view', component: ViewPageComponent},
  {path: 'home', component: HomePageComponent},
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
