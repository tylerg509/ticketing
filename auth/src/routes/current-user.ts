import express from 'express';
import jwt from 'jsonwebtoken';
import { EnvVariables } from '../helpers/constants';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

// middleware handles current user
router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send({currentUser: req.currentUser || null})
});

export { router as currentUserRouter };


