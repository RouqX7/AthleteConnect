import { validateStringType } from "./typeValidator";

describe('should test if value is a string', () => {
    it('should return true if value is a string', () => {
        expect(validateStringType({ value: 'string' })).toBe(true);
    });

    it('should throw an error if value is not a string', () => {
        expect(() => validateStringType({ value: 1 })).toThrow('Value must be of type string');
    });

    it('should throw an error if value is not a string', () => {
        expect(() => validateStringType({ value: 1, errorMessage: 'Value must be a string' })).toThrow('Value must be a string');
    });

    it('should throw an error if value is not a string', () => {
        expect(() => validateStringType({ value: 1, values: [1, 2, 3] })).toThrow('Value must be of type string');
    });

    it('should throw an error if value is not a string', () => {
        expect(() => validateStringType({ value: 1, values: [1, 2, 3], errorMessage: 'Value must be a string' })).toThrow('Value must be a string');
    });
});

describe('should test if values are strings', () => {
    it('should return true if values are strings', () => {
        expect(validateStringType({ values: ['string', 'string', 'string'] })).toBe(true);
    });

    it('should throw an error if values are not strings', () => {
        expect(() => validateStringType({ values: ['string', 1, 'string'] })).toThrow('Value must be of type string');
    });

    it('should throw an error if values are not strings', () => {
        expect(() => validateStringType({ values: ['string', 1, 'string'], errorMessage: 'Value must be a string' })).toThrow('Value must be a string');
    });
});