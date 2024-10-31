import config from "../config"

const databaseConfig = {
    password: config.DB_PASSWORD,
    username: config.DB_USERNAME,
    clusterUrl: config.DB_CLUSTER_URL,
    name: config.DB_NAME,
}

export default databaseConfig;
