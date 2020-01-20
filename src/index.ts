import server from "./server";
import account from "./server/account";
import api from "./server/api";
import databaseBuilder from "./services/databaseBuilder";

databaseBuilder.build();

account.load();
api.load();

server.start();
