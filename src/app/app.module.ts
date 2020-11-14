import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app-component/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionPageComponent } from './sites/view/components/action-page/action-page.component';
import { HomePageComponent } from './sites/home-page/home-page.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { ViewRendererComponent } from './sites/view/components/view-renderer/view-renderer.component';
import { ViewListComponent } from './sites/view/components/view-list/view-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RestService} from './services/rest/rest.service';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    ActionPageComponent,
    HomePageComponent,
    TopBarComponent,
    ViewRendererComponent,
    ViewListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {floatLabel: 'auto'}},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: HTTP_INTERCEPTORS, useClass: RestService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
