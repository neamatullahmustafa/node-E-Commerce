import { dbConnection } from "./database/dbConnection.js";
import { redisConnection } from "./database/redisConnection.js";
import { server } from "./server.js";
import cornJob from "./src/utils/cornJop.js";

server();
dbConnection();
redisConnection();
cornJob.start();
