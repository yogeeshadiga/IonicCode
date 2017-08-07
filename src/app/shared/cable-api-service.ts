import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CableAPI {
  private baseURL = 'https://firsttest-e2fdc.firebaseio.com';
  currentCompanySubscribers: any = {};

  constructor(private http: Http) {

  }

  getCompanies() {
    return new Promise(resolve => {
      this.http.get('${this.baseURL}/1/company.json')
        .subscribe(res => resolve(res.json()));
    });
  }
  getSubscriberData(compID) : Observable<any> {
    return this.http.get(`${this.baseURL}/0/subscribers.json`)
      .map((response: Response) => {
        this.currentCompanySubscribers = response.json();
        console.log("from api class:" + this.currentCompanySubscribers);
        return this.currentCompanySubscribers;

      });
  }
}
