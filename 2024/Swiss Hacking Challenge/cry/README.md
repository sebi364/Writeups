# [cry](https://ctf.m0unt41n.ch/challenges/cry) - [crypto] [medium]
###  Files: [cry.tar.gz](https://ctf.m0unt41n.ch/handouts/cry.tar.gz)
```graphql
└── cry.py
```
## In a Nutshell:
### Summary
In this challenge, we are accessing a remote, encrypted key-value store. Apart from saving/retrieving our own keys, the store has two special entries, one of which is the flag. However, these two are encrypted with a different key than those that we put there.

The challenge is to retrieve and decrypt the flag. The source-code is provided as a download.

### Key insights:
- We have one known plaintext value ("example"), which we know was encrypted with the same key as the flag.
- The program uses 6 rounds of AES encryption/decryption for each block, which requires 2^54 bruteforce attempts to get the key, which is too much

## Inspecting the program:
After starting the program we see the following menu:
```
Vault menu: 5 TESTING QUERIES LEFT
  1) add value to vault
  2) get value from vault
  3) list available keys in the vault
option >
```
let's try a few things and take a quick look at the source code:
```
option > 3
Available keys: ['example', 'FLAG']
Vault menu: 4 TESTING QUERIES LEFT
  1) add value to vault
  2) get value from vault
  3) list available keys in the vault
option > 2
key > FLAG
Could not decrypt; invalid data: b'Sx\x19\xdf\xe1.oLN\x0c\n\xc7\x05OZF\x04h\xa5\xdf\x9f\xb6\xb8\xc18\xd7\xf6\xa6\x86\x97h\xcd'
```
```py
...
def main():
    ...
    admin_keys = generate_keys()
    user_keys = generate_keys()
    add(vault, admin_keys, "example", "nobody will be able to read this")
    add(vault, admin_keys, "FLAG", getenv("FLAG", "flag{fakeflagfakeflag}"))
    ...
    while True:
        option = int(input("option > "))

        match option:
            case 1:
                key = input("key  > ")
                text = input("text > ")
                assert all(i in printable for i in text)
                add(vault, user_keys, key, text)
                print(f"Successfully added the value ({vault[key]})")
            case 2:
                key = input("key > ")
                value = get(vault, user_keys, key)
                print(value)
    ...
```
We can see that the flag gets encrypted using a different key than our user's inputs. The program is using the "user_key" when working with our cmd input, therefore we are unable to decrypt the flag.

Furthermore, the encryption function appends a text at the end of the input, that gets checked before our decrypted value is returned:
```py
def encrypt(data, keys):
    ...
    data += b"<<valid_secret>>"
    ...


def decrypt(data, keys):
    ...
    if data[-16:] != b"<<valid_secret>>":
        return (f"Could not decrypt; invalid data: {data[:-16]}")
    
    return f"Decrypted data: {unpad(data[:-16], 16)}"
```
Luckily for us the function also returns something if the value wasn't decrypted successfully, so we can get the flag in it's encrypted form.

### Encryption & Key Generation
#### Encryption-Keys:
##### Generation of Keys in code:
The key generation function consists of a single line of code that creates 6 **small** binary keys that are stored in a list:
```py
def generate_keys():
    return [long_to_bytes(randbelow(2**9)).ljust(16) for _ in range(6)]
```
```py
[b'\x01\xa6              ', b'\xba               ', b'\x01\x8c              ', b')               ', b'\x19               ', b'o               ']
```
The function's output is a bit of a red flag, because a single key (or even a few of these keys) are not secure and can be cracked easily. The only reason why they are somewhat save is because the program uses 6 keys that add up exponentially.

##### Cryptographic Strength:
Our list of keys consists of 6 keys of whom each has 2⁹ possible combinations. This gives us a total of 2⁵⁴ combinations -> to much to brute force.

#### Cryptography Implementation
The function encrypts the input data using all 6 keys in a row. Before the encryption process, the data is padded and `<<valid_secret>>` is appended:
```py
def encrypt(data, keys):
    if isinstance(data, str):
        data = data.encode()

    data = pad(data, 16)
    data += b"<<valid_secret>>"

    for k in keys:
        data = AES.new(k, AES.MODE_ECB).encrypt(data)

    return data
```
**AES - ECB Mode:** The function uses AES ECB mode to encrypt the data, AES is a symmetric encryption algorithm. In ECB mode, each block of plaintext is encrypted independently using the same key, resulting in the same ciphertext for identical plaintext blocks.

