import { Component, OnInit, Input } from '@angular/core';
import {NsgTabsComponent} from "../nsg-tabs/nsg-tabs.component";

@Component({
  selector: 'nsg-tab',
  templateUrl: './nsg-tab.component.html',
  styleUrls: ['./nsg-tab.component.scss'],
  host: {'[class.nsg-active]': 'active'}
})
export class NsgTabComponent implements OnInit {
  @Input() tabTitle: string;
  public active: boolean;
  slugTitle : string;

  constructor(tabs: NsgTabsComponent) {
      tabs.addTab(this);
      this.active = false;
  }

  ngOnInit() {
      this.slugTitle = this.tabTitle.toLowerCase().replace(/ /g, '-');

      const url = window.location.href.split('#');
      if (url.length == 2) {
          const hash = url[1];
          if (this.slugTitle == hash) {
              this.active = true;
          }
      }
  }

}
