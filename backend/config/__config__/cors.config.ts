import config from "../config";

export default {
    origin: config.SERVER_URL + ":" + config.FRONTEND_PORT,
    credentials: true
}