**In a nutshell:** The encryption implementation can be compared to the layers of an onion. Each layer represents a key that was used to encrypt the output of the previous one. To decrypt this onion, we have to loop through our keys in reverse and remove one layer after another. This is exactly what our decryption function is doing:
```py
def decrypt(data, keys):
    if isinstance(data, str):
        data = data.encode()

    for k in keys[::-1]:
        data = AES.new(k, AES.MODE_ECB).decrypt(data)

    if data[-16:] != b"<<valid_secret>>":
        return (f"Could not decrypt; invalid data: {data[:-16]}")

    return f"Decrypted data: {unpad(data[:-16], 16)}"
```

## Vulnerabilities:
### Explanation
Because I didn't find any obvious implementation mistakes in the code, I decided to take a closer look at the encryption & decryption process. I have put together a small Python program, that only uses the encryption & decryption functions from the original script and runs a test string through it:

<details>
<summary><b>mimal_crypto.py</b></summary>

```py
#!/usr/bin/env python3
from Crypto.Util.number import long_to_bytes
from Crypto.Util.Padding import pad, unpad
from Crypto.Cipher import AES
from secrets import randbelow

def encrypt(data, keys):
    data = pad(data.encode(), 16)

    for k in keys:
        print(data)
        data = AES.new(k, AES.MODE_ECB).encrypt(data)
    print(data)

    return data


def decrypt(data, keys):
    for k in keys[::-1]:
        print(data)
        data = AES.new(k, AES.MODE_ECB).decrypt(data)
    print(data)

    return unpad(data, 16)

def generate_keys():
    return [long_to_bytes(randbelow(2**9)).ljust(16) for _ in range(4)]

keys = generate_keys()
input_text = "shc2024{flag}"

print("######################################################")
print("Input: ", input_text)
print("######################################################")
encrypted_text = encrypt("shc2024{flag}", keys)
print("######################################################")
print("Encrypted: ", encrypted_text)
print("######################################################")
decrypted_text = decrypt(encrypted_text, keys)
print("######################################################")
print("Decrypted: ", decrypted_text)
print("######################################################")
```

</details>

```py
######################################################
Input:  shc2024{flag}
######################################################
b'shc2024{flag}\x03\x03\x03'
b'\x14\xb1W\xdf\xed9Mi\xb6[\x01s\x0b`\xb32'
b'\xd9\xef\xbd\xddmy\x1c\xa7[WD\x83)kz\xc9'
b']w\xdd\xa6\n\xf2\x1az\xc5\xc8\xdf\t\xce,qz'
b'\x98\xbe[g\xa7NL\xf3\xb7\xfd\x96\x8f^D\x9f\xe3'
######################################################
Encrypted:  b'\x98\xbe[g\xa7NL\xf3\xb7\xfd\x96\x8f^D\x9f\xe3'
######################################################
b'\x98\xbe[g\xa7NL\xf3\xb7\xfd\x96\x8f^D\x9f\xe3'
b']w\xdd\xa6\n\xf2\x1az\xc5\xc8\xdf\t\xce,qz'
b'\xd9\xef\xbd\xddmy\x1c\xa7[WD\x83)kz\xc9'
b'\x14\xb1W\xdf\xed9Mi\xb6[\x01s\x0b`\xb32'
b'shc2024{flag}\x03\x03\x03'
######################################################
Decrypted:  b'shc2024{flag}'
######################################################
```
The output for this function is interesting because it shows that the in-between values are the same for the decryption & encryption process.

**Key Conclusion:** If we have a known plaintext & cyphertext value, we can get a matching "in-between" value by decrypting the last 3 layers of the cyphertext, and encrypting the first 3 layers of a plaintext.

### Proof of concept:
#### Cryptographic Strength, pt 2:
If we attack a middle value from both sides, instead of trying to break 6 keys at once, we can significantly reduce the number of possibilities:
```
((2**9)*3)*2 == (2**(9*3))*2 == (2 ** 27)*2 == 268'435'456
```
While 268 Million is a lot of possible combinations, it's nothing that a reasonably modern Laptop can't handle.

To summarize, here is our Plan:
1. Calculate list with all possible "in-between values" that can occur after 3 layers of encrypting a known plaintext.
2. Calculate list with all possible "in-between values" that can occur after 3 layers of decrypting the plaintext's encrypted counterpart.
3. Cross Reference both lists and find the value that is present in both of them.
rerun steps 1 & 2, and find the keys that lead us to our "known overlapping in-between value" again.

If all the steps above were executed successfully, we should now have a valid key, that can be used to decrypt & encrypt the text.

Here is a simple proof of concept that demonstrates that the above-described approach, but uses only with 4 keys:

<details>
<summary><b>proof_of_concept.py</b></summary>

```py
#!/usr/bin/python3
from secrets import randbelow
from Crypto.Util.number import long_to_bytes
from Crypto.Cipher import AES

