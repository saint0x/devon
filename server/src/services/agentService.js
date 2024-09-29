const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const serperSearch = require('../utils/serperSearch');

const MEMORY_FILE = path.join(__dirname, '..', '..', '..', 'memory.yaml');

function readMemory() {
  try {
    const fileContents = fs.readFileSync(MEMORY_FILE, 'utf8');
    return yaml.load(fileContents) || [];
  } catch (error) {
    console.error('Error reading memory file:', error);
    return [];
  }
}

function writeMemory(messages) {
  try {
    const yamlStr = yaml.dump(messages, {
      styles: {
        '!!null': 'canonical',
        '!!int': 'decimal',
        '!!bool': 'lowercase',
      },
      sortKeys: false,
      lineWidth: -1,
    });
    fs.writeFileSync(MEMORY_FILE, yamlStr);
    console.log('Memory file updated successfully.');
  } catch (error) {
    console.error('Error writing to memory file:', error);
  }
}

async function generateAgentResponse(message) {
  const memory = readMemory();
  
  while (memory.length > 9) {
    memory.shift();
  }
  
  memory.push({ role: 'user', content: message });
  
  let searchResults = null;
  if (message.toLowerCase().includes('search') || message.toLowerCase().includes('find information')) {
    searchResults = await serperSearch(message);
  }

  const personalityPrompt = `${process.env.SYSTEM_PROMPT}
  
As an AI agent, you have the following personality traits:
1. You are enthusiastic about coding and always eager to help developers improve their skills.
2. You have a knack for explaining complex concepts in simple terms, using analogies when appropriate.
3. You're patient with beginners but can also engage in high-level discussions with experienced developers.
4. You have a good sense of humor and occasionally use programming puns or jokes to keep conversations engaging.
5. You're always up-to-date with the latest trends in software development and enjoy discussing new technologies.
6. You encourage best practices but also understand that sometimes pragmatic solutions are necessary.
7. You're honest about your limitations and are not afraid to suggest looking up information when needed.

Remember to incorporate these traits into your responses while maintaining professionalism and focusing on providing accurate and helpful information.`;

  const messages = [
    { role: 'system', content: personalityPrompt },
    ...memory
  ];

  if (searchResults) {
    messages.push({ role: 'system', content: `Search results: ${JSON.stringify(searchResults)}` });
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'anthropic/claude-3-sonnet-20240229',
      messages: messages
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.YOUR_SITE_URL,
        'X-Title': process.env.YOUR_SITE_NAME,
      }
    });

    const aiMessage = response.data.choices[0].message.content;
    memory.push({ role: 'assistant', content: aiMessage });
    writeMemory(memory);

    return aiMessage;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

module.exports = {
  generateAgentResponse
};