import {Component, AfterContentInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NsgTabComponent} from "../nsg-tab/nsg-tab.component";

@Component({
    selector: 'nsg-tabs',
    templateUrl: './nsg-tabs.component.html',
    styleUrls: ['./nsg-tabs.component.scss']
})
export class NsgTabsComponent implements AfterContentInit {
    tabs: NsgTabComponent[] = [];

    constructor(private activatedRoute : ActivatedRoute,
                private router: Router) {
    }

    ngAfterContentInit() {
        // after tabs has called their ngOnInit
        this.setActiveTab();
        this.activatedRoute.fragment.subscribe(fragment => {
            for (let tab of this.tabs) {
                tab.active = tab.slugTitle == fragment;
            }
        });
    }

    selectTab(tab: NsgTabComponent) {
        for (let tab of this.tabs) {
            tab.active = false;
        }
        tab.active = true;
        this.router.navigate([], {fragment: tab.slugTitle, replaceUrl: true})
    }

    addTab(tab: NsgTabComponent) {
        this.tabs.push(tab);
    }

    private setActiveTab() {
        let url = window.location.href.split('#');

        if (url.length == 2) {
            for (let tab of this.tabs) {
                tab.active = tab.slugTitle == url[1];
            }
            return;
        }

        if (this.tabs.length > 0) {
            this.selectTab(this.tabs[0]);
        }
    }
}
