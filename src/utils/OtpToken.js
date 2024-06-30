import { currentTime, encryptAES, decryptAES } from "../utils/Encryption.js";
import randomstring from "randomstring";


function emailOtpTokenGen() {
    const otpTokenObj = {
        time: currentTime(),
        mode: 'emailVerify',
        otp: randomstring.generate({
            length: parseInt(process.env.OTP_LENGTH),
            charset: 'alphanumeric'
        }),
    }
    const otpTokenTXT = JSON.stringify(otpTokenObj);
    console.log(otpTokenTXT, '***otpTXT');
    const otpToken = encryptAES(otpTokenTXT);
    // console.log(otpToken, '***otpEnc');
    return otpToken;
}

function emailOtpTokenVerify({ otpToken, otp }) {
    const otpTXT = decryptAES(otpToken);
    const otpObj = JSON.parse(otpTXT);
    const nowTime = currentTime();
    if (otpObj.mode === 'emailVerify') {
        if (nowTime - otpObj.time > 300) {
            return { isVerified: false, reason: 'OTP Expired' };
        } else {
            if (otp === otpObj.otp) {
                return { isVerified: true, reason: 'OTP Verified' };
            } else {
                return { isVerified: false, reason: 'OTP Mismatch' };
            }
        }
    } else {
        return { isVerified: false, reason: 'OTP Mode Mismatch' };
    }


}

export { emailOtpTokenGen, emailOtpTokenVerify }