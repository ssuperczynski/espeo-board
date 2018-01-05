import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { routing } from './routes';
import { ListModule } from './components/list/list.module';
import { BoardModule } from './components/board/board.module';
import { RouterModule } from '@angular/router';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { AngularFirestoreModule } from 'angularfire2/firestore';

const config = {
  apiKey: 'AIzaSyDUUWnElboZX82vwb0jcO1RG5sTFc-M1Tk',
  authDomain: 'espeo-board.firebaseapp.com',
  databaseURL: 'https://espeo-board.firebaseio.com',
  projectId: 'espeo-board',
  storageBucket: 'espeo-board.appspot.com',
  messagingSenderId: '886007210926'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ListModule,
    BoardModule,
    RouterModule,
    NgxSmartModalModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    routing
  ],
  providers: [NgxSmartModalService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
