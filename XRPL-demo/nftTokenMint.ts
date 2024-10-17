import { XrplClient } from "xrpl-client";
import { derive,sign } from "xrpl-accountlib";
import { verifySignature } from "verify-xrpl-signature";

const client = new XrplClient("wss://xls20-sandbox.rippletest.net:51233");
const secret = "snPxJJEQGE13HruL9y7FEAnQ1h5ud";
const account = derive.familySeed(secret);
const unified = "https://bafybeihcxgv6sscjmipq5rvu6vl2eqfwbvgma3mnybw5mq6bglhdobb.ipfs.nftstorage.link/"
const main = async() => {

    const data = await client.send({
        id : 1,
        command : "account_info",
        account : account.address,
        strict : true,
    });
    const Uri= Buffer.from(unified).toString("hex");
    const {id ,signedTransaction} = sign(
      {
        TransactionType: "NFTokenMint",
        Account: account.address,
        // Issuer: "rLEEa5bG6DSg7Nec9Kox13DxJktMZd7pVh",
        TransferFee: 314,
        NFTokenTaxon: 0,
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