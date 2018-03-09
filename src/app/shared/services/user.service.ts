import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const USER_KEY = 'user_key';
const PROFILE_USER_KEY = 'profile_key';

@Injectable()
export class UserService {
  private currentUser: User;
  private profileUser: User;

  constructor(private http: HttpClient) {
    this.currentUser = this.loadState() || null;
    this.profileUser = this.loadProfile() || null;
  }

  private loadState(): User {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  private saveState(): void {
    localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));
  }


  // Returning a copy of the stored user, if it is not null (if logged in).
  getUser(): any {
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
  //////////
  setProfile(user: User): void {
    this.profileUser = user;
    this.saveProfile();
  }

  getProfile(): any{

     if (this.profileUser == null) {
      return null;
    }

    // Returning copy for added security.
    return { ...this.profileUser };
  }
  
   exitProfile(ID: string): void{
     delete this.profileUser[ID];
     this.saveProfile();
   }


  
  private saveProfile(): void {
    localStorage.setItem(PROFILE_USER_KEY, JSON.stringify(this.profileUser));
  }
  private loadProfile(): User {
    return JSON.parse(localStorage.getItem(PROFILE_USER_KEY));
  }

 
}

export interface User {
  userID: number;
  username: string;
  password: string;
  role: string;
  photo: any;
  firstName: string;
  lastName: string;
  email: string;
  city: string;

}

export interface Feedback{
  auctionID:number; 
  sellerID: number;
  sellerComment: string;
  sellerRating: number;
  buyerID: number;
  buyerComment: string;
  buyerRating: number;
  name: string;//item name
  username: string; //comment maker username
  endTime: string;


}
