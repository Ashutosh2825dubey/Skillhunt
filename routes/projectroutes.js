const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectcontroller');

router.get('/', projectController.render_homepage);
router.get('/skill_hunt/skill_wind', projectController.render_index);

router.get('/skill_hunt/skill_wind/:rolename/:locname', [
    projectController.render_skillwind_charts
]);
// When you call an async function directly in the context of an Express.js route handler, you do not need to use .then and .catch to handle the promise returned by the async function. Express is designed to handle this for you.
//calling async return promise but when calling in route handler expresses does that no need to use .then method to resolve the promise


router.post('/skill_hunt/skillfit',projectController.render_ml_response)
router.get('/skill_hunt/skillfit',projectController.render_ml_form)
router.get('/skill_hunt/about',projectController.render_about)

module.exports = router;
