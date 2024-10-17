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
const xrpl_client_1 = require("xrpl-client");
const xrpl_accountlib_1 = require("xrpl-accountlib");
const secret = "sa9xSwBg86LoiToncEaeV1pVehuMg";
const account = xrpl_accountlib_1.derive.familySeed(secret);
const client = new xrpl_client_1.XrplClient("wss://s.altnet.rippletest.net:51233");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = yield client.send({
        id: 1,
        command: "account_info",
        account: account.address,
        strict: true,
    });
    console.log(data);
    const payload = {
        TransactionType: "TrustSet",
        Account: account.address,
        Fee: "10",
        "LimitAmount": {
            currency: "TEC",
            issuer: "rHGYw6Ep2VrPN7SYQgxZz5vDeCzc4U2AH8",
            value: "100000"
        },
        // "SetFlag": 8,
        "Sequence": (_a = data.account_data) === null || _a === void 0 ? void 0 : _a.Sequence,
    };
    const { signedTransaction } = (0, xrpl_accountlib_1.sign)(payload, account);
    const data1 = yield client.send({
        command: "submit",
        tx_blob: signedTransaction
    });
    console.log(data1);
});
main();
