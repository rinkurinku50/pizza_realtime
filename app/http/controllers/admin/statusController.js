const { model } = require("../../../models/menu");
const Order = require("../../../models/order");

function statusOrderController() {
    return {
        update(req, res) {
            console.log(req.body.orderId);
            console.log(req.body.status);

            Order.updateOne({ _id: req.body.orderId }, { status: req.body.status }, (err, status) => {
                if (err) {
                    return res.redirect('/admin/orders');
                }
                return res.redirect('/admin/orders');
            })


        }
    }
}



module.exports = statusOrderController;