export interface TokenPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

export interface TokenValidationResponse {
    isValid: boolean;
    user?: TokenPayload;
    message?: string;
}
