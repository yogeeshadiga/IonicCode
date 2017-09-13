import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Platform, NavController, NavParams, List } from 'ionic-angular';
import { CableAPI } from '../../app/shared/shared';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  subscribers: any = [];/* =
   [{ id: 1, name: 'Superman' },
  { id: 2, name: 'Batman', companyid: 1 },
  { id: 5, name: 'BatGirl', companyid: 1 },
  { id: 3, name: 'Robin', companyid: 2 },
  { id: 4, name: 'Flash', companyid: 2 }];*/
  filteredSubscribers = [];
  subscribersCompany = [];

  selectedCompany: any = [];
  selectedAreas: any = [];

  companies: any = [];
  company: any;
  filterSetting: { companyIDSelected: string, areaIDSelected: string };

  constructor(public navCtrl: NavController, private platform: Platform,
    private navParam: NavParams,
    public http: Http, private cableAPI: CableAPI) {
    //console.log(this.navParam.get('selectedCompany'));

    this.selectedCompany = this.navParam.get('selectedCompany');
    this.selectedAreas = this.navParam.get('selectedAreas');
    //console.log(this.filterSetting);
  }

  public ionViewDidLoad() {
    //let comp = this.cableAPI.getCompanies().then(data => this.companies = data);
    let selectecComp = this.cableAPI.getSubscriberData(1, 1).subscribe(data => {
      this.subscribers = this.filteredSubscribers = data;
    });
  }

  public printHello() {
    let selectecComp = this.cableAPI.getSubscriberData(1, 1).subscribe(
      data => {
        this.subscribers = data;
      });
      //console.log(this.subscribers);

    this.filteredSubscribers = this.subscribers.filter((item) => {
      console.log("item="); //this.subscribers);
      console.log(this.selectedAreas);
      //return true; item.companyid == this.selectedCompany &&
      console.log(this.selectedAreas.indexOf(item.areaid));
      return item.companyid == this.selectedCompany && this.selectedAreas.indexOf(item.areaid) > -1;
    });

    console.log(this.subscribers)
  }

  itemSelected(item) {
    console.log(item);
  }

  getItems(eventVal: any) {
    let searchTerm = eventVal.target.value;
    if (searchTerm && searchTerm != '')
      this.filteredSubscribers = this.subscribers.filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
    else
      this.filteredSubscribers = this.subscribers;

  }

}
