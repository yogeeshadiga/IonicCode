import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  location: { lat: number, lng: number };

  constructor(public navCtrl: NavController,
    private geolocation: Geolocation) { }

  public getGeoLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.location = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
}

