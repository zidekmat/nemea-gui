import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nsg-instance-detail',
  templateUrl: './nsg-instance-detail.component.html',
  styleUrls: ['./nsg-instance-detail.component.scss']
})
export class NsgInstanceDetailComponent implements OnInit {
  constructor() { }

  ngOnInit() {
/*      this.route.fragment.subscribe(f => {
          const element = document.querySelector('#' + f);
          if (element) {
              element.scrollIntoView(); // <-- omit element from the argument
          }
      });*/
  }

  removeModule() {
    // TODO, show confirm alert -> modal loading -> success/error
  }

}
