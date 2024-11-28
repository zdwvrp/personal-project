import { Component } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'personal-project';
  fileCabinetTabs = [
    {
      iconText: 'home',
      type: 'link',
      title: 'Home',
      link: '/',
      color: 'white',
      active: false,
      activeStyles: {
        'background-color': 'rgba(250, 235, 215, 0.5)'
      },
    },
    {
      iconText: 'check_box_outline_blank',
      type: 'link',
      title: 'Wordle',
      link: '/wordle',
      color: 'pink',
      active: false,
      activeStyles: {
        'background-color': 'pink',
      },
    },
    {
      iconText: 'more_vert',
      type: 'menu',
      title: '',
      menuName: 'more_options',
      color: 'white',
      active: false,
      activeStyles: {

      },
    },
  ];
  activeTab: any = null;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.fileCabinetTabs.filter(tab => tab.type === 'link').forEach(tab => {
          if (tab.link === '/') {
            tab.active = event.url === tab.link;
          } else {
            tab.active = event.url.includes(tab.link);
          }

          if (tab.active) {
            this.activeTab = tab;
          }
        });
      }
    });
  }
}
