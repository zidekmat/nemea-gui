import {Component, OnInit} from '@angular/core';
import {NsgTabComponent} from "../nsg-tab/nsg-tab.component";

@Component({
    selector: 'nsg-tabs',
    templateUrl: './nsg-tabs.component.html',
    styleUrls: ['./nsg-tabs.component.scss']
})
export class NsgTabsComponent implements OnInit {
    tabs: NsgTabComponent[] = [];

    constructor() {
    }

    ngOnInit() {
        this.setActiveTab();
    }

    selectTab(tab: NsgTabComponent) {
        for (let tab of this.tabs) {
            tab.active = false;
        }
        tab.active = true;
        history.pushState(null, null,
            window.location.pathname+'#'+tab.slugTitle);
    }

    addTab(tab: NsgTabComponent) {
        this.tabs.push(tab);
    }

    private setActiveTab() {
        let url = window.location.href.split('#');

        if (url.length == 2) {
            // there is hash so let tab activate itself in it's own ngOnInit
            return;
        }

        if (this.tabs.length > 0) {
            this.tabs[0].active = true;
        }
    }
}
