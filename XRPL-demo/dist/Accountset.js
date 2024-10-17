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
const verify_xrpl_signature_1 = require("verify-xrpl-signature");
const client = new xrpl_client_1.XrplClient("wss://xls20-sandbox.rippletest.net:51233");
const secret = "ssm6X8LY1cHEskYC75Lpv9Z6hDAim";
const account = xrpl_accountlib_1.derive.familySeed(secret);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = yield client.send({
        id: 1,
        command: "account_info",
        account: account.address,
        strict: true,
    });
    // console.log("Data: ",data);
    const payload = {
        TransactionType: "AccountSet",
        Account: account.address,
        Fee: "12",
        Sequence: (_a = data.account_data) === null || _a === void 0 ? void 0 : _a.Sequence,
        SetFlag: 10,
        "NFTokenMinter": "r95Zr5j5ovzWxZLvFXDWUGwTxzQWPPnUAX",
    };
    const { signedTransaction } = (0, xrpl_accountlib_1.sign)(payload, account);
    console.log(signedTransaction);
    const data1 = yield client.send({
        command: "submit",
        tx_blob: signedTransaction,
    });
    console.log(data1);
    const Result = (0, verify_xrpl_signature_1.verifySignature)(signedTransaction);
    console.log("Result: ", Result);
});
main();