# ----------------------------------------------------------------
# encrypt sample data

keys = [long_to_bytes(randbelow(2**9)).ljust(16) for _ in range(4)]

data = b"<<valid_secret>>"
data_enc = data
for k in keys:
    data_enc = AES.new(k, AES.MODE_ECB).encrypt(data_enc)

# ----------------------------------------------------------------
# try to guess key usign known plaintext and ciphertext

keys_bruteforce = [long_to_bytes(i).ljust(16) for i in range(0, 2**9)] # generate a list of all possible states a key can be in (only 512 possibilities)

values1 = []
for i in keys:
    i_crypted = AES.new(i, AES.MODE_ECB).encrypt(data)
    for j in keys:
        j_crypted = AES.new(j, AES.MODE_ECB).encrypt(i_crypted)
        values1.append(j_crypted)

values2 = []
for i in keys:
    i_decrypted = AES.new(i, AES.MODE_ECB).decrypt(data_enc)
    for j in keys:
        j_decrypted = AES.new(j, AES.MODE_ECB).decrypt(i_decrypted)
        values2.append(j_decrypted)

intersection = set(values1).intersection(set(values2))
print(f"Intersection: {intersection}")

# ----------------------------------------------------------------
# find keys that lead to intersection

key = []
for i in keys_bruteforce:
    i_crypted = AES.new(i, AES.MODE_ECB).encrypt(data)
    for j in keys_bruteforce:
        j_crypted = AES.new(j, AES.MODE_ECB).encrypt(i_crypted)
        if j_crypted in intersection:
            key += [i, j]

for i in keys_bruteforce:
    i_decrypted = AES.new(i, AES.MODE_ECB).decrypt(data_enc)
    for j in keys_bruteforce:
        j_decrypted = AES.new(j, AES.MODE_ECB).decrypt(i_decrypted)
        if j_decrypted in intersection:
            key += [j, i]

# ----------------------------------------------------------------

print(f"Guessed: {key}")
print(f"Real:    {keys}")
```

</details>

---

## Exploitation:
### One last thing!
Before we try to break the admin_key itself, we have to think about how we got our flag value. We have gotten it by trying to decrypt it using the user_key, which means that there is an "additional layer" of cryptography on top of the admin key encryption.
```py
our_encrypted_flag = decrypt(encrypt(flag, admin_key), user_key)
```
To get rid of that extra layer, we have to break the user_key and use it to "encrypt" our flag, which internally undoes the decryption attempt with the user_key, and leaves us with the actual cyphertext.

### Breaking the Cryptography!
Now that we know how we can break a key, it's finally time to make a plan for how we can break it:

#### 1. Break the user_key:
As mentioned above, we have to get the user_key first, before we can attempt to break the admin key. To get our plaintext & cyphertext pair, we can use the program's builtin function to encrypt any text and take note of its encrypted value. Once we have that, we can enter the values into the following script that executes the attack described in the proof of concept on all 6 layers.

<details>
<summary><b>1_step.py</b></summary>

```py
#!/usr/bin/python3
from Crypto.Util.number import long_to_bytes
from Crypto.Cipher import AES

keys_bruteforce = [long_to_bytes(i).ljust(16) for i in range(0, 2**9)]

data = b"ttttttttttttttttttttttttttttttttttttttttttttttttt"[:16]
data_enc = b'\x96\xb4\xaa\xdfK,\xb2\xd6\x0b\xea\x8a\xf3\x12\xcb\x84\x84\x96\xb4\xaa\xdfK,\xb2\xd6\x0b\xea\x8a\xf3\x12\xcb\x84\x84\x96\xb4\xaa\xdfK,\xb2\xd6\x0b\xea\x8a\xf3\x12\xcb\x84\x84\xf1\t\xe6\xf53po\x08\xad\x92\xebTa\xf3BS\x98\xceV\xbdO\x93\xb6\xc1\xf2\xeb\xb5\xcdMxs\xdd'[:16]

