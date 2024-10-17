import { XrplClient } from "xrpl-client";


const client = new XrplClient("wss://xls20-sandbox.rippletest.net:51233");
// const client = new XrplClient("wss://s1.ripple.com/");

const main = async() => {
    const data = await client.send({
        command : "account_nfts",
        account : "rhVzJ2727hkbBaVbTY5zXxNh1nDurLfJ3c",
    });
    console.log(JSON.stringify(data, null, "\t"));

    // const data = await client.send({
    //     command : "account_currencies",
    //     account : "r3gTPCk224oP8jsshZDC33oGSduCYbmWYJ",
    // });
    // console.log(JSON.stringify(data, null, "\t"));

    // const data = await client.send({
    //     command : "account_currencies",
    //     account : "rHZvzsz5ZPjRxjToQyro5cmGe7gweB5Qas",
    // });
    // console.log(JSON.stringify(data, null, "\t"));
};
main();