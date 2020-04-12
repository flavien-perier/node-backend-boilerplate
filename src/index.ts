import { server } from "./server";
import databaseBuilder from "./service/databaseBuilder";

async function main() {
    await databaseBuilder.build();
    
    await server;
}

main();
