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
const secret = "she4rJ7hnkzRt3YjYx9ESuK5m2uh2";
const account = xrpl_accountlib_1.derive.familySeed(secret);
const client = new xrpl_client_1.XrplClient("wss://xls20-sandbox.rippletest.net:51233");
const payment = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield client.send({
        command: "account_info",
        account: account.address,
        strict: true,
    });
    console.log(data);
    const { id, signedTransaction } = (0, xrpl_accountlib_1.sign)({
        TransactionType: "Payment",
        Account: account.address,
        Destination: "rLHkajeyngCJfmvsiYC9Zp71KpjTZeJe2q",
        Amount: '1000000',
        Sequence: data.account_data.Sequence,
        Fee: String(12)
    }, account);
    console.log("ID: ", id);
    console.log("signedTransaction: ", signedTransaction);
    const verifyResult = (0, verify_xrpl_signature_1.verifySignature)(signedTransaction);
    console.log("Verified: ", verifyResult);
    const result = yield client.send({
        command: "submit",
        tx_blob: signedTransaction,
    });
    // console.log("hash: ",result?.tx_json.hash);
    console.log(result);
    if (id == result.tx_json.hash) {
        console.log("it is verified");
    }
    else {
        console.log("it is not verified");
    }
});
payment();
