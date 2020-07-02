import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip  } from 'ng2-charts';
import { ChartsService } from './charts.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { string } from '@amcharts/amcharts4/core';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent {
  keyword = '';
  period = '';
  chartdata = null;
  mapdata = null;
  days = [];
  neutral = [];
  positive = [];
  negative = [];
  pieData = [1, 1, 1];

  constructor(private api: ChartsService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
}


// graphical chart
public lineChartData: ChartDataSets[] = [
  { data: this.negative, label: 'Negative Sentiments' },
  { data: this.positive, label: 'Positive Sentiments' },
  { data: this.neutral, label: 'Neutral Sentiments'}
  // { data: [15, 19, 20, 8, 6, 5, 20], label: 'Series A' },
  // { data: [105, 20, 80, 8, 46, 75, 4], label: 'Series B' },
];

// public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
public lineChartLabels: Label[] = this.days;

public lineChartOptions: ChartOptions = {
  responsive: true,
};
public lineChartColors: Color[] = [
  {
    borderColor: 'black',
  },
];
public lineChartLegend = true;
public lineChartType = 'line';
public lineChartPlugins = [];

// pie chart
public pieChartOptions: ChartOptions = {
  responsive: true,
};
public pieChartLabels: Label[] = [['Positive'], ['Negative'], 'Neutral'];
public pieChartData: SingleDataSet = this.pieData;
public pieChartType = 'pie';
public pieChartLegend = true;
public pieChartPlugins = [];


chart_data() {
let pieN = 0;
let pieP = 0;
let pieNeu = 0;
this.pieData.pop();
this.pieData.pop();
this.pieData.pop();
const modal = document.getElementById('myModal');
// Get the button that opens the modal
const btn = document.getElementById('myBtn');
modal.style.display = 'block';
console.log( 'desired period is ' + this.period);
this.api.getCharts(this.keyword, this.period).subscribe(
    data1 => {
      this.chartdata = JSON.parse(data1 as string);
      console.log(this.chartdata);
      if (this.chartdata !== null) {
         modal.style.display = 'none';
       }
      // tslint:disable-next-line:forin
      for (const index in this.chartdata) {
        console.log(this.chartdata[index].Date);
        this.days.push(this.chartdata[index].Date);
        this.positive.push(this.chartdata[index].positive_score);
        this.negative.push(this.chartdata[index].negative_score);
        this.neutral.push(this.chartdata[index].neutre_score);
        pieN += this.chartdata[index].negative_score;
        pieP += this.chartdata[index].positive_score;
        pieNeu += this.chartdata[index].neutre_score;
        console.log(this.negative);
      }
      this.pieData.push(pieP);
      this.pieData.push(pieN);
      this.pieData.push(pieNeu);
      console.log('-------------------------------');
      console.log(this.pieData);
    },
    error => {
      console.log(error);
    }
  );
}

