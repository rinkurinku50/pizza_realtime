const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusOrderController = require('../app/http/controllers/admin/statusController');
const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const adminProtect = require('../app/http/middleware/admin');

function initRoute(app) {
    app.get('/', homeController().index);

    //login route
    app.get('/login', guest, authController().login);
    app.post('/login', authController().postlogin);

    //register route
    app.get('/register', guest, authController().register);
    app.post('/register', authController().postRegister);

    //logout
    app.post('/logout', authController().logout);

    //cart
    app.get('/cart', cartController().index);
    app.post('/update-cart', cartController().update);

    //order 
    app.post('/order', auth, orderController().store);
    app.get('/customers/orders', auth, orderController().index);
    app.get('/customers/orders/:id', auth, orderController().show);

    //admin 
    app.get('/admin/orders', adminProtect, adminOrderController().index);
    app.post('/admin/order/status', adminProtect, statusOrderController().update);


}

module.exports = initRoute;