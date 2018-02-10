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
var http_1 = require("@angular/common/http");
var RegistrationComponent = (function () {
    function RegistrationComponent(http) {
        this.http = http;
        this.login = true;
        this.localURI = 'https://localhost:3000/php/';
        this.remoteURI = 'https://ucl-group30.azurewebsites.net/php/';
    }
    RegistrationComponent.prototype.register = function () {
        var _this = this;
        console.log('registering');
        var headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json' }), options = { 'userRole': this.userRole, 'firstName': this.firstName,
            'lastName': this.lastName, 'street': this.street, 'city': this.city,
            'postcode': this.postcode, 'username': this.username,
            'email': this.email, 'password': this.password,
            'confirmedPassword': this.confirmedPassword,
            'phone': this.phone, 'day': this.day, 'month': this.month, 'year': this.year,
            'gender': this.gender }, url = this.remoteURI + 'registration.php';
        this.http.post(url, JSON.stringify(options), headers)
            .subscribe(function (data) {
            // If the request was successful, notify the user
            console.log("Congratulations, the user: " + _this.username + " was successfully added!");
        }, function (error) {
            console.log('Something went wrong!');
        });
        this.goBack();
    };
    RegistrationComponent.prototype.goBack = function () {
        window.history.back();
    };
    RegistrationComponent.prototype.show = function () {
        console.log(this.login);
    };
    return RegistrationComponent;
}());
RegistrationComponent = __decorate([
    core_1.Component({
        selector: 'registration',
        templateUrl: './html/registration.html',
        styleUrls: ['./css/registration.css']
    }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], RegistrationComponent);
exports.RegistrationComponent = RegistrationComponent;
//# sourceMappingURL=registration.component.js.map