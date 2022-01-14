import { registerAs } from "@nestjs/config";

export default registerAs('mongoConfig', () => ({
    // uri: 'mongodb://scrm:scrm@192.168.3.177:27037,192.168.3.177:27047,192.168.3.177:27057/scrm?authSource=scrm&replicaSet=r1'
    uri: process.env.DATABASEURI
}));