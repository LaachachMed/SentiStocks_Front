import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../dashboard.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})

export class DashboardComponent {
  title = 'Dashboard for sentiments and stocks';
  Tweet;
  filename = '';
  file: File = null;
  response;
  keyword;
  listTweets;
  stockprices;
  listTWeetNotJson;
  StocksNotJson;
  StockStatus;
  myForm: FormGroup;
  chartdata = null;
  days = [];
  neutral = [];
  positive = [];
  negative = [];

  numberNeg = [];
  numberPos = [];
  numberNeutre = [];

  constructor(private api: DashboardService, private fb: FormBuilder) {
    this.Tweet = [{content: '',
                   sentiment : ''
  }];
    this.keyword = '';
    this.stockprices = '';
    this.StockStatus = '';
  }
  public lineChartData: ChartDataSets[] = [
    // { data: this.negative, label: 'Negative Sentiments' },
    // { data: this.positive, label: 'Positive Sentiments' },
    // {data: this.neutral, label: 'Neutral Sentiments'}
    { data: this.numberNeg, label: 'Negative Sentiments' },
    { data: this.numberPos, label: 'Positive sentiments' },
    { data: this.numberNeutre, label: 'Neutral Sentiments' }
  ];
  public lineChartLabels: Label[] = ['Sentiments'];

  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'bar';
  public lineChartPlugins = [];
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.myForm = this.fb.group({
      data_form: this.fb.array([])
    });
  }
  getSentiment() {
    this.api.PredictSentiment(this.Tweet.content).subscribe(
      data => {
      console.log(data.results);
      this.Tweet.sentiment = data.results;
    },
    error => {
      console.log(error);
    }
  );
  }

  onFileSelected(event) {
    console.log(event);
    this.filename = event.target.files[0].name;
    this.file = event.target.files[0] as File;
    console.log(this.file);
  }

  getTweetsSentiment() {
    this.api.PredictTweetsSentiment(this.file).subscribe(
      data => {
        // tslint:disable-next-line:no-string-literal
        this.response = JSON.parse(data);
        console.log(this.response);
      },
      error => {
        console.log(error);
      }
    );
  }

  onChange(tweet: string, sentiment: string, isChecked: boolean) {
    const tweetFormArray = this.myForm.controls.data_form as FormArray;

    if (isChecked) {
      // tweetFormArray.push(new FormControl({tweet, sentiment}));
      for (const index in this.response) {
        if (this.response[index].cleaned_tweets === tweet) {
          console.log(index);
          this.response[index].sentiment = sentiment;
          console.log(this.response);
        }
      }
    } else {
      const index = tweetFormArray.controls.findIndex(x => x.value === tweet);
      // tweetFormArray.removeAt(index);
    }
    // console.log(tweetFormArray.value);
  }
  correctSentiment() {
    this.api.downloadFileTweetsCorrected(this.response, 'TweetsCorrected');
  }
  getTweets() {
    const modal = document.getElementById('myModal');
    // Get the button that opens the modal
    const btn = document.getElementById('myBtn');
    modal.style.display = 'block';
    this.api.GetTweets(this.keyword).subscribe(
      data => {
        let tempN = 0;
        let tempP = 0;
        let tempNe = 0;
        this.listTweets = JSON.parse(data);
        this.listTWeetNotJson = data;
        if (this.listTweets !== null) {
          modal.style.display = 'none';
        }
        console.log(this.listTWeetNotJson);
        for (const index in this.listTweets) {
         if ( this.listTweets[index].sentiment === '1') {
            tempP++;
         } else if (this.listTweets[index].sentiment === '-1') {
           tempN++;
         } else if (this.listTweets[index].sentiment === '0') {
           tempNe++;
         }
        }
        this.numberNeutre.push(tempNe);
        this.numberPos.push(tempP);
        this.numberNeg.push(tempN);
      },
      error => {
        console.log(error);
      }
    );
  }
  download() {
    this.api.downloadFile(this.listTWeetNotJson, 'jsontocsv');
  }

  GetStockPrices() {

    this.api.GetStockPrices(this.keyword).subscribe(
      data => {
        this.StocksNotJson = data;
        this.stockprices = JSON.parse(data);
        console.log(this.StocksNotJson);
      },
      error => {
        console.log(error);
      }
    );
  }

  download_stocks() {
    this.api.downloadStocksFile(this.StocksNotJson, 'stocks');
  }
  closeModal() {
    const modal = document.getElementById('exampleModal');
    // Get the button that opens the modal
    const btn = document.getElementById('btnCorrelation');
    modal.style.display = 'none';
  }

  Correlation() {
    const modal = document.getElementById('exampleModal');
    // Get the button that opens the modal
    const btn = document.getElementById('btnCorrelation');
    modal.style.display = 'block';
    this.api.CorrelationSentiStocks(this.listTWeetNotJson, this.StocksNotJson).subscribe(
      data => {
      // tslint:disable-next-line:no-string-literal
      this.StockStatus = data.results;
      console.log(data.results);
    },
    error => {
      console.log(error);
    });
  }
}
