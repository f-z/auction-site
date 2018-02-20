import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const USER_KEY = 'user_key';

@Injectable()
export class UserService {
  private currentUser: User;

  constructor(private http: HttpClient) {
    this.currentUser = this.loadState() || null;
  }

  private loadState(): User {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  private saveState(): void {
    localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));
  }

  // Returning a copy of the stored user, if it is not null (if logged in).
  getUser(): User {
    if (this.currentUser == null) {
      return null;
    }

    // Returning copy for added security.
    return { ...this.currentUser };
  }

  setUser(user: User): void {
    this.currentUser = user;
    this.saveState();
  }

  logout(ID: string): void {
    delete this.currentUser[ID];
    this.saveState();
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
