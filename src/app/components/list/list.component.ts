import {Component, OnInit} from '@angular/core';
import {ConfigService} from './configuration.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {DB} from '../board/db.enum';
import {ConfigBusyService} from './configuration-busy.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfigService, ConfigBusyService],
})
export class ListComponent implements OnInit {
  configuration;
  configurationBusy;
  columns = [
    {key: 'name', title: 'Name'},
    {key: 'skills', title: 'Skills'},
    {key: 'position', title: 'Position'},
    {key: 'sum', title: 'Working hours'},
  ];
  busyUsers = [];
  availableUsers = [];

  constructor(private db: AngularFirestore) {
  }

  ngOnInit() {
    this.configuration = ConfigService.config;
    this.configurationBusy = ConfigBusyService.config;
    this.fetchList();
  }

  eventEmitted($event) {

  }

  private fetchList() {
    Observable.zip(
      this.db.collection(DB.nodes, ref => ref.where('type', '==', 'worker'))
        .valueChanges(),
      this.db.collection(DB.edges)
        .valueChanges()
    ).subscribe(data => {
      const users: Array<any> = data[0];
      const edges: Array<any> = data[1];
      users.forEach((user) => {
        user.sum = edges
          .filter(edge => edge.to === user.name)
          .map(edge => edge.time)
          .reduce((acc, val) => acc + val, 0);
      });
      this.busyUsers = [...users];
      this.availableUsers = [...users].filter(user => user.sum < 80);
      console.log('this.availableUsers', this.availableUsers);
    });
  }
}
