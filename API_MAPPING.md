# API Endpoint Mapping

## Backend Routes → Frontend Service

### WorkerDashboardController Routes

| Backend Route | Method | Frontend Function | Description | Expected Fields |
|---------------|--------|-------------------|-------------|-----------------|
| `/api/workers/user/{userId}` | GET | `getWorkerByUserId(userId)` | Get worker settings by user ID | Returns: `{ user: {...}, worker: {...} }` |
| `/api/users/{userId}` | PUT | `updateUser(userId, payload)` | Update user information | `name`, `first_name`, `last_name`, `phone`, `address`, `email` |
| `/api/workers/{workerId}` | PUT | `updateWorker(workerId, payload)` | Update worker information | `work_role`, `bio`, `status`, `experience_level`, `availability`, `short_info`, `minimum_education` |

### Controller Implementation

```php
// getSettings() returns: { user: {...}, worker: {...} }
// updateUser() expects: name, first_name, last_name, phone, address, email
// updateWorker() expects: work_role, bio, status, experience_level, availability, short_info, minimum_education
```

### Usage in Settings.jsx

```javascript
import { getWorkerByUserId, updateWorker, updateUser } from '../../services/workerdashboard';

// Fetch worker settings (returns { user: {...}, worker: {...} })
const response = await getWorkerByUserId(userId);
const { user, worker } = response;

// Update user info (only allowed fields sent)
await updateUser(userId, {
  name: user.name,
  first_name: user.first_name,
  last_name: user.last_name,
  phone: user.phone,
  address: user.address,
  email: user.email
});

// Update worker info (only allowed fields sent)
await updateWorker(workerId, {
  work_role: worker.work_role,
  bio: worker.bio,
  status: worker.status,
  experience_level: worker.experience_level,
  availability: worker.availability,
  short_info: worker.short_info,
  minimum_education: worker.minimum_education
});
```

### Data Filtering

The service automatically filters payloads to only include fields expected by the controller, preventing validation errors.

### Error Handling

All functions include comprehensive error logging and will throw detailed errors for proper handling in the UI components.
