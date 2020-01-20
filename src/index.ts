import server from "./server";
import account from "./server/account";
import api from "./server/api";

account.load();
api.load();

server.start();
