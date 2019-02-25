export interface ConversionPayload {
    to: Array<string> | string;
    from: Array<string> | string;
    value: string;
    convertedValue: string;
};