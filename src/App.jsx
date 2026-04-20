import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import CallInterface from './components/CallInterface';
import OrderDashboard from './components/OrderDashboard';
import { sendTelegramMessage } from './utils/telegramApi';

function App() {
  const vapiPublicKey = 'f0313a9e-90be-4b09-b1cb-3b18ab82fb12';
  const vapiAssistantId = '445c072a-b877-4b78-8592-56b597527daa';
  const botToken = '8613687852:AAGRlKlM4-WpNA8jY3tv6rb_k49k7PQNzh4';
  const chatId = '7739262594';
  
  const [callState, setCallState] = useState('idle'); // idle, loading, active
  const [statusText, setStatusText] = useState('Waiting for call...');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [telegramStatus, setTelegramStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Keep a reference to the Vapi instance so we don't recreate it on every render
  const vapiRef = useRef(null);

  // Initialize Vapi Instance when PublicKey changes, or on first start
  const getVapiInstance = () => {
    if (!vapiRef.current && vapiPublicKey) {
      try {
        const VapiClass = Vapi.default || Vapi;
        vapiRef.current = new VapiClass(vapiPublicKey);
        setupVapiListeners(vapiRef.current);
      } catch (e) {
        console.error("Error initializing Vapi:", e);
      }
    }
    return vapiRef.current;
  };

  const setupVapiListeners = (vapi) => {
    vapi.on('call-start', () => {
      setCallState('active');
      setStatusText('📞 Call Connected! Start speaking...');
    });

    vapi.on('call-end', () => {
      setCallState('idle');
      setIsAiSpeaking(false);
      setStatusText('Call ended.');
    });

    vapi.on('speech-start', () => {
      setIsAiSpeaking(true);
      setStatusText('🤖 AI is speaking...');
    });

    vapi.on('speech-end', () => {
      setIsAiSpeaking(false);
      setStatusText('AI is listening...');
    });

    vapi.on('message', async (message) => {
      // Listen for the specific tool call where the AI finalizes the order
      if (message.type === 'tool-calls' && message.toolCalls && message.toolCalls.length > 0) {
        for (const toolCall of message.toolCalls) {
          // You must configure a tool named "finalizeOrder" in your Vapi Dashboard 
          // that passes the arguments: customerName, items, total, specialRequests
          if (toolCall.function && toolCall.function.name === 'finalizeOrder') {
            try {
              let orderData = toolCall.function.arguments;
              // Sometimes Vapi passes arguments as a JSON string instead of an object
              if (typeof orderData === 'string') {
                orderData = JSON.parse(orderData);
              }
              
              setOrderSummary(orderData);
              setStatusText('✅ Order captured! Ending call and dispatching to Telegram...');
              
              // End the conversation
              vapi.stop();
              setCallState('idle');

              // Dispatch Telegram
              setTelegramStatus('sending');
              const tgMessage = `
🛎️ *NEW ORDER RECEIVED* 🛎️

👤 *Customer:* ${orderData.customerName}
📞 *Phone:* ${orderData.customerPhone || 'Not provided'}

🍽️ *Order Items:*
${orderData.items ? orderData.items.map(i => `- ${i.name} (£${i.price})`).join('\n') : 'No items listed'}

📝 *Special Requests:* ${orderData.specialRequests || 'None'}

💰 *Total:* £${orderData.total || '0.00'}
💳 *Payment Method:* ${(orderData.paymentMethod || 'cash').toUpperCase()}
⏱️ *Preparation Time:* 15-20 Minutes

_Please prepare for pickup/delivery._
              `;
              
              await sendTelegramMessage(botToken, chatId, tgMessage);
              setTelegramStatus('success');
              setStatusText('✨ Call finished! Order successfully sent to Telegram.');
            } catch (err) {
              console.error(err);
              setTelegramStatus('error');
              setErrorMsg('Failed to process order or send to Telegram: ' + err.message);
            }
          }
        }
      }
    });

    vapi.on('error', (error) => {
      console.error('Vapi Error:', error);
      setErrorMsg('Vapi Error: ' + error.message);
      setCallState('idle');
      setIsAiSpeaking(false);
    });
  };

  const handleStartCall = () => {
    setErrorMsg('');
    setOrderSummary(null);
    setTelegramStatus(null);
    setCallState('loading');
    setStatusText('Requesting microphone access and connecting to Voice AI...');

    const vapi = getVapiInstance();
    if (vapi) {
      vapi.start(vapiAssistantId).catch(err => {
        setCallState('idle');
        setErrorMsg('Failed to start call: ' + err.message);
      });
    } else {
      setCallState('idle');
      setErrorMsg('Failed to initialize Vapi with the provided public key.');
    }
  };

  const handleEndCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setCallState('idle');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      
      <header className="header">
        <div className="header-title">
          DialMinds
          <span className="ai-badge">AI Voice OS</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Live B2B Demonstration Environment
        </div>
      </header>

      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '40px', marginBottom: '16px', color: 'white' }}>
          Automate Your Restaurant Orders
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
          Click Start Live Call, allow microphone access, and speak directly to test the AI receptionist in true real-time!
        </p>
      </div>

      <main className="grid">
        <CallInterface 
          callState={callState}
          handleStartCall={handleStartCall}
          handleEndCall={handleEndCall}
          statusText={statusText}
          errorMsg={errorMsg}
          isAiSpeaking={isAiSpeaking}
        />
        <OrderDashboard 
          orderSummary={orderSummary}
          telegramStatus={telegramStatus}
        />
      </main>

    </div>
  );
}

export default App;
