import { server } from "./server";
import databaseBuilder from "./configuration/databaseBuilder";

async function main() {
    await databaseBuilder.build();
    
    await server;
}

main();
