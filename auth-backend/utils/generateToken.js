
import jwt from "jsonwebtoken";

const generateJWTTokenAndSetCookie = async (userid,response) =>{

    const token =jwt.sign({userid}, process.env.JWT_SECRET, {expiresIn: '15d'});
    response.cookie('jwt', token,
        {
            maxAge: 15*24*60*60*1000, //miliseconds
            httpOnly: true,
            sameSite:"strict",
            secure: false
        }
    );
}

export default generateJWTTokenAndSetCookie