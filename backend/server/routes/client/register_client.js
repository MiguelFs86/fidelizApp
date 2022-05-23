const express = require('express');
let { checkUserToken } = require('../../middlewares/authentication');
const Client = require('../../models/client');
const Store = require('../../models/store');
const User = require('../../models/user');
const { sendMail } = require('../../utils/mail');
const sql = require('mssql');
const router = express.Router();

router.post('/register/client', checkUserToken, async(req, res) => {
    try {
        await saveClient(req.store, req.body, req.files, res);
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err: err,
            type: 1
        });
    }
});

saveClient = async(store, body, files, res) => {
    sql.close();
    try {
        let client = new Client({
            name: body.name,
            email: body.email,
            phone: body.phone,
            invoice_details: body.invoice_detail,
            store: store
        });
        const existingClient = await Client.find({
            email: body.email,
            phone: body.phone,
            store: store
        });
        if (existingClient.length === 0) {
            const savedClient = await client.save();
            if (savedClient) {
                if (files) {
                    const response = await addSignature(client, res, files.signature);
                    if (!response.ok) {
                        return res.status(400).json({
                            ok: false,
                            message: response.error,
                            type: 16
                        });
                    } else {
                        client = response.clientDB;
                    }
                }
                const user = await User.findById(store.user);
                addToLog('info', `Client "${client.name}" created by store "${store.name}"`);
                if (user.emailConfig) {
                    await sendMail(store, client, user);
                }
                return res.status(200).json({
                    ok: true,
                    message: 'Client inserted',
                    type: 23
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    message: 'Error saving client',
                    type: 16
                });
            }
        } else {
            return res.status(400).json({
                ok: false,
                message: 'Client already exists',
                type: 16
            });
        }
    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: 'Server error',
            err: err,
            type: 1
        });
    }
};

addSignature = async(clientDB, res, signature) => {
    try {
        let file = signature;
        extension = 'png';

        let filename = `${clientDB._id}-${new Date().getMilliseconds() * Math.random()}.${extension}`;
        await file.mv(`uploads/client/signature/${filename}`);

        clientDB.signature = filename;
        return {
            ok: true,
            clientDB
        };
    } catch (err) {
        return {
            ok: false,
            error: 'Error moving signature file'
        };
    }
};

module.exports = router;