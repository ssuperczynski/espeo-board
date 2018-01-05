import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddWorkerComponent } from './add-worker.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [AddWorkerComponent],
  declarations: [AddWorkerComponent]
})
export class AddWorkerModule { }
