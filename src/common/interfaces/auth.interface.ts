export interface UserTokenData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface TokenValidationResponse {
    isValid: boolean;
    user?: UserTokenData;
    error?: string;
    message?: string;
}
