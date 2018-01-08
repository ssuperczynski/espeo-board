import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import {TableModule} from 'ngx-easy-table';
@NgModule({
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [ListComponent],
  declarations: [ListComponent]
})
export class ListModule { }
