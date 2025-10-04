import { subscribeUser } from '../push';
import { notificationService } from '../services/notifications';
import { useState, useEffect } from 'react';

function TestNotification() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    const init = async () => {
      await notificationService.initialize();
      setIsInitialized(true);
      setPermission(Notification.permission);
    };
    init();
  }, []);

  const handleSubscribe = async () => {
    await subscribeUser();
    setPermission(Notification.permission);
  };

  const handleTestNotification = async () => {
    const success = await notificationService.sendNotification('Test Notification', {
      body: 'This is a test notification from Fixora!',
      icon: '/vite.svg'
    });
    
    if (success) {
      alert('Test notification sent!');
    } else {
      alert('Failed to send test notification. Check console for details.');
    }
  };

  const handleTestBookingNotification = async () => {
    const mockBookingData = {
      id: 'test-123',
      serviceCategoryId: 1,
      bookingDate: new Date().toISOString(),
      description: 'Test electrical repair',
      address: '123 Test Street'
    };

    const success = await notificationService.sendBookingConfirmation(mockBookingData);
    
    if (success) {
      alert('Test booking notification sent!');
    } else {
      alert('Failed to send test booking notification. Check console for details.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Push Notification Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Status:</h3>
        <p>Service Worker Initialized: {isInitialized ? '✅' : '❌'}</p>
        <p>Notification Permission: {permission}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={handleSubscribe}
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Enable Notifications (Subscribe to Push)
        </button>

        <button 
          onClick={handleTestNotification}
          disabled={permission !== 'granted'}
          style={{ 
            padding: '10px', 
            backgroundColor: permission === 'granted' ? '#28a745' : '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px' 
          }}
        >
          Send Test Notification
        </button>

        <button 
          onClick={handleTestBookingNotification}
          disabled={permission !== 'granted'}
          style={{ 
            padding: '10px', 
            backgroundColor: permission === 'granted' ? '#17a2b8' : '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px' 
          }}
        >
          Send Test Booking Notification
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Instructions:</h4>
        <ol>
          <li>Click "Enable Notifications" to subscribe to push notifications</li>
          <li>Allow notifications when prompted by your browser</li>
          <li>Click "Send Test Notification" to test basic notifications</li>
          <li>Click "Send Test Booking Notification" to test booking confirmation notifications</li>
          <li>Go to the booking page and create a real booking to test the full flow</li>
        </ol>
      </div>
    </div>
  );
}

export default TestNotification;
