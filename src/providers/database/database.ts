import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Platform } from 'ionic-angular';

@Injectable()
export class DatabaseProvider {

  db: SQLite;
  constructor(public plt: Platform, private sqlite: SQLite) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          db.executeSql('create table danceMoves(name VARCHAR(32))', {})
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));

      console.log('Hello DatabaseProvider Provider');
    });

  }
}
