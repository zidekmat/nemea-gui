import {Component, OnInit} from '@angular/core';
import {Network, DataSet, Node, Edge, IdType} from 'vis';
import {Router} from '@angular/router';

@Component({
    selector: 'nsg-status',
    templateUrl: './nsg-status.component.html',
    styleUrls: ['./nsg-status.component.scss']
})
export class NsgStatusComponent implements OnInit {
    constructor(private router: Router) {
    }

    ngOnInit() {
        let nodes = new DataSet([
            {id: 1, label: 'module 1'},
            {id: 2, label: 'module 2'},
            {id: 3, label: 'module 3'},
            {id: 4, label: 'module 4'},
            {id: 5, label: 'module 5'}
        ]);
        // create an array with edges
        let edges = new DataSet([
            {from: 1, to: 3, label: 'if0 to if1'},
            {from: 1, to: 2, label: 'if0 to if1'},
            {from: 2, to: 4, label: 'if0 to if1'},
            {from: 2, to: 5, label: 'if0 to if1'},
        ]);
        // create a network
        let container = document.getElementById('graph');
        let data = {
            nodes: nodes,
            edges: edges
        };
        let options = {interaction:{dragNodes: false, dragView: false}};
        let network = new Network(container, data, options);
        network.on('doubleClick', (x) => {
            if (x.nodes && x.nodes.length == 1) {
                let instName = x.nodes[0];
                this.router.navigate([`/nemea/supervisor-gui/instances/${instName}`], {fragment: 'info'})
            }
        });
    }

    onClick(x) {
    }

    navigateToInst(instName: string) {

    }

}
