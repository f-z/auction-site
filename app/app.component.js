"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var Item = (function () {
    function Item() {
    }
    return Item;
}());
exports.Item = Item;
var AppComponent = (function () {
    function AppComponent(router) {
        this.router = router;
        this.items = [
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
    }
    AppComponent.prototype.ngOnInit = function () { };
    AppComponent.prototype.goToItemPage = function (item) {
        console.log(item);
        this.router.navigate(['item-details'], { queryParams: { item: item } });
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'app',
        templateUrl: './html/app.html',
        styleUrls: ['./css/app.css']
    }),
    __metadata("design:paramtypes", [router_1.Router])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map