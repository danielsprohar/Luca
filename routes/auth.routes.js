const express = require('express')
const router = express.Router()
const debug = require('debug')('luca:auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../config/database')
const { httpStatusCodes } = require('../constants')
const { User, Role, UserRole } = require('../models')

// ===========================================================================
// Sign in a User
// ===========================================================================

// /api/auth/login
router.post('/login', async (req, res) => {
  const { error } = User.validateLogin(req.body)
  if (error) {
    debug(error)
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send(error.details[0].message)
  }

  // The User table has a unique (btree) index on column "normalizedEmail"
  const user = await User.findOne({
    where: {
      normalizedEmail: req.body.email.toUpperCase()
    },
    include: {
      model: Role,
      as: 'roles',
      attributes: ['name'],
      through: {
        attributes: []
      }
    }
  })

  // Check for an invalid email
  if (!user) {
    return res
      .status(httpStatusCodes.unauthorized)
      .send('Invalid email or password')
  }

  // Check for an invalid password
  const isAuthenticated = await bcrypt.compare(
    req.body.password,
    user.hashedPassword
  )
  if (!isAuthenticated) {
    return res
      .status(httpStatusCodes.unauthorized)
      .send('Invalid email or password')
  }

  res.json({
    user: mapToDto(user),
    token: buildJwtToken(user)
  })
})

// ===========================================================================
// Create a new user
// ===========================================================================

// /api/auth/register
router.post('/register', async (req, res, next) => {
  const { error } = User.validateInsert(req.body)
  if (error) {
    debug(error)
    return res.status(httpStatusCodes.badRequest).send(error.details[0].message)
  }

  const userCount = await User.count({
    where: {
      normalizedEmail: req.body.email.toUpperCase()
    }
  })

  if (userCount === undefined || userCount === null) {
    return res
      .status(httpStatusCodes.badRequest)
      .send('The provided email already exists.')
  }

  const defaultRole = await Role.findOne({
    where: {
      name: 'user'
    }
  })

  // https://www.npmjs.com/package/bcrypt#a-note-on-rounds
  const saltRounds = 11

  // https://www.npmjs.com/package/bcrypt#hash-info
  const hash = await bcrypt.hash(req.body.password, saltRounds)

  const transaction = await db.transaction()

  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      hashedPassword: hash
    })

    await UserRole.create({
      userId: user.id,
      roleId: defaultRole.id
    })

    await transaction.commit()

    return res.json(mapToDto(user))
  } catch (error) {
    debug(error)
    if (transaction) {
      await transaction.rollback()
    }
  }

  res.status(httpStatusCodes.internalServerError).send()
})

// ===========================================================================
// Facilitators
// ===========================================================================

/**
 * Maps the given user entity to a Data Transfer Object (DTO).
 * In other words, this function will removed the entity's
 * sensitive attributes.
 *
 * @param {User} user the `User` entity
 */
function mapToDto(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles
  }
}

// ===========================================================================

/**
 * Builds a new JWT token with the attributes of the given `User` entity.
 * @param {User} user the `User` entity
 * @returns {string} A new JWT token
 */
function buildJwtToken(user) {
  // Check if this user is an administrator
  const isAdmin = user.roles.findIndex((role) => role.name === 'admin') !== -1

  // Create JWT token
  return jwt.sign(
    {
      id: user.id,
      admin: isAdmin
    },
    process.env.JWT_KEY,
    {
      expiresIn: '8h',
      issuer: 'http://localhost:5000'
    }
  )
}

// ===========================================================================

module.exports = router