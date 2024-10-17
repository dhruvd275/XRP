import { XrplClient } from "xrpl-client";
import { derive , sign } from "xrpl-accountlib";
import { verifySignature } from "verify-xrpl-signature";

const secret = "she4rJ7hnkzRt3YjYx9ESuK5m2uh2";
const account = derive.familySeed(secret);
const client = new XrplClient("wss://xls20-sandbox.rippletest.net:51233");

const payment = async() => {
     const data = await client.send({
        command : "account_info",
        account : account.address,
        strict : true,
    });
    console.log(data);

    const {id , signedTransaction} = sign(
        {
            TransactionType: "Payment",
            Account: account.address,
            Destination: "rLHkajeyngCJfmvsiYC9Zp71KpjTZeJe2q",
            Amount: '1000000',
            Sequence: data.account_data.Sequence,
            Fee: String(12)
        },
        account
    );
    console.log("ID: ",id);    
    console.log("signedTransaction: ",signedTransaction);
    const verifyResult= verifySignature(signedTransaction);
    console.log("Verified: ",verifyResult);

    const result = await client.send({
        command : "submit",
        tx_blob : signedTransaction,
    });
    // console.log("hash: ",result?.tx_json.hash);
    console.log(result)

    if(id==result.tx_json.hash){
        console.log("it is verified");
    }
    else{
        console.log("it is not verified");
    }

};
payment();