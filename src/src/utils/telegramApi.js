export const sendTelegramMessage = async (botToken, chatId, message) => {
  if (!botToken || !chatId) {
    throw new Error('Bot token and Chat ID are required.');
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Telegram API Error: ${errorData.description || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    throw error;
  }
};
