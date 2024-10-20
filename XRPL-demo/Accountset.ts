import { XrplClient } from "xrpl-client";
import { derive , sign} from "xrpl-accountlib";
import { verifySignature } from "verify-xrpl-signature";

const client = new XrplClient("wss://xls20-sandbox.rippletest.net:51233");
const secret = "ssm6X8LY1cHEskYC75Lpv9Z6hDAim";
const account = derive.familySeed(secret);

const main = async() => {

    const data = await client.send({
        id : 1,
        command : "account_info",
        account : account.address,
        strict : true,
    });
    // console.log("Data: ",data);

    const payload = {
        TransactionType: "AccountSet",
        Account : account.address,
        Fee: "12",
        Sequence : data.account_data?.Sequence,
        SetFlag: 10,//authorised nftminter
        "NFTokenMinter": "r95Zr5j5ovzWxZLvFXDWUGwTxzQWPPnUAX",
    }

    const {signedTransaction} = sign(payload,account);
    console.log(signedTransaction)
    const data1 = await client.send({
        command: "submit",
        tx_blob: signedTransaction,
    })
    console.log(data1)
    const Result = verifySignature(signedTransaction);
    console.log("Result: ", Result);
     
};
main();