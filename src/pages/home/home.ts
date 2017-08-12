import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CableAPI } from '../../app/shared/shared';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  myDate: String = new Date().toISOString();
  companies: any = [];
  areasInCompany: any = [];

  selectedCompany: any = [];
  selectedAreas: any = [];

  constructor(public navCtrl: NavController, private cableAPI: CableAPI) {

  }

  public ionViewDidLoad() {
    let comp = this.cableAPI.getCompanies().subscribe(data => {
      this.companies = data;
    });
    let area = this.cableAPI.getAreaData(1).subscribe(data => {
      this.areasInCompany = data;
    });
    //console.log(this.companies);
  }
  public gotoAbout(item) {
    //console.log(this.selectedAreaID);

    //this.navCtrl.push(AboutPage, item);
  }

  public gotoAboutPage() {
    this.navCtrl.push(AboutPage, { selectedCompany: this.selectedCompany, selectedAreas: this.selectedAreas });
  }

}
