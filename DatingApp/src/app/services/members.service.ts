import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Member } from '../models/Member';
import { PaginatedResult } from '../models/Pagination';
import { User } from '../models/User';
import { UserParams } from '../models/UserParams';
import { AccountService } from './account.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  memberCache = new Map();
  user: User;
  userParams: UserParams;
  constructor(private http: HttpClient, private userService: UserService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(this.user);
    });
  }
  getUserParams() {
    return this.userParams;
  }
  setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }
  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
  getMembers(userParams: UserParams) {
    const key = Object.values(userParams).join('-');
    var response = this.memberCache.get(key);
    if (response) {
      return of(response);
    }
    let params = this.getHeaders(userParams);
    let members = this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params)
      .pipe(map(response => {
        this.memberCache.set(key, response);
      }));
    return members;
  }
  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body ?? {} as T;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination') ?? '{}');
        }
        return paginatedResult;
      })
    );
  }
  private getHeaders(userParams: UserParams): HttpParams {
    let params = new HttpParams();
    params = params.append('pageNumber', userParams.pageNumber.toString());
    params = params.append('pageSize', userParams.pageSize.toString());
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return params;
  }
  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((a, e) => a.concat(e.result), [])
      .find((member: Member) => member.username === username);
    if (member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  updateMember(member: Member) {
    return this.http.put(this.baseUrl + "users", member);
  }
  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }
  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
