/* eslint-disable @typescript-eslint/no-explicit-any */
import colors from 'colors';
class Log {
    public static info(message: any, ...optionalParams: any[]) {
        if(process.env.ENV_NAME === 'development') {
            console.log(`${new Date().toISOString()} [INFO]:: ${colors.blue(message)}`.blue, ...optionalParams);
        }
    }
    public static error(message: any, ...optionalParams: any[]) {
        if(process.env.ENV_NAME === 'development') {
            console.log(`${new Date().toISOString()} [ERROR]:: ${colors.red(message)}`.red, ...optionalParams);
        }
    }
    public static warn(message: any, ...optionalParams: any[]) {
        if(process.env.ENV_NAME === 'development') {
            console.log(`${new Date().toISOString()} [WARN]:: ${colors.yellow(message)}`.yellow, ...optionalParams);
        }
    }
    public static test(message: any, ...optionalParams: any[]) {
        if(process.env.ENV_NAME === 'development') {
            console.log(`${new Date().toISOString()} [TEST]:: ${colors.green(message)}`.green, ...optionalParams);
        }
    }
    public static quiet(message: any, ...optionalParams: any[]) {
        if(process.env.ENV_NAME === 'development') {
            console.log(`${new Date().toISOString()} [QUIET]:: ${colors.gray(message)}`.gray, ...optionalParams);
        }
    }
}

export default Log;