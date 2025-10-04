// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }
  
  // Subscribe user
  export async function subscribeUser() {
    try {
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        alert('VAPID public key is missing. Set VITE_VAPID_PUBLIC_KEY in .env');
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js');

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Notification permission denied!');
        return;
      }

      // Reuse existing subscription if present
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
      }

      const subscriptionJson = typeof subscription.toJSON === 'function' ? subscription.toJSON() : subscription;

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBase}/api/save-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(subscriptionJson)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save subscription:', response.status, errorText);
        alert(`Failed to save subscription (${response.status}). Check server logs.`);
        return;
      }

      alert('Subscribed to notifications ✅');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('An error occurred while subscribing. Check console for details.');
    }
  }
  