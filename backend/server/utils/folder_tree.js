const fs = require('fs');

const log_dir = './logs';

/* Create uploads folder tree */
const uploads_dir = './uploads/';
const store_dir = './uploads/store/';
const user_dir = './uploads/user/';
const user_email_dir = './uploads/user/email/';
const client_dir = './uploads/client/';
const media_dir = './uploads/media/';
const background_dir = './uploads/store/background/';
const background_logo = './uploads/store/logo/';
const signature = './uploads/client/signature/';

if (!fs.existsSync(log_dir)) {
    fs.mkdirSync(log_dir);
}

if (!fs.existsSync(uploads_dir)) {
    fs.mkdirSync(uploads_dir);
}

if (!fs.existsSync(store_dir)) {
    fs.mkdirSync(store_dir);
}

if (!fs.existsSync(user_dir)) {
    fs.mkdirSync(user_dir);
}

if (!fs.existsSync(media_dir)) {
    fs.mkdirSync(media_dir);
}

if (!fs.existsSync(user_email_dir)) {
    fs.mkdirSync(user_email_dir);
}

if (!fs.existsSync(client_dir)) {
    fs.mkdirSync(client_dir);
}

if (!fs.existsSync(background_dir)) {
    fs.mkdirSync(background_dir);
}

if (!fs.existsSync(background_logo)) {
    fs.mkdirSync(background_logo);
}

if (!fs.existsSync(signature)) {
    fs.mkdirSync(signature);
}
