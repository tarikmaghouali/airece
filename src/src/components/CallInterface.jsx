import React from 'react';

const CallInterface = ({ 
  callState, // 'idle', 'loading', 'active'
  handleStartCall, handleEndCall,
  statusText, errorMsg, isAiSpeaking
}) => {
  return (
    <div className="card">
      <h3 className="card-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        Live AI Interface
      </h3>

      <div style={{ marginBottom: '16px' }}>
        {errorMsg && <p style={{ color: 'var(--error)', marginTop: '12px', fontSize: '13px', fontWeight: 500 }}>{errorMsg}</p>}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px', textAlign: 'center' }}>
        <div className={`calling-indicator ${isAiSpeaking ? 'active' : ''}`} style={{ borderColor: callState === 'active' ? 'var(--primary)' : 'var(--border)' }}>
          {callState !== 'active' ? (
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--text-muted)'}}>
               <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
               <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
               <line x1="12" x2="12" y1="19" y2="22"></line>
             </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isAiSpeaking ? 'pulse-icon' : ''}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          )}
        </div>
        
        <p className="status-text" style={{ marginBottom: '24px', color: callState === 'active' ? 'inherit' : 'var(--text-muted)' }}>
          {statusText}
        </p>

        {callState === 'idle' && (
          <button 
            onClick={handleStartCall} 
            className="btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
          >
            Start Live Call 📞
          </button>
        )}

        {callState === 'loading' && (
          <button 
            disabled
            className="btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
          >
            Connecting to Vapi... ⏳
          </button>
        )}

        {callState === 'active' && (
          <button 
            onClick={handleEndCall} 
            className="btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '16px', backgroundColor: 'var(--error)', color: 'white' }}
          >
            End Call ⬛
          </button>
        )}
      </div>
    </div>
  );
};

export default CallInterface;
