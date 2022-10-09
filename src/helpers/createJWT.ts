import jwt from "jsonwebtoken"

const createJWT = (payload: any) => {
     
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_LIFETIME
    })
    return token
}

export default createJWT