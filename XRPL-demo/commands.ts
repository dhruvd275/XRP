import { XrplClient } from "xrpl-client";

const client = new XrplClient("wss://xls20-sandbox.rippletest.net:51233");

const main = async() => {
    const data = await client.send({
        command : "account_nfts",
        account : "r3PTFH3YpaoaUV1TWcF2DiKz8Lnp8w2ioj",
    });
    console.log(JSON.stringify(data, null, "\t"));
};
main();