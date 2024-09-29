const express = require('express');
const router = express.Router();
const agentService = require('../services/agentService');

router.post('/agent', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await agentService.generateAgentResponse(message);
    res.json({ message: response });
  } catch (error) {
    console.error('Error in agent route:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;