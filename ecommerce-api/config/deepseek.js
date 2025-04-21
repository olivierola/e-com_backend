const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getDeepseekResponse(prompt) {
  try {
    const response = await fetch(process.env.DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Deepseek API:', error);
    throw error;
  }
}

module.exports = { getDeepseekResponse };