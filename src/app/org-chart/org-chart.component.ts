import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { OrgChart } from 'd3-org-chart';
import {FormsModule} from '@angular/forms';
import * as d3 from 'd3';
@Component({
  selector: 'app-org-chart',
  imports: [
    FormsModule
  ],
  templateUrl: './org-chart.component.html',
  styleUrl: './org-chart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OrgChartComponent implements OnInit, OnChanges {
@ViewChild('chartContainer') chartContainer!: ElementRef;
@Input() data: any[]=[];
@Input() selectedColumns: string[]=[];
  chart!:any;
  zoom=100
 otherThing='pepe'
  currentZoom: number = 1;
  constructor() {}

  ngOnInit() {}

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
        console.log(node);

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

        // Definir el estilo y estructura para el nodo raíz
        const rootContent = `
    <div class="box__root" style="width:${node.width}px;height:${node.height}px;">
      <div>
        <span class="center">${node.data.customName}</span>
        ${generateDynamicContent()}
      </div>
    </div>
  `;

        // Definir el estilo y estructura para nodos hijos
        const childContent = `
    <div class="box" style="width:${node.width}px;height:${node.height}px;">
      <div>
        <span class="center">${node.data.customName}</span>
        ${generateDynamicContent()}
      </div>
    </div>
  `;

        return node.depth === 0 ? rootContent : childContent;
      })
//       .nodeContent((node:any) => {
//         console.log(node);
//
//         if(node.depth===0){
//           return `<div
//         class="box__root"
//         style="width:${node.width}px;height:${node.height}px;"
//       >
//       <div>
//        <span class="center" > ${node.data.customName }</span>
//
//       <div class="label-value">
//         <span class="label">Stream:</span>
//         <span class="value">M</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Level:</span>
//         <span class="value">8</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Reporting Lines:</span>
//         <span class="value">0</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Revenue Generation:</span>
//         <span class="value">No</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//             <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//
//
//
// </div>
//
//        </div>`;
//         }
//         return `<div
//         class="box"
//         style="width:${node.width}px;height:${node.height}px;"
//       >
//       <div>
//        <span class="center" > ${node.data.customName }</span>
//
//       <div class="label-value">
//         <span class="label">Stream:</span>
//         <span class="value">M</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Level:</span>
//         <span class="value">8</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Reporting Lines:</span>
//         <span class="value">0</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Revenue Generation:</span>
//         <span class="value">No</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//           <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//             <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//         <div class="label-value">
//         <span class="label">Annual Revenue:</span>
//         <span class="value">0</span>
//       </div>
//
//
//
// </div>
//
//        </div>`;
//       })
      .onNodeClick((d: any) => this.handleNodeClick(d))
      // Añadir configuración para alinear en un solo eje horizontal
      .compact(false) // Evita el diseño compacto
      .data(this.data)
      .nodeWidth((d:any) => 188)
      .nodeHeight((d:any) => 366)
      .childrenMargin((d:any) => 108)
      .siblingsMargin((d:any) => 146)
      .compactMarginBetween((d:any) => 35)
      .compactMarginPair((d:any) => 30)


      .render();


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
}

