import { server } from "./configuration/server";
import databaseBuilder from "./configuration/database-builder";

async function main() {
    await databaseBuilder.build();
    
    await server;
}

main();
