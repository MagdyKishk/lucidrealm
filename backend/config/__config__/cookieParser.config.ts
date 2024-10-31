import config from "../config"

const cookieParserConfig = {
    secret: config.COOKIE_SECRET,
}

export default cookieParserConfig;
