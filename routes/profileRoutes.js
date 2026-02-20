import express from 'express';
import {
    getProfile, updateProfile,
    addSocial, updateSocial, deleteSocial,
    addExperience, updateExperience, deleteExperience,
    addEducation, updateEducation, deleteEducation,
    addAward, updateAward, deleteAward
} from '../controllers/profileController.js';

const router = express.Router();

// Core Profile
router.get('/', getProfile);
router.put('/', updateProfile);

// Socials
router.post('/socials', addSocial);
router.put('/socials/:id', updateSocial);
router.delete('/socials/:id', deleteSocial);

// Experience
router.post('/experience', addExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Education
router.post('/education', addEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Awards
router.post('/awards', addAward);
router.put('/awards/:id', updateAward);
router.delete('/awards/:id', deleteAward);

export default router;
