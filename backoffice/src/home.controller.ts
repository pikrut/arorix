import { Request, Response } from 'express';

/**
 * Home controller
 * @route POST /
 */

export const home = (req: Request, res: Response, nonce: string) => {
    res.render('home', {
        name: 'Aurorix Backend',
        component:'home',
        mainComponent:'home',
        nonce: nonce
    });
};

