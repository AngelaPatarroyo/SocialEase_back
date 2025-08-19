const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../../../src/middleware/authMiddleware');
const { createMockRequest, createMockResponse, createMockNext } = require('../../helpers/testHelpers');

describe('AuthMiddleware Unit Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
  });

  describe('Valid Token', () => {
    it('should authenticate user with valid Bearer token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'user';
      const token = jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET || 'test-secret-key'
      );

      mockReq.headers.authorization = `Bearer ${token}`;

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.id).toBe(userId);
      expect(mockReq.user.role).toBe(role);
    });

    it('should handle different token payload structures', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'admin';
      
      // Test with 'userId' instead of 'id'
      const token = jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'test-secret-key'
      );

      mockReq.headers.authorization = `Bearer ${token}`;

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user.id).toBe(userId);
      expect(mockReq.user.role).toBe(role);
    });

    it('should handle token with 'sub' claim', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'user';
      
      // Test with 'sub' claim
      const token = jwt.sign(
        { sub: userId, role },
        process.env.JWT_SECRET || 'test-secret-key'
      );

      mockReq.headers.authorization = `Bearer ${token}`;

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user.id).toBe(userId);
      expect(mockReq.user.role).toBe(role);
    });
  });

  describe('Invalid Token', () => {
    it('should reject request without Authorization header', () => {
      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing or invalid Authorization header',
          statusCode: 401
        })
      );
    });

    it('should reject request with invalid Authorization header format', () => {
      mockReq.headers.authorization = 'InvalidFormat token123';

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing or invalid Authorization header',
          statusCode: 401
        })
      );
    });

    it('should reject request without Bearer prefix', () => {
      mockReq.headers.authorization = 'token123';

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing or invalid Authorization header',
          statusCode: 401
        })
      );
    });

    it('should reject request with empty token', () => {
      mockReq.headers.authorization = 'Bearer ';

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Token not provided',
          statusCode: 401
        })
      );
    });

    it('should reject request with invalid JWT token', () => {
      mockReq.headers.authorization = 'Bearer invalid.token.here';

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid or expired token',
          statusCode: 401
        })
      );
    });

    it('should reject request with expired token', () => {
      const expiredToken = jwt.sign(
        { id: '507f1f77bcf86cd799439011', role: 'user' },
        process.env.JWT_SECRET || 'test-secret-key',
        { expiresIn: '0s' }
      );

      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid or expired token',
          statusCode: 401
        })
      );
    });

    it('should reject token without user ID', () => {
      const tokenWithoutId = jwt.sign(
        { role: 'user' },
        process.env.JWT_SECRET || 'test-secret-key'
      );

      mockReq.headers.authorization = `Bearer ${tokenWithoutId}`;

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Token payload missing user id',
          statusCode: 403
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle null authorization header', () => {
      mockReq.headers.authorization = null;

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing or invalid Authorization header',
          statusCode: 401
        })
      );
    });

    it('should handle undefined authorization header', () => {
      mockReq.headers.authorization = undefined;

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing or invalid Authorization header',
          statusCode: 401
        })
      );
    });

    it('should handle empty string authorization header', () => {
      mockReq.headers.authorization = '';

      authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing or invalid Authorization header',
          statusCode: 401
        })
      );
    });
  });
});
