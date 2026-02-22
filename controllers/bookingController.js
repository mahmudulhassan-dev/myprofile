import { Service, Booking, User } from '../models/index.js';
import automationService from '../services/automationService.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public/Private
export const createBooking = catchAsync(async (req, res) => {
    const { serviceId, clientName, clientEmail, clientPhone, scheduledDate, requirements } = req.body;

    if (!serviceId || !clientName || !clientEmail || !scheduledDate) {
        return res.status(400).json({ error: 'Missing required booking information' });
    }

    const service = await Service.findByPk(serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const booking = await Booking.create({
        serviceId,
        userId: req.user ? req.user.id : null,
        clientName,
        clientEmail,
        clientPhone,
        scheduledDate,
        requirements,
        amount: service.price
    });

    // Fire Automation
    automationService.trigger('new_booking', {
        id: booking.id,
        service: service.title,
        clientName,
        clientEmail,
        amount: booking.amount,
        scheduledDate
    });

    res.status(201).json({ message: 'Booking requested successfully', booking });
});

// @desc    Get client's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = catchAsync(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const bookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: [{ model: Service }]
    });
    res.json(bookings);
});

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Admin
export const getAllBookings = catchAsync(async (req, res) => {
    const bookings = await Booking.findAll({
        include: [{ model: Service }, { model: User, as: 'client' }]
    });
    res.json(bookings);
});
