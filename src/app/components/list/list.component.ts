import {Component, OnInit} from '@angular/core';
import {ConfigService} from './configuration.service';
import {AngularFirestore} from 'angularfire2/firestore';
import {DB} from '../board/db.enum';
import {ConfigBusyService} from './configuration-busy.service';

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
    {key: 'user', title: 'USER'},
    {key: 'label', title: 'SKILLS'},
    {key: 'status', title: 'STATUS'},
  ];
  data = [
    {user: 'foo', label: 'fullstack', status: 'available'},
    {user: 'foo2', label: 'fullstack', status: 'available'},
    {user: 'foo3', label: 'front', status: 'available'},
    {user: 'foo4', label: 'front', status: 'available'},
    {user: 'foo5', label: 'front', status: 'busy'},
    {user: 'foo6', label: 'front', status: 'busy'},
    {user: 'foo7', label: 'fullstack', status: 'busy'},
    {user: 'foo8', label: 'fullstack', status: 'busy'},
    {user: 'foo9', label: 'back', status: 'busy'},
    {user: 'foo10', label: 'back', status: 'busy'},
    {user: 'foo11', label: 'back', status: 'busy'},
    {user: 'foo12', label: 'back', status: 'part-time'},
    {user: 'foo13', label: 'back', status: 'part-time'},
    {user: 'foo14', label: 'back', status: 'part-time'},
    {user: 'foo15', label: 'back', status: 'part-time'},
    {user: 'foo16', label: 'back', status: 'part-time'},
    {user: 'foo17', label: 'back', status: 'part-time'},
  ];

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
    this.db.collection(DB.nodes, ref => ref.where('type', '==', 'worker'))
      .valueChanges()
      .subscribe((event) => {
        console.log('event: ', event);
      });
  }
}
