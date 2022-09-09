import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app-component/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ViewPageComponent} from './sites/view-page/view-page.component';
import {HomePageComponent} from './sites/home-page/home-page.component';
import {TopBarComponent} from './components/top-bar/top-bar.component';
import {ViewRendererComponent} from './components/view/view-renderer/view-renderer.component';
import {ViewListComponent} from './components/view/view-list/view-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RestService} from './services/rest/rest.service';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {ViewEditComponent} from './components/view/view-edit/view-edit.component';
import {ViewActionComponent} from './components/view/view-action/view-action.component';
import {EditFieldRenderComponent} from './components/field/edit-field-render/edit-field-render.component';
import {ActionFieldRenderComponent} from './components/field/action-field-render/action-field-render.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {SettingsPageComponent} from './sites/settings-page/settings-page.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { DesktopAutomationFunctionSelectComponent } from './components/view/view-edit/desktop-automation-function-select/desktop-automation-function-select.component';
import {MatSelectSearchModule} from "mat-select-search";

@NgModule({
  declarations: [
    AppComponent,
    ViewPageComponent,
    HomePageComponent,
    TopBarComponent,
    ViewRendererComponent,
    ViewListComponent,
    ViewEditComponent,
    ViewActionComponent,
    EditFieldRenderComponent,
    ActionFieldRenderComponent,
    SettingsPageComponent,
    DesktopAutomationFunctionSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSelectSearchModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {floatLabel: 'auto'}},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: HTTP_INTERCEPTORS, useClass: RestService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
