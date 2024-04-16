import { Request, Response } from 'express';
import fs from "fs";
import {dirname} from "path";
import path from 'path'
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Login controller
 * @route POST /
 */

export const login = (req: Request, res: Response, nonce: string) => {

    res.render('login', {
        name: 'Aurorix Backend',
        nonce: nonce
    });
};

export const loginPost = (req, res, nonce) => {
    const { email, password } = req.body;

    // Read JSON file containing user data
     var dbPath = path.join(__dirname, '../'+'db');
     console.log("__dirname ==="+dbPath)
    fs.readFile(dbPath+'/users.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.redirect("/backend?status=failed");
            return;
        }

        try {
            // Parse JSON data
            const users = JSON.parse(data);

            // Find user with provided email and password
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                // User found, set session and redirect to home
                req.session.userId = email;
                console.log("session = " + req.session.userId);
                res.redirect("home");
            } else {
                // User not found, destroy session and redirect with status
                req.session.destroy();
                res.redirect("/backend?status=failed");
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.redirect("/backend?status=failed");
        }
    });
};

