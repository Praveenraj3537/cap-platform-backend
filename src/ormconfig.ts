import { ConnectionOptions } from 'typeorm';
// import {  DotenvConfigOutput,config } from "dotenv";
import * as dotenv from 'dotenv';
dotenv.config();

const config: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: "db123",
    database: 'PLATFORM',
    entities: [__dirname+ '/**/**.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
        // Location of migration should be inside src folder
        // to be compiled into dist/ folder.
        migrationsDir: 'src/migrations',
    },
};

export = config