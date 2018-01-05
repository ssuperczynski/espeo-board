import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  @Input() modalInstance: any;
  @Output() output = new EventEmitter();
  constructor(private db: AngularFirestore,
  ) { }
  ngOnInit() {
  }

  add() {
    const name = 'project-' + AddProjectComponent.rand;
    this.db.collection('nodes').doc(name).set({
      label: name,
      type: 'project',
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
