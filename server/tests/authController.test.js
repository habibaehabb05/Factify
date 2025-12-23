const { registerUser } = require('../controllers/authController');
const User = require('../models/User');
const UserFactory = require('../factories/UserFactory');
const httpMocks = require('node-mocks-http');

// Mock dependencies
jest.mock('../models/User');
jest.mock('../factories/UserFactory');
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mock-token')
}));

describe('Auth Controller - Registration Validation', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        // Clear mocks
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        req.body = { email: 'test@example.com', password: 'Password@123' }; // Missing username
        await registerUser(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ message: 'Please provide all required fields' });
    });

    it('should return 400 if password is too short', async () => {
        req.body = { username: 'test', email: 'test@example.com', password: 'Short1!' };
        await registerUser(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ message: 'Password must be at least 8 characters' });
    });

    it('should return 400 if password lacks uppercase', async () => {
        req.body = { username: 'test', email: 'test@example.com', password: 'password@123' };
        await registerUser(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ message: 'Password must contain at least one uppercase letter' });
    });

    it('should return 400 if password lacks lowercase', async () => {
        req.body = { username: 'test', email: 'test@example.com', password: 'PASSWORD@123' };
        await registerUser(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ message: 'Password must contain at least one lowercase letter' });
    });

    it('should return 400 if password lacks number', async () => {
        req.body = { username: 'test', email: 'test@example.com', password: 'Password!@#' };
        await registerUser(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ message: 'Password must contain at least one number' });
    });

    it('should return 400 if password lacks special character', async () => {
        req.body = { username: 'test', email: 'test@example.com', password: 'Password12345' };
        await registerUser(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ message: 'Password must contain at least one special character' });
    });

    it('should return 400 if user already exists', async () => {
        req.body = { username: 'test', email: 'existing@example.com', password: 'Password@123' };
        User.findOne.mockResolvedValue({ email: 'existing@example.com' }); // Mock existing user

        await registerUser(req, res);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ message: 'User already exists' });
    });

    it('should create user and return 201 if data is valid', async () => {
        req.body = { username: 'testuser', email: 'new@example.com', password: 'Password@123' };
        User.findOne.mockResolvedValue(null); // User does not exist

        const mockUser = {
            _id: 'mock-id',
            username: 'testuser',
            email: 'new@example.com',
            role: 'user'
        };
        UserFactory.createUser.mockResolvedValue(mockUser);

        await registerUser(req, res);

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({
            _id: 'mock-id',
            username: 'testuser',
            email: 'new@example.com',
            role: 'user',
            token: 'mock-token'
        });
    });
});
