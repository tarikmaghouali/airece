import React from 'react';

const OrderDashboard = ({ orderSummary, telegramStatus }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 className="card-title" style={{ color: 'var(--text-main)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        Restaurant Owner Dashboard
      </h3>

      {telegramStatus === 'success' && (
        <div style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success)', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
            <path d="M22 2L11 13"></path>
            <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
          </svg>
          <div>
            <p style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '14px' }}>Telegram Notification Sent!</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>Check your phone for the instant push notification.</p>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!orderSummary ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', border: '2px dashed var(--border)', borderRadius: '8px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Awaiting incoming AI order...</p>
          </div>
        ) : (
          <div className="receipt">
            <div className="receipt-header">
              <h4 style={{ fontSize: '20px', margin: '0 0 4px 0' }}>PEPE'S PIRI PIRI</h4>
              <p style={{ fontSize: '14px', margin: 0, color: '#666' }}>Order Processing</p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>Customer: {orderSummary.customerName}</p>
              <p style={{ fontSize: '14px', margin: 0, color: '#333' }}>📞 {orderSummary.customerPhone || 'Not provided'}</p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '12px', fontSize: '14px', color: '#666' }}>ITEMS</p>
              {Array.isArray(orderSummary.items) ? orderSummary.items.map((item, i) => (
                <div key={i} className="receipt-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>1x {item.name || 'Unknown Item'}</span>
                  <span>£{typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || 0).toFixed(2)}</span>
                </div>
              )) : (
                <div className="receipt-item"><span style={{color: 'var(--error)'}}>Error reading items layout</span></div>
              )}
            </div>

            {orderSummary.specialRequests && (
              <div style={{ backgroundColor: '#f9f9f9', padding: '12px', borderLeft: '3px solid #333', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Special Requests:</p>
                <p style={{ fontSize: '13px', fontStyle: 'italic', margin: 0 }}>"{orderSummary.specialRequests}"</p>
              </div>
            )}

            <div className="receipt-total" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #333', paddingTop: '12px', fontWeight: 'bold' }}>
              <span>TOTAL DUE</span>
              <span>£{typeof orderSummary.total === 'number' ? orderSummary.total.toFixed(2) : parseFloat(orderSummary.total || 0).toFixed(2)}</span>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
              <span>PAYMENT METHOD:</span>
              <span style={{ color: 'var(--primary)' }}>{(orderSummary.paymentMethod || 'CASH').toUpperCase()}</span>
            </div>
            
            <div style={{ marginTop: '8px', fontSize: '13px', textAlign: 'center', color: '#666' }}>
              ⏱️ Ready in 15-20 Minutes
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDashboard;
