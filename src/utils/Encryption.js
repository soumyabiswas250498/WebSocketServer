import CryptoJS from "crypto-js";

// Encryption with AES
function encryptAES(text) {
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        process.env.ENCRYPTION_SECRET
    ).toString();
    return data;
}

// Decryption with AES
function decryptAES(encryptedText) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, process.env.ENCRYPTION_SECRET);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return data

}

function currentTime() {
    return Math.floor(Date.now() / 1000);
}

export { encryptAES, decryptAES, currentTime }