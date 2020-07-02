import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseurl = 'http://127.0.0.1:8000';
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  PredictSentiment(tweet: string): Observable<any> {
    return this.http.get(this.baseurl + '/predict_sentiments/CNN/' + tweet + '/',
    {headers: this.httpHeaders});
  }

  PredictTweetsSentiment(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, 'file');
    console.log(formData);
    return this.http.post(this.baseurl + '/getsentimentstweets/', formData);
  }

  GetTweets(keyword: string): Observable<any> {
    return this.http.get(this.baseurl + '/gettweets/' + keyword + '/',
    {headers: this.httpHeaders});
  }

  downloadFile(data, filename= 'data') {
    const csvData = this.ConvertToCSV(data, ['username', 'Date', 'cleaned_tweets']);
    console.log(csvData);
    const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv; charset=UTF-8;' });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    if (isSafariBrowser) {
        dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}

downloadFileTweetsCorrected(data, filename= 'data') {
  const csvData = this.ConvertToCSV(data, ['Date', 'cleaned_tweets', 'sentiment']);
  console.log(csvData);
  const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv; charset=UTF-8;' });
  const dwldLink = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
  if (isSafariBrowser) {
      dwldLink.setAttribute('target', '_blank');
  }
  dwldLink.setAttribute('href', url);
  dwldLink.setAttribute('download', filename + '.csv');
  dwldLink.style.visibility = 'hidden';
  document.body.appendChild(dwldLink);
  dwldLink.click();
  document.body.removeChild(dwldLink);
}

ConvertToCSV(objArray, headerList) {
     const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
     let str = '';
     let row = 'No,';
     // tslint:disable-next-line:forin
     for (const index in headerList) {
              row += headerList[index] + ',';
          }
     row = row.slice(0, -1);
     str += row + '\r\n';
     for (let i = 0; i < array.length; i++) {
         let line = (i + 1) + '';
         // tslint:disable-next-line:forin
         for (const index in headerList) {
            const head = headerList[index];
            line += ',' + array[i][head];
         }
         str += line + '\r\n';
     }
     return str;
 }

downloadStocksFile(data, filename= 'stocks') {
  const csvData = this.ConvertToCSV(data, ['Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']);
  console.log(csvData);
  const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv; charset=UTF-8;' });
  const dwldLink = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
  if (isSafariBrowser) {
      dwldLink.setAttribute('target', '_blank');
  }
  dwldLink.setAttribute('href', url);
  dwldLink.setAttribute('download', filename + '.csv');
  dwldLink.style.visibility = 'hidden';
  document.body.appendChild(dwldLink);
  dwldLink.click();
  document.body.removeChild(dwldLink);
}

GetStockPrices(stockname: string): Observable<any> {
  return this.http.get(this.baseurl + '/stock_values/' + stockname + '/',
  {headers: this.httpHeaders});
}

CorrelationSentiStocks(sentiments, stocks): Observable<any> {
  const sentimentsData = this.ConvertToCSV(sentiments, ['username', 'Date', 'cleaned_tweets']);
  const stocksCSV = this.ConvertToCSV(stocks, ['Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']);
  const sentimentblob = new Blob(['\ufeff' + sentimentsData], { type: 'text/csv; charset=UTF-8;' });
  const stocksblob = new Blob(['\ufeff' + stocksCSV], { type: 'text/csv; charset=UTF-8;' });
  const formData = new FormData();
  formData.append('file1', sentimentblob, 'file1.csv');
  formData.append('file2', stocksblob, 'file2.csv');
  console.log(formData);
  return this.http.post(this.baseurl + '/calculate_sentiment_score/', formData);
}

}

