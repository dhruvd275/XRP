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
const client = new xrpl_client_1.XrplClient("wss://xls20-sandbox.rippletest.net:51233");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield client.send({
        command: "account_nfts",
        account: "rDHGs1cexLcJDJycE84fBpazFSb3VDQXPh",
    });
    console.log(JSON.stringify(data, null, "\t"));
});
main();
