import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CableAPI {
  private baseURL = 'https://firsttest-e2fdc.firebaseio.com';
  currentCompanySubscribers: any = {};
company: any = [];

  constructor(private http: Http) {  }

  getCompanies() : Observable<any> {
    return this.http.get(`${this.baseURL}/1/company.json`)
      .map((response: Response) => {
        this.company = response.json();
        return this.company;
      });
 /* {
    return new Promise(resolve => {
      this.http.get(`${this.baseURL}/1/company.json`)
        .subscribe(res => resolve(res.json()));
    });*/
  }

  getSubscriberData(compID, areaID) : Observable<any> {
    return this.http.get(`${this.baseURL}/0/subscribers.json`)
      .map((response: Response) => {
        this.currentCompanySubscribers = response.json();
        return this.currentCompanySubscribers;

      });
  }

  getAreaData(compID) : Observable<any> {
    return this.http.get(`${this.baseURL}/2/area.json`)
      .map((response: Response) => {
        this.currentCompanySubscribers = response.json();
        return this.currentCompanySubscribers;

      });
  }
}
