import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {ListComponent} from './components/list/list.component';
import { BoardComponent } from './components/board/board.component';

export const routes = [
  {path: '', component: BoardComponent},
  {path: 'board', component: BoardComponent},
  {path: 'list', component: ListComponent},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
