import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    // per cookie session set session to null
    req.session = null;

    res.send({})
});

export { router as signOutRouter }