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
const xrpl_accountlib_1 = require("xrpl-accountlib");
const xrpl_client_1 = require("xrpl-client");
const verify_xrpl_signature_1 = require("verify-xrpl-signature");
const client = new xrpl_client_1.XrplClient("wss://xls20-sandbox.rippletest.net:51233");
const Pass = "ssx3BeHZFw3afsc3MyU39H6BJ3QvH"; // issuer secret phase
const account = xrpl_accountlib_1.derive.familySeed(Pass);
// ======== Giving authorisation to other wallet address for minting================ // 
const auth = () => {
    const main = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const data = yield client.send({
            id: 1,
            command: "account_info",
            account: account.address,
            strict: true,
        });
        const payload = {
            TransactionType: "AccountSet",
            Account: account.address,
            Fee: "12",
            "Sequence": (_a = data.account_data) === null || _a === void 0 ? void 0 : _a.Sequence,
            SetFlag: 10,
            "NFTokenMinter": "r439ShDLvXH5NXPmjCWqUFLfzdUJiTLSRH",
        };
        const { signedTransaction } = (0, xrpl_accountlib_1.sign)(payload, account);
        const Submit = yield client.send({
            command: "submit",
            tx_blob: signedTransaction,
        });
        console.log("Submit1", Submit);
        const Result = (0, verify_xrpl_signature_1.verifySignature)(signedTransaction);
        console.log("Result1: ", Result);
    });
    main();
};
auth();
// ======== minting from minter's wallet================ //
const work = () => {
    setTimeout(() => {
        const mint = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const buyer = "shLzxpxoeg1KNEaneVHnVPZp48ato";
            const wallet = xrpl_accountlib_1.derive.familySeed(buyer);
            const unified = "https://bafybeihcxgv6sscjmipq5rvu6vl2eqfwbvgma3mnybw5mq6bglhdobb.ipfs.nftstorage.link/";
            const Uri = Buffer.from(unified).toString("hex");
            const data2 = yield client.send({
                id: 1,
                command: "account_info",
                account: wallet.address,
                strict: true,
            });
            const { signedTransaction } = (0, xrpl_accountlib_1.sign)({
                TransactionType: "NFTokenMint",
                Account: wallet.address,
                Issuer: "rwE5WbYVMJf449BoxD1sF5rfXEQFNwmx8u",
                TransferFee: 314,
                NFTokenTaxon: 0,
                Flags: 8,
                Sequence: (_a = data2.account_data) === null || _a === void 0 ? void 0 : _a.Sequence,
                Fee: "10",
                URI: Uri,
            }, wallet);
            const Submit = yield client.send({
                command: "submit",
                tx_blob: signedTransaction,
            });
            console.log("Submit2: ", Submit);
            const Result = (0, verify_xrpl_signature_1.verifySignature)(signedTransaction);
            console.log("Result2:", Result);
        });
        mint();
    }, 5000);
};
work();
// ======== changing minting authorisation to our other wallet================ //
const chnage = () => {
    setTimeout(() => {
        const change = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const data = yield client.send({
                id: 1,
                command: "account_info",
                account: account.address,
                strict: true,
            });
            // console.log("Data1: ",data);
            const Permission = {
                TransactionType: "AccountSet",
                Account: account.address,
                Fee: "12",
                "Sequence": (_a = data.account_data) === null || _a === void 0 ? void 0 : _a.Sequence,
                SetFlag: 10,
                "NFTokenMinter": "rE7e3ZnojoTHsUT8eY8YPFjep6SGzLgUPm",
            };
            const { signedTransaction } = (0, xrpl_accountlib_1.sign)(Permission, account);
            const Submit = yield client.send({
                command: "submit",
                tx_blob: signedTransaction,
            });
            console.log("Submit1", Submit);
            const Result = (0, verify_xrpl_signature_1.verifySignature)(signedTransaction);
            console.log("Result1: ", Result);
        });
        change();
    }, 10000);
};
chnage();
