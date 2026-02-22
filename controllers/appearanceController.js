import { Appearance } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';

export const getAppearance = catchAsync(async (req, res) => {
    const appearance = await Appearance.findOne();
    res.json(appearance || {});
});

export const updateAppearance = catchAsync(async (req, res) => {
    let appearance = await Appearance.findOne();
    if (appearance) {
        await appearance.update(req.body);
    } else {
        appearance = await Appearance.create(req.body);
    }
    res.json(appearance);
});