map_data() {
                          let dataFormap = null;
                          // get data from django server
                          this.api.getMapData(this.keyword).subscribe(
                              datamap => {
                                this.mapdata = JSON.parse(datamap as string);
                                dataFormap = this.mapdata;
                                console.log(this.mapdata);
                              },
                              error => {
                                console.log(error);
                            });
                          setTimeout(() => {
                            console.log('Hello');
                            // Themes begin
                            am4core.useTheme(am4themes_animated);
                          // Themes end

                          // Create map instance
                            const chart = am4core.create('chartdiv', am4maps.MapChart);
                            const interfaceColors = new am4core.InterfaceColorSet();

                            try {
                              chart.geodata = am4geodata_worldLow;
                          } catch (e) {
                              // tslint:disable-next-line:max-line-length
                              chart.raiseCriticalError(new Error('Map geodata could not be loaded. Please download the latest <a href="https://www.amcharts.com/download/download-v4/">amcharts geodata</a> and extract its contents into the same directory as your amCharts files.'));
                          }


                            const label = chart.createChild(am4core.Label);
                          // tslint:disable-next-line:max-line-length
                            label.text = 'Distribution of sentiments\n per country.';
                            label.fontSize = 12;
                            label.align = 'left';
                            label.valign = 'bottom';
                            label.fill = am4core.color('#927459');
                            label.background = new am4core.RoundedRectangle();
                          // label.background.cornerRadius(10, 10, 10, 10);
                            label.padding(10, 10, 10, 10);
                            label.marginLeft = 30;
                            label.marginBottom = 30;
                            label.background.strokeOpacity = 0.3;
                            label.background.stroke = am4core.color('#927459');
                            label.background.fill = am4core.color('#f9e3ce');
                            label.background.fillOpacity = 0.6;

                            const dataSource = chart.createChild(am4core.TextLink);
                            dataSource.text = 'Data source: Twitter API';
                            dataSource.fontSize = 12;
                            dataSource.align = 'left';
                            dataSource.valign = 'top';
                          // tslint:disable-next-line:max-line-length
                            dataSource.url = 'https://developer.twitter.com/en/docs';
                            dataSource.urlTarget = '_blank';
                            dataSource.fill = am4core.color('#927459');
                            dataSource.padding(10, 10, 10, 10);
                            dataSource.marginLeft = 30;
                            dataSource.marginTop = 30;

                          // Set projection
                            chart.projection = new am4maps.projections.Orthographic();
                            chart.panBehavior = 'rotateLongLat';
                            chart.padding(20, 20, 20, 20);

                          // Add zoom control
                            chart.zoomControl = new am4maps.ZoomControl();

                            const homeButton = new am4core.Button();
                          // tslint:disable-next-line:only-arrow-functions
                            homeButton.events.on('hit', function() {
                            chart.goHome();
                          });

                            homeButton.icon = new am4core.Sprite();
                            homeButton.padding(7, 5, 7, 5);
                            homeButton.width = 30;
                            homeButton.icon.path = 'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
                            homeButton.marginBottom = 10;
                            homeButton.parent = chart.zoomControl;
                            homeButton.insertBefore(chart.zoomControl.plusButton);

                            chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color('white');
                            chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;
                            chart.deltaLongitude = 20;
                            chart.deltaLatitude = -20;

                          // limits vertical rotation
                          // tslint:disable-next-line:only-arrow-functions
                            chart.adapter.add('deltaLatitude', function(delatLatitude) {
                              return am4core.math.fitToRange(delatLatitude, -90, 90);
                          });

                          // Create map polygon series

                            const shadowPolygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
                            shadowPolygonSeries.geodata = am4geodata_continentsLow;

                            try {
                              shadowPolygonSeries.geodata = am4geodata_continentsLow;
                          } catch (e) {
                              // tslint:disable-next-line:max-line-length
                              shadowPolygonSeries.raiseCriticalError(new Error('Map geodata could not be loaded. Please download the latest <a href="https://www.amcharts.com/download/download-v4/">amcharts geodata</a> and extract its contents into the same directory as your amCharts files.'));
                          }

                            shadowPolygonSeries.useGeodata = true;
                            shadowPolygonSeries.dx = 2;
                            shadowPolygonSeries.dy = 2;
                            shadowPolygonSeries.mapPolygons.template.fill = am4core.color('#000');
                            shadowPolygonSeries.mapPolygons.template.fillOpacity = 0.2;
                            shadowPolygonSeries.mapPolygons.template.strokeOpacity = 0;
                            shadowPolygonSeries.fillOpacity = 0.1;
                            shadowPolygonSeries.fill = am4core.color('#000');


                          // Create map polygon series
                            const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
                            polygonSeries.useGeodata = true;

                            polygonSeries.calculateVisualCenter = true;
                            polygonSeries.tooltip.background.fillOpacity = 0.2;
                            polygonSeries.tooltip.background.cornerRadius = 20;

                            const template = polygonSeries.mapPolygons.template;
                            template.nonScalingStroke = true;
                            template.fill = am4core.color('#f9e3ce');
                            template.stroke = am4core.color('#e2c9b0');

                            polygonSeries.calculateVisualCenter = true;
                            template.propertyFields.id = 'id';
                            template.tooltipPosition = 'fixed';
                            template.fillOpacity = 1;

                          // tslint:disable-next-line:only-arrow-functions
                            template.events.on('over', function(event) {
                            if (event.target.dummyData) {
                              event.target.dummyData.isHover = true;
                            }
                          });
                          // tslint:disable-next-line:only-arrow-functions
                            template.events.on('out', function(event) {
                            if (event.target.dummyData) {
                              event.target.dummyData.isHover = false;
                            }
                          });

                            const hs = polygonSeries.mapPolygons.template.states.create('hover');
                            hs.properties.fillOpacity = 1;
                            hs.properties.fill = am4core.color('#deb7ad');


                            const graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
                            graticuleSeries.mapLines.template.stroke = am4core.color('#fff');
                            graticuleSeries.fitExtent = false;
                            graticuleSeries.mapLines.template.strokeOpacity = 0.2;
                            graticuleSeries.mapLines.template.stroke = am4core.color('#fff');


                            const measelsSeries = chart.series.push(new am4maps.MapPolygonSeries());
                            measelsSeries.tooltip.background.fillOpacity = 0;
                            measelsSeries.tooltip.background.cornerRadius = 20;
                            measelsSeries.tooltip.autoTextColor = false;
                            measelsSeries.tooltip.label.fill = am4core.color('#000');
                            measelsSeries.tooltip.dy = -5;

                            const measelTemplate = measelsSeries.mapPolygons.template;
                            measelTemplate.fill = am4core.color('#bf7569');
                            measelTemplate.strokeOpacity = 0;
                            measelTemplate.fillOpacity = 0.75;
                            measelTemplate.tooltipPosition = 'fixed';



                            const hs2 = measelsSeries.mapPolygons.template.states.create('hover');
                            hs2.properties.fillOpacity = 1;
                            hs2.properties.fill = am4core.color('#86240c');

                          // tslint:disable-next-line:only-arrow-functions
                            polygonSeries.events.on('inited', function() {
                            // tslint:disable-next-line:only-arrow-functions
                            polygonSeries.mapPolygons.each(function(mapPolygon) {
                              let count = -1;
                              let count2 = -1;
                              let count3 = -1;
                              // console.log(mapPolygon);
                              // tslint:disable-next-line:no-string-literal
                              // tslint:disable-next-line:forin
                              for (const index in dataFormap) {
                                if (dataFormap[index].location === (mapPolygon.id).toLowerCase()) {
                                   console.log(dataFormap[index].positive_score);
                                   count = dataFormap[index].positive_score;
                                   count2 = dataFormap[index].negative_score;
                                   count3 = dataFormap[index].neutre_score;
                                 }
                              }
                              const temp = mapPolygon.id;
                              // const count = data[temp];
                              // const count2 = data2[temp];

                              if (count > -1) {
                                const polygon = measelsSeries.mapPolygons.create();
                                // tslint:disable-next-line:max-line-length
                                polygon.multiPolygon = am4maps.getCircle(mapPolygon.visualLongitude, mapPolygon.visualLatitude, Math.max(0.2, Math.log(count) * Math.LN10 / 10));
                                // tslint:disable-next-line:no-string-literal
                                // tslint:disable-next-line:max-line-length
                                polygon.tooltipText = mapPolygon.dataItem.dataContext['name'] + ': \n positive: ' + count + ' \n negative: ' + count2 + ' \n neutral: ' + count3;
                                mapPolygon.dummyData = polygon;
                                // tslint:disable-next-line:only-arrow-functions
                                polygon.events.on('over', function() {
                                  mapPolygon.isHover = true;
                                });
                                // tslint:disable-next-line:only-arrow-functions
                                polygon.events.on('out', function() {
                                  mapPolygon.isHover = false;
                                });
                              } else {
                                // tslint:disable-next-line:no-string-literal
                                mapPolygon.tooltipText = mapPolygon.dataItem.dataContext['name'] + ': no data';
                                mapPolygon.fillOpacity = 0.9;
                              }

                            });
                          });

                          // const data2 = {
                          //   'MA': 23,
                          // };

                          // const data = {
                          //   'AL': 5.38,
                          //   'AM': 6.5,
                          //   'AO': 2.98,
                          //   'AR': 0.32,
                          //   'AT': 10.9,
                          //   'AU': 5.02,
                          //   'AZ': 17.38,
                          //   'BA': 24.45,
                          //   'BD': 13.4,
                          //   'BE': 12.06,
                          //   'BF': 93.37,
                          //   'BG': 1.68,
                          //   'BI': 0.95,
                          //   'BJ': 93.36,
                          //   'BR': 49.42,
                          //   'BT': 10.03,
                          //   'BY': 26.16,
                          //   'CA': 0.96,
                          //   'CD': 69.71,
                          //   'CF': 4.57,
                          //   'CG': 19.7,
                          //   'CH': 6.19,
                          //   'CI': 14.1,
                          //   'CL': 1.4,
                          //   'CM': 41.26,
                          //   'CN': 2.6,
                          //   'CO': 4.48,
                          //   'CY': 7.69,
                          //   'CZ': 23.09,
                          //   'DK': 1.58,
                          //   'EE': 9.91,
                          //   'EG': 0.63,
                          //   'ES': 4.96,
                          //   'FI': 3.27,
                          //   'FR': 43.26,
                          //   'GA': 3.03,
                          //   'GB': 14.3,
                          //   'GE': 809.09,
                          //   'GH': 39.78,
                          //   'GM': 2.45,
                          //   'GN': 45.98,
                          //   'GQ': 23.74,
                          //   'GR': 154.42,
                          //   'HR': 5.46,
                          //   'HU': 1.44,
                          //   'ID': 16.87,
                          //   'IE': 17.56,
                          //   'IL': 412.24,
                          //   'IN': 47.85,
                          //   'IQ': 12.96,
                          //   'IR': 1.13,
                          //   'IT': 44.29,
                          //   'JP': 3.27,
                          //   'KE': 16.8,
                          //   'KG': 253.37,
                          //   'KH': 0.44,
                          //   'KM': 1.26,
                          //   'KZ': 116.3,
                          //   'LA': 1.33,
                          //   'LK': 0.53,
                          //   'LR': 692.27,
                          //   'LS': 5.9,
                          //   'LT': 14.44,
                          //   'LU': 6.95,
                          //   'LV': 6.09,
                          //   'MA': 0.1,
                          //   'MD': 83.75,
                          //   'ME': 319.75,
                          //   'MG': 2386.35,
                          //   'MK': 28.83,
                          //   'ML': 48.68,
                          //   'MM': 40.31,
                          //   'MN': 0.66,
                          //   'MR': 14.65,
                          //   'MT': 11.65,
                          //   'MV': 9.35,
                          //   'MX': 0.04,
                          //   'MY': 86.41,
                          //   'MZ': 13.49,
                          //   'NA': 12.9,
                          //   'NE': 80.88,
                          //   'NG': 31.44,
                          //   'NL': 1.47,
                          //   'NO': 2.47,
                          //   'NP': 10.8,
                          //   'NZ': 9.23,
                          //   'PE': 1.29,
                          //   'PK': 159.14,
                          //   'PL': 8.24,
                          //   'PT': 16.68,
                          //   'RO': 63.05,
                          //   'RS': 473.46,
                          //   'RU': 14.24,
                          //   'RW': 5.45,
                          //   'SE': 2.64,
                          //   'SG': 8.18,
                          //   'SI': 3.37,
                          //   'SK': 112.78,
                          //   'SN': 3.37,
                          //   'SO': 8.03,
                          //   'SS': 19.3,
                          //   'TD': 75.63,
                          //   'TG': 34.84,
                          //   'TH': 81.02,
                          //   'TL': 9.46,
                          //   'TN': 7.8,
                          //   'TR': 7.08,
                          //   'UA': 1439.02,
                          //   'UG': 62.55,
                          //   'US': 1.32,
                          //   'UZ': 0.99,
                          //   'VE': 179.55,
                          //   'ZA': 3.09,
                          //   'ZM': 9.82,
                          //   'ZW': 0.06
                          // };
                            },
                            4000);
                          console.log('Hello aprés 4 s');
}

}
