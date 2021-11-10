import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }
  getCurrentUser(): User | undefined {
    const json: any = localStorage.getItem('user');
    if (!!json) {
      const user: User = JSON.parse(json);
      return user;
    }
    return undefined;
  }
}
