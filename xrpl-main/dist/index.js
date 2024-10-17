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
// Please only do this if you want to build your own platform & sign headless.
// It's bad practice to add your secret to source code or a config file. In
// this case it's for demonstration/educational purposes only.
//
// If you want to interact with end users, please use the XUMM SDK, and
// NEVER ask for end user secrets! You do not want that responsibility!
//    > https://www.npmjs.com/package/xumm-sdk
//    > https://dev.to/wietse/how-to-use-the-xumm-sdk-in-node-js-5380
const secret = "sh8tjTEJTRaBNdiJkmk4kzsWpbThS";
const client = new xrpl_client_1.XrplClient("wss://hooks-testnet.xrpl-labs.com");
const account = xrpl_accountlib_1.derive.familySeed(secret);
console.log("Account address:", account.address);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const { account_data } = yield client.send({
        command: "account_info",
        account: account.address,
    });
    console.log(`Account balance (XRP) ${Number(account_data.Balance) / 1000000}`);
    // Wait until we know what the current ledger index is
    yield client.ready();
    const LastLedgerSequence = client.getState().ledger.last + 2; // Expect finality in max. 2 ledgers
    const { id, signedTransaction } = (0, xrpl_accountlib_1.sign)({
        TransactionType: "Payment",
        Account: account.address,
        Destination: "rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ",
        Amount: String(25 * 1000000),
        Sequence: account_data.Sequence,
        Fee: String(12),
        LastLedgerSequence,
    }, account);
    console.log("Transaction hash:", id);
    client.send({ command: "subscribe", accounts: [account.address] });
    client
        .send({ command: "submit", tx_blob: signedTransaction })
        .then(({ accepted, engine_result }) => console.log("Transaction sent:", accepted, engine_result));
    client.on("transaction", ({ transaction, meta, ledger_index, engine_result }) => {
        if (transaction.hash === id) {
            console.log(`Transaction in ledger:\n  ${ledger_index}\nTransaction status:\n  ${engine_result}\nDelivered amount:\n  ${meta.delivered_amount}`);
            if (typeof meta.delivered_amount === "string") {
                const xrp = Number(meta.delivered_amount) / 1000000;
                console.log(`Delivered amount in XRP instead of drops:\n  ${xrp}`);
            }
            client.close();
        }
    });
    client.on("ledger", ({ ledger_index }) => {
        if (ledger_index > LastLedgerSequence) {
            console.log("Past last ledger & transaction not seen. Transaction failed");
            client.close();
        }
    });
});
main();
