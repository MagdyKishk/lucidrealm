import crypto from "crypto"

export default (length: number = 8) => {
    return crypto.randomBytes(Math.round(length/2)).toString('hex');
}
