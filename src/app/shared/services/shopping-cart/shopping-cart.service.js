"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var SHOPPING_CART_KEY = 'ngs_shopping_cart';
var ShoppingCartService = (function () {
    function ShoppingCartService() {
        this.state = this.loadState() || {};
    }
    ShoppingCartService.prototype.loadState = function () {
        return JSON.parse(localStorage.getItem(SHOPPING_CART_KEY));
    };
    ShoppingCartService.prototype.saveState = function () {
        localStorage.setItem(SHOPPING_CART_KEY, JSON.stringify(this.state));
    };
    Object.defineProperty(ShoppingCartService.prototype, "totalQuantity", {
        get: function () {
            var _this = this;
            return Object.keys(this.state).reduce(function (total, productId) {
                return total + _this.state[productId];
            }, 0);
        },
        enumerable: true,
        configurable: true
    });
    ShoppingCartService.prototype.getItems = function () {
        // Return a copy of the shopping cart's state.
        return __assign({}, this.state);
    };
    ShoppingCartService.prototype.setItems = function (items) {
        this.state = items;
        this.saveState();
    };
    ShoppingCartService.prototype.addItem = function (productId, quantity) {
        if (quantity > 0) {
            this.state[productId] = (this.state[productId] || 0) + quantity;
            this.saveState();
        }
    };
    ShoppingCartService.prototype.removeItem = function (productId) {
        delete this.state[productId];
        this.saveState();
    };
    ShoppingCartService.prototype.setQuantity = function (productId, quantity) {
        if (quantity > 0) {
            this.state[productId] = quantity;
            this.saveState();
        }
        else {
            this.removeItem(productId);
        }
    };
    return ShoppingCartService;
}());
ShoppingCartService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], ShoppingCartService);
exports.ShoppingCartService = ShoppingCartService;
//# sourceMappingURL=shopping-cart.service.js.map