export type SignInFormData = {
    email: string
    password: string
}

export type RegisterFormData = {
    email: string
    password: string
    passwordConfirm: string
}

export type AuthResponse = {
    token: string
    user: {
        id: number
        email: string
    }
}