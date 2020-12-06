import express from 'express';

import { currentUser } from '@tylergasperlin/ticketing-common';

const router = express.Router();

// middleware handles current user
router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send({currentUser: req.currentUser || null})
});

export { router as currentUserRouter };


