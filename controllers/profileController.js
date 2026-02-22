import { Profile, ProfileSocial, ProfileExperience, ProfileEducation, ProfileAward, Skill } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';

// --- Profile Core ---

// Get Full Profile Data
export const getProfile = catchAsync(async (req, res) => {
    // Assuming single user profile for portfolio, ID 1
    let profile = await Profile.findByPk(1);

    if (!profile) {
        // Create default if not exists
        profile = await Profile.create({
            fullName: 'Your Name',
            username: 'admin',
            email: [{ value: 'admin@example.com', label: 'Primary' }]
        });
    }

    const socials = await ProfileSocial.findAll({ order: [['order', 'ASC']] });
    const experience = await ProfileExperience.findAll({ order: [['start_date', 'DESC']] });
    const education = await ProfileEducation.findAll({ order: [['start_date', 'DESC']] });
    const awards = await ProfileAward.findAll({ order: [['date', 'DESC']] });
    const skills = await Skill.findAll();

    res.json({ profile, socials, experience, education, awards, skills });
});

// Update Core Profile Info
export const updateProfile = catchAsync(async (req, res) => {
    const profile = await Profile.findByPk(1);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    await profile.update(req.body);
    res.json({ message: 'Profile updated', profile });
});

// --- Socials ---
export const addSocial = catchAsync(async (req, res) => {
    const social = await ProfileSocial.create(req.body);
    res.status(201).json(social);
});

export const updateSocial = catchAsync(async (req, res) => {
    const social = await ProfileSocial.findByPk(req.params.id);
    if (!social) return res.status(404).json({ error: 'Not found' });
    await social.update(req.body);
    res.json(social);
});

export const deleteSocial = catchAsync(async (req, res) => {
    await ProfileSocial.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
});

// --- Experience ---
export const addExperience = catchAsync(async (req, res) => {
    const exp = await ProfileExperience.create(req.body);
    res.status(201).json(exp);
});

export const updateExperience = catchAsync(async (req, res) => {
    const exp = await ProfileExperience.findByPk(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Not found' });
    await exp.update(req.body);
    res.json(exp);
});

export const deleteExperience = catchAsync(async (req, res) => {
    await ProfileExperience.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
});

// --- Education ---
export const addEducation = catchAsync(async (req, res) => {
    const edu = await ProfileEducation.create(req.body);
    res.status(201).json(edu);
});

export const updateEducation = catchAsync(async (req, res) => {
    const edu = await ProfileEducation.findByPk(req.params.id);
    if (!edu) return res.status(404).json({ error: 'Not found' });
    await edu.update(req.body);
    res.json(edu);
});

export const deleteEducation = catchAsync(async (req, res) => {
    await ProfileEducation.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
});

// --- Awards ---
export const addAward = catchAsync(async (req, res) => {
    const award = await ProfileAward.create(req.body);
    res.status(201).json(award);
});

export const updateAward = catchAsync(async (req, res) => {
    const award = await ProfileAward.findByPk(req.params.id);
    if (!award) return res.status(404).json({ error: 'Not found' });
    await award.update(req.body);
    res.json(award);
});

export const deleteAward = catchAsync(async (req, res) => {
    await ProfileAward.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
});
