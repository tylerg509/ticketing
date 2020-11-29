import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    if (!req.session?.jwt) {
        return res.send({ currentUser: null });
    }

    // verify jwt token
    // BANG is ok since we verify existence of jwt_key in index.js
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!); 

        res.send({ currentUser: payload})
        
    } catch(err) {
        res.send({currentUser: null})
    }
});

export { router as currentUserRouter };


