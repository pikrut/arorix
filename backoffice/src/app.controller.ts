import { Request, Response } from 'express';

/**
 * Index controller
 * @route GET /
 */
export const index = (req: Request, res: Response, nonce: string) => {
    res.render('index', {
        name: 'Aurorix Backend',
        nonce: nonce
    });
};
