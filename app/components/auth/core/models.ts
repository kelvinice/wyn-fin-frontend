export type SignInFormData = {
    email: string
    password: string
}

export type RegisterFormData = {
    email: string
    password: string
    passwordConfirm: string
}

export type User = {
    id: number
    email: string
    name?: string
    createdAt?: string
    updatedAt?: string
}

export type AuthResponse = {
    token: string
    refreshToken?: string
    expiresIn: number
    user: User
}