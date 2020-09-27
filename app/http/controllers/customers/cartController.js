function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart');
        },
        update(req, res) {

            // sample
            //let cart = {
            //    items: {
            //        pizzaId: {
            //            item: pizzaObject,
            //            qty: 0
            //        },
            //        totalQty: 0,
            //        totalPrice: 0
            //    }
            //}

            //console.log(cart.items[pizzaId]);
            //check the session that it contain cart 
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart;
            //cart.items[req.body._id]
            //console.log(cart.items[req.body._id]);
            //var key = "your_choice";
            //var object = {};

            //if (!object[req.body._id]) {
            //    object[req.body._id] = "your_choice";
            //}
            //console.log(object);
            if (!cart.items[req.body._id]) { //check if item already in cart the run this code
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;

            } else { // if this item not in cart
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }

            res.json({ totalQty: req.session.cart.totalQty });
            //res.json({ data: "All onk" });
        },
    }
}
module.exports = cartController;