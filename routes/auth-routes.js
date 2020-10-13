const express = require('express')
const router = express.Router()
const models = require('../models')
const debug = require('debug')

const { validate } = require('../models/user')

// ===========================================================================
// Sign in a User
// ===========================================================================
router.post('/sign-in', async (req, res) => {})

// ===========================================================================
// Create a new user
// ===========================================================================

// /api/auth/register
router.post('/register', async (req, res, next) => {})

// ===========================================================================

module.exports = router
