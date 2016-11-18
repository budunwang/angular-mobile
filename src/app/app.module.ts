import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AppComponent} from "./app.component";
import {IndexComponent} from "./components/index/index.component";
import {SceneFormComponent} from "./components/scene/scene-form.component";
import {PhotosComponent} from "./components/photos/photos.component";
import {MyDialogComponent} from "./common/dialog/my-dialog.component";
import {ConfirmComponent} from "./common/confirm/confirm.component";
import {TabsComponent} from "./common/tabs/tabs.component";
import {TabItemComponent} from "./common/tabs/tabItem.component";
import {PaginationComponent} from "./common/pagination/pagination.component";
import {MessageComponent} from "./common/message/message.component";
import {ViewerComponent} from "./components/viewer/viewer.component";
import {TipComponent} from "./common/tip/tip.component";
import {TruingsComponent} from './components/truings/truings.component'
import {HttpModule, JsonpModule} from "@angular/http";
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    SceneFormComponent,
    PhotosComponent,
    MyDialogComponent,
    ConfirmComponent,
    TabsComponent,
    TabItemComponent,
    PaginationComponent,
    MessageComponent,
    ViewerComponent,
    TipComponent,
    TruingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot([
      {path: 'raw/:photoinfoid', component: PhotosComponent},
      {path: 'truing/:photoinfoid', component: TruingsComponent}
    ]),
    RouterModule.forChild([])
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule {
}
