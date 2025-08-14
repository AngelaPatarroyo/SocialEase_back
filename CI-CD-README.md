# 🚀 CI/CD Pipeline Setup Guide

This guide explains how to set up and use the automated CI/CD pipeline for your SocialEase backend.

## 📋 **What's Included**

- ✅ **GitHub Actions** workflow for automated testing and deployment
- ✅ **Jest testing framework** with sample tests
- ✅ **ESLint** for code quality
- ✅ **Docker** containerization
- ✅ **Health checks** for monitoring
- ✅ **Security scanning** with npm audit and Snyk

## 🛠️ **Setup Instructions**

### **1. Install Dependencies**

```bash
# Install all dependencies including dev dependencies
npm install

# Install testing dependencies
npm install --save-dev jest supertest mongodb-memory-server
```

### **2. Configure GitHub Secrets**

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

#### **For Railway Deployment:**
- `RAILWAY_TOKEN` - Your Railway API token
- `RAILWAY_SERVICE` - Your Railway service name

#### **For Heroku Deployment (Alternative):**
- `HEROKU_API_KEY` - Your Heroku API key
- `HEROKU_APP_NAME` - Your Heroku app name
- `HEROKU_EMAIL` - Your Heroku email

#### **For Security Scanning:**
- `SNYK_TOKEN` - Your Snyk security token (optional)

### **3. Test the Pipeline Locally**

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### **4. Docker Commands**

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run only the app
docker-compose up app

# Run only MongoDB
docker-compose up mongo

# Access MongoDB Express (web interface)
# Open http://localhost:8081 in your browser

# Stop all services
docker-compose down

# Remove volumes (will delete all data)
docker-compose down -v
```

## 🔄 **How the Pipeline Works**

### **On Every Push/Pull Request:**
1. **Test Job**: Runs Jest tests with in-memory MongoDB
2. **Security Scan**: Runs npm audit and Snyk security scan
3. **Linting**: Checks code quality with ESLint

### **On Push to Main Branch:**
1. **Build Job**: Creates production build artifacts
2. **Deploy Job**: Automatically deploys to Railway/Heroku

## 📊 **Pipeline Jobs Breakdown**

| Job | Purpose | Runs On | Dependencies |
|-----|---------|---------|--------------|
| `test` | Run tests & linting | All branches | None |
| `build` | Create production build | Main branch only | `test` |
| `deploy` | Deploy to production | Main branch only | `test`, `build` |
| `security` | Security vulnerability scan | All branches | `test` |

## 🧪 **Testing Strategy**

### **Test Structure:**
```
tests/
├── setup.js          # Test environment configuration
├── auth.test.js      # Authentication tests
├── __mocks__/        # Mock files
└── fixtures/         # Test data
```

### **Test Commands:**
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### **Coverage Reports:**
- HTML reports in `coverage/` folder
- Console output with summary
- Coverage thresholds can be configured in `jest.config.js`

## 🐳 **Docker Features**

### **Multi-stage Build:**
- **Builder stage**: Installs dependencies and builds app
- **Production stage**: Creates minimal production image

### **Security Features:**
- Non-root user (`nodejs`)
- Minimal Alpine Linux base
- Health checks for monitoring

### **Development Features:**
- Hot reload with volume mounting
- MongoDB Express for database management
- Persistent data storage

## 🔒 **Security Features**

### **Automated Security:**
- **npm audit**: Checks for known vulnerabilities
- **Snyk**: Advanced security scanning
- **Docker security**: Non-root user, minimal base image

### **Environment Security:**
- Secrets stored in GitHub Actions
- No hardcoded credentials
- Environment-specific configurations

## 📈 **Monitoring & Health Checks**

### **Health Endpoint:**
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-14T22:00:00.000Z",
  "uptime": 3600.5,
  "environment": "production",
  "version": "1.0.0"
}
```

### **Docker Health Checks:**
- Automatic health monitoring
- Container restart on failure
- Integration with orchestration platforms

## 🚀 **Deployment Options**

### **Railway (Recommended):**
- Easy setup
- Automatic HTTPS
- Good free tier
- GitHub integration

### **Heroku:**
- Mature platform
- Good documentation
- Multiple add-ons
- Automatic deployments

### **Other Options:**
- **Render**: Good free tier
- **DigitalOcean App Platform**: Scalable
- **AWS Elastic Beanstalk**: Enterprise-grade

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **Tests Failing:**
```bash
# Clear Jest cache
npx jest --clearCache

# Run tests with verbose output
npm test -- --verbose
```

#### **Docker Issues:**
```bash
# Remove all containers and images
docker system prune -a

# Check container logs
docker-compose logs app
```

#### **Pipeline Failures:**
- Check GitHub Actions logs
- Verify secrets are set correctly
- Ensure all dependencies are installed

### **Debug Commands:**
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version
```

## 📚 **Next Steps**

1. **Customize Tests**: Add more test cases for your specific features
2. **Add Integration Tests**: Test API endpoints with real database
3. **Performance Testing**: Add load testing with tools like Artillery
4. **Monitoring**: Integrate with monitoring services (DataDog, New Relic)
5. **Slack Notifications**: Add notifications for deployment status

## 🎯 **Success Metrics**

- ✅ **Test Coverage**: Aim for >80%
- ✅ **Build Time**: Keep under 5 minutes
- ✅ **Deployment Time**: Keep under 2 minutes
- ✅ **Security**: Zero high/critical vulnerabilities
- ✅ **Uptime**: >99.9% availability

---

**Your CI/CD pipeline is now ready! 🎉**

Push to your main branch to trigger the first automated deployment.
