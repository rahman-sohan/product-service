export interface TokenPayload {
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
    user?: TokenPayload;
    error?: string;
    message?: string;
}
