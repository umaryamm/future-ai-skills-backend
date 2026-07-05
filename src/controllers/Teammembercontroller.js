const prisma = require('../config/prismaClient');
const asyncHandler = require('../middleware/asyncHandler');
const { validateCreateTeamMember, validateUpdateTeamMember } = require('../schemas/teamMemberSchema');

function validationError(zodResult) {
  const flat = zodResult.error.flatten();
  const fieldMsgs = Object.entries(flat.fieldErrors)
    .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
    .join('; ');
  const err = new Error(fieldMsgs || 'Validation failed');
  err.statusCode = 400;
  return err;
}

// ------------------------------------------------------------
// PUBLIC: GET /api/team-members
// Only active members, in display order. No auth required.
// ------------------------------------------------------------
exports.getPublicTeamMembers = asyncHandler(async (req, res) => {
  const members = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
  res.json(members);
});

// ------------------------------------------------------------
// ADMIN: GET /api/admin/team-members
// Every member regardless of isActive.
// ------------------------------------------------------------
exports.getAllTeamMembers = asyncHandler(async (req, res) => {
  const members = await prisma.teamMember.findMany({
    orderBy: { displayOrder: 'asc' },
  });
  res.json(members);
});

// ------------------------------------------------------------
// ADMIN: GET /api/admin/team-members/:id
// ------------------------------------------------------------
exports.getTeamMemberById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const member = await prisma.teamMember.findUnique({ where: { id } });

  if (!member) {
    const err = new Error('Team member not found');
    err.statusCode = 404;
    throw err;
  }

  res.json(member);
});

// ------------------------------------------------------------
// ADMIN: POST /api/admin/team-members
// ------------------------------------------------------------
exports.createTeamMember = asyncHandler(async (req, res) => {
  const result = validateCreateTeamMember(req.body);
  if (!result.success) throw validationError(result);

  const data = result.data;

  const member = await prisma.teamMember.create({
    data: {
      name: data.name,
      designation: data.designation ?? null,
      photo: data.photo || null,
      bio: data.bio ?? null,
      specialty: data.specialty ?? null,
      socialLinks: data.socialLinks ?? undefined,
      isActive: data.isActive,
      displayOrder: data.displayOrder,
    },
  });

  res.status(201).json(member);
});

// ------------------------------------------------------------
// ADMIN: PUT /api/admin/team-members/:id
// ------------------------------------------------------------
exports.updateTeamMember = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const result = validateUpdateTeamMember(req.body);
  if (!result.success) throw validationError(result);

  const data = result.data;

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error('Team member not found');
    err.statusCode = 404;
    throw err;
  }

  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.designation !== undefined && { designation: data.designation }),
      ...(data.photo !== undefined && { photo: data.photo || null }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.specialty !== undefined && { specialty: data.specialty }),
      ...(data.socialLinks !== undefined && { socialLinks: data.socialLinks }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
  });

  res.json(member);
});

// ------------------------------------------------------------
// ADMIN: DELETE /api/admin/team-members/:id
// ------------------------------------------------------------
exports.deleteTeamMember = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error('Team member not found');
    err.statusCode = 404;
    throw err;
  }

  await prisma.teamMember.delete({ where: { id } });
  res.json({ success: true, message: 'Team member deleted' });
});