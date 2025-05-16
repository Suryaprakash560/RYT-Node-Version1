const crypto = require('crypto-js')

function Encrypt (data,key){
    const EncryptedData = crypto.AES.encrypt(data,key).toString()
    return EncryptedData
}

function Decrypt (data,key){
    const Bytes = crypto.AES.decrypt(data,key)
    if(Bytes.sigBytes>0){
        const DecryptData = Bytes.toString(crypto.enc.Utf8)
        return DecryptData
    }
    else{
        return "Invalid"
    }
}
module.exports = {
                Encrypt,
                Decrypt
            }