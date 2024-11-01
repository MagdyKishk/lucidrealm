import { Response } from 'express';

export default (res: Response, token: string) => {
    res.cookie("token", token, { path: "/", httpOnly: true });
}