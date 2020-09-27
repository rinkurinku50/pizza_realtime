const Order = require('../../../models/order');
const moment = require('moment');

function orderController() {
    return {
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null, { sort: { createdAt: -1 } }
            );
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            return res.render('customers/orders', { orders: orders, moment: moment })
        },
        store(req, res) {
            console.log(req.body);
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash('error', 'All Fields are required...');
                res.redirect('/cart');
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            });

            order.save().then(result => {
                req.flash('success', 'Order placed successfully...');
                delete req.session.cart //delete all cart data from session with delete keyword
                return res.redirect('/customers/orders');
            }).catch(err => {
                req.flash('error', 'Something went wrong...');
                return res.redirect('/cart');
            });
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id);

            //authorize user
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order: order });
            }
            return res.redirect('/');

        }
    }
}

module.exports = orderController;