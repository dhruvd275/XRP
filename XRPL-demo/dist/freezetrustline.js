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
const client = new xrpl_client_1.XrplClient("wss://s.altnet.rippletest.net:51233");
const secret = "sptv7x8jd8rZBC8C4Tri5oDnfEna5";
const account = xrpl_accountlib_1.derive.familySeed(secret);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = yield client.send({
        id: 1,
        command: "account_info",
        account: account.address,
        strict: true,
    });
    const { id, signedTransaction } = (0, xrpl_accountlib_1.sign)({
        TransactionType: "TrustSet",
        Account: account.address,
        Fee: "10",
        LimitAccount: {
            currency: "BCD",
            issuer: "rBkrHiuEXz3wBMsLooF2y1adtJVFjfPGhE",
            value: "1000",
        },
        ClearFlags: 7,
        Sequence: (_a = data.account_data) === null || _a === void 0 ? void 0 : _a.Sequence,
    }, account);
    console.log("id: ", id);
    console.log("signedTransaction: ", signedTransaction);
    const result = yield client.send({
        command: "submit",
        tx_blob: signedTransaction,
    });
    console.log("Result: ", result);
    const Result = (0, verify_xrpl_signature_1.verifySignature)(signedTransaction);
    console.log("Result:", Result);
});
main();
