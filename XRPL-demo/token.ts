import { XrplClient } from "xrpl-client";
import { derive , sign } from "xrpl-accountlib";

const secret = "sa9xSwBg86LoiToncEaeV1pVehuMg";
const account = derive.familySeed(secret);
const client = new XrplClient("wss://s.altnet.rippletest.net:51233");


const main = async() => {

    const data = await client.send({
        id : 1,
        command : "account_info",
        account : account.address,
        strict : true,
    });
    console.log(data);

    const payload = {
        TransactionType: "TrustSet",
        Account : account.address,
        Fee: "10",
        "LimitAmount": {
            currency: "TEC",
            issuer: "rHGYw6Ep2VrPN7SYQgxZz5vDeCzc4U2AH8",
            value: "100000"
          },
        // "SetFlag": 8,
        "Sequence": data.account_data?.Sequence,
    }

    const {signedTransaction} = sign(payload,account);
    const data1 = await client.send({
        command : "submit",
        tx_blob : signedTransaction
    })
    console.log(data1);

};
main();
