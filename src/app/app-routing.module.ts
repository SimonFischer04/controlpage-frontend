import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomePageComponent} from './sites/home-page/home-page.component';
import {ActionPageComponent} from './sites/view/components/action-page/action-page.component';


const routes: Routes = [
  {path: 'action', component: ActionPageComponent},
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
