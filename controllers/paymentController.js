import SSLCommerzPayment from 'sslcommerz-lts';
import { Order, Product } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { triggerAutomation } from '../utils/automation.js';
import process from 'process';

const STORE_ID = process.env.STORE_ID || 'testbox';
const STORE_PASSWORD = process.env.STORE_PASSWORD || 'qwerty';
const IS_LIVE = process.env.IS_SANDBOX === 'false'; // Default false -> Sandbox

export const initPayment = async (req, res) => {
    try {
        const { productId, customerName, customerEmail, customerPhone, address } = req.body;

        // Find product
        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const tran_id = uuidv4();

        // Create Initial Order
        const order = await Order.create({
            productId,
            productName: product.name,
            amount: product.price ? product.price.replace(/[^0-9.]/g, '') : '100', // Clean price
            currency: 'BDT',
            customerName,
            customerEmail,
            customerPhone,
            address,
            paymentMethod: 'sslcommerz',
            transactionID: tran_id,
            status: 'Pending',
            payment_status: 'Unpaid'
        });

        const data = {
            total_amount: order.amount,
            currency: 'BDT',
            tran_id: tran_id, // use unique tran_id for each api call
            success_url: `${req.protocol}://${req.get('host')}/api/payment/success/${tran_id}`,
            fail_url: `${req.protocol}://${req.get('host')}/api/payment/fail/${tran_id}`,
            cancel_url: `${req.protocol}://${req.get('host')}/api/payment/cancel/${tran_id}`,
            ipn_url: `${req.protocol}://${req.get('host')}/api/payment/ipn`,
            shipping_method: 'Courier',
            product_name: product.name,
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: customerName,
            cus_email: customerEmail,
            cus_add1: address || 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: customerPhone,
            cus_fax: customerPhone,
            ship_name: customerName,
            ship_add1: address || 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, IS_LIVE);
        const apiResponse = await sslcz.init(data);

        if (apiResponse?.GatewayPageURL) {
            res.json({ url: apiResponse.GatewayPageURL });
        } else {
            res.status(500).json({ error: 'Failed to generate payment link' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const paymentSuccess = async (req, res) => {
    const { tran_id } = req.params;
    try {
        const order = await Order.findOne({ where: { transactionID: tran_id } });
        if (!order) return res.redirect('/payment/fail'); // Frontend route

        // Verify with SSLCommerz (Optional but recommended validation)
        const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, IS_LIVE);
        const validation = await sslcz.validate({ val_id: req.body.val_id });

        if (validation && (validation.status === 'VALID' || validation.status === 'VALIDATED')) {
            await order.update({
                payment_status: 'Paid',
                val_id: req.body.val_id,
                paymentMethod: req.body.card_type || 'sslcommerz'
            });

            // Trigger Automation
            triggerAutomation('new_order', {
                orderId: order.id,
                tran_id,
                amount: order.amount,
                customer: order.customerEmail,
                product: order.productName
            });

            // Redirect to frontend success page
            res.redirect(`http://localhost:5173/payment/success?tran_id=${tran_id}`);
        } else {
            await order.update({ payment_status: 'Failed' });
            res.redirect('http://localhost:5173/payment/fail');
        }

    } catch (error) {
        console.error(error);
        res.redirect('http://localhost:5173/payment/fail');
    }
};

export const paymentFail = async (req, res) => {
    const { tran_id } = req.params;
    const order = await Order.findOne({ where: { transactionID: tran_id } });
    if (order) await order.update({ payment_status: 'Failed', status: 'Failed' });
    res.redirect('http://localhost:5173/payment/fail');
};

export const paymentCancel = async (req) => {
    const { tran_id } = req.params;
    const order = await Order.findOne({ where: { transactionID: tran_id } });
    if (order) await order.update({ payment_status: 'Cancelled', status: 'Cancelled' });
};

// --- Phase 7: MFS Integration (bKash / Nagad / Rocket) ---

/**
 * POST /api/mfs/init
 * Public — customer submits payment intent after sending money manually.
 * Creates an Order record with Pending status for admin verification.
 */
export const initMfsPayment = async (req, res) => {
    try {
        const {
            productId, productName, amount,
            customerName, customerEmail, customerPhone,
            mfsProvider, transactionID
        } = req.body;

        // Validate required MFS fields
        if (!mfsProvider || !transactionID || !customerPhone) {
            return res.status(400).json({ error: 'mfsProvider, transactionID, and customerPhone are required.' });
        }

        const allowedProviders = ['bkash', 'nagad', 'rocket'];
        if (!allowedProviders.includes(mfsProvider.toLowerCase())) {
            return res.status(400).json({ error: `Invalid mfsProvider. Must be one of: ${allowedProviders.join(', ')}` });
        }

        // Check for duplicate TrxID to prevent double-submission
        const existing = await Order.findOne({ where: { transactionID } });
        if (existing) {
            return res.status(409).json({ error: 'This Transaction ID has already been submitted.' });
        }

        const order = await Order.create({
            productId: productId || null,
            productName: productName || 'Manual Order',
            amount: String(amount || '0'),
            customerName: customerName || '',
            customerEmail: customerEmail || '',
            customerPhone,
            address: '',
            paymentMethod: mfsProvider.toLowerCase(),
            transactionID,
            mfsProvider: mfsProvider.toLowerCase(),
            status: 'Pending',
            payment_status: 'Unpaid'
        });

        return res.status(201).json({
            success: true,
            message: 'Payment submitted. We will verify and confirm your order shortly.',
            orderId: order.id
        });
    } catch (error) {
        console.error('[MFS Init Error]', error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * GET /api/mfs/orders
 * Admin-only — fetch all MFS pending orders, newest first.
 */
export const getMfsOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const where = { paymentMethod: ['bkash', 'nagad', 'rocket'] };
        if (status) where.payment_status = status;

        const orders = await Order.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        return res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        console.error('[MFS Orders Error]', error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * PATCH /api/mfs/orders/:id
 * Admin-only — approve or reject an MFS order.
 * Body: { action: 'approve' | 'reject', note: '...' }
 */
export const updateMfsOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body;

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ error: "action must be 'approve' or 'reject'" });
        }

        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const update = action === 'approve'
            ? { payment_status: 'Paid', status: 'Processing' }
            : { payment_status: 'Rejected', status: 'Cancelled' };

        await order.update(update);

        // Fire automation hook on approval
        if (action === 'approve') {
            triggerAutomation('new_order', {
                orderId: order.id,
                tran_id: order.transactionID,
                amount: order.amount,
                customer: order.customerEmail,
                product: order.productName
            });
        }

        return res.json({ success: true, message: `Order ${action}d successfully.`, order });
    } catch (error) {
        console.error('[MFS Update Error]', error);
        return res.status(500).json({ error: error.message });
    }
};
