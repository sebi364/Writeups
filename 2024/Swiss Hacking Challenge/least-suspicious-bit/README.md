# least-suspicious-bit - [misc] [baby]
### Files: [least-suspicious-bit.tar.gz](https://ctf.m0unt41n.ch/handouts/least-suspicious-bit.tar.gz)
```graphql
└── grey.png
```
### Description:
> Just as one might scrutinize the slight variations between "grey" and "gray", steganography enthusiasts meticulously analyze the least significant bit to conceal and reveal hidden messages. Yet, for the vast majority of people, the nuances of LSB steganography remain as obscure and unremarkable as the differences between the spellings of "grey" and "gray."

## Walktrough
Upon initial inspection, the provided download a single image that at first glance doesn't have anything useful in it.

![](./grey.png)

The description for this challange states that "*steganography enthusiasts meticulously analyze the least significant bit*", this is interesting because steganography is a method to hide data inside pictures. After using [an online steganography tool](https://stylesuxx.github.io/steganography/) on this image we are given the following flag:

```
shc2024{lsb_stego_like_in_the_g00d_old_days}
```