import server from "./server";
import account from "./server/account";
import api from "./server/api";
import databaseBuilder from "./service/databaseBuilder";

async function main() {
    await databaseBuilder.build();
    
    account.load();
    api.load();
    
    server.start();
}

main();
