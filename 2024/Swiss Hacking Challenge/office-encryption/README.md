# office-encryption
## About:
### Author: `xnull`
### Difficulty: `baby`
### Description:
> I heard about this nation state actor
> I'm not sure why actors would attack companies but we need encryption to secure our systems.
> Please add the encryption program I made to every software we had so we are secure! 
### Categories: [`crypto`]
### Files: [office-encryption.tar.gz](https://ctf.m0unt41n.ch/handouts/office-encryption.tar.gz)
```graphql
├── cipher_map.txt
├── cipher.txt
└── encrypt.py
```
### In a Nutshell:
We are given a python script that performs a substitution cipher encryption on a given text. The encrypted flag is provided, along with the cipher map used for encryption. Our task is to reverse the encryption and obtain the original flag.

## Walktrough:
### Analysis:
We are given 3 files: a python script `encrypt.py` that encrypts a text, a file containing a ciphertext, and a file named `cipher_map.txt`.

Taking a look at the `encrypt.py` file, we can see that it implements a simple substitution cipher. The `generate_substitution_cipher` function takes a text as input, shuffles the alphabet, and replaces each letter of the text with its shuffled counterpart:

<details>
<summary><b>encrypt.py</b></summary>

```py
from random import shuffle
from collections import Counter


def generate_substitution_cipher(text):
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    shuffled_alphabet = list(alphabet)
    shuffle(shuffled_alphabet)
    cipher_map = {
        original: substituted
        for original, substituted in zip(alphabet, shuffled_alphabet)
    }

    encrypted_text = ""
    for char in text:
        if char.lower() in cipher_map:
            encrypted_char = cipher_map[char.lower()]
            if char.isupper():
                encrypted_char = encrypted_char.upper()
            encrypted_text += encrypted_char
        else:
            encrypted_text += char

    return encrypted_text, cipher_map


text = "shc2024{fake_flag}"

encrypted_text, cipher_map = generate_substitution_cipher(text)

print(encrypted_text, cipher_map)
```

</details>

We can confirm this by taking a look at the cyphertext, where a general outline of a flag is recognizable, but some characters don't make any sense:
```
swo2024{jytmm_ruvs_opgbzu_mum}
```

### Decrypting the Flag:
The flag can be decrypted by reversing the cipher-map and rerunning the same substitution cypher. This can be achieved with a few small modifications to `encrypt.py`:

<details>
<summary><b>decrypt.py</b></summary>

```py
#!/usr/bin/python
def reversedict(d):
    return {v: k for k, v in d.items()}

def decrypt(cryptstring, cypher):
    cypher = reversedict(cypher)
    plainstring = ""
    for c in cryptstring:
        if c in cypher:
            plainstring += cypher[c]
        else:
            plainstring += c
    return plainstring

cypher = {'a': 'k', 'b': 'n', 'c': 'o', 'd': 'r', 'e': 'v', 'f': 'q', 'g': 'i', 'h': 'w', 'i': 'x', 'j': 'd', 'k': 'h', 'l': 'm', 'm': 'l', 'n': 'y', 'o': 'u', 'p': 'b', 'q': 'f', 'r': 'p', 's': 's', 't': 'z', 'u': 't', 'v': 'a', 'w': 'c', 'x': 'j', 'y': 'g', 'z': 'e'}
cryptstring = "swo2024{jytmm_ruvs_opgbzu_mum}"
decrypted = decrypt(cryptstring, cypher)
print(decrypted)
```

</details>

```
shc2024{xnull_does_crypto_lol}
```