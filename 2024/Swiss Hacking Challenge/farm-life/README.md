# farm-life
## About:
### Author: `Roxy`
### Difficulty: `easy`
### Description:
> Susan from HR decided that to improve team spirit in the office, they would all go volunteer on a farm.
> This caused terrible drama with Veronica, who claimed to have had the idea first.
> Marcel chimed in that he hated stinky farms and, like probably everybody else, would not want to join a trip where he would only ruin his brand new white sneakers.
> Rumor has it that after weeks of bickering, Veronica booby-trapped the office kitchen and caused Susan to trip...
### Categories: [`crypto`]
### Files: [least-suspicious-bit.tar.gz](https://ctf.m0unt41n.ch/handouts/least-suspicious-bit.tar.gz)
```graphql
└── otp_public.py
```

## Walktrough
### Overview:
This challenge consists of a basic Python program that uses XOR to encrypt a user's input with a key that changes with each request. The program provides the user with a simple menu that has 3 possible choices:

1. Encrypt an arbitrary binary string
2. Get the (encrypted) flag
3. Exit

### Solution:
In order to decrypt the exported flag, we would need to somehow obtain the key that was used to encrypt the flag. Due to the nature of XOR, we could reverse the key if we were somehow able to get the program to encrypt some known plaintext with the same key that was used to encrypt the flag.

After taking a closer look at the main function, I noticed that the key only gets changed after the user encrypts a text themselves, but not after we export the key. This allows us to exploit the program by exporting the flag first and then encrypting the known plaintext (with the same key that was used to encrypt the flag) right after that.

<details>
<summary><b>otp_public.py - main()</b></summary>

```py
key = format(secrets.randbits(365), 'b')
print("Welcome to the CryptoFarm!")
while True:
    command = input('Would you like to encrypt a message yourself [1], get the flag [2], or exit [3] \n>').strip()
    try:
        if command == "1":
            data = input('Enter the binary string you want to encrypt \n>')
            print("Ciphertext = ", encrypt(key, data))
            key = format(secrets.randbits(365), 'b')
        elif command == "2":
            print("Flag = ", encrypt(key, format(int.from_bytes(FLAG.encode(), 'big'), 'b')))
        elif command == "3":
            print("Exiting...")
            break
        else:
            print("Please enter a valid input")
    except Exception:
        print("Something went wrong.")
```

</details>

To get the initial key, we just have to XOR our known plaintext with it's encrypted counterpart. The key can than be used to decrypt the flag.

<details>
<summary><b>solve.py</b></summary>

```py
ENCRYPTED_FLAG = "001111110011110101001010100100010100011110101110111011001001111011000110010101100101010111010010110101100110010100111011101110010101001011110001101010000001110001011101111001001101111010010000100011001001000011101011001001111010111000011101000101001101010101010111101001100010110101011101000100001110000"
PLAINTEXT = "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
PLAINTEXT_ENC = "110110011110110110001100111101010010011111001010100001000110100001011000100011101001110101101100011110101010111111100111011001111000111000110011000101101000110010011111001011000110000000010010001100100000011001100001100101010001000010010111110111100000011110011101011011001111111110000011110000000001101"

def xor(key, ciphertext):
    return ''.join(str(int(a) ^ int(b)) for a, b in zip(key, ciphertext))

encryption_key = xor(PLAINTEXT, PLAINTEXT_ENC)
flag = xor(encryption_key, ENCRYPTED_FLAG)
flag_decoded = int(flag, 2).to_bytes((int(flag, 2).bit_length() + 7) // 8, 'big').decode()
print(flag_decoded)
```

</details>

```
shc2024{Old_Venona_Had_A_KEY_Eeieeioh}
```