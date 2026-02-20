import { Profile, ProfileSocial, ProfileExperience, ProfileEducation, ProfileAward, Skill, sequelize } from '../models/index.js';

// --- Profile Core ---

// Get Full Profile Data
export const getProfile = async (req, res) => {
    try {
        // Assuming single user profile for portfolio, ID 1
        letprofile = await Profile.findByPk(1);

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
        const skills = await Skill.findAll(); // Using the existing Skill model

        res.json({
            profile,
            socials,
            experience,
            education,
            awards,
            skills
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Update Core Profile Info
export const updateProfile = async (req, res) => {
    try {
        const profile = await Profile.findByPk(1);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        await profile.update(req.body);
        res.json({ message: 'Profile updated', profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Socials ---
export const addSocial = async (req, res) => {
    try {
        const social = await ProfileSocial.create(req.body);
        res.status(201).json(social);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateSocial = async (req, res) => {
    try {
        const social = await ProfileSocial.findByPk(req.params.id);
        if (!social) return res.status(404).json({ error: 'Not found' });
        await social.update(req.body);
        res.json(social);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteSocial = async (req, res) => {
    try {
        await ProfileSocial.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// --- Experience ---
export const addExperience = async (req, res) => {
    try {
        const exp = await ProfileExperience.create(req.body);
        res.status(201).json(exp);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateExperience = async (req, res) => {
    try {
        const exp = await ProfileExperience.findByPk(req.params.id);
        if (!exp) return res.status(404).json({ error: 'Not found' });
        await exp.update(req.body);
        res.json(exp);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteExperience = async (req, res) => {
    try {
        await ProfileExperience.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// --- Education ---
export const addEducation = async (req, res) => {
    try {
        const edu = await ProfileEducation.create(req.body);
        res.status(201).json(edu);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateEducation = async (req, res) => {
    try {
        const edu = await ProfileEducation.findByPk(req.params.id);
        if (!edu) return res.status(404).json({ error: 'Not found' });
        await edu.update(req.body);
        res.json(edu);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteEducation = async (req, res) => {
    try {
        await ProfileEducation.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// --- Awards ---
export const addAward = async (req, res) => {
    try {
        const award = await ProfileAward.create(req.body);
        res.status(201).json(award);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateAward = async (req, res) => {
    try {
        const award = await ProfileAward.findByPk(req.params.id);
        if (!award) return res.status(404).json({ error: 'Not found' });
        await award.update(req.body);
        res.json(award);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteAward = async (req, res) => {
    try {
        await ProfileAward.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
