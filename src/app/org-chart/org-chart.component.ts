import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { OrgChart } from 'd3-org-chart';
import {FormsModule} from '@angular/forms';
import * as d3 from 'd3';
import {NgForOf} from '@angular/common';
import {ModalComponent} from '../modal/modal.component';
@Component({
  selector: 'app-org-chart',
  imports: [
    FormsModule,
    NgForOf,
    ModalComponent
  ],
  templateUrl: './org-chart.component.html',
  styleUrl: './org-chart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OrgChartComponent implements OnInit, OnChanges {
@ViewChild('chartContainer') chartContainer!: ElementRef;
@Input() data: any[]=[];
@Input() isolatedNodes: any[]=[];
@Input() selectedColumns: string[]=[];
@Output() addNewNode=new EventEmitter<any>();
  @Output() removeNode = new EventEmitter<any>();
  chart!:any;
  zoom=100
 otherThing='pepe'
  currentZoom: number = 1;
  constructor() {}

  ngOnInit() {
    (window as any).removeNode = (id: number) => this.emitRemoveNode(id);
    (window as any).editNode = (id: number) => this.emitEditNode(id);
  }
  emitRemoveNode(id: number) {
    console.log('emitRemoveNode', id);

    const confirmation = window.confirm('Are you sure you want to delete this node?');
    if (confirmation) {
      console.log('emitRemoveNode', id);
      this.removeNode.emit(this.data.find(x => x.customId === id));
    }
  }
  emitEditNode(id: number) {
    this.showEditModal=true

  }

  ngAfterViewInit() {
    if (!this.chart) {
      this.chart = new OrgChart();
    }
    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }
  updateChart() {
    if (!this.data) {
      return;
    }
    if (!this.chart) {
      return;
    }
    console.log(   this.chart
      .container(this.chartContainer.nativeElement))
    this.chart
      .container(this.chartContainer.nativeElement)
      .nodeId((dataItem:any) => dataItem.customId)
      .parentNodeId((dataItem:any) => dataItem.customParentId)
      .nodeContent((node: any) => {
        console.log(node, this)
        // Verificar si el nodo es una hoja (no tiene hijos)
        const isLeaf = !node.children || node.children.length === 0;

        // Crear el contenido dinámico basado en columnas seleccionadas
        const generateDynamicContent = () => {
          return this.selectedColumns
            .map(column => `
        <div class="label-value">
          <span class="label">${column}:</span>
          <span class="value">${node.data[column] || 'N/A'}</span>
        </div>
      `)
            .join('');
        };

        // Botón de eliminar solo si es una hoja
        const removeButton = isLeaf ? `
 <i class="remove-btn" onclick="window.editNode(${node.data.customId})">
  <svg viewBox="64 64 896 896" focusable="false" data-icon="edit" width="1em" height="22px" fill="#8592A3" aria-hidden="true"><path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path></svg>

</i>
    <i class="remove-btn" onclick="window.removeNode(${node.data.customId})">
    <svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 18.75C7.76522 18.75 8.01957 18.6315 8.20711 18.4205C8.39464 18.2095 8.5 17.9234 8.5 17.625V10.875C8.5 10.5766 8.39464 10.2905 8.20711 10.0795C8.01957 9.86853 7.76522 9.75 7.5 9.75C7.23478 9.75 6.98043 9.86853 6.79289 10.0795C6.60536 10.2905 6.5 10.5766 6.5 10.875V17.625C6.5 17.9234 6.60536 18.2095 6.79289 18.4205C6.98043 18.6315 7.23478 18.75 7.5 18.75ZM17.5 5.25H13.5V4.125C13.5 3.22989 13.1839 2.37145 12.6213 1.73851C12.0587 1.10558 11.2956 0.75 10.5 0.75H8.5C7.70435 0.75 6.94129 1.10558 6.37868 1.73851C5.81607 2.37145 5.5 3.22989 5.5 4.125V5.25H1.5C1.23478 5.25 0.98043 5.36853 0.792893 5.5795C0.605357 5.79048 0.5 6.07663 0.5 6.375C0.5 6.67337 0.605357 6.95952 0.792893 7.1705C0.98043 7.38147 1.23478 7.5 1.5 7.5H2.5V19.875C2.5 20.7701 2.81607 21.6286 3.37868 22.2615C3.94129 22.8944 4.70435 23.25 5.5 23.25H13.5C14.2956 23.25 15.0587 22.8944 15.6213 22.2615C16.1839 21.6286 16.5 20.7701 16.5 19.875V7.5H17.5C17.7652 7.5 18.0196 7.38147 18.2071 7.1705C18.3946 6.95952 18.5 6.67337 18.5 6.375C18.5 6.07663 18.3946 5.79048 18.2071 5.5795C18.0196 5.36853 17.7652 5.25 17.5 5.25ZM7.5 4.125C7.5 3.82663 7.60536 3.54048 7.79289 3.3295C7.98043 3.11853 8.23478 3 8.5 3H10.5C10.7652 3 11.0196 3.11853 11.2071 3.3295C11.3946 3.54048 11.5 3.82663 11.5 4.125V5.25H7.5V4.125ZM14.5 19.875C14.5 20.1734 14.3946 20.4595 14.2071 20.6705C14.0196 20.8815 13.7652 21 13.5 21H5.5C5.23478 21 4.98043 20.8815 4.79289 20.6705C4.60536 20.4595 4.5 20.1734 4.5 19.875V7.5H14.5V19.875ZM11.5 18.75C11.7652 18.75 12.0196 18.6315 12.2071 18.4205C12.3946 18.2095 12.5 17.9234 12.5 17.625V10.875C12.5 10.5766 12.3946 10.2905 12.2071 10.0795C12.0196 9.86853 11.7652 9.75 11.5 9.75C11.2348 9.75 10.9804 9.86853 10.7929 10.0795C10.6054 10.2905 10.5 10.5766 10.5 10.875V17.625C10.5 17.9234 10.6054 18.2095 10.7929 18.4205C10.9804 18.6315 11.2348 18.75 11.5 18.75Z" fill="#8592A3"/>
</svg>

</i>
  ` : `
  <i class="remove-btn" onclick="window.editNode(${node.data.customId})">
   <svg viewBox="64 64 896 896" focusable="false" data-icon="edit" width="1em" height="22px" fill="#8592A3" aria-hidden="true"><path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path></svg>

</i>`;

        // Definir el contenido para el nodo raíz y los nodos hijos
        const nodeContent = `
    <div class="${node.depth === 0 ? 'box__root' : 'box'}" style="width:${node.width}px;height:${node.height}px;">
      <div>
        <span class="center">${node.data.customName}</span>
        ${generateDynamicContent()}
        ${removeButton} <!-- Botón solo en hojas -->
      </div>
    </div>
  `;

        return nodeContent;
      })
      .onNodeClick((d: any) => this.handleNodeClick(d))
      // Añadir configuración para alinear en un solo eje horizontal
      .compact(false) // Evita el diseño compacto
      .data(this.data)
      .nodeWidth((d:any) => 188)
      .nodeHeight((d:any) => 390)
      .childrenMargin((d:any) => 108)
      .siblingsMargin((d:any) => 146)
      .compactMarginBetween((d:any) => 35)
      .compactMarginPair((d:any) => 30)

      .render();
     this.chart.expandAll();


  }

  handleNodeClick(data: any) {
    console.log('Node clicked:', data);
  }



  zoomIn() {
    this.chart.zoomIn();
    this.currentZoom=this.currentZoom+20

  }

  zoomOut() {
    this.chart.zoomOut();
    this.currentZoom=this.currentZoom-20
  }

  setZoom(zoomStr: number) {
    if (this.chart) {

      const { svg, zoomBehavior } = this.chart.getChartState();
      const zoom= +zoomStr
      if(zoom===0){
        this.chart.fullscreen()
        return
      }
      const targetZoom = zoom / 100;
      svg.transition().call(zoomBehavior.scaleTo, targetZoom);

      this.currentZoom = zoom;
    } else {
      console.error('Chart not initialized.');
    }

}

  protected readonly alert = alert;
  showModal=false;
  showEditModal=false;
  parentPositionSelected=1;
  isolatedNodeSelected=0;
  center() {
    if (this.chart){
      console.log('center')
      this.chart.setCentered(1).render()
    }

  }

  closeModal() {
    this.showModal=false
  }

  closeEditModal() {
    this.showEditModal=false
  }


  addAsChild() {
    this.addNewNode.emit({
      from:this.isolatedNodeSelected,
      to:this.parentPositionSelected,
      node:this.isolatedNodes.find(x=>x.customId===this.isolatedNodeSelected)
    })
  }

  remove(){

  }

  selectIsolatedNode(customId: number) {
    this.isolatedNodeSelected=customId;
    this.showModal=true;
  }

  customNameSelected() {
    return this.isolatedNodes.find(x=>x.customId===this.isolatedNodeSelected)?.customName;
  }
}

