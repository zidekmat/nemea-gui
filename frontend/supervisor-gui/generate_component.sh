#!/bin/bash

name="$1"
camelName=$(ruby -e "print '$name'.split('-').collect(&:capitalize).join; \$stdout.flush")

mkdir $name && cd $name

echo "<h1>$name.component.html</h1>" > $name.component.html
touch $name.component.scss
cat <<COMPONENT_CONTENT > $name.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: '$name',
  templateUrl: './$name.component.html',
  styleUrls: ['./$name.component.scss']
})
export class ${camelName}Component implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
COMPONENT_CONTENT

cd ..
