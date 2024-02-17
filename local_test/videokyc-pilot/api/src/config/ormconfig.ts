import { appConfig } from "./app-config";

export default Object.assign({
    synchronize: false,
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "typeorm_migrations",
    migrationsRun: false,
    cli: {
        migrationsDir: "src/migrations/"
    }
}, appConfig.postgresqlDbConfig)
