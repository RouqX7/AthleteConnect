export const validateStringType= ({
    value,
    values,
    errorMessage,
}: {
    value?: unknown;
    values?: unknown[];
    errorMessage?: string;
}) => {
    if (value && typeof value !== "string") {
        throw new Error(errorMessage ?? "Value must be of type string");
    }
    if (values) {
        for (const val of values) {
            if (val && typeof val !== "string") {
                throw new Error(errorMessage ?? "Value must be of type string");
            }
        }
    }
    return true;
}