# try to guess key usign known plaintext and ciphertext
print("==================================================")
# find intersection
values1 = []
for i in keys_bruteforce:
    i_crypted = AES.new(i, AES.MODE_ECB).encrypt(data)
    for j in keys_bruteforce:
        j_crypted = AES.new(j, AES.MODE_ECB).encrypt(i_crypted)
        for k in keys_bruteforce:
            k_crypted = AES.new(k, AES.MODE_ECB).encrypt(j_crypted)
            values1.append(k_crypted)

values2 = []
for i in keys_bruteforce:
    i_decrypted = AES.new(i, AES.MODE_ECB).decrypt(data_enc)
    for j in keys_bruteforce:
        j_decrypted = AES.new(j, AES.MODE_ECB).decrypt(i_decrypted)
        for k in keys_bruteforce:
            k_decrypted = AES.new(k, AES.MODE_ECB).decrypt(j_decrypted)
            values2.append(k_decrypted)

intersection = set(values1).intersection(set(values2))
print(f"Intersection: {intersection}")


print("==================================================")

key = []
for i in keys_bruteforce:
    i_crypted = AES.new(i, AES.MODE_ECB).encrypt(data)
    for j in keys_bruteforce:
        j_crypted = AES.new(j, AES.MODE_ECB).encrypt(i_crypted)
        for k in keys_bruteforce:
            k_crypted = AES.new(k, AES.MODE_ECB).encrypt(j_crypted)
            if k_crypted in intersection:
                key += [i, j, k]

for i in keys_bruteforce:
    i_decrypted = AES.new(i, AES.MODE_ECB).decrypt(data_enc)
    for j in keys_bruteforce:
        j_decrypted = AES.new(j, AES.MODE_ECB).decrypt(i_decrypted)
        for k in keys_bruteforce:
            k_decrypted = AES.new(k, AES.MODE_ECB).decrypt(j_decrypted)
            if k_decrypted in intersection:
                key += [k, j, i]

print(f"Key: {key}")
```

</details>
This will take about 30 minutes and requires about 16GB of RAM.

#### 2. Decrypting example & flag cyphertext
If the previous step was successful, we now have the user_key. This can be used to undo the "failed decryption attempt" with the user_key. After the decryption is successful, we will have the cyphertext for the example string, and the flag.

<details>
<summary><b>2_step.py</b></summary>

```py
#!/usr/bin/env python3

from Crypto.Util.number import bytes_to_long, long_to_bytes
from Crypto.Util.Padding import pad, unpad
from Crypto.Cipher import AES
from secrets import randbelow
from string import printable
from os import getenv

mykey = [b'\x01\xa6              ', b'\xba               ', b'\x01\x8c              ', b')               ', b'\x19               ', b'o               ']


def encrypt(data, keys):
    if isinstance(data, str):
        data = data.encode()

    data = pad(data, 16)

    for k in keys:
        data = AES.new(k, AES.MODE_ECB).encrypt(data)

    return data


def decrypt(data, keys):
    if isinstance(data, str):
        data = data.encode()

    for k in keys[::-1]:
        data = AES.new(k, AES.MODE_ECB).decrypt(data)

    if data[-16:] != b"<<valid_secret>>":
        return (f"Could not decrypt; invalid data: {data[:-16]}")

    return f"Decrypted data: {unpad(data[:-16], 16)}"

print(encrypt(b'\x1b\xc9\xb1\x0b8\xebi+\x80\x9e\x0f\xcdY\x1b\x9dF\x9c"\xbar\xe9\xa34FG\xd6\x1b\t\r?o\xda\xdbh\xa89z\xaf\xdf\xe1\xaa\xca\xe2/M\xa9\x80:', mykey))
print(encrypt(b"\x83K\xae\x1c'\xddc#\xbaV\x8b/\x0f\x07\xd3\x00<`Ih@e\x95dt\xfe\xdb\x1b)\x9b\xfb\xa6\xd0\xcd)\x13`\x9e\xcc-\xa6\xde\xdd\xbf\x18\xee\xf6\x04", mykey))
```

</details>

#### 3. Breaking the admin key
We can now use the encrypted example text, which we know the value of because it's hardcoded in the server's source-code, to perform a similar attack as in step 1:

<details>
<summary><b>3_step.py</b></summary>

```py
#!/usr/bin/python3
from Crypto.Util.number import long_to_bytes
from Crypto.Cipher import AES

