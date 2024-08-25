var module275 = require('./275'),
    module25 = require('./25'),
    module26 = require('./26'),
    module40 = require('./40'),
    module37 = require('./37'),
    module39 = require('./39'),
    module41 = require('./41'),
    module133 = (function (e, t) {
        if (!t && e && e.__esModule) return e;
        if (null === e || ('object' != typeof e && 'function' != typeof e))
            return {
                default: e,
            };
        var n = L(t);
        if (n && n.has(e)) return n.get(e);
        var o = {},
            s = Object.defineProperty && Object.getOwnPropertyDescriptor;

        for (var l in e)
            if ('default' !== l && Object.prototype.hasOwnProperty.call(e, l)) {
                var c = s ? Object.getOwnPropertyDescriptor(e, l) : null;
                if (c && (c.get || c.set)) Object.defineProperty(o, l, c);
                else o[l] = e[l];
            }

        o.default = e;
        if (n) n.set(e, o);
        return o;
    })(require('./133')),
    ReactNative = require('react-native'),
    module444 = require('./444'),
    module446 = require('./446'),
    module447 = require('./447'),
    module453 = require('./453'),
    module455 = require('./455'),
    module454 = require('./454'),
    module456 = require('./456'),
    module457 = require('./457'),
    module458 = require('./458'),
    module461 = require('./461'),
    module476 = require('./476'),
    module477 = require('./477'),
    module478 = require('./478'),
    module486 = require('./486'),
    module488 = require('./488'),
    module491 = require('./491'),
    module700 = require('./700'),
    module188 = require('./188');

function L(e) {
    if ('function' != typeof WeakMap) return null;
    var t = new WeakMap(),
        n = new WeakMap();
    return (L = function (e) {
        return e ? n : t;
    })(e);
}

function V() {
    if ('undefined' == typeof Reflect || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if ('function' == typeof Proxy) return true;

    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { }));
        return true;
    } catch (e) {
        return false;
    }
}

