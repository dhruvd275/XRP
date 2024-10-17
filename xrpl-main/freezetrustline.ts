import { XrplClient } from "xrpl-client";
import { derive,sign } from "xrpl-accountlib";
import { verifySignature } from "verify-xrpl-signature";

const client = new XrplClient("wss://s.altnet.rippletest.net:51233");
const secret = "sptv7x8jd8rZBC8C4Tri5oDnfEna5";
const account = derive.familySeed(secret);
const main = async() => {

    const data = await client.send({
        id : 1,
        command : "account_info",
        account : account.address,
        strict : true,
    });
    const {id , signedTransaction} = sign(
      {
        TransactionType: "TrustSet",
        Account: account.address,
        Fee: "10",  
        LimitAccount:{
          currency : "BCD",
          issuer : "rBkrHiuEXz3wBMsLooF2y1adtJVFjfPGhE",
          value : "1000",
        } ,
        ClearFlags: 7,
        Sequence: data.account_data?.Sequence,
      },
      account
  );
  console.log("id: ",id);
  console.log("signedTransaction: ",signedTransaction);

  const result = await client.send({
    command : "submit",
    tx_blob : signedTransaction,
  });
  console.log("Result: ",result);

  const Result = verifySignature(signedTransaction);
  console.log("Result:", Result);


}
main();