import config from "../config"

const jwtConfig = {
    accessSecret: config.JWT_ACESS_SECRET,
    refreshSecret: config.JWT_REFRESH_SECRET,
}

export default jwtConfig;