var _ = (function (e, ...args) {
    module37.default(_, e);

    var module133 = _,
        module491 = V(),
        L = function () {
            var e,
                t = module41.default(module133);

            if (module491) {
                var n = module41.default(this).constructor;
                e = Reflect.construct(t, arguments, n);
            } else e = t.apply(this, arguments);

            return module39.default(this, e);
        };

    function _() {
        var e, o;
        module25.default(this, _);
        (e = L.call(this, ...args)).state = {
            email: '',
            password: '',
            wrongEmail: false,
            wrongPwd: false,
            checked: false,
            verifying: false,
            errorTitle: '',
            errorMessage: '',
        };
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

        e.handleEmailChanges = function (t) {
            e.setState({
                email: t,
            });
        };

        e.handlePasswordChanges = function (t) {
            e.setState({
                password: t,
            });
        };

        e.handleLoginPress = function () {
            if (0 === e.state.email.length) {
                e.setState({
                    errorTitle: 'Email Error',
                    errorMessage: 'Email Should not be empty',
                });
                e.AlertPro.open();
            } else if (0 === e.state.password.length) {
                e.setState({
                    errorTitle: 'Password Error',
                    errorMessage: 'Password Should not be empty',
                });
                e.AlertPro.open();
            } else if (module446.validate(e.state.email)) e._verifyEmail(module40.default(e));
            else
                e.setState({
                    email: '',
                    wrongEmail: true,
                });
        };

        e.handleCheckBox = function () {
            e.setState({
                checked: !e.state.checked,
            });
        };

        return e;
    }

    module26.default(_, [
        {
            key: 'componentDidMount',
            value: function () { },
        },
        {
            key: 'render',
            value: function () {
                var e = this;
                return module188.jsxs(ReactNative.View, {
                    style: I.background,
                    children: [
                        module188.jsx(module461.Video, {
                            source: module476.default,
                            rate: 1,
                            volume: 1,
                            isMuted: true,
                            resizeMode: 'cover',
                            useNativeControls: false,
                            isLooping: true,
                            shouldPlay: true,
                            style: {
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: ReactNative.Dimensions.get('screen').height,
                                width: ReactNative.Dimensions.get('screen').width,
                            },
                        }),
                        module188.jsx(ReactNative.KeyboardAvoidingView, {
                            behavior: 'padding',
                            style: I.container,
                            children: module188.jsxs(ReactNative.View, {
                                style: I.form,
                                children: [
                                    module188.jsxs(ReactNative.Text, {
                                        style: {
                                            fontSize: 20,
                                            marginTop: 20,
                                            marginBottom: 5,
                                        },
                                        children: ['\n', 'Log into your account', '\n'],
                                    }),
                                    module188.jsxs(ReactNative.View, {
                                        style: {
                                            width: '98%',
                                            paddingLeft: 16,
                                            paddingRight: 16,
                                            overflow: 'visible',
                                        },
                                        children: [
                                            module188.jsx(ReactNative.View, {
                                                style: {
                                                    flexDirection: 'row',
                                                },
                                                children: module188.jsx(module455.default, {
                                                    value: this.state.email,
                                                    onChangeText: this.handleEmailChanges,
                                                    placeholder: this.state.wrongEmail ? 'Invalid Email' : module456.default.EMAIL_PLACEHOLDER,
                                                    placeholderTextColor: this.state.wrongEmail ? module454.default.TORCH_RED : null,
                                                    keyboardType: 'email-address',
                                                    returnKeyType: 'next',
                                                    autoCorrect: false,
                                                    style: {
                                                        flex: 1,
                                                        paddingHorizontal: 10,
                                                    },
                                                }),
                                            }),
                                            module188.jsx(ReactNative.View, {
                                                style: {
                                                    flexDirection: 'row',
                                                },
                                                children: module188.jsx(module455.default, {
                                                    value: this.state.password,
                                                    onChangeText: this.handlePasswordChanges,
                                                    placeholder: this.state.wrongPwd ? 'Wrong Password' : module456.default.PASSWORD_PLACEHOLDER,
                                                    placeholderTextColor: this.state.wrongPwd ? module454.default.TORCH_RED : null,
                                                    secureTextEntry: true,
                                                    returnKeyType: 'done',
                                                    style: {
                                                        flex: 1,
                                                        paddingHorizontal: 10,
                                                    },
                                                }),
                                            }),
                                            module188.jsxs(ReactNative.View, {
                                                style: {
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                },
                                                children: [
                                                    module188.jsx(module458.default, {
                                                        onPress: this.handleCheckBox,
                                                        isChecked: this.state.checked,
                                                        text: 'Admin Account',
                                                    }),
                                                    module188.jsx(module457.default, {}),
                                                    module188.jsx(module457.default, {}),
                                                    module188.jsx(module457.default, {}),
                                                    module188.jsx(module457.default, {}),
                                                    module188.jsxs(ReactNative.Text, {
                                                        children: ['\n', '\n'],
                                                    }),
                                                ],
                                            }),
                                            module188.jsx(module453.default, {
                                                label: module456.default.LOGIN,
                                                onPress: this.handleLoginPress,
                                                extraStyles: {
                                                    width: '100%',
                                                    marginTop: 6,
                                                },
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        }),
                        module188.jsx(module444.default, {
                            visible: this.state.verifying,
                            textContent: 'Verifying...',
                            textStyle: {
                                color: '#FFF',
                            },
                        }),
                        module188.jsx(module447.default, {
                            ref: function (t) {
                                e.AlertPro = t;
                            },
                            onCancel: function () {
                                return e.AlertPro.close();
                            },
                            showConfirm: false,
                            title: this.state.errorTitle,
                            textCancel: 'Ok',
                            message: this.state.errorMessage,
                        }),
                    ],
                });
            },
        },
    ]);
    return _;
})(module133.Component);

_.navigationOptions = {
    header: null,
};
var I = ReactNative.StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        flex: 1,
        zIndex: 0,
    },
    logo: {
        width: '20%',
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 40,
    },
    mail: {
        width: '20%',
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 15,
        marginRight: 11,
    },
    lock: {
        width: '20%',
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 15,
        marginRight: 12,
        marginLeft: 2,
    },
    form: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '85%',
        backgroundColor: module454.default.WHITE,
        borderRadius: 26,
        opacity: 0.95,
        paddingHorizontal: '3%',
        paddingVertical: '5%',
    },
    icon: {
        padding: 10,
        marginTop: 15,
        marginRight: 10,
        marginLeft: 5,
        height: 15,
        width: 15,
        alignItems: 'center',
    },
}),
    z = module491.withNavigation(_);
exports.default = z;
