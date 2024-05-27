import { Component } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'personal-project';
  fileCabinetTabs = [
    {
      iconText: 'home',
      type: 'link',
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
      menuName: 'more_options',
      color: 'white',
      active: false,
      activeStyles: {

      },
    },
  ];

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
        });
      }
    });
  }
}
