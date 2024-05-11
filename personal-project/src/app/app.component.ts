import { Component } from '@angular/core';

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
      link: '',
      color: 'white',
    },
    {
      iconText: 'check_box_outline_blank',
      type: 'link',
      link: '/wordle',
      color: 'pink',
    },
    {
      iconText: 'more_vert',
      type: 'menu',
      menuName: 'more_options',
      color: 'white',
    },
  ];
}
