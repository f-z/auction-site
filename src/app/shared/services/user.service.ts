import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  currentUser: User;

  constructor(private http: HttpClient) {
    this.currentUser = null;
  }
}

export interface User {
  ID: number;
  username: string;
  password: string;
  photo: Blob;
  firstName: string;
  lastName: string;
  email: string;
}
