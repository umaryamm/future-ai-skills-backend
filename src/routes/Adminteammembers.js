const express = require('express');
const requireAdmin = require('../middleware/requireAdmin');
const {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamMemberController');

const router = express.Router();

router.get('/', requireAdmin, getAllTeamMembers);
router.get('/:id', requireAdmin, getTeamMemberById);
router.post('/', requireAdmin, createTeamMember);
router.put('/:id', requireAdmin, updateTeamMember);
router.delete('/:id', requireAdmin, deleteTeamMember);

module.exports = router;