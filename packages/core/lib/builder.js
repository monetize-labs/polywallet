"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletBuilder = void 0;
const utils_1 = require("./utils");
const async_wait_until_1 = require("async-wait-until");
class WalletBuilder {
    constructor() {
        this.timeout = 600000;
        this.wallets = [];
        this.forceShowEnabled = false;
    }
    with(ctor, ...args) {
        this.wallets.push(new ctor(...args));
        return this;
    }
    withHandler(handler) {
        this.handler = handler;
        return this;
    }
    withModal(ctor, ...args) {
        const modal = new ctor(...args);
        this.handler = (wallets) => modal.open(wallets);
        this.afterBuilt = () => modal.close();
        return this;
    }
    forceShow(enabled) {
        this.forceShowEnabled = enabled;
        return this;
    }
    withTimeout(timeout) {
        this.timeout = timeout;
        return this;
    }
    build() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.wallets.length === 0) {
                throw new Error('At least one wallet is required.');
            }
            let wallet = yield this.getAuthenticatedWallet();
            if (wallet && !this.forceShowEnabled) {
                return wallet;
            }
            (_a = this.handler) === null || _a === void 0 ? void 0 : _a.call(this, this.wallets);
            yield (0, async_wait_until_1.waitUntil)(() => __awaiter(this, void 0, void 0, function* () { return !!(wallet = yield this.getAuthenticatedWallet()); }), { timeout: this.timeout });
            if (!wallet) {
                throw new Error('Unable to find an authenticated wallet.');
            }
            (_b = this.afterBuilt) === null || _b === void 0 ? void 0 : _b.call(this);
            return wallet;
        });
    }
    getAuthenticatedWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, utils_1.asyncFind)(this.wallets, (w) => w.isAuthenticated());
        });
    }
}
exports.WalletBuilder = WalletBuilder;
