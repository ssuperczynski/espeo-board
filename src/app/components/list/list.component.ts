import { Component, OnInit } from '@angular/core';
import { ConfigService } from './configuration.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfigService],
})
export class ListComponent implements OnInit {
  configuration;
  pagination = {
    limit: 10,
    offset: 1,
    count: 1,
  };
  data;
  columns = [
    {key: 'jobTitle', title: 'APPLICATIONS'},
    {key: 'recruiter', title: 'SUPERVISORS'},
    {key: 'units', title: 'STATUS & CREATION DATE'},
  ];
  constructor() { }

  ngOnInit() {
    this.configuration = ConfigService.config;
  }

  eventEmitted($event) {
    this.data = [
      {jobTitle: 'foo', recruiter: 'John', units: 'some'},
      {jobTitle: 'foo2', recruiter: 'John', units: 'some'},
      {jobTitle: 'foo3', recruiter: 'John', units: 'some'},
      {jobTitle: 'foo4', recruiter: 'John', units: 'some'},
      {jobTitle: 'foo5', recruiter: 'John', units: 'foo'},
      {jobTitle: 'foo6', recruiter: 'John', units: 'foo'},
      {jobTitle: 'foo7', recruiter: 'John', units: 'foo'},
      {jobTitle: 'foo8', recruiter: 'John', units: 'foo'},
      {jobTitle: 'foo9', recruiter: 'John', units: 'foo'},
      {jobTitle: 'foo10', recruiter: 'John', units: 'foo'},
      {jobTitle: 'foo11', recruiter: 'John', units: 'foo'},
      {jobTitle: 'foo12', recruiter: 'John', units: 'bat'},
      {jobTitle: 'foo13', recruiter: 'John', units: 'bat'},
      {jobTitle: 'foo14', recruiter: 'John', units: 'bat'},
      {jobTitle: 'foo15', recruiter: 'John', units: 'bat'},
      {jobTitle: 'foo16', recruiter: 'John', units: 'bat'},
      {jobTitle: 'foo17', recruiter: 'John', units: 'bar'},
    ];
  }

}
