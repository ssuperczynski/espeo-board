import {Input, Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DB} from '../db.enum';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  providers: [FormBuilder]
})
export class AddProjectComponent implements OnInit {
  @Input() modalInstance: any;
  @Output() output = new EventEmitter();
  projectForm: FormGroup;

  constructor(private db: AngularFirestore,
              private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  add() {
    const name = this.projectForm.controls.name.value;
    this.db.collection(DB.nodes).doc(name).set({
      label: name,
      type: 'project',
    }).then(() => {
      this.output.emit({name});
      this.modalInstance.close();
    });
  }
}
