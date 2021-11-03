import { Component, OnInit } from '@angular/core';
import { User } from './models/User';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users: any;
  constructor(private accountService: AccountService) { }
  ngOnInit() {
    this.setCurrentUser();
  }
  setCurrentUser() {
    const json: any = localStorage.getItem('user');
    if (!!json) {
      const user: User = JSON.parse(json);
      this.accountService.setCurrentUser(user);
    }
  }
}
