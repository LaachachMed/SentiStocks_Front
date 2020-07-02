import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  baseurl = 'http://127.0.0.1:8000';
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  getCharts(keyword: string, period: string) {
    return this.http.get(this.baseurl + '/chart_sentiment_analysis/' + keyword + '/' + period + '/',
    {headers: this.httpHeaders});
  }
  getMapData(keyword: string) {
    return this.http.get(this.baseurl + '/maps_sentiment/' + keyword + '/',
    {headers: this.httpHeaders});
  }
}
