import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Platform, NavController, NavParams, List } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CableAPI } from '../../app/shared/shared';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

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
  uniqueAreas = [];
  filteredSubscribers = [];
  subscribersCompany = [];

  selectedCompany: any = [];
  selectedAreas: any = [];
  selectedDate: any = [];

  companies: any = [];
  company: any;
  filterSetting: { companyIDSelected: string, areaIDSelected: string };
  dbAreas: any = [];
  areaDetails: any = [];

  constructor(public navCtrl: NavController, private platform: Platform,
    private navParam: NavParams,
    public http: Http, private cableAPI: CableAPI,
    public storage: Storage,
    public dbProvider: DatabaseProvider,
    public loadingController: LoadingController) {
    //console.log(this.navParam.get('selectedCompany'));

    this.selectedCompany = this.navParam.get('selectedCompany');
    this.selectedAreas = this.navParam.get('selectedAreas');
    this.selectedDate = this.navParam.get('selectedDate');

    this.dbProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        dbProvider.getAreasForCompany("1").then(data => {
          this.dbAreas = data;
          console.log("areas from db:", this.dbAreas);
        });
      }
    });

    console.log('selectedAreas val', this.selectedAreas);

    this.storage.set('selectedCompany', this.selectedCompany);
    this.storage.set('selectedAreas', this.selectedAreas);
    this.storage.set('selectedDate', this.selectedDate);
    this.storage.set('selectedFilters', {
      selectedCompany: this.selectedCompany, selectedAreas: this.selectedAreas,
      selectedDate: this.selectedDate
    });
  }

  public ionViewDidLoad() {
    if (this.selectedDate && this.selectedDate!= '' && this.selectedDate.indexOf('-') > 0) {
      var dateData = this.selectedDate.split('-');
      this.dbProvider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.dbProvider.getSubscriberPaymentsForAreaAndMonthYear(this.selectedAreas, "01", "2018").then(
            data => {
              this.subscribers = this.filteredSubscribers = data;
              console.log("searched subscribers:", data);
            }
          );
        }
      });

      this.dbProvider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.dbProvider.getAreaForID(this.selectedAreas).then(
            data => {
              this.areaDetails = data[0];
              console.log("selected area:", this.areaDetails.area_name);
            }
          );
        }
      });

      //let comp = this.cableAPI.getCompanies().then(data => this.companies = data);
      /*let selectecComp = this.cableAPI.getSubscriberData(1, 1).subscribe(data => {
        this.subscribers = this.filteredSubscribers = data;
      });*/
    }
  }

  public printHello() {
    let selectecComp = this.cableAPI.getSubscriberData(1, 1).subscribe(
      data => {
        this.subscribers = data;
      });
    this.presentLoadingCustom();
    //console.log(this.subscribers);

    this.filteredSubscribers = this.subscribers.filter((item) => {
      console.log("item="); //this.subscribers);
      console.log(this.selectedAreas);
      //return true; item.companyid == this.selectedCompany &&
      console.log(this.selectedAreas.indexOf(item.areaid));
      return item.companyid == this.selectedCompany && this.selectedAreas.indexOf(item.areaid) > -1;
    });

    console.log(this.subscribers);
  }

  private presentLoadingCustom() {
    let loading = this.loadingController.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`,
      duration: 5000
    });
    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
  }

  itemSelected(item) {
    console.log(item);
  }

  getItems(eventVal: any) {
    this.storage.get('selectedCompany')
      .then((data) => {
        console.log('selectedCompany', data);
      })
      .catch((ex) => { console.log(ex); });

    let searchTerm = eventVal.target.value;
    if (searchTerm && searchTerm != '')
      this.filteredSubscribers = this.subscribers.filter((item) => {
        return item.subscriber_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
    else
      this.filteredSubscribers = this.subscribers;
    // Get all areas
    /*const curr: string[] = this.filteredSubscribers.map(data => data.areaid);
    // Unique areas
    this.uniqueAreas = curr.filter((x, i, a) => x && a.indexOf(x) === i);*/
  }

  savePayment(enteredValue: any) {
    if (enteredValue && enteredValue != '') {
      this.dbProvider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          let paymentmade = { paid_amount: enteredValue.paid_amount, payment_date: "2018-01-10", other_action: "", payment_history_id: enteredValue.payment_history_id };
          this.dbProvider.updatePaymentHistory(paymentmade).then(
            data => {
              console.log("Saved!!!:", data);
            }
          );
        }
      });
    }
  }
}
