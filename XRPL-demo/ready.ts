import { derive, sign} from "xrpl-accountlib";
import { XrplClient } from "xrpl-client";
import { verifySignature} from "verify-xrpl-signature";

const client= new XrplClient("wss://xls20-sandbox.rippletest.net:51233"); 
  
const Pass = "ssx3BeHZFw3afsc3MyU39H6BJ3QvH";// issuer secret phase
const account = derive.familySeed(Pass);

// ======== Giving authorisation to other wallet address for minting================ // 
const auth= () => {

    const main = async() => {
        
        const data = await client.send({
            id : 1,
            command : "account_info",
            account : account.address,
            strict : true,
        });
        
        const payload = {
            TransactionType: "AccountSet",
            Account : account.address,
            Fee: "12",
            "Sequence": data.account_data?.Sequence,
            SetFlag: 10,
            "NFTokenMinter": "r439ShDLvXH5NXPmjCWqUFLfzdUJiTLSRH",
        }
        
        const {signedTransaction} = sign(payload,account);
        const Submit = await client.send({
            command: "submit",
            tx_blob: signedTransaction,
        })
        console.log("Submit1",Submit)
        const Result = verifySignature(signedTransaction);
        console.log("Result1: ", Result);      
    };
    main();
};
auth();
    
// ======== minting from minter's wallet================ //

const work = () => {
    setTimeout(() => {
         const mint = async() => {    
            
            const buyer = "shLzxpxoeg1KNEaneVHnVPZp48ato";
            const wallet = derive.familySeed(buyer);
            
            const unified = "https://bafybeihcxgv6sscjmipq5rvu6vl2eqfwbvgma3mnybw5mq6bglhdobb.ipfs.nftstorage.link/";
            const Uri= Buffer.from(unified).toString("hex");
            
            const data2 = await client.send({
                id:1,
                command: "account_info",
                account : wallet.address,
                strict : true,
            });
            
            
            const { signedTransaction} = sign(
                {
                    TransactionType: "NFTokenMint",
                    Account: wallet.address,
                    Issuer: "rwE5WbYVMJf449BoxD1sF5rfXEQFNwmx8u",
                    TransferFee: 314,
                    NFTokenTaxon: 0,
                    Flags: 8,
                    Sequence: data2.account_data?.Sequence,
                    Fee: "10",
                    URI: Uri,       
                },
                wallet
                );
                
                const Submit = await client.send({
                    command : "submit",
                    tx_blob : signedTransaction,
                });
                console.log("Submit2: ",Submit);
                
                const Result = verifySignature(signedTransaction);
                console.log("Result2:", Result);   
            };
            
            mint();
            
        }, 5000);
        };
        work();
        
    
// ======== changing minting authorisation to our other wallet================ //

const chnage = () => {
    setTimeout(() => {

        
         const change = async() =>{
            const data = await client.send({
                id : 1,
                command : "account_info",
                account : account.address,
                strict : true,
            });
            // console.log("Data1: ",data);
            
            const Permission = {
                TransactionType: "AccountSet",
                Account : account.address,
                Fee: "12",
                "Sequence": data.account_data?.Sequence,
                SetFlag: 10,
                "NFTokenMinter": "rE7e3ZnojoTHsUT8eY8YPFjep6SGzLgUPm",
            }
            
            const {signedTransaction} = sign(Permission,account);
            const Submit = await client.send({
                command: "submit",
                tx_blob: signedTransaction,
            })
            console.log("Submit1",Submit)
            const Result = verifySignature(signedTransaction);
            console.log("Result1: ", Result);
            
        };
        change();
        
    }, 10000);
    };
    chnage();