const {XummSdk} = require('xumm-sdk')
const Sdk    = new XummSdk('98bb5a6f-d55b-468d-8bdc-278467744bb7', 'bf46b760-6d2a-4235-8955-a19e1c9b4062')
// const message = "https://bafybeihcxgv6sscjmipq5rvu6vl2eqfwbvgma3mnybw5mq6bglhdobb.ipfs.nftstorage.link/" ;
// const Uri= Buffer.from(message).toString("hex");
// console.log(Uri);

const main = async() => {
    const request = {
        TransactionType: "NFTokenMint",
        // Issuer: "rLEEa5bG6DSg7Nec9Kox13DxJktMZd7pVh",
        TransferFee: 314,
        NFTokenTaxon: 0,
        Flags: 8,
        Fee: "10",
        URI: "68747470733a2f2f626166796265696863786776367373636a6d6970713572767536766c32657166776276676d61336d6e796277356d713662676c68646f62622e697066732e6e667473746f726167652e6c696e6b2f",  
    }
    const payload = await Sdk.payload.create(request, true)

    console.log(payload);

};
main();