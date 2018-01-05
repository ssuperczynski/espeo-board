import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-add-worker',
  templateUrl: './add-worker.component.html',
  styleUrls: ['./add-worker.component.scss']
})
export class AddWorkerComponent implements OnInit {
  @Input() modalInstance: any;
  @Output() output = new EventEmitter();
  constructor(private db: AngularFirestore,
  ) { }
  ngOnInit() {
  }

  add() {
    const name = 'worker-' + AddWorkerComponent.rand;
    this.db.collection('nodes').doc(name).set({
      label: name,
      type: 'worker',
    }).then(() => {
      this.output.emit({ name });
      this.modalInstance.close();
    });
  }

  static get rand() {
    // tslint:disable-next-line:no-bitwise
    return ~~(Math.random() * (100 - 10) + 10);
  }

}
