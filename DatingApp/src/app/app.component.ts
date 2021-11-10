import { Component, OnInit } from '@angular/core';
import { User } from './models/User';
import { AccountService } from './services/account.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private accountService: AccountService, private userService: UserService) { }
  ngOnInit() {
    this.setCurrentUser();
  }
  setCurrentUser() {
    const user: User | undefined = this.userService.getCurrentUser();
    if (user != undefined) 
      this.accountService.setCurrentUser(user);
  }
}
