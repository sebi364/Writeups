from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from binascii import unhexlify

# Key and IV
key = 'react_native_expo_version_47.0.0'[:32].encode('utf-8')
iv = '__sekaictf2023__'.encode('utf-8')

# Decrypt the ciphertext using AES in CBC mode
ciphertext = unhexlify('03afaa672ff078c63d5bdb0ea08be12b09ea53ea822cd2acef36da5b279b9524')
cipher = AES.new(key, AES.MODE_CBC, iv)
decrypted = unpad(cipher.decrypt(ciphertext), AES.block_size).decode('utf-8')

print(decrypted)