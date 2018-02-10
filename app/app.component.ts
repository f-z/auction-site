import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export class Item {
  name: string;
  shortname: string;
  reknown: string;
  bio: string;
}

@Component({
  selector: 'app',
  templateUrl: './html/app.html',
  styleUrls: ['./css/app.css']
})
export class AppComponent implements OnInit {
  items: Item[] = [
    {
      name: 'Used Car',
      shortname: 'car',
      reknown: 'Collectibe model',
      bio: 'blah blah'
    },
    {
      name: 'Red Sofa',
      shortname: 'sofa',
      reknown: 'Beautiful sofa',
      bio: 'blah blah'
    },
    {
      name: 'Tennis Rackets',
      shortname: 'tennis',
      reknown: 'Almost like new',
      bio: 'blah blah'
    }
  ];

  item: Item;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToItemPage(item: Item): void {
    console.log(item);
    this.router.navigate(['item-details'], { queryParams: { item: item }});
  }
}
