This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.


use ion-list 'dividers' to display group by cross

use ion-cards to display details page
use grid


use lodash library to manage array

use moment library

use badge to visible show danger color in the background




##Tools used:
Pluralsight course: https://app.pluralsight.com/player?course=ionic2-angular2-typescript-mobile-apps&author=steve-michelotti&name=ionic2-angular2-typescript-mobile-apps-m4&clip=2&mode=live

#Generate JSON:
chrome-extension://lhkmoheomjbkfloacpgllgjcamhihfaj/index.html

#Account created in firebase for quick http access
https://console.firebase.google.com/u/0/project/firsttest-e2fdc/database/data/1/company

Test using in postman tool: https://firsttest-e2fdc.firebaseio.com/1/company.json

#Install Angular Typescript Snippets for easy code snippets
(It takes a while before showing it self)
------------------------------------
##git commands

git clone [url] --branch [master]
git status
git add -a
git commit -m "some comments"
git push

##git for first time:
git remote add origin https://<AccountName>.visualstudio.com/DefaultCollection/_git/<RepoName>
git push -u origin master

-------------------------------------
##Build and run ionic project
>ionic serve 


## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/ionic-team/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/ionic-team/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start myTabs tabs
```

Then, to run it, cd into `myTabs` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.

