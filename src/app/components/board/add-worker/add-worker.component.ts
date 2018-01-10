import {Input, Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DB} from '../db.enum';

@Component({
  selector: 'app-add-worker',
  templateUrl: './add-worker.component.html',
  styleUrls: ['./add-worker.component.scss'],
  providers: [FormBuilder]
})
export class AddWorkerComponent implements OnInit {
  @Input() modalInstance: any;
  @Output() output = new EventEmitter();
  workerForm: FormGroup;

  constructor(private db: AngularFirestore,
              private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm(): void {
    this.workerForm = this.fb.group({
      name: ['', Validators.required],
      skills: ['', Validators.required],
      position: ['', Validators.required],
    });
  }

  add() {
    const name = this.workerForm.controls.name.value;
    const skills = this.workerForm.controls.skills.value;
    const position = this.workerForm.controls.position.value;
    this.db.collection(DB.nodes).doc(name).set({
      name: name,
      skills: skills,
      position: position,
      type: 'worker',
    }).then(() => {
      this.output.emit({name});
      this.modalInstance.close();
    });
  }
}
