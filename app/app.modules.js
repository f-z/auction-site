"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var home_1 = require("./home");
var app_component_1 = require("./app.component");
var app_routing_module_1 = require("./app-routing.module");
var item_component_1 = require("./item.component");
var item_details_component_1 = require("./item-details.component");
var registration_component_1 = require("./registration.component");
var search_pipe_1 = require("./search.pipe");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, app_routing_module_1.AppRoutingModule, http_1.HttpClientModule],
        declarations: [
            home_1.HomeComponent,
            app_component_1.AppComponent,
            registration_component_1.RegistrationComponent,
            item_component_1.ItemComponent,
            item_details_component_1.ItemDetailsComponent,
            search_pipe_1.SearchPipe
        ],
        bootstrap: [home_1.HomeComponent],
        providers: [{ provide: common_1.APP_BASE_HREF, useValue: '/' }]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.modules.js.map