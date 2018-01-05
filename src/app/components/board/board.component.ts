import {
  ViewChild,
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  TemplateRef,
  NgZone,
  ComponentFactoryResolver,
  ViewContainerRef,
  Injector,
  ComponentRef,
  ComponentFactory
} from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { NgxSmartModalService } from 'ngx-smart-modal';

import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3-webpack';
import { AddWorkerComponent } from './add-worker/add-worker.component';
import { AddProjectComponent } from './add-project/add-project.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [],
})
export class BoardComponent implements OnInit, OnDestroy {
  g = new dagreD3.graphlib.Graph().setGraph({});
  render = new dagreD3.render();
  svg: any;
  inner: any;
  showOptions = false;
  private _selectedProject: number = null;
  private _selectedWorker: number = null;
  private _selectedNode: number = null;
  @ViewChild('modalContainer', { read: ViewContainerRef }) container;
  componentRef: ComponentRef<any>;
  constructor(
    private db: AngularFirestore,
    public modal: NgxSmartModalService,
    private zone: NgZone,
    private resolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.svg = d3.select('svg');
      this.inner = this.svg.select('g');
    });
    this.initWorkflow();
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }

  addWorker(template: TemplateRef<any>) {
    this.modal.getModal('modal').open();
    this.container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(AddWorkerComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.modalInstance = this.modal.getModal('modal');
    this.componentRef.instance.output.subscribe(event => {
      console.log('event: ', event);
      this.componentRef.destroy();
    });
  }

  addProject(template: TemplateRef<any>) {
    this.modal.getModal('modal').open();
    this.container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(AddProjectComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.modalInstance = this.modal.getModal('modal');
    this.componentRef.instance.output.subscribe(event => {
      console.log('event: ', event);
      this.componentRef.destroy();
    });
  }

  initWorkflow() {
    this.fetchNodes().subscribe(() => {
      const zoom = d3.behavior.zoom().on('zoom', () => {
        this.inner.attr('transform', 'translate(' + d3.event.translate + ')' +
          'scale(' + d3.event.scale + ')');
      });
      this.svg.call(zoom);
    });
  }

  bindOnNodeClicked() {
    d3.select('svg')
      .selectAll('.node')
      .on('click', id => {
        const node = this.g.node(id);
        if (!this.selectedNode) {
          this.showOptions = true;
          this.selectedNode = node;
        } else {
          this.selectedNode = null;
          this.showOptions = false;
        }
        console.log(`clicked node ${id} type: ${node.type}`);
        if (node.type === 'worker') {
          if (this.selectedWorker) {
            this.resetSelection();
          } else {
            this.selectedWorker = id;
            node.style = 'fill: #F9D76A; stroke: black; stroke-width:3';
          }
        } else {
          if (this.selectedProject) {
            this.resetSelection();
          } else {
            this.selectedProject = id;
            node.style = 'fill: #F5A9A9; stroke: black; stroke-width:3';
          }
        }
        if (this.selectedWorker !== null && this.selectedProject !== null) {
          const label = `${this.selectedWorker}-${this.selectedProject}`;
          console.log('drawing an edge', label);
          this.db.collection('edges').doc(label).set({
            from: this.selectedProject,
            to: this.selectedWorker,
          });
          this.resetSelection();
        }
        this._render();
        // dagreD3.select(id);
        // d3.event.stopPropagation();
      });
  }

  private resetSelection() {
    if (this.selectedWorker) {
      this.g.node(this.selectedWorker).style = 'fill: #F9D76A;';
    }
    if (this.selectedProject) {
      this.g.node(this.selectedProject).style = 'fill: #F5A9A9;';
    }

    this.selectedWorker = null;
    this.selectedProject = null;
  }

  fetchNodes(): any {
    this.db
      .collection('nodes')
      .valueChanges()
      .subscribe((event: Array<{ label: string, type: string }>) => {
        console.log('fetching nodes: ', event);
        event.forEach((element, key) => {
          this.g.setNode(key, {
            label: element.label,
            type: element.type,
            style: element.type === 'project' ? 'fill: #F5A9A9' : 'fill: #F9D76A',
          });
        });
        this.render(this.inner, this.g);
        this.bindOnNodeClicked();
      });
    this.db
      .collection('edges')
      .valueChanges()
      .subscribe((event: Array<{ label: string, type: string }>) => {
        console.log('fetching edges: ', event);
        event.forEach((element: any, key) => {
          console.log('element: ', element);
          this.g.setEdge(
            element.to,
            element.from,
            {
              label: element.label ? element.label : '160h',
              style: 'fill:#ffffff; stroke: #f66; stroke-width: 3px; stroke-dasharray: 5, 5;',
              arrowheadStyle: 'fill: #f66',
              lineInterpolate: 'basis',
              labeloffset: 50,
              labelpos: 'l'
            });
        });
        this.render(this.inner, this.g);
        this.bindOnEdgePathClicked();
        this.bindOnEdgeLabelClicked();
      });

    return Observable.of(true);
  }

  bindOnEdgePathClicked() {
    d3.select('svg').selectAll('.edgePath').on('click', (id, obj) => {
      console.log('clicked edge:', id);
      // dagreD3.select(id);
      // d3.event.stopPropagation();
    });
  }

  bindOnEdgeLabelClicked() {
    d3.select('svg').selectAll('.edgeLabel').on('click', (id, obj) => {
      console.log('click edge label:', id);
      // dagreD3.select(id);
      // d3.event.stopPropagation();
    });
  }

  get selectedWorker(): number {
    return this._selectedWorker;
  }

  set selectedWorker(value: number) {
    this._selectedWorker = value;
  }

  get selectedProject(): number {
    return this._selectedProject;
  }

  set selectedProject(value: number) {
    this._selectedProject = value;
  }

  get selectedNode(): number {
    return this._selectedNode;
  }

  set selectedNode(value: number) {
    this._selectedNode = value;
  }

  private _render(): void {
    this.render(this.inner, this.g);
  }
}
