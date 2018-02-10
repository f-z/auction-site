import { Component } from "@angular/core";
import { Item } from "./app.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "item-details",
  templateUrl: "./html/item-details.html",
  styleUrls: ["./css/item-details.css"],
  inputs: ["item"]
})
export class ItemDetailsComponent {
  item: Item;
  private sub: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.item = params['item'];
      console.log(this.item);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
