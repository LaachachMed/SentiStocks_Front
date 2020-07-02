import { Component, OnInit } from '@angular/core';
import {LoginService} from '../login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user;
  isConnected;
  constructor(private api: LoginService, private router: Router) {
    this.user = [{username: '',
                  pswrd : ''
  }];
  }

login() {
  this.api.getUsers(this.user.username, this.user.pswrd).subscribe(
    data => {
    console.log(data[0].UserName);
    if (data[0].UserName === this.user.username && data[0].Password === this.user.pswrd) {
      this.isConnected = data[0].id;
      console.log(this.isConnected);
      this.router.navigateByUrl('/dashboard');
    } else {
      this.isConnected = 'NotAllowed';
      console.log(this.isConnected);
    }
  },
  error => {
    console.log(error);
  }
);
}

}
