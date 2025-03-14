import Log from "./logger";

describe('Log Class', () => {
    let originalEnv: string | undefined;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        // Backup the original environment
        originalEnv = process.env.ENV_NAME;
        // Mock console.log
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restore the original environment
        process.env.ENV_NAME = originalEnv;
        // Restore console.log after each test
        consoleLogSpy.mockRestore();
    });

    it('should log info message in development environment', () => {
        process.env.ENV_NAME = 'development';
        Log.info('This is an info message');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]::'));
    });

    it('should log error message in development environment', () => {
        process.env.ENV_NAME = 'development';
        Log.error('This is an error message');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]::'));
    });

    it('should log warn message in development environment', () => {
        process.env.ENV_NAME = 'development';
        Log.warn('This is a warning message');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[WARN]::'));
    });

    it('should log test message in development environment', () => {
        process.env.ENV_NAME = 'development';
        Log.test('This is a test message');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[TEST]::'));
    });

    it('should log quiet message in development environment', () => {
        process.env.ENV_NAME = 'development';
        Log.quiet('This is a quiet message');

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[QUIET]::'));
    });

    it('should not log anything if ENV_NAME is not development', () => {
        process.env.ENV_NAME = 'production';
        Log.info('This message should not be logged');

        expect(consoleLogSpy).not.toHaveBeenCalled();
    });
});
