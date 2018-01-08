import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddWorkerComponent } from './add-worker.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [AddWorkerComponent],
  declarations: [AddWorkerComponent]
})
export class AddWorkerModule { }
