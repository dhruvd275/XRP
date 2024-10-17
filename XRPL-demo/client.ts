import axios from "axios";

const main = async() => {
    const data = await axios({
        method : "post",
        url : "https://s.altnet.rippletest.net:51234",
        headers: {"content-Type": "application/json" },
        data : {
            "id": 1,
            "method": "account_info",
            "params": [
          {
            "account": "rDfa2jNQniFhXj9Qdax4PRmp3d8sCetJFM",
            "strict": true,
            "ledger_index": "current",
            "queue": true
          }
         ] 
        }
    });
    console.log("Data", data)
};
main();