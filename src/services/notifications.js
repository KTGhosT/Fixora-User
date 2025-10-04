// Notification service for sending push notifications
export class NotificationService {
  constructor() {
    this.registration = null;
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Initialize the service worker
  async initialize() {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/service-worker.js');
      return true;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return false;
    }
  }

  // Check if notifications are permitted
  async isPermissionGranted() {
    if (!this.isSupported) return false;
    return Notification.permission === 'granted';
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) return false;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Send a push notification
  async sendNotification(title, options = {}) {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported');
      return false;
    }

    if (!await this.isPermissionGranted()) {
      console.warn('Notification permission not granted');
      return false;
    }

    if (!this.registration) {
      const initialized = await this.initialize();
      if (!initialized) return false;
    }

    try {
      // Use the service worker to show the notification
      await this.registration.showNotification(title, {
        body: options.body || '',
        icon: options.icon || '/vite.svg',
        badge: options.badge || '/vite.svg',
        data: options.data || {},
        tag: options.tag || 'fixora-notification',
        requireInteraction: options.requireInteraction || false,
        actions: options.actions || [],
        ...options
      });
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // Send booking confirmation notification
  async sendBookingConfirmation(bookingData) {
    const serviceName = this.getServiceName(bookingData.serviceCategoryId);
    const scheduledDate = new Date(bookingData.bookingDate).toLocaleDateString();
    const scheduledTime = new Date(bookingData.bookingDate).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return await this.sendNotification(
      'Booking Confirmed! 🎉',
      {
        body: `Your ${serviceName} service is scheduled for ${scheduledDate} at ${scheduledTime}. We'll send you updates about your booking.`,
        icon: '/vite.svg',
        data: {
          url: `/booking-status/${bookingData.id}`,
          bookingId: bookingData.id
        },
        tag: `booking-${bookingData.id}`,
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'View Booking',
            icon: '/vite.svg'
          },
          {
            action: 'close',
            title: 'Close',
            icon: '/vite.svg'
          }
        ]
      }
    );
  }

  // Get service name from category ID
  getServiceName(serviceCategoryId) {
    const services = {
      1: 'Electrician',
      2: 'Plumber', 
      3: 'House Cleaner',
      4: 'Garden Cleaner',
      5: 'Carpenter',
      6: 'Device Repair'
    };
    return services[serviceCategoryId] || 'Service';
  }

  // Handle notification click
  setupNotificationClickHandler() {
    if (!this.isSupported) return;

    self.addEventListener('notificationclick', (event) => {
      event.notification.close();
      
      if (event.action === 'view' || !event.action) {
        const url = event.notification.data?.url || '/';
        event.waitUntil(
          clients.matchAll({ type: 'window' }).then((clientList) => {
            // Check if there's already a window/tab open with the target URL
            for (const client of clientList) {
              if (client.url === url && 'focus' in client) {
                return client.focus();
              }
            }
            // If no existing window, open a new one
            if (clients.openWindow) {
              return clients.openWindow(url);
            }
          })
        );
      }
    });
  }
}

// Create a singleton instance
export const notificationService = new NotificationService();

// Setup notification click handler
if (typeof window !== 'undefined') {
  notificationService.setupNotificationClickHandler();
}
