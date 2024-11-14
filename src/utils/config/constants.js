import 'dotenv/config';


const constants = {
    port: process.env.PORT || 3000,
    origin: process.env.ALLOWED_ORIGINS || "*",
    dbUrl: process.env.DB_URI || "",
    jwtSecrete: process.env.JWT_SECRETE || "",
    jwtExpiry: process.env.JWT_EXPIRY || "",
}

export default constants;

// console.log(process.env.PORT, '***')