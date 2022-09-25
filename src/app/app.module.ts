import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app-component/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ViewPageComponent} from './sites/view-page/view-page.component';
import {HomePageComponent} from './sites/home-page/home-page.component';
import {TopBarComponent} from './components/top-bar/top-bar.component';
import {ViewRendererComponent} from './sites/view-page/global/view-renderer/view-renderer.component';
import {ViewListComponent} from './sites/view-page/sub-pages/view-list/view-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RestService} from './services/rest/rest.service';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {ViewEditComponent} from './sites/view-page/sub-pages/view-edit/view-edit.component';
import {ViewActionComponent} from './sites/view-page/sub-pages/view-action/view-action.component';
import {EditFieldRenderComponent} from './sites/view-page/global/view-renderer/edit-field-render/edit-field-render.component';
import {ActionFieldRenderComponent} from './sites/view-page/global/view-renderer/action-field-render/action-field-render.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {SettingsPageComponent} from './sites/settings-page/settings-page.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {DesktopAutomationFunctionSelectComponent} from './sites/view-page/sub-pages/view-edit/field-edit-section/desktop-automation-function-select/desktop-automation-function-select.component';
import {MatSelectSearchModule} from "mat-select-search";
import {BottomBarComponent} from './components/bottom-bar/bottom-bar.component';
import {FieldEditSectionComponent} from './sites/view-page/sub-pages/view-edit/field-edit-section/field-edit-section.component';
import {ViewEditSectionComponent} from './sites/view-page/sub-pages/view-edit/view-edit-section/view-edit-section.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

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
    DesktopAutomationFunctionSelectComponent,
    BottomBarComponent,
    FieldEditSectionComponent,
    ViewEditSectionComponent
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
    MatSelectSearchModule,
    ClipboardModule,
    MatTooltipModule,
    MatButtonToggleModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {floatLabel: 'auto'}},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: HTTP_INTERCEPTORS, useClass: RestService, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
