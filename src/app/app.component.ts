import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppNavbarComponent} from './app-navbar/app-navbar.component';
import {AppFooterComponent} from './app-footer/app-footer.component';
import * as d3 from 'd3';
import {OrgChartComponent} from './org-chart/org-chart.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppNavbarComponent, AppFooterComponent, OrgChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements OnInit{
  title = 'poc-org-chart';

 data = [
    { customId: 1, customParentId: null, customName: 'CEO' },
    { customId: 2, customParentId: 1, customName: 'node2' },
    { customId: 3, customParentId: 1, customName: 'node3' },
    { customId: 4, customParentId: 2, customName: 'node4' },
    { customId: 5, customParentId: 3, customName: 'node5' },
    { customId: 6, customParentId: 1, customName: 'node6' },
  ];

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
}
