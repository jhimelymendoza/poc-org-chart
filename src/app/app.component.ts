import {Component, HostListener, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppNavbarComponent} from './app-navbar/app-navbar.component';
import {AppFooterComponent} from './app-footer/app-footer.component';
import * as d3 from 'd3';
import {OrgChartComponent} from './org-chart/org-chart.component';
import {NgForOf, NgIf} from '@angular/common';
import {ScreenLoaderComponent} from './screen-loader/screen-loader.component';
import {AgGridAngular} from 'ag-grid-angular';
import {
  ColDef,
  GridApi, GridReadyEvent,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy
} from 'ag-grid-community';
import {HttpClient} from '@angular/common/http';

export interface IOlympicData {
  athlete: string,
  age: number | null,
  country: string | null,
  year: number,
  date: string | null,
  sport: string,
  gold: number,
  silver: number,
  bronze: number,
  total: number
}

const columnDefinitions: ColDef[] = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
];
const updatedHeaderColumnDefs: ColDef[] = [
  { field: "athlete", headerName: "C1" },
  { field: "age", headerName: "C2" },
  { field: "country", headerName: "C3" },
  { field: "sport", headerName: "C4" },
];
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppNavbarComponent, AppFooterComponent, OrgChartComponent, NgIf, NgForOf, ScreenLoaderComponent, AgGridAngular],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements OnInit{
  title = 'poc-org-chart';
activeTableView=false

 data = [
    { customId: 1, customParentId: null, customName: 'CEO' },
    { customId: 2, customParentId: 1, customName: 'Head of Sales' },
    { customId: 3, customParentId: 1, customName: 'Head of Finance' },
    { customId: 4, customParentId: 2, customName: 'HR Manager' },
    { customId: 5, customParentId: 3, customName: 'PO' },
    { customId: 6, customParentId: 1, customName: 'Scrum Master' },
  ];

isolatedNodes=[
  { customId: 7, customParentId: null, customName: 'Other Position' },
  { customId: 8, customParentId: 1, customName: 'Second Position' },
  { customId: 9, customParentId: 1, customName: 'Third Position' },

]




  columns: string[] = [
    'Stream', 'Level', 'Rev Generation', 'Annual Revenue',
    'Reporting Lines', 'Reports To', 'Direct Reports',
    'FLSA Status', 'FTE', 'Description'
  ];

  selectedColumns:string[]=[...this.columns]

  isPanelOpen = false;
  isLoadingChart=false;

  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = columnDefinitions;
  autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
    type: "fitGridWidth",
  };
  rowData: IOlympicData[]=[
    {"athlete":"Natalie Coughlin","age":25,"country":"United States","year":2008,"date":"24/08/2008","sport":"Swimming","gold":1,"silver":2,"bronze":3,"total":6},
    {"athlete":"Aleksey Nemov","age":24,"country":null,"year":2000,"date":null,"sport":"Gymnastics","gold":2,"silver":1,"bronze":3,"total":6},
    {"athlete":"Alicia Coutts","age":24,"country":"Australia","year":2012,"date":"12/08/2012","sport":"Swimming","gold":1,"silver":3,"bronze":1,"total":5},
    {"athlete":"Missy Franklin","age":17,"country":null,"year":2012,"date":"12/08/2012","sport":"Swimming","gold":4,"silver":0,"bronze":1,"total":5},
    {"athlete":"Ryan Lochte","age":null,"country":"United States","year":2012,"date":null,"sport":"Swimming","gold":2,"silver":2,"bronze":1,"total":5},
    {"athlete":"Allison Schmitt","age":22,"country":"United States","year":2012,"date":"12/08/2012","sport":"Swimming","gold":3,"silver":1,"bronze":1,"total":5},
    {"athlete":"Natalie Coughlin","age":21,"country":"United States","year":2004,"date":"29/08/2004","sport":"Swimming","gold":2,"silver":2,"bronze":1,"total":5},
    {"athlete":"Dara Torres","age":33,"country":"United States","year":2000,"date":"01/10/2000","sport":"Swimming","gold":2,"silver":0,"bronze":3,"total":5},
    {"athlete":"Cindy Klassen","age":null,"country":"Canada","year":2006,"date":"26/02/2006","sport":"Speed Skating","gold":1,"silver":2,"bronze":2,"total":5},
    {"athlete":"Nastia Liukin","age":18,"country":null,"year":2008,"date":"24/08/2008","sport":"Gymnastics","gold":1,"silver":3,"bronze":1,"total":5},
    {"athlete":"Marit Bjørgen","age":29,"country":"Norway","year":2010,"date":null,"sport":"Cross Country Skiing","gold":3,"silver":1,"bronze":1,"total":5},
    {"athlete":"Sun Yang","age":null,"country":"China","year":2012,"date":"12/08/2012","sport":"Swimming","gold":2,"silver":1,"bronze":1,"total":4},
    {"athlete":"Kirsty Coventry","age":24,"country":"Zimbabwe","year":2008,"date":"24/08/2008","sport":"Swimming","gold":1,"silver":3,"bronze":0,"total":4},
    {"athlete":"Libby Lenton-Trickett","age":23,"country":"Australia","year":2008,"date":"24/08/2008","sport":"Swimming","gold":2,"silver":1,"bronze":1,"total":4},
    {"athlete":"Ryan Lochte","age":24,"country":null,"year":2008,"date":null,"sport":"Swimming","gold":2,"silver":0,"bronze":2,"total":4},
    {"athlete":"Inge de Bruijn","age":null,"country":"Netherlands","year":2004,"date":"29/08/2004","sport":"Swimming","gold":1,"silver":1,"bronze":2,"total":4},
    {"athlete":"Petria Thomas","age":28,"country":"Australia","year":2004,"date":"29/08/2004","sport":"Swimming","gold":3,"silver":1,"bronze":0,"total":4},
    {"athlete":"Ian Thorpe","age":21,"country":"Australia","year":2004,"date":"29/08/2004","sport":"Swimming","gold":2,"silver":1,"bronze":1,"total":4},
    {"athlete":"Inge de Bruijn","age":27,"country":"Netherlands","year":2000,"date":"01/10/2000","sport":"Swimming","gold":3,"silver":1,"bronze":0,"total":4},
    {"athlete":"Gary Hall Jr.","age":25,"country":"United States","year":2000,"date":null,"sport":"Swimming","gold":2,"silver":1,"bronze":1,"total":4},
    {"athlete":"Michael Klim","age":23,"country":"Australia","year":2000,"date":"01/10/2000","sport":"Swimming","gold":2,"silver":2,"bronze":0,"total":4},
    {"athlete":"Susie O'Neill","age":27,"country":"Australia","year":2000,"date":"01/10/2000","sport":"Swimming","gold":1,"silver":3,"bronze":0,"total":4},
    {"athlete":"Jenny Thompson","age":27,"country":"United States","year":2000,"date":"01/10/2000","sport":"Swimming","gold":3,"silver":0,"bronze":1,"total":4},
    {"athlete":"Pieter van den Hoogenband","age":22,"country":"Netherlands","year":2000,"date":"01/10/2000","sport":"Swimming","gold":2,"silver":0,"bronze":2,"total":4},
    {"athlete":"An Hyeon-Su","age":20,"country":"South Korea","year":2006,"date":"26/02/2006","sport":"Short-Track Speed Skating","gold":3,"silver":0,"bronze":1,"total":4},
    {"athlete":"Aliya Mustafina","age":17,"country":"Russia","year":2012,"date":"12/08/2012","sport":"Gymnastics","gold":1,"silver":1,"bronze":2,"total":4},
    {"athlete":"Shawn Johnson","age":16,"country":"United States","year":2008,"date":"24/08/2008","sport":"Gymnastics","gold":1,"silver":3,"bronze":0,"total":4},
    {"athlete":"Dmitry Sautin","age":26,"country":"Russia","year":2000,"date":"01/10/2000","sport":"Diving","gold":1,"silver":1,"bronze":2,"total":4},
    {"athlete":"Leontien Zijlaard-van Moorsel","age":30,"country":"Netherlands","year":2000,"date":"01/10/2000","sport":"Cycling","gold":3,"silver":1,"bronze":0,"total":4},
    {"athlete":"Petter Northug Jr.","age":24,"country":"Norway","year":2010,"date":"28/02/2010","sport":"Cross Country Skiing","gold":2,"silver":1,"bronze":1,"total":4},
    {"athlete":"Ole Einar Bjørndalen","age":28,"country":"Norway","year":2002,"date":"24/02/2002","sport":"Biathlon","gold":4,"silver":0,"bronze":0,"total":4}
  ];


  onBtUpdateHeaders() {
    this.gridApi.setGridOption("columnDefs", updatedHeaderColumnDefs);
  }

  onBtRestoreHeaders() {
    this.gridApi.setGridOption("columnDefs", columnDefinitions);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

  }

  @HostListener('document:click', ['$event'])
  closePanel(event: Event) {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.panel') && !clickedElement.closest('.toggle-button')) {
      this.isPanelOpen = false;
    }
  }

  ngOnInit() {
    // d3.csv(
    //   'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv'
    // ).then((data:any) => {
    //   this.data = data;
    //   let prevIndex = 0;
    //   setInterval((d: any) => {
    //       data[prevIndex]._highlighted = false;
    //     let index = Math.floor(Math.random() * 10);
    //     prevIndex = index;
    //     data[index]._centered = true;
    //     data[index]._expanded = true;
    //     data[index]._highlighted = true;
    //     this.data = Object.assign([], data);
    //   }, 1000);
    // });
    // new d3.OrgChart()
    //   .nodeId((dataItem:any) => dataItem.customId)
    //   .parentNodeId((dataItem:any) => dataItem.customParentId)
    //   .nodeWidth((node:any) => 100)
    //   .nodeHeight((node:any) => 100)
    //   .nodeContent((node:any) => {
    //     return `<div
    //     style="background-color:aqua;width:${node.width}px;height:${node.height}px"
    //   >
    //        ${node.data.customName}
    //    </div>`;
    //   })
    //   .container('.chart-container')
    //   .data(this.data)
    //   .render();
  }

  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
    console.log(this.selectedColumns)
  }


  isSelected(column: string) {
    return this.selectedColumns.includes(column);
  }

  updateColumnsSelected(column: string) {
    if(this.selectedColumns.includes(column)){
      this.selectedColumns.splice(this.selectedColumns.indexOf(column), 1);
    }else{
      this.selectedColumns.push(column);
    }
  }

  applyFilters() {
    this.togglePanel()
    this.isLoadingChart=true;
    setTimeout(() => {
      this.isLoadingChart=false;
    }, 1000);
  }

  addNewNode($event: { from: number, to: number , node:any}) {

    this.data.push({...$event.node, customParentId: $event.to})
    this.isolatedNodes=this.isolatedNodes.filter(x=>x.customId!==$event.from)
    this.isLoadingChart=true;
    setTimeout(() => {
      this.isLoadingChart=false;
    }, 1000);
  }
}
