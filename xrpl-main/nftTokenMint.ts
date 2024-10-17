import { XrplClient } from "xrpl-client";
import { derive,sign } from "xrpl-accountlib";
import { verifySignature } from "verify-xrpl-signature";

const client = new XrplClient("wss://xls20-sandbox.rippletest.net:51233");
const secret = "sEdSkkoEC3w9bFP4tmQuS9CsVAb3Hy3";
const account = derive.familySeed(secret);
const unified = "ipfs://bafkreicjedfrzckhst2lplf64bbdllk2xdtazk6hh45lcib4x3hvsja37m"
const main = async() => {

    const data = await client.send({
        id : 1,
        command : "account_info",
        account : account.address,
        strict : true,
    });
    console.log(data);
    const Uri= Buffer.from(unified).toString("hex");
    const {id ,signedTransaction} = sign(
      {
        TransactionType: "NFTokenMint",
        Account: account.address,
        // Issuer: "rHCMcNp2JYyhtHqKRjnSynSxJboU6XQHjZ",
        TransferFee: 1000,
        NFTokenTaxon: 3,
        Flags: 8,
        Sequence: data.account_data?.Sequence,
        Fee: "10",
        URI: Uri,       
      },
      account
  );
  console.log("ID: ",id)
  console.log("signedTransaction: ",signedTransaction);

  const result = await client.send({
    command : "submit",
    tx_blob : signedTransaction,
  });
  console.log("Result: ",result);

  const Result = verifySignature(signedTransaction);
  console.log("Result:", Result);

  if(result.engine_result=== "tecNO_PERMISSION"){
      console.log("ERROR: You don't have permission to mint");
  }


}
main();