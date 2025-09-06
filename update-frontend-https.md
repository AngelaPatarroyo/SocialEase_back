# HTTPS Setup for SocialEase Frontend

## Backend HTTPS Setup ✅
Your backend now supports HTTPS on port 4001:
- **HTTP**: `http://localhost:4000` (still available)
- **HTTPS**: `https://localhost:4001` (encrypted)

## Frontend HTTPS Configuration

### Option 1: Update API Base URL
In your frontend `src/utils/api.ts`, update the base URL:

```typescript
// Change from:
const API_BASE_URL = 'http://localhost:4000/api';

// To:
const API_BASE_URL = 'https://localhost:4001/api';
```

### Option 2: Environment Variables
Create a `.env.local` file in your frontend:

```bash
NEXT_PUBLIC_API_URL=https://localhost:4001/api
```

Then update your API configuration to use the environment variable.

### Option 3: Development HTTPS (Frontend)
For full HTTPS in development, you can also run your Next.js frontend with HTTPS:

```bash
# In your frontend directory
npm run dev -- --experimental-https
```

## Testing HTTPS
1. **Backend**: `https://localhost:4001` ✅ (working)
2. **Frontend**: Update to use HTTPS backend URL
3. **Browser**: Accept the self-signed certificate warning

## Production HTTPS
For production, you'll need:
- Real SSL certificates (Let's Encrypt, Cloudflare, etc.)
- Domain name
- Proper certificate management

## Security Benefits
- ✅ All API calls encrypted
- ✅ Data transmission secure
- ✅ Meets NFR1 requirement
- ✅ Prevents man-in-the-middle attacks

