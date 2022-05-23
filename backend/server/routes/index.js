const express = require('express');
const app = express();

/* Login routes */
app.use(require('./login/login'));
app.use(require('./login/direct_access'));
app.use(require('./login/validate_token'));

/* Client routes */
app.use(require('./client/register_client'));
app.use(require('./client/list_clients'));

/* Store routes */
app.use(require('./store/register_store'));
app.use(require('./store/update_store'));
app.use(require('./store/delete_store'));
app.use(require('./store/list_stores'));
app.use(require('./store/get_connections'));

/* User routes */
app.use(require('./user/register_user'));
app.use(require('./user/update_user'));
app.use(require('./user/delete_user'));
app.use(require('./user/list_users'));
app.use(require('./user/sync_gmail_account'));

/* Utils routes */
app.use(require('./admin/change_admin_password'));
app.use(require('./logger/logger'));

module.exports = app;