keys_bruteforce = [long_to_bytes(i).ljust(16) for i in range(0, 2**9)]

data = b"nobody will be able to read this"[:16]
data_enc = b"\xcb\x88\x02\xe4f3!\xa2f\x7f\xdb\x11\xb4T \x08\xe0}\\i@LKmz^3\x10CGk\xafYp\xd0\x9d'\xf2\xe7\x9c\xae\x00\xbezm\xbaJ\xb5A%\xf2@l\x1a\x13\x8a\x9f\x0e\xc0\x1f\x83\xf0\x85y"[:16]

# try to guess key usign known plaintext and ciphertext
print("==================================================")
# find intersection
values1 = []
for i in keys_bruteforce:
    i_crypted = AES.new(i, AES.MODE_ECB).encrypt(data)
    for j in keys_bruteforce:
        j_crypted = AES.new(j, AES.MODE_ECB).encrypt(i_crypted)
        for k in keys_bruteforce:
            k_crypted = AES.new(k, AES.MODE_ECB).encrypt(j_crypted)
            values1.append(k_crypted)

values2 = []
for i in keys_bruteforce:
    i_decrypted = AES.new(i, AES.MODE_ECB).decrypt(data_enc)
    for j in keys_bruteforce:
        j_decrypted = AES.new(j, AES.MODE_ECB).decrypt(i_decrypted)
        for k in keys_bruteforce:
            k_decrypted = AES.new(k, AES.MODE_ECB).decrypt(j_decrypted)
            values2.append(k_decrypted)

intersection = set(values1).intersection(set(values2))
print(f"Intersection: {intersection}")


print("==================================================")

key = []
for i in keys_bruteforce:
    i_crypted = AES.new(i, AES.MODE_ECB).encrypt(data)
    for j in keys_bruteforce:
        j_crypted = AES.new(j, AES.MODE_ECB).encrypt(i_crypted)
        for k in keys_bruteforce:
            k_crypted = AES.new(k, AES.MODE_ECB).encrypt(j_crypted)
            if k_crypted in intersection:
                key += [i, j, k]

for i in keys_bruteforce:
    i_decrypted = AES.new(i, AES.MODE_ECB).decrypt(data_enc)
    for j in keys_bruteforce:
        j_decrypted = AES.new(j, AES.MODE_ECB).decrypt(i_decrypted)
        for k in keys_bruteforce:
            k_decrypted = AES.new(k, AES.MODE_ECB).decrypt(j_decrypted)
            if k_decrypted in intersection:
                key += [k, j, i]

print(f"Key: {key}")
```

</details>
If successful, this will give us the admin key that we can use to finally decrypt our flag:

<details>
<summary><b>4_get_flag.py</b></summary>

```py
#!/usr/bin/env python3

from Crypto.Util.Padding import pad, unpad
from Crypto.Cipher import AES

mykey = [b'\x01-              ', b'\x01\x1e              ', b'\x01U              ', b'\xb4               ', b'\xb1               ', b'\x01v              ']

def decrypt(data, keys):
    if isinstance(data, str):
        data = data.encode()

    for k in keys[::-1]:
        data = AES.new(k, AES.MODE_ECB).decrypt(data)

    if data[-16:] != b"<<valid_secret>>":
        return (f"Could not decrypt; invalid data: {data[:-16]}")

    return f"Decrypted data: {unpad(data[:-16], 16)}"

print(decrypt(b"\xcb\x88\x02\xe4f3!\xa2f\x7f\xdb\x11\xb4T \x08\xe0}\\i@LKmz^3\x10CGk\xafYp\xd0\x9d'\xf2\xe7\x9c\xae\x00\xbezm\xbaJ\xb5A%\xf2@l\x1a\x13\x8a\x9f\x0e\xc0\x1f\x83\xf0\x85y", mykey))
print(decrypt(b'\x04\x03\x82#\xaer>q\xaf\\\xe9\x06U\xc2A\xbbM,\x8d{/c\xda0fY2\xf2a\xbc>r\x0f\xa99&\xae\xca\nC\x8eE\xfe*l\x9e\x80\x80A%\xf2@l\x1a\x13\x8a\x9f\x0e\xc0\x1f\x83\xf0\x85y', mykey))
```

</details>

```
shc2024{every1_will_b3_able_t0_read_th1s}
```