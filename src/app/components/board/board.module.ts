import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AddWorkerModule } from './add-worker/add-worker.module';
import { AddWorkerComponent } from './add-worker/add-worker.component';
import { AddProjectModule } from './add-project/add-project.module';
import { AddProjectComponent } from './add-project/add-project.component';

@NgModule({
  imports: [
    CommonModule,
    NgxSmartModalModule.forChild(),
    NoopAnimationsModule,
    AddWorkerModule,
    AddProjectModule
  ],
  exports: [BoardComponent],
  entryComponents: [AddWorkerComponent, AddProjectComponent],
  declarations: [BoardComponent]
})
export class BoardModule { }
