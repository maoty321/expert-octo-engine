const express = require('express')
const { create_aircraft, get_all_aircraft, get_single_aircraft } = require('../controller/aircraft')
const router = express.Router()

router.post('/', create_aircraft)
router.get('/', get_all_aircraft)
router.get('/:id', get_single_aircraft)

module.exports = router