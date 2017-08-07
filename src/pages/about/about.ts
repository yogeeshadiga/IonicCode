import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Platform, NavController } from 'ionic-angular';
import { CableAPI } from '../../app/shared/shared';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  subscribers = [{ id: 1, name: 'Superman' },
  { id: 2, name: 'Batman' },
  { id: 5, name: 'BatGirl' },
  { id: 3, name: 'Robin' },
  { id: 4, name: 'Flash' }];
companies: any = [];

  constructor(public navCtrl: NavController, private platform: Platform,
    public http: Http, private cableAPI: CableAPI) {
    console.log('writing');
  }

  public ionViewDidLoad() {
    let comp = this.cableAPI.getCompanies().then(data=> this.companies = data);
    console.log(comp);
    console.log('here');
    let selectecComp = this.cableAPI.getSubscriberData(1).subscribe(data => {
      //this.subscribers = data.currentCompanySubscribers;
      console.log(this.subscribers);
    });
  }

  public printHello() {
    let selectecComp = this.cableAPI.getSubscriberData(1).subscribe(
      data => {
        this.subscribers = data;
      });
  }
  itemSelected(item) {
    console.log(item);
  }

}
