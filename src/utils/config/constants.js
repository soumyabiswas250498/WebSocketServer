import "dotenv/config";

const constants = {
  port: process.env.PORT || 3000,
  origin: process.env.ALLOWED_ORIGINS || "*",
  dbUrl: process.env.DB_URI || "",
  jwtSecreteAT: process.env.JWT_SECRETE_AT || "",
  jwtSecreteRT: process.env.JWT_SECRETE_RT || "",
  jwtExpiry: process.env.JWT_EXPIRY || "",
  maxDevice: 5,
};

export default constants;

// console.log(process.env.PORT, '***')
