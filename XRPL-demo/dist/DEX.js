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
const secret = "shS7tFuLmEvujjTQRm3icTVoQnfTp";
const account = xrpl_accountlib_1.derive.familySeed(secret);
const client = new xrpl_client_1.XrplClient("wss://s.altnet.rippletest.net:51233");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield client.send({
        id: 1,
        command: "account_info",
        account: account.address,
        strict: true,
    });
    console.log(data);
    const we_want = {
        currency: "TST",
        issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
        value: "25"
    };
    const we_spend = {
        currency: "XRP",
        value: client.xrpToDrops(25 * 10 * 1.15)
    };
});
main();
