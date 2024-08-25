# Crack Me - [rev] [⭐⭐]
### Files: [CrackMe.apk](./CrackMe.apk)
## Overview:
We are given an APK file that can be installed on a phone, or in a VM. After launching the app we are greeted by a simple login prompt that asks for email/password.

![](./pictures/02.png)

I tried some common credentials, but none of them worked. There is also an "Admin Account" checkbox, but it did not change anything (yet), so we need to dig a bit deeper...

## Analysis:
We can decompile the APK using [jadx](https://github.com/skylot/jadx). Opening the manifest reveals multiple clues that we are working with a React-native app, that uses [Firebase](https://www.youtube.com/watch?v=vAoB4VbhRzM) for its backend:

![](./pictures/03.png)

Next I found that React keeps most resources in `/assets/index.android.bundle`, which can be further decompiled using [react-native-decompiler](https://www.npmjs.com/package/react-native-decompiler). This leaves us with 863 poorly named `.js` files.

```
x1eg4:~/CTF/sekai2024/crackme: npx react-native-decompiler -i ./index.android.bundle -o ./output
Reading file...
Parsing JS...
Finding modules...
Took 2223.018202ms
Pre-parsing modules...
 ████████████████████████████████████████ 100% | ETA: 0s | 864/864
Took 1607.047232ms
Tagging...
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0% | ETA: 50s | 1/864
Took 58.09940200000074ms
Filtering out modules only depended on ignored modules...
655 remain to be decompiled
Took 174.21415500000057ms
Decompiling...
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0% | ETA: 2316s | 1/655
Took 3540.0594949999995ms
Generating code...
 ████████████████████████████████████████ 100% | ETA: 0s | 655/655
Took 4569.7086420000005ms
Saving...
 ████████████████████████████████████████ 100% | ETA: 0s | 655/655
Writing to cache...
Took 484.1550150000003ms
Done!
x1eg4:~/CTF/sekai2024/crackme: ls output/
0.js    118.js  138.js  156.js  174.js  21.js   384.js  400.js  419.js  436.js  456.js  473.js  490.js  507.js  525.js  543.js  560.js  578.js  595.js  611.js  629.js  646.js  663.js  680.js  698.js  714.js  732.js  74.js   767.js  784.js  800.js  819.js  836.js  853.js  91.js
100.js  119.js  139.js  157.js  175.js  22.js   385.js  401.js  41.js   437.js  457.js  474.js  491.js  508.js  526.js  544.js  561.js  579.js  596.js  612.js  62.js   647.js  664.js  681.js  699.js  715.js  733.js  750.js  768.js  785.js  801.js  81.js   837.js  854.js  92.js
101.js  120.js  140.js  158.js  176.js  23.js   386.js  402.js  420.js  438.js  458.js  475.js  492.js  50.js   527.js  545.js  562.js  57.js   597.js  613.js  630.js  648.js  665.js  682.js  69.js   716.js  734.js  751.js  769.js  786.js  802.js  820.js  838.js  855.js  93.js
102.js  121.js  141.js  159.js  177.js  24.js   387.js  403.js  421.js  439.js  459.js  476.js  493.js  510.js  528.js  546.js  563.js  580.js  598.js  614.js  631.js  649.js  666.js  683.js  6.js    717.js  735.js  752.js  76.js   787.js  803.js  821.js  839.js  856.js  95.js
103.js  122.js  142.js  15.js   178.js  25.js   388.js  404.js  422.js  43.js   45.js   477.js  494.js  511.js  529.js  547.js  564.js  581.js  599.js  615.js  632.js  64.js   667.js  684.js  700.js  718.js  736.js  753.js  770.js  788.js  804.js  822.js  83.js   857.js  96.js
104.js  123.js  143.js  160.js  179.js  26.js   389.js  405.js  423.js  440.js  460.js  478.js  495.js  512.js  52.js   548.js  565.js  582.js  59.js   616.js  633.js  650.js  668.js  685.js  701.js  719.js  737.js  754.js  771.js  789.js  805.js  823.js  840.js  858.js  97.js
105.js  124.js  144.js  161.js  17.js   275.js  38.js   406.js  424.js  441.js  461.js  479.js  496.js  513.js  530.js  549.js  566.js  583.js  5.js    617.js  634.js  651.js  669.js  686.js  702.js  71.js   738.js  755.js  772.js  78.js   806.js  824.js  841.js  859.js  98.js
106.js  125.js  145.js  162.js  184.js  27.js   390.js  407.js  425.js  442.js  462.js  47.js   497.js  514.js  531.js  54.js   567.js  584.js  600.js  618.js  635.js  652.js  66.js   687.js  703.js  720.js  739.js  756.js  773.js  790.js  807.js  825.js  842.js  85.js   99.js
107.js  126.js  146.js  163.js  185.js  29.js   391.js  409.js  426.js  443.js  463.js  480.js  498.js  515.js  532.js  550.js  568.js  585.js  601.js  619.js  636.js  653.js  670.js  688.js  704.js  721.js  73.js   757.js  774.js  791.js  808.js  826.js  843.js  860.js  9.js
108.js  127.js  147.js  164.js  186.js  2.js    392.js  40.js   427.js  444.js  464.js  481.js  499.js  516.js  533.js  551.js  569.js  586.js  602.js  61.js   637.js  654.js  671.js  689.js  705.js  722.js  740.js  758.js  775.js  792.js  809.js  827.js  844.js  861.js  null.cache
109.js  128.js  148.js  165.js  188.js  30.js   393.js  410.js  428.js  445.js  465.js  482.js  49.js   517.js  534.js  552.js  56.js   587.js  603.js  620.js  638.js  655.js  672.js  68.js   706.js  723.js  741.js  759.js  776.js  793.js  80.js   828.js  845.js  862.js
110.js  129.js  149.js  166.js  18.js   31.js   394.js  411.js  429.js  446.js  466.js  483.js  4.js    518.js  535.js  553.js  570.js  588.js  604.js  621.js  639.js  656.js  673.js  690.js  707.js  724.js  742.js  75.js   777.js  794.js  810.js  829.js  846.js  863.js
111.js  12.js   14.js   167.js  191.js  32.js   395.js  412.js  42.js   447.js  467.js  484.js  500.js  519.js  537.js  554.js  571.js  589.js  605.js  622.js  63.js   657.js  674.js  691.js  708.js  725.js  743.js  760.js  778.js  795.js  811.js  82.js   847.js  864.js
112.js  130.js  150.js  168.js  192.js  33.js   396.js  413.js  430.js  448.js  468.js  485.js  501.js  51.js   538.js  555.js  572.js  58.js   606.js  623.js  640.js  658.js  675.js  692.js  709.js  726.js  744.js  761.js  779.js  796.js  813.js  830.js  848.js  86.js
113.js  131.js  151.js  169.js  193.js  34.js   397.js  414.js  431.js  44.js   469.js  486.js  502.js  520.js  539.js  556.js  573.js  590.js  607.js  624.js  641.js  659.js  676.js  693.js  70.js   727.js  745.js  762.js  77.js   797.js  814.js  831.js  849.js  87.js
114.js  133.js  152.js  170.js  197.js  35.js   398.js  415.js  432.js  452.js  46.js   487.js  503.js  521.js  53.js   557.js  574.js  591.js  608.js  625.js  642.js  65.js   677.js  694.js  710.js  728.js  746.js  763.js  780.js  798.js  815.js  832.js  84.js   88.js
115.js  135.js  153.js  171.js  198.js  36.js   399.js  416.js  433.js  453.js  470.js  488.js  504.js  522.js  540.js  558.js  575.js  592.js  609.js  626.js  643.js  660.js  678.js  695.js  711.js  729.js  747.js  764.js  781.js  799.js  816.js  833.js  850.js  89.js
116.js  136.js  154.js  172.js  19.js   37.js   39.js   417.js  434.js  454.js  471.js  489.js  505.js  523.js  541.js  559.js  576.js  593.js  60.js   627.js  644.js  661.js  679.js  696.js  712.js  730.js  748.js  765.js  782.js  79.js   817.js  834.js  851.js  8.js
117.js  137.js  155.js  173.js  20.js   383.js  3.js    418.js  435.js  455.js  472.js  48.js   506.js  524.js  542.js  55.js   577.js  594.js  610.js  628.js  645.js  662.js  67.js   697.js  713.js  731.js  749.js  766.js  783.js  7.js    818.js  835.js  852.js  90.js
```

After searching for keywords like `auth`, `password`, `firebase`, I found the Firebase API key in [477.js](./jsfiles/477.js):
```js
var c = {
  apiKey: 'AIzaSyCR2Al5_9U5j6UOhqu0HCDS0jhpYfa2Wgk',
  authDomain: 'crackme-1b52a.firebaseapp.com',
  projectId: 'crackme-1b52a',
  storageBucket: 'crackme-1b52a.appspot.com',
  messagingSenderId: '544041293350',
  appId: '1:544041293350:web:2abc55a6bb408e4ff838e7',
  measurementId: 'G-RDD86JV32R',
  databaseURL: 'https://crackme-1b52a-default-rtdb.firebaseio.com',
};
exports.default = c;
```

However [the API key is not enough to do anything interesting](https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public), so I looked for scripts that use these credentials instead. This got me [443.js](./jsfiles/443.js):

```js
...
    e._verifyEmail =
      ((o = module275.default(function* (t) {
        t.setState({
          verifying: true,
        });
        var n = module478.initializeApp(module477.default),
          o = module486.getDatabase(n);
        if ('admin@sekai.team' !== t.state.email || false === e.validatePassword(t.state.password)) console.log('Not an admin account.');
        else console.log('You are an admin...This could be useful.');
        var s = module488.getAuth(n);
        module488
          .signInWithEmailAndPassword(s, t.state.email, t.state.password)
          .then(function (e) {
            t.setState({
              verifying: false,
            });
            var n = module486.ref(o, 'users/' + e.user.uid + '/flag');
            module486.onValue(n, function () {
              t.setState({
                verifying: false,
              });
              t.setState({
                errorTitle: 'Hello Admin',
                errorMessage: "Keep digging, you're almost there!",
              });
              t.AlertPro.open();
            });
          })
          .catch(function (e) {
            t.setState({
              verifying: false,
            });
            var n = e.code,
              o = e.message;

            if ('auth/wrong-password' === n) {
              t.setState({
                password: '',
                wrongPwd: true,
                errorTitle: 'Password Error',
                errorMessage: 'Password is incorrect, please check again',
              });
              t.AlertPro.open();
            } else if ('auth/invalid-email' === n) {
              t.setState({
                email: '',
                password: '',
                wrongEmail: true,
                errorTitle: 'Email error',
                errorMessage: 'Invalid email, please check again',
              });
              t.AlertPro.open();
            } else {
              t.setState({
                email: '',
                password: '',
                errorTitle: 'Error',
                errorMessage: o,
              });
              t.AlertPro.open();
            }
          });
      })),
      function (e) {
        return o.apply(this, arguments);
      });

    e.validatePassword = function (e) {
      if (17 !== e.length) return false;
      var t = module700.default.enc.Utf8.parse(module456.default.KEY),
        n = module700.default.enc.Utf8.parse(module456.default.IV);
      return (
        '03afaa672ff078c63d5bdb0ea08be12b09ea53ea822cd2acef36da5b279b9524' ===
        module700.default.AES.encrypt(e, t, {
          iv: n,
        }).ciphertext.toString(module700.default.enc.Hex)
      );
    };
...
```

We see that some information is hardcoded in this script, notably:
* **E-Mail** -> `admin@sekai.team`
* **Password** -> `03afaa672ff078c63d5bdb0ea08be12b09ea53ea822cd2acef36da5b279b9524`
    * Encrypted using AES
    * Key is stored in `module456.default.KEY` -> `react_native_expo_version_47.0.0` (see [456.js](./jsfiles/456.js))
    * IV is stored in `module456.default.IV` -> `__sekaictf2023__` (see [456.js](./jsfiles/456.js))

We now have everything we need to decrypt the password:

```py
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
```

Result:

```
s3cr3t_SEKAI_P@ss
```

Great!, however if we try to log into the app we get the following error message:

![](./pictures/04.png)

With another look at the script, I noticed that the flag is retrieved at some point, however it is never shown to the user. Instead we just get an error message:
```js
.signInWithEmailAndPassword(s, t.state.email, t.state.password)
.then(function (e) {
  t.setState({
    verifying: false,
  });
  var n = module486.ref(o, 'users/' + e.user.uid + '/flag');
  module486.onValue(n, function () {
    t.setState({
      verifying: false,
    });
    t.setState({
      errorTitle: 'Hello Admin',
      errorMessage: "Keep digging, you're almost there!",
    });
    t.AlertPro.open();
  });
})
```

But, we have all credentials necessary to connect to firebase ourselves, so we can create a short python script that will get the flag for us:
```py
import pyrebase

config = {
    "apiKey": "AIzaSyCR2Al5_9U5j6UOhqu0HCDS0jhpYfa2Wgk",
    "authDomain": "crackme-1b52a.firebaseapp.com",
    "projectId": "crackme-1b52a",
    "storageBucket": "crackme-1b52a.appspot.com",
    "messagingSenderId": "544041293350",
    "appId": "1:544041293350:web:2abc55a6bb408e4ff838e7",
    "measurementId": "G-RDD86JV32R",
    "databaseURL": "https://crackme-1b52a-default-rtdb.firebaseio.com"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

email = "admin@sekai.team"
password = "s3cr3t_SEKAI_P@ss"
user = auth.sign_in_with_email_and_password(email, password)

db = firebase.database()

uid = user['localId']

flag_ref = db.child("users").child(uid).child("flag")

flag = flag_ref.get(user['idToken']).val()

if flag:
    print(f"Flag: {flag}")
else:
    print("Flag not found.")
```

Result:

```
Flag: SEKAI{15_React_N@71v3_R3v3rs3_H@RD???}
```