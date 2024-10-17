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
if (process.argv.length < 3) {
    console.log("Usage: node dist/index.js <FamilySeed> ");
    process.exit(1);
}
const xrpl_client_1 = require("xrpl-client");
const xrpl_accountlib_1 = require("xrpl-accountlib");
const verify_xrpl_signature_1 = require("verify-xrpl-signature");
const client = new xrpl_client_1.XrplClient("wss://s.altnet.rippletest.net:51233");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!xrpl_accountlib_1.utils.isValidAddress(process.argv[2])) {
        console.log("Invalid FamilySeed");
        process.exit(1);
    }
    const account = xrpl_accountlib_1.derive.familySeed(process.argv[2]);
    const data = yield client.send({
        id: 1,
        command: "account_info",
        account: account.address,
        strict: true,
    });
    console.log("Balance: ", ((_a = data.account_data) === null || _a === void 0 ? void 0 : _a.Balance) / 1000000, "XRP");
    // if(data.Balance<process.argv[4]){
    //     console.log("doesn't have enough fund");
    // }
    const { id, signedTransaction } = (0, xrpl_accountlib_1.sign)({
        TransactionType: "Payment",
        Account: account.address,
        Destination: process.argv[3],
        Amount: String(process.argv[4]),
        Sequence: data.account_data.Sequence,
        Fee: String(12)
    }, account);
    console.log("id: ", id);
    console.log("signedTransaction: ", signedTransaction);
    const verifyResult = (0, verify_xrpl_signature_1.verifySignature)(signedTransaction);
    console.log("Verified: ", verifyResult);
    const result = yield client.send({
        command: "submit",
        tx_blob: signedTransaction,
    });
    console.log("Result: ", result);
    // if(data.error){
    //     console.log("Error:", data.error_message);
    //     process.exit(1);
    // }
    // console.log("LedgerEntryType: ",data.account_data?.LedgerEntryType);
    // console.log("Balance: ",data.account_data?.Balance /1000000 ,"XRP");
    // console.log("Owner: ",data.account_data?.OwnerCount);
    // console.log("Sequence: ",data.account_data?.Sequence);
    // console.log("Current Ledger index: ",data.account_data?.ledger_current_index);
});
main();
