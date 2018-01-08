import {
  ViewChild,
  Component,
  OnInit,
  NgZone,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
  ComponentFactory
} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {NgxSmartModalService} from 'ngx-smart-modal';
import 'rxjs/add/observable/zip';
import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3-webpack';
import {AddWorkerComponent} from './add-worker/add-worker.component';
import {AddProjectComponent} from './add-project/add-project.component';
import {SVG} from './svg.enum';
import {DB} from './db.enum';
import {OBJECTS} from './objects.enum';
import {EVENT} from './event.enum';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [],
})
export class BoardComponent implements OnInit {
  g = new dagreD3.graphlib.Graph().setGraph({});
  render = new dagreD3.render();
  svg: any;
  inner: any;
  showOptions = false;
  asideType: OBJECTS = OBJECTS.worker;
  private _selectedProject: string = null;
  private _selectedWorker: string = null;
  private _selectedEdgeLabel = null;
  private _selectedEdge: string = null;
  private _selectedNode: string = null;
  public labelValue;
  public nameValue;
  public edges: Array<{ v: string, w: string }>;
  @ViewChild('modalContainer', {read: ViewContainerRef}) container;
  componentRef: ComponentRef<any>;

  constructor(private db: AngularFirestore,
              public modal: NgxSmartModalService,
              private zone: NgZone,
              private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.svg = d3.select('svg');
      this.inner = this.svg.select('g');
    });
    this.initWorkflow();
  }

  addWorker() {
    this.modal.getModal('modal').open();
    this.container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(AddWorkerComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.modalInstance = this.modal.getModal('modal');
    this.componentRef.instance.output.subscribe(event => {
      console.log('event: ', event);
      this.fetchNodes().subscribe();
    });
  }

  addProject() {
    this.modal.getModal('modal').open();
    this.container.clear();
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(AddProjectComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.modalInstance = this.modal.getModal('modal');
    this.componentRef.instance.output.subscribe(event => {
      console.log('event: ', event);
      this.fetchNodes().subscribe();
    });
  }

  initWorkflow() {
    this.fetchBoard().subscribe(() => {
      const zoom = d3.behavior.zoom().on(EVENT.zoom, () => {
        this.inner.attr('transform', 'translate(' + d3.event.translate + ')' +
          'scale(' + d3.event.scale + ')');
      });
      this.svg.call(zoom);
    });
  }

  private drawEdge() {
    const label = `${this.selectedWorker}-${this.selectedProject}`;
    console.log('drawing an edge', label);
    this.db.collection(DB.edges).doc(label).set({
      from: this.selectedProject,
      to: this.selectedWorker,
      time: 160,
    });
    this.resetSelection();
  }

  private bindProject(id: any, node: any) {
    if (this.selectedProject) {
      this.resetSelection();
    } else {
      this.selectedProject = id;
      node.style = 'fill: #F5A9A9; stroke: black; stroke-width:3';
    }
  }

  private bindWorker(id: any, node: any) {
    if (this.selectedWorker) {
      this.resetSelection();
    } else {
      this.selectedWorker = id;
      node.style = 'fill: #F9D76A; stroke: black; stroke-width:3';
    }
  }

  private showAside(type: OBJECTS) {
    this.asideType = type;
    this.showOptions = !this.showOptions;
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

  fetchBoard(): Observable<any> {
    return Observable.zip(
      this.fetchNodes(),
      this.fetchEdges()
    );
  }

  private fetchEdges(): Observable<boolean> {
    this.db
      .collection(DB.edges)
      .valueChanges()
      .subscribe((event: Array<{
        label: string;
        type: string;
      }>) => {
        const edges = this.g.edges();
        edges.forEach((edge) => {
          this.g.removeEdge(edge.v, edge.w);
        });
        console.log('fetching edges: ', event);
        event.forEach((node: any, key) => {
          console.log('element: ', node);
          // todo check if node.to and node.from exists, if not catch error
          this.g.setEdge(node.to, node.from, {
            label: node.time,
            style: 'fill:white; fill-opacity:0; stroke: red; stroke-width: 3px; stroke-dasharray: 5, 5;',
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

  private fetchNodes(): Observable<boolean> {
    this.db
      .collection(DB.nodes)
      .valueChanges()
      .subscribe((event: Array<{
        label: string;
        type: string;
      }>) => {
        event.forEach((element, key) => {
          this.g.setNode(element.label, {
            label: element.label,
            type: element.type,
            style: element.type === 'project' ? 'fill: #F5A9A9' : 'fill: #F9D76A',
          });
        });
        this.render(this.inner, this.g);
        this.bindOnNodeClicked();
      });
    return Observable.of(true);
  }

  bindOnNodeClicked() {
    d3.select('svg')
      .selectAll(SVG.node)
      .on(EVENT.click, id => {
        const node = this.g.node(id);
        this.nameValue = node.label;
        this.selectedNode = this.selectedNode ? null : id;
        this.edges = this.g.nodeEdges(this.selectedNode);
        this.showAside(OBJECTS.worker);
        console.log(`clicked node ${id} type: ${node.type}`);
        if (node.type === 'worker') {
          this.bindWorker(id, node);
        } else {
          this.bindProject(id, node);
        }
        if (this.selectedWorker !== null && this.selectedProject !== null) {
          this.drawEdge();
        }
        this._render();
      });
  }

  bindOnEdgePathClicked() {
    d3.select('svg')
      .selectAll(SVG.edgePath)
      .on(EVENT.click, (obj, id) => {
        this.showAside(OBJECTS.edge);
        console.log('click edge id:', id);
        console.log('click edge obj:', obj);
      });
  }

  bindOnEdgeLabelClicked() {
    d3.select('svg')
      .selectAll(SVG.edgeLabel)
      .on(EVENT.click, (label, id) => {
        this.showAside(OBJECTS.label);
        this.selectedEdgeLabel = label;
        const edge = this.g.edge(label.v, label.w);
        this.labelValue = edge.label;
      });
  }

  saveNode() {
    console.log('updating an node', this.selectedNode);
    // TODO update an edge too
    // this.db
    //   .collection(DB.nodes)
    //   .doc(this.selectedNode)
    //   .update({label: this.nameValue});
  }

  saveLabel() {
    const label = `${this.selectedEdgeLabel.v}-${this.selectedEdgeLabel.w}`;
    console.log('updating an edge', label);
    this.db
      .collection(DB.edges)
      .doc(label)
      .update({time: this.labelValue});
  }

  unlink(edge) {
    this.db
      .collection(DB.edges)
      .doc(`${edge.v}-${edge.w}`)
      .delete()
      .then(() => {
        this.g.removeEdge(edge.v, edge.w);
        this.render(this.inner, this.g);
        this.bindOnNodeClicked();
        this.edges = this.g.nodeEdges(this.selectedNode);
      });
  }

  remove() {
    const node = this.g.node(this.selectedNode);
    const edges = this.g.nodeEdges(this.selectedNode);
    this.db
      .collection(DB.nodes)
      .doc(node.label)
      .delete()
      .then(() => {
        this.g.removeNode(this.selectedNode);
        this.selectedWorker = null;
        this.selectedProject = null;
        this.closeMenu();
        this.render(this.inner, this.g);
        this.bindOnNodeClicked();
      });
    edges.forEach((edge) => {
      this.db
        .collection(DB.edges)
        .doc(`${edge.v}-${edge.w}`)
        .delete();
    });
  }

  closeMenu() {
    this.showOptions = false;
    this.selectedNode = null;
  }

  get selectedWorker(): string {
    return this._selectedWorker;
  }

  set selectedWorker(value: string) {
    this._selectedWorker = value;
  }

  get selectedProject(): string {
    return this._selectedProject;
  }

  set selectedProject(value: string) {
    this._selectedProject = value;
  }

  get selectedNode(): string {
    return this._selectedNode;
  }

  set selectedNode(value: string) {
    this._selectedNode = value;
  }

  get selectedEdgeLabel(): any {
    return this._selectedEdgeLabel;
  }

  set selectedEdgeLabel(value: any) {
    this._selectedEdgeLabel = value;
  }

  private _render(): void {
    this.render(this.inner, this.g);
  }

  isWorker() {
    return (this.asideType === OBJECTS.worker) || (this.asideType === OBJECTS.project);
  }

  isLabel() {
    return this.asideType === OBJECTS.label;
  }
}
