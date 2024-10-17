if(process.argv.length < 3)
{
    console.log("Usage: node dist/index.js <FamilySeed> ");
    process.exit(1);
}

import { XrplClient } from "xrpl-client";
import { utils , derive , sign} from "xrpl-accountlib";
import { verifySignature } from "verify-xrpl-signature";

const client = new XrplClient("wss://s.altnet.rippletest.net:51233");

const main = async () => {
    if(!utils.isValidAddress(process.argv[2])){
        console.log("Invalid FamilySeed");
        process.exit(1);
    }
    
    const account = derive.familySeed(process.argv[2])

    const data = await client.send({
        id : 1,
        command : "account_info",
        account : account.address,
        strict : true,
    });
    console.log("Balance: ",data.account_data?.Balance /1000000 ,"XRP");
    // if(data.Balance<process.argv[4]){
    //     console.log("doesn't have enough fund");
    // }

    const {id , signedTransaction} = sign(
        {
            TransactionType: "Payment",
            Account: account.address,
            Destination: process.argv[3],
            Amount: String(process.argv[4]),
            Sequence: data.account_data.Sequence,
            Fee: String(12)
        },
        account
    );
    console.log("id: ",id);
    console.log("signedTransaction: ",signedTransaction);
    const verifyResult= verifySignature(signedTransaction);
    console.log("Verified: ",verifyResult);

    const result = await client.send({
        command : "submit",
        tx_blob : signedTransaction,
    });
    console.log("Result: ",result);
    
    // if(data.error){
    //     console.log("Error:", data.error_message);
    //     process.exit(1);
    // }
    
    // console.log("LedgerEntryType: ",data.account_data?.LedgerEntryType);
    // console.log("Balance: ",data.account_data?.Balance /1000000 ,"XRP");
    // console.log("Owner: ",data.account_data?.OwnerCount);
    // console.log("Sequence: ",data.account_data?.Sequence);
    // console.log("Current Ledger index: ",data.account_data?.ledger_current_index);
};

main();
