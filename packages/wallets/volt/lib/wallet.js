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
exports.VoltWallet = void 0;
const core_1 = require("@polywallet/core");
const nimble_1 = require("@runonbitcoin/nimble");
const sdk_1 = require("@volt.id/sdk");
const types_1 = require("@volt.id/sdk/dist/types");
class VoltWallet {
    constructor() {
        this.authenticateButtonOptions = {
            color: {
                base: ['#2bb696', '#21b593'],
                hover: ['#32af91', '#28af8e'],
            },
            label: 'Volt',
            logo: 'data:image/webp;base64,UklGRjYEAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOEz3AQAALxfABRAH4ziSbSvpcx+PFWhyhmk8bs2D303DbWzbqnL2+R+XyB2Koh6GemgFiiAmc7/XUSTbrjJz///kVVSCFVTihz1IyPFxILeR5EiOBnO13rt7XxC1QiYyO9jSd3/w2ew54tc4Wk8n78XuNL/3Y/WWy+M+40U7+h/Oh229NT7vAwggO86Xw2xPb7qLxv130HF+mJWhR+1/tqa/oz46nJfHuSr9TxnXq+3Rf4A/0EitrXHH463ptpR1GM2Rcp368ztwOR/vpdJLtJOyLqF7h0x6iT3GDP4V9gQQkmsKrwSyiNg6IlhnMAlExhxh/W+rorsAElwL1BGE4KGhJJA6hBQRSKqhKJFBsm3bpu30Z9u2bdsxXpxzzvr/v0g7+95iyhH9V+C2jTLe4egVAAAAAAAAAAAAAAAAAAAAAAAAALUjuyfH6wN07p/Ot1XhmtWPEVm8m+o9z/LiqJKbdyLyiPi8cF9kETFUAXvfi8gj+714EUVExHBitWxFlFF8nb2JBK4aE9j6kZVh/Fy6TJ7LH8ZLq2k7jfl1+ba8UmRP/Ym9+S0J4+/cZXkmL57HEu75lQT9ZeWuvJ7lL33p66NF5EX8WTv7d7W882ai4q/W95HH6/RhlM/EdX+VEk8+xqeZhvaNtxEfDgartqSuuyVpQUdX/X9gPgAA',
        };
        this.isConnected = false;
        this.volt = (0, sdk_1.Bsv)();
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.volt.connectAccount({
                network: types_1.NetWork.Mainnet,
            });
            this.isConnected = yield this.isAuthenticated();
        });
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.volt.getDepositAddress();
                return (this.isConnected = true);
            }
            catch (_a) {
                return (this.isConnected = false);
            }
        });
    }
    getChangeOutputScript() {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('getChangeOutputScript()');
            const address = yield this.volt.getDepositAddress();
            return nimble_1.Address.fromString(address).toScript().toBuffer();
        });
    }
    getSpendableBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('getSpendableBalance()');
            const { free } = yield this.volt.getBsvBalance();
            return parseInt(free, 10);
        });
    }
    sendToBitcoinAddress(destinationAddress, amountSatoshis) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authenticationGuard('sendToBitcoinAddress()');
            const [{ txHex }] = yield this.volt.batchTransfer({
                noBroadcast: false,
                list: [
                    {
                        type: types_1.TransferType.Bsv,
                        data: {
                            receivers: [
                                {
                                    address: destinationAddress,
                                    amount: amountSatoshis.toString(10),
                                },
                            ],
                            amountExact: true,
                        },
                    },
                ],
            });
            return core_1.UtxoP2PKH.fromTransactionHex(txHex, destinationAddress);
        });
    }
    authenticationGuard(method) {
        if (!this.isConnected) {
            throw new core_1.AuthenticationError(`Attempted to call ${method} on Volt wallet while unauthenticated. Please call authenticate() first.`);
        }
    }
}
exports.VoltWallet = VoltWallet;
