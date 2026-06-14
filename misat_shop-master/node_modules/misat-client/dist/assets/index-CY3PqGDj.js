function tx(e, t) {
    for (var r = 0; r < t.length; r++) {
        const s = t[r];
        if (typeof s != "string" && !Array.isArray(s)) {
            for (const a in s) if (a !== "default" && !(a in e)) {
                const l = Object.getOwnPropertyDescriptor(s, a);
                l && Object.defineProperty(e, a, l.get ? l : {enumerable: !0, get: () => s[a]})
            }
        }
    }
    return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}))
}

(function () {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const a of document.querySelectorAll('link[rel="modulepreload"]')) s(a);
    new MutationObserver(a => {
        for (const l of a) if (l.type === "childList") for (const i of l.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && s(i)
    }).observe(document, {childList: !0, subtree: !0});

    function r(a) {
        const l = {};
        return a.integrity && (l.integrity = a.integrity), a.referrerPolicy && (l.referrerPolicy = a.referrerPolicy), a.crossOrigin === "use-credentials" ? l.credentials = "include" : a.crossOrigin === "anonymous" ? l.credentials = "omit" : l.credentials = "same-origin", l
    }

    function s(a) {
        if (a.ep) return;
        a.ep = !0;
        const l = r(a);
        fetch(a.href, l)
    }
})();

function rx(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
}

var gf = {exports: {}}, il = {}, yf = {exports: {}}, K = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ps = Symbol.for("react.element"), nx = Symbol.for("react.portal"), sx = Symbol.for("react.fragment"),
    ax = Symbol.for("react.strict_mode"), lx = Symbol.for("react.profiler"), ix = Symbol.for("react.provider"),
    ox = Symbol.for("react.context"), cx = Symbol.for("react.forward_ref"), ux = Symbol.for("react.suspense"),
    dx = Symbol.for("react.memo"), fx = Symbol.for("react.lazy"), xu = Symbol.iterator;

function mx(e) {
    return e === null || typeof e != "object" ? null : (e = xu && e[xu] || e["@@iterator"], typeof e == "function" ? e : null)
}

var vf = {
    isMounted: function () {
        return !1
    }, enqueueForceUpdate: function () {
    }, enqueueReplaceState: function () {
    }, enqueueSetState: function () {
    }
}, bf = Object.assign, jf = {};

function On(e, t, r) {
    this.props = e, this.context = t, this.refs = jf, this.updater = r || vf
}

On.prototype.isReactComponent = {};
On.prototype.setState = function (e, t) {
    if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, e, t, "setState")
};
On.prototype.forceUpdate = function (e) {
    this.updater.enqueueForceUpdate(this, e, "forceUpdate")
};

function Nf() {
}

Nf.prototype = On.prototype;

function Ko(e, t, r) {
    this.props = e, this.context = t, this.refs = jf, this.updater = r || vf
}

var Go = Ko.prototype = new Nf;
Go.constructor = Ko;
bf(Go, On.prototype);
Go.isPureReactComponent = !0;
var gu = Array.isArray, wf = Object.prototype.hasOwnProperty, Xo = {current: null},
    kf = {key: !0, ref: !0, __self: !0, __source: !0};

function Sf(e, t, r) {
    var s, a = {}, l = null, i = null;
    if (t != null) for (s in t.ref !== void 0 && (i = t.ref), t.key !== void 0 && (l = "" + t.key), t) wf.call(t, s) && !kf.hasOwnProperty(s) && (a[s] = t[s]);
    var o = arguments.length - 2;
    if (o === 1) a.children = r; else if (1 < o) {
        for (var c = Array(o), u = 0; u < o; u++) c[u] = arguments[u + 2];
        a.children = c
    }
    if (e && e.defaultProps) for (s in o = e.defaultProps, o) a[s] === void 0 && (a[s] = o[s]);
    return {$$typeof: Ps, type: e, key: l, ref: i, props: a, _owner: Xo.current}
}

function px(e, t) {
    return {$$typeof: Ps, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner}
}

function Yo(e) {
    return typeof e == "object" && e !== null && e.$$typeof === Ps
}

function hx(e) {
    var t = {"=": "=0", ":": "=2"};
    return "$" + e.replace(/[=:]/g, function (r) {
        return t[r]
    })
}

var yu = /\/+/g;

function ei(e, t) {
    return typeof e == "object" && e !== null && e.key != null ? hx("" + e.key) : t.toString(36)
}

function ua(e, t, r, s, a) {
    var l = typeof e;
    (l === "undefined" || l === "boolean") && (e = null);
    var i = !1;
    if (e === null) i = !0; else switch (l) {
        case"string":
        case"number":
            i = !0;
            break;
        case"object":
            switch (e.$$typeof) {
                case Ps:
                case nx:
                    i = !0
            }
    }
    if (i) return i = e, a = a(i), e = s === "" ? "." + ei(i, 0) : s, gu(a) ? (r = "", e != null && (r = e.replace(yu, "$&/") + "/"), ua(a, t, r, "", function (u) {
        return u
    })) : a != null && (Yo(a) && (a = px(a, r + (!a.key || i && i.key === a.key ? "" : ("" + a.key).replace(yu, "$&/") + "/") + e)), t.push(a)), 1;
    if (i = 0, s = s === "" ? "." : s + ":", gu(e)) for (var o = 0; o < e.length; o++) {
        l = e[o];
        var c = s + ei(l, o);
        i += ua(l, t, r, c, a)
    } else if (c = mx(e), typeof c == "function") for (e = c.call(e), o = 0; !(l = e.next()).done;) l = l.value, c = s + ei(l, o++), i += ua(l, t, r, c, a); else if (l === "object") throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
    return i
}

function Hs(e, t, r) {
    if (e == null) return e;
    var s = [], a = 0;
    return ua(e, s, "", "", function (l) {
        return t.call(r, l, a++)
    }), s
}

function xx(e) {
    if (e._status === -1) {
        var t = e._result;
        t = t(), t.then(function (r) {
            (e._status === 0 || e._status === -1) && (e._status = 1, e._result = r)
        }, function (r) {
            (e._status === 0 || e._status === -1) && (e._status = 2, e._result = r)
        }), e._status === -1 && (e._status = 0, e._result = t)
    }
    if (e._status === 1) return e._result.default;
    throw e._result
}

var Fe = {current: null}, da = {transition: null},
    gx = {ReactCurrentDispatcher: Fe, ReactCurrentBatchConfig: da, ReactCurrentOwner: Xo};

function Cf() {
    throw Error("act(...) is not supported in production builds of React.")
}

K.Children = {
    map: Hs, forEach: function (e, t, r) {
        Hs(e, function () {
            t.apply(this, arguments)
        }, r)
    }, count: function (e) {
        var t = 0;
        return Hs(e, function () {
            t++
        }), t
    }, toArray: function (e) {
        return Hs(e, function (t) {
            return t
        }) || []
    }, only: function (e) {
        if (!Yo(e)) throw Error("React.Children.only expected to receive a single React element child.");
        return e
    }
};
K.Component = On;
K.Fragment = sx;
K.Profiler = lx;
K.PureComponent = Ko;
K.StrictMode = ax;
K.Suspense = ux;
K.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = gx;
K.act = Cf;
K.cloneElement = function (e, t, r) {
    if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
    var s = bf({}, e.props), a = e.key, l = e.ref, i = e._owner;
    if (t != null) {
        if (t.ref !== void 0 && (l = t.ref, i = Xo.current), t.key !== void 0 && (a = "" + t.key), e.type && e.type.defaultProps) var o = e.type.defaultProps;
        for (c in t) wf.call(t, c) && !kf.hasOwnProperty(c) && (s[c] = t[c] === void 0 && o !== void 0 ? o[c] : t[c])
    }
    var c = arguments.length - 2;
    if (c === 1) s.children = r; else if (1 < c) {
        o = Array(c);
        for (var u = 0; u < c; u++) o[u] = arguments[u + 2];
        s.children = o
    }
    return {$$typeof: Ps, type: e.type, key: a, ref: l, props: s, _owner: i}
};
K.createContext = function (e) {
    return e = {
        $$typeof: ox,
        _currentValue: e,
        _currentValue2: e,
        _threadCount: 0,
        Provider: null,
        Consumer: null,
        _defaultValue: null,
        _globalName: null
    }, e.Provider = {$$typeof: ix, _context: e}, e.Consumer = e
};
K.createElement = Sf;
K.createFactory = function (e) {
    var t = Sf.bind(null, e);
    return t.type = e, t
};
K.createRef = function () {
    return {current: null}
};
K.forwardRef = function (e) {
    return {$$typeof: cx, render: e}
};
K.isValidElement = Yo;
K.lazy = function (e) {
    return {$$typeof: fx, _payload: {_status: -1, _result: e}, _init: xx}
};
K.memo = function (e, t) {
    return {$$typeof: dx, type: e, compare: t === void 0 ? null : t}
};
K.startTransition = function (e) {
    var t = da.transition;
    da.transition = {};
    try {
        e()
    } finally {
        da.transition = t
    }
};
K.unstable_act = Cf;
K.useCallback = function (e, t) {
    return Fe.current.useCallback(e, t)
};
K.useContext = function (e) {
    return Fe.current.useContext(e)
};
K.useDebugValue = function () {
};
K.useDeferredValue = function (e) {
    return Fe.current.useDeferredValue(e)
};
K.useEffect = function (e, t) {
    return Fe.current.useEffect(e, t)
};
K.useId = function () {
    return Fe.current.useId()
};
K.useImperativeHandle = function (e, t, r) {
    return Fe.current.useImperativeHandle(e, t, r)
};
K.useInsertionEffect = function (e, t) {
    return Fe.current.useInsertionEffect(e, t)
};
K.useLayoutEffect = function (e, t) {
    return Fe.current.useLayoutEffect(e, t)
};
K.useMemo = function (e, t) {
    return Fe.current.useMemo(e, t)
};
K.useReducer = function (e, t, r) {
    return Fe.current.useReducer(e, t, r)
};
K.useRef = function (e) {
    return Fe.current.useRef(e)
};
K.useState = function (e) {
    return Fe.current.useState(e)
};
K.useSyncExternalStore = function (e, t, r) {
    return Fe.current.useSyncExternalStore(e, t, r)
};
K.useTransition = function () {
    return Fe.current.useTransition()
};
K.version = "18.3.1";
yf.exports = K;
var j = yf.exports;
const Ef = rx(j), yx = tx({__proto__: null, default: Ef}, [j]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var vx = j, bx = Symbol.for("react.element"), jx = Symbol.for("react.fragment"),
    Nx = Object.prototype.hasOwnProperty, wx = vx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    kx = {key: !0, ref: !0, __self: !0, __source: !0};

function Pf(e, t, r) {
    var s, a = {}, l = null, i = null;
    r !== void 0 && (l = "" + r), t.key !== void 0 && (l = "" + t.key), t.ref !== void 0 && (i = t.ref);
    for (s in t) Nx.call(t, s) && !kx.hasOwnProperty(s) && (a[s] = t[s]);
    if (e && e.defaultProps) for (s in t = e.defaultProps, t) a[s] === void 0 && (a[s] = t[s]);
    return {$$typeof: bx, type: e, key: l, ref: i, props: a, _owner: wx.current}
}

il.Fragment = jx;
il.jsx = Pf;
il.jsxs = Pf;
gf.exports = il;
var n = gf.exports, zi = {}, _f = {exports: {}}, rt = {}, Of = {exports: {}}, Rf = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function (e) {
    function t(A, U) {
        var S = A.length;
        A.push(U);
        e:for (; 0 < S;) {
            var M = S - 1 >>> 1, B = A[M];
            if (0 < a(B, U)) A[M] = U, A[S] = B, S = M; else break e
        }
    }

    function r(A) {
        return A.length === 0 ? null : A[0]
    }

    function s(A) {
        if (A.length === 0) return null;
        var U = A[0], S = A.pop();
        if (S !== U) {
            A[0] = S;
            e:for (var M = 0, B = A.length, oe = B >>> 1; M < oe;) {
                var fe = 2 * (M + 1) - 1, O = A[fe], V = fe + 1, T = A[V];
                if (0 > a(O, S)) V < B && 0 > a(T, O) ? (A[M] = T, A[V] = S, M = V) : (A[M] = O, A[fe] = S, M = fe); else if (V < B && 0 > a(T, S)) A[M] = T, A[V] = S, M = V; else break e
            }
        }
        return U
    }

    function a(A, U) {
        var S = A.sortIndex - U.sortIndex;
        return S !== 0 ? S : A.id - U.id
    }

    if (typeof performance == "object" && typeof performance.now == "function") {
        var l = performance;
        e.unstable_now = function () {
            return l.now()
        }
    } else {
        var i = Date, o = i.now();
        e.unstable_now = function () {
            return i.now() - o
        }
    }
    var c = [], u = [], f = 1, m = null, y = 3, b = !1, p = !1, d = !1,
        x = typeof setTimeout == "function" ? setTimeout : null,
        h = typeof clearTimeout == "function" ? clearTimeout : null,
        g = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);

    function v(A) {
        for (var U = r(u); U !== null;) {
            if (U.callback === null) s(u); else if (U.startTime <= A) s(u), U.sortIndex = U.expirationTime, t(c, U); else break;
            U = r(u)
        }
    }

    function w(A) {
        if (d = !1, v(A), !p) if (r(c) !== null) p = !0, H(N); else {
            var U = r(u);
            U !== null && te(w, U.startTime - A)
        }
    }

    function N(A, U) {
        p = !1, d && (d = !1, h(R), R = -1), b = !0;
        var S = y;
        try {
            for (v(U), m = r(c); m !== null && (!(m.expirationTime > U) || A && !L());) {
                var M = m.callback;
                if (typeof M == "function") {
                    m.callback = null, y = m.priorityLevel;
                    var B = M(m.expirationTime <= U);
                    U = e.unstable_now(), typeof B == "function" ? m.callback = B : m === r(c) && s(c), v(U)
                } else s(c);
                m = r(c)
            }
            if (m !== null) var oe = !0; else {
                var fe = r(u);
                fe !== null && te(w, fe.startTime - U), oe = !1
            }
            return oe
        } finally {
            m = null, y = S, b = !1
        }
    }

    var k = !1, E = null, R = -1, z = 5, $ = -1;

    function L() {
        return !(e.unstable_now() - $ < z)
    }

    function G() {
        if (E !== null) {
            var A = e.unstable_now();
            $ = A;
            var U = !0;
            try {
                U = E(!0, A)
            } finally {
                U ? X() : (k = !1, E = null)
            }
        } else k = !1
    }

    var X;
    if (typeof g == "function") X = function () {
        g(G)
    }; else if (typeof MessageChannel < "u") {
        var P = new MessageChannel, W = P.port2;
        P.port1.onmessage = G, X = function () {
            W.postMessage(null)
        }
    } else X = function () {
        x(G, 0)
    };

    function H(A) {
        E = A, k || (k = !0, X())
    }

    function te(A, U) {
        R = x(function () {
            A(e.unstable_now())
        }, U)
    }

    e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function (A) {
        A.callback = null
    }, e.unstable_continueExecution = function () {
        p || b || (p = !0, H(N))
    }, e.unstable_forceFrameRate = function (A) {
        0 > A || 125 < A ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : z = 0 < A ? Math.floor(1e3 / A) : 5
    }, e.unstable_getCurrentPriorityLevel = function () {
        return y
    }, e.unstable_getFirstCallbackNode = function () {
        return r(c)
    }, e.unstable_next = function (A) {
        switch (y) {
            case 1:
            case 2:
            case 3:
                var U = 3;
                break;
            default:
                U = y
        }
        var S = y;
        y = U;
        try {
            return A()
        } finally {
            y = S
        }
    }, e.unstable_pauseExecution = function () {
    }, e.unstable_requestPaint = function () {
    }, e.unstable_runWithPriority = function (A, U) {
        switch (A) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            default:
                A = 3
        }
        var S = y;
        y = A;
        try {
            return U()
        } finally {
            y = S
        }
    }, e.unstable_scheduleCallback = function (A, U, S) {
        var M = e.unstable_now();
        switch (typeof S == "object" && S !== null ? (S = S.delay, S = typeof S == "number" && 0 < S ? M + S : M) : S = M, A) {
            case 1:
                var B = -1;
                break;
            case 2:
                B = 250;
                break;
            case 5:
                B = 1073741823;
                break;
            case 4:
                B = 1e4;
                break;
            default:
                B = 5e3
        }
        return B = S + B, A = {
            id: f++,
            callback: U,
            priorityLevel: A,
            startTime: S,
            expirationTime: B,
            sortIndex: -1
        }, S > M ? (A.sortIndex = S, t(u, A), r(c) === null && A === r(u) && (d ? (h(R), R = -1) : d = !0, te(w, S - M))) : (A.sortIndex = B, t(c, A), p || b || (p = !0, H(N))), A
    }, e.unstable_shouldYield = L, e.unstable_wrapCallback = function (A) {
        var U = y;
        return function () {
            var S = y;
            y = U;
            try {
                return A.apply(this, arguments)
            } finally {
                y = S
            }
        }
    }
})(Rf);
Of.exports = Rf;
var Sx = Of.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cx = j, et = Sx;

function I(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1; r < arguments.length; r++) t += "&args[]=" + encodeURIComponent(arguments[r]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
}

var Tf = new Set, ls = {};

function Wr(e, t) {
    yn(e, t), yn(e + "Capture", t)
}

function yn(e, t) {
    for (ls[e] = t, e = 0; e < t.length; e++) Tf.add(t[e])
}

var Ut = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
    Ui = Object.prototype.hasOwnProperty,
    Ex = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    vu = {}, bu = {};

function Px(e) {
    return Ui.call(bu, e) ? !0 : Ui.call(vu, e) ? !1 : Ex.test(e) ? bu[e] = !0 : (vu[e] = !0, !1)
}

function _x(e, t, r, s) {
    if (r !== null && r.type === 0) return !1;
    switch (typeof t) {
        case"function":
        case"symbol":
            return !0;
        case"boolean":
            return s ? !1 : r !== null ? !r.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
        default:
            return !1
    }
}

function Ox(e, t, r, s) {
    if (t === null || typeof t > "u" || _x(e, t, r, s)) return !0;
    if (s) return !1;
    if (r !== null) switch (r.type) {
        case 3:
            return !t;
        case 4:
            return t === !1;
        case 5:
            return isNaN(t);
        case 6:
            return isNaN(t) || 1 > t
    }
    return !1
}

function Be(e, t, r, s, a, l, i) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = s, this.attributeNamespace = a, this.mustUseProperty = r, this.propertyName = e, this.type = t, this.sanitizeURL = l, this.removeEmptyString = i
}

var Te = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function (e) {
    Te[e] = new Be(e, 0, !1, e, null, !1, !1)
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function (e) {
    var t = e[0];
    Te[t] = new Be(t, 1, !1, e[1], null, !1, !1)
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
    Te[e] = new Be(e, 2, !1, e.toLowerCase(), null, !1, !1)
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (e) {
    Te[e] = new Be(e, 2, !1, e, null, !1, !1)
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function (e) {
    Te[e] = new Be(e, 3, !1, e.toLowerCase(), null, !1, !1)
});
["checked", "multiple", "muted", "selected"].forEach(function (e) {
    Te[e] = new Be(e, 3, !0, e, null, !1, !1)
});
["capture", "download"].forEach(function (e) {
    Te[e] = new Be(e, 4, !1, e, null, !1, !1)
});
["cols", "rows", "size", "span"].forEach(function (e) {
    Te[e] = new Be(e, 6, !1, e, null, !1, !1)
});
["rowSpan", "start"].forEach(function (e) {
    Te[e] = new Be(e, 5, !1, e.toLowerCase(), null, !1, !1)
});
var Zo = /[\-:]([a-z])/g;

function ec(e) {
    return e[1].toUpperCase()
}

"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function (e) {
    var t = e.replace(Zo, ec);
    Te[t] = new Be(t, 1, !1, e, null, !1, !1)
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (e) {
    var t = e.replace(Zo, ec);
    Te[t] = new Be(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1)
});
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
    var t = e.replace(Zo, ec);
    Te[t] = new Be(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1)
});
["tabIndex", "crossOrigin"].forEach(function (e) {
    Te[e] = new Be(e, 1, !1, e.toLowerCase(), null, !1, !1)
});
Te.xlinkHref = new Be("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function (e) {
    Te[e] = new Be(e, 1, !1, e.toLowerCase(), null, !0, !0)
});

function tc(e, t, r, s) {
    var a = Te.hasOwnProperty(t) ? Te[t] : null;
    (a !== null ? a.type !== 0 : s || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Ox(t, r, a, s) && (r = null), s || a === null ? Px(t) && (r === null ? e.removeAttribute(t) : e.setAttribute(t, "" + r)) : a.mustUseProperty ? e[a.propertyName] = r === null ? a.type === 3 ? !1 : "" : r : (t = a.attributeName, s = a.attributeNamespace, r === null ? e.removeAttribute(t) : (a = a.type, r = a === 3 || a === 4 && r === !0 ? "" : "" + r, s ? e.setAttributeNS(s, t, r) : e.setAttribute(t, r))))
}

var Jt = Cx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Js = Symbol.for("react.element"),
    Xr = Symbol.for("react.portal"), Yr = Symbol.for("react.fragment"), rc = Symbol.for("react.strict_mode"),
    Fi = Symbol.for("react.profiler"), If = Symbol.for("react.provider"), Af = Symbol.for("react.context"),
    nc = Symbol.for("react.forward_ref"), Bi = Symbol.for("react.suspense"), Vi = Symbol.for("react.suspense_list"),
    sc = Symbol.for("react.memo"), Yt = Symbol.for("react.lazy"), Lf = Symbol.for("react.offscreen"),
    ju = Symbol.iterator;

function $n(e) {
    return e === null || typeof e != "object" ? null : (e = ju && e[ju] || e["@@iterator"], typeof e == "function" ? e : null)
}

var he = Object.assign, ti;

function Jn(e) {
    if (ti === void 0) try {
        throw Error()
    } catch (r) {
        var t = r.stack.trim().match(/\n( *(at )?)/);
        ti = t && t[1] || ""
    }
    return `
` + ti + e
}

var ri = !1;

function ni(e, t) {
    if (!e || ri) return "";
    ri = !0;
    var r = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
        if (t) if (t = function () {
            throw Error()
        }, Object.defineProperty(t.prototype, "props", {
            set: function () {
                throw Error()
            }
        }), typeof Reflect == "object" && Reflect.construct) {
            try {
                Reflect.construct(t, [])
            } catch (u) {
                var s = u
            }
            Reflect.construct(e, [], t)
        } else {
            try {
                t.call()
            } catch (u) {
                s = u
            }
            e.call(t.prototype)
        } else {
            try {
                throw Error()
            } catch (u) {
                s = u
            }
            e()
        }
    } catch (u) {
        if (u && s && typeof u.stack == "string") {
            for (var a = u.stack.split(`
`), l = s.stack.split(`
`), i = a.length - 1, o = l.length - 1; 1 <= i && 0 <= o && a[i] !== l[o];) o--;
            for (; 1 <= i && 0 <= o; i--, o--) if (a[i] !== l[o]) {
                if (i !== 1 || o !== 1) do if (i--, o--, 0 > o || a[i] !== l[o]) {
                    var c = `
` + a[i].replace(" at new ", " at ");
                    return e.displayName && c.includes("<anonymous>") && (c = c.replace("<anonymous>", e.displayName)), c
                } while (1 <= i && 0 <= o);
                break
            }
        }
    } finally {
        ri = !1, Error.prepareStackTrace = r
    }
    return (e = e ? e.displayName || e.name : "") ? Jn(e) : ""
}

function Rx(e) {
    switch (e.tag) {
        case 5:
            return Jn(e.type);
        case 16:
            return Jn("Lazy");
        case 13:
            return Jn("Suspense");
        case 19:
            return Jn("SuspenseList");
        case 0:
        case 2:
        case 15:
            return e = ni(e.type, !1), e;
        case 11:
            return e = ni(e.type.render, !1), e;
        case 1:
            return e = ni(e.type, !0), e;
        default:
            return ""
    }
}

function Wi(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
        case Yr:
            return "Fragment";
        case Xr:
            return "Portal";
        case Fi:
            return "Profiler";
        case rc:
            return "StrictMode";
        case Bi:
            return "Suspense";
        case Vi:
            return "SuspenseList"
    }
    if (typeof e == "object") switch (e.$$typeof) {
        case Af:
            return (e.displayName || "Context") + ".Consumer";
        case If:
            return (e._context.displayName || "Context") + ".Provider";
        case nc:
            var t = e.render;
            return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case sc:
            return t = e.displayName || null, t !== null ? t : Wi(e.type) || "Memo";
        case Yt:
            t = e._payload, e = e._init;
            try {
                return Wi(e(t))
            } catch {
            }
    }
    return null
}

function Tx(e) {
    var t = e.type;
    switch (e.tag) {
        case 24:
            return "Cache";
        case 9:
            return (t.displayName || "Context") + ".Consumer";
        case 10:
            return (t._context.displayName || "Context") + ".Provider";
        case 18:
            return "DehydratedFragment";
        case 11:
            return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
        case 7:
            return "Fragment";
        case 5:
            return t;
        case 4:
            return "Portal";
        case 3:
            return "Root";
        case 6:
            return "Text";
        case 16:
            return Wi(t);
        case 8:
            return t === rc ? "StrictMode" : "Mode";
        case 22:
            return "Offscreen";
        case 12:
            return "Profiler";
        case 21:
            return "Scope";
        case 13:
            return "Suspense";
        case 19:
            return "SuspenseList";
        case 25:
            return "TracingMarker";
        case 1:
        case 0:
        case 17:
        case 2:
        case 14:
        case 15:
            if (typeof t == "function") return t.displayName || t.name || null;
            if (typeof t == "string") return t
    }
    return null
}

function yr(e) {
    switch (typeof e) {
        case"boolean":
        case"number":
        case"string":
        case"undefined":
            return e;
        case"object":
            return e;
        default:
            return ""
    }
}

function $f(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio")
}

function Ix(e) {
    var t = $f(e) ? "checked" : "value", r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), s = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof r < "u" && typeof r.get == "function" && typeof r.set == "function") {
        var a = r.get, l = r.set;
        return Object.defineProperty(e, t, {
            configurable: !0, get: function () {
                return a.call(this)
            }, set: function (i) {
                s = "" + i, l.call(this, i)
            }
        }), Object.defineProperty(e, t, {enumerable: r.enumerable}), {
            getValue: function () {
                return s
            }, setValue: function (i) {
                s = "" + i
            }, stopTracking: function () {
                e._valueTracker = null, delete e[t]
            }
        }
    }
}

function qs(e) {
    e._valueTracker || (e._valueTracker = Ix(e))
}

function Df(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var r = t.getValue(), s = "";
    return e && (s = $f(e) ? e.checked ? "true" : "false" : e.value), e = s, e !== r ? (t.setValue(e), !0) : !1
}

function Pa(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
        return e.activeElement || e.body
    } catch {
        return e.body
    }
}

function Hi(e, t) {
    var r = t.checked;
    return he({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: r ?? e._wrapperState.initialChecked
    })
}

function Nu(e, t) {
    var r = t.defaultValue == null ? "" : t.defaultValue, s = t.checked != null ? t.checked : t.defaultChecked;
    r = yr(t.value != null ? t.value : r), e._wrapperState = {
        initialChecked: s,
        initialValue: r,
        controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null
    }
}

function Mf(e, t) {
    t = t.checked, t != null && tc(e, "checked", t, !1)
}

function Ji(e, t) {
    Mf(e, t);
    var r = yr(t.value), s = t.type;
    if (r != null) s === "number" ? (r === 0 && e.value === "" || e.value != r) && (e.value = "" + r) : e.value !== "" + r && (e.value = "" + r); else if (s === "submit" || s === "reset") {
        e.removeAttribute("value");
        return
    }
    t.hasOwnProperty("value") ? qi(e, t.type, r) : t.hasOwnProperty("defaultValue") && qi(e, t.type, yr(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked)
}

function wu(e, t, r) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var s = t.type;
        if (!(s !== "submit" && s !== "reset" || t.value !== void 0 && t.value !== null)) return;
        t = "" + e._wrapperState.initialValue, r || t === e.value || (e.value = t), e.defaultValue = t
    }
    r = e.name, r !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, r !== "" && (e.name = r)
}

function qi(e, t, r) {
    (t !== "number" || Pa(e.ownerDocument) !== e) && (r == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + r && (e.defaultValue = "" + r))
}

var qn = Array.isArray;

function un(e, t, r, s) {
    if (e = e.options, t) {
        t = {};
        for (var a = 0; a < r.length; a++) t["$" + r[a]] = !0;
        for (r = 0; r < e.length; r++) a = t.hasOwnProperty("$" + e[r].value), e[r].selected !== a && (e[r].selected = a), a && s && (e[r].defaultSelected = !0)
    } else {
        for (r = "" + yr(r), t = null, a = 0; a < e.length; a++) {
            if (e[a].value === r) {
                e[a].selected = !0, s && (e[a].defaultSelected = !0);
                return
            }
            t !== null || e[a].disabled || (t = e[a])
        }
        t !== null && (t.selected = !0)
    }
}

function Qi(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(I(91));
    return he({}, t, {value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue})
}

function ku(e, t) {
    var r = t.value;
    if (r == null) {
        if (r = t.children, t = t.defaultValue, r != null) {
            if (t != null) throw Error(I(92));
            if (qn(r)) {
                if (1 < r.length) throw Error(I(93));
                r = r[0]
            }
            t = r
        }
        t == null && (t = ""), r = t
    }
    e._wrapperState = {initialValue: yr(r)}
}

function zf(e, t) {
    var r = yr(t.value), s = yr(t.defaultValue);
    r != null && (r = "" + r, r !== e.value && (e.value = r), t.defaultValue == null && e.defaultValue !== r && (e.defaultValue = r)), s != null && (e.defaultValue = "" + s)
}

function Su(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t)
}

function Uf(e) {
    switch (e) {
        case"svg":
            return "http://www.w3.org/2000/svg";
        case"math":
            return "http://www.w3.org/1998/Math/MathML";
        default:
            return "http://www.w3.org/1999/xhtml"
    }
}

function Ki(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Uf(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e
}

var Qs, Ff = function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function (t, r, s, a) {
        MSApp.execUnsafeLocalFunction(function () {
            return e(t, r, s, a)
        })
    } : e
}(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t; else {
        for (Qs = Qs || document.createElement("div"), Qs.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Qs.firstChild; e.firstChild;) e.removeChild(e.firstChild);
        for (; t.firstChild;) e.appendChild(t.firstChild)
    }
});

function is(e, t) {
    if (t) {
        var r = e.firstChild;
        if (r && r === e.lastChild && r.nodeType === 3) {
            r.nodeValue = t;
            return
        }
    }
    e.textContent = t
}

var Xn = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
}, Ax = ["Webkit", "ms", "Moz", "O"];
Object.keys(Xn).forEach(function (e) {
    Ax.forEach(function (t) {
        t = t + e.charAt(0).toUpperCase() + e.substring(1), Xn[t] = Xn[e]
    })
});

function Bf(e, t, r) {
    return t == null || typeof t == "boolean" || t === "" ? "" : r || typeof t != "number" || t === 0 || Xn.hasOwnProperty(e) && Xn[e] ? ("" + t).trim() : t + "px"
}

function Vf(e, t) {
    e = e.style;
    for (var r in t) if (t.hasOwnProperty(r)) {
        var s = r.indexOf("--") === 0, a = Bf(r, t[r], s);
        r === "float" && (r = "cssFloat"), s ? e.setProperty(r, a) : e[r] = a
    }
}

var Lx = he({menuitem: !0}, {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
});

function Gi(e, t) {
    if (t) {
        if (Lx[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(I(137, e));
        if (t.dangerouslySetInnerHTML != null) {
            if (t.children != null) throw Error(I(60));
            if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(I(61))
        }
        if (t.style != null && typeof t.style != "object") throw Error(I(62))
    }
}

function Xi(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
        case"annotation-xml":
        case"color-profile":
        case"font-face":
        case"font-face-src":
        case"font-face-uri":
        case"font-face-format":
        case"font-face-name":
        case"missing-glyph":
            return !1;
        default:
            return !0
    }
}

var Yi = null;

function ac(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e
}

var Zi = null, dn = null, fn = null;

function Cu(e) {
    if (e = Rs(e)) {
        if (typeof Zi != "function") throw Error(I(280));
        var t = e.stateNode;
        t && (t = fl(t), Zi(e.stateNode, e.type, t))
    }
}

function Wf(e) {
    dn ? fn ? fn.push(e) : fn = [e] : dn = e
}

function Hf() {
    if (dn) {
        var e = dn, t = fn;
        if (fn = dn = null, Cu(e), t) for (e = 0; e < t.length; e++) Cu(t[e])
    }
}

function Jf(e, t) {
    return e(t)
}

function qf() {
}

var si = !1;

function Qf(e, t, r) {
    if (si) return e(t, r);
    si = !0;
    try {
        return Jf(e, t, r)
    } finally {
        si = !1, (dn !== null || fn !== null) && (qf(), Hf())
    }
}

function os(e, t) {
    var r = e.stateNode;
    if (r === null) return null;
    var s = fl(r);
    if (s === null) return null;
    r = s[t];
    e:switch (t) {
        case"onClick":
        case"onClickCapture":
        case"onDoubleClick":
        case"onDoubleClickCapture":
        case"onMouseDown":
        case"onMouseDownCapture":
        case"onMouseMove":
        case"onMouseMoveCapture":
        case"onMouseUp":
        case"onMouseUpCapture":
        case"onMouseEnter":
            (s = !s.disabled) || (e = e.type, s = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !s;
            break e;
        default:
            e = !1
    }
    if (e) return null;
    if (r && typeof r != "function") throw Error(I(231, t, typeof r));
    return r
}

var eo = !1;
if (Ut) try {
    var Dn = {};
    Object.defineProperty(Dn, "passive", {
        get: function () {
            eo = !0
        }
    }), window.addEventListener("test", Dn, Dn), window.removeEventListener("test", Dn, Dn)
} catch {
    eo = !1
}

function $x(e, t, r, s, a, l, i, o, c) {
    var u = Array.prototype.slice.call(arguments, 3);
    try {
        t.apply(r, u)
    } catch (f) {
        this.onError(f)
    }
}

var Yn = !1, _a = null, Oa = !1, to = null, Dx = {
    onError: function (e) {
        Yn = !0, _a = e
    }
};

function Mx(e, t, r, s, a, l, i, o, c) {
    Yn = !1, _a = null, $x.apply(Dx, arguments)
}

function zx(e, t, r, s, a, l, i, o, c) {
    if (Mx.apply(this, arguments), Yn) {
        if (Yn) {
            var u = _a;
            Yn = !1, _a = null
        } else throw Error(I(198));
        Oa || (Oa = !0, to = u)
    }
}

function Hr(e) {
    var t = e, r = e;
    if (e.alternate) for (; t.return;) t = t.return; else {
        e = t;
        do t = e, t.flags & 4098 && (r = t.return), e = t.return; while (e)
    }
    return t.tag === 3 ? r : null
}

function Kf(e) {
    if (e.tag === 13) {
        var t = e.memoizedState;
        if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated
    }
    return null
}

function Eu(e) {
    if (Hr(e) !== e) throw Error(I(188))
}

function Ux(e) {
    var t = e.alternate;
    if (!t) {
        if (t = Hr(e), t === null) throw Error(I(188));
        return t !== e ? null : e
    }
    for (var r = e, s = t; ;) {
        var a = r.return;
        if (a === null) break;
        var l = a.alternate;
        if (l === null) {
            if (s = a.return, s !== null) {
                r = s;
                continue
            }
            break
        }
        if (a.child === l.child) {
            for (l = a.child; l;) {
                if (l === r) return Eu(a), e;
                if (l === s) return Eu(a), t;
                l = l.sibling
            }
            throw Error(I(188))
        }
        if (r.return !== s.return) r = a, s = l; else {
            for (var i = !1, o = a.child; o;) {
                if (o === r) {
                    i = !0, r = a, s = l;
                    break
                }
                if (o === s) {
                    i = !0, s = a, r = l;
                    break
                }
                o = o.sibling
            }
            if (!i) {
                for (o = l.child; o;) {
                    if (o === r) {
                        i = !0, r = l, s = a;
                        break
                    }
                    if (o === s) {
                        i = !0, s = l, r = a;
                        break
                    }
                    o = o.sibling
                }
                if (!i) throw Error(I(189))
            }
        }
        if (r.alternate !== s) throw Error(I(190))
    }
    if (r.tag !== 3) throw Error(I(188));
    return r.stateNode.current === r ? e : t
}

function Gf(e) {
    return e = Ux(e), e !== null ? Xf(e) : null
}

function Xf(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null;) {
        var t = Xf(e);
        if (t !== null) return t;
        e = e.sibling
    }
    return null
}

var Yf = et.unstable_scheduleCallback, Pu = et.unstable_cancelCallback, Fx = et.unstable_shouldYield,
    Bx = et.unstable_requestPaint, ve = et.unstable_now, Vx = et.unstable_getCurrentPriorityLevel,
    lc = et.unstable_ImmediatePriority, Zf = et.unstable_UserBlockingPriority, Ra = et.unstable_NormalPriority,
    Wx = et.unstable_LowPriority, em = et.unstable_IdlePriority, ol = null, Ot = null;

function Hx(e) {
    if (Ot && typeof Ot.onCommitFiberRoot == "function") try {
        Ot.onCommitFiberRoot(ol, e, void 0, (e.current.flags & 128) === 128)
    } catch {
    }
}

var bt = Math.clz32 ? Math.clz32 : Qx, Jx = Math.log, qx = Math.LN2;

function Qx(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Jx(e) / qx | 0) | 0
}

var Ks = 64, Gs = 4194304;

function Qn(e) {
    switch (e & -e) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 4;
        case 8:
            return 8;
        case 16:
            return 16;
        case 32:
            return 32;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return e & 4194240;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
            return e & 130023424;
        case 134217728:
            return 134217728;
        case 268435456:
            return 268435456;
        case 536870912:
            return 536870912;
        case 1073741824:
            return 1073741824;
        default:
            return e
    }
}

function Ta(e, t) {
    var r = e.pendingLanes;
    if (r === 0) return 0;
    var s = 0, a = e.suspendedLanes, l = e.pingedLanes, i = r & 268435455;
    if (i !== 0) {
        var o = i & ~a;
        o !== 0 ? s = Qn(o) : (l &= i, l !== 0 && (s = Qn(l)))
    } else i = r & ~a, i !== 0 ? s = Qn(i) : l !== 0 && (s = Qn(l));
    if (s === 0) return 0;
    if (t !== 0 && t !== s && !(t & a) && (a = s & -s, l = t & -t, a >= l || a === 16 && (l & 4194240) !== 0)) return t;
    if (s & 4 && (s |= r & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= s; 0 < t;) r = 31 - bt(t), a = 1 << r, s |= e[r], t &= ~a;
    return s
}

function Kx(e, t) {
    switch (e) {
        case 1:
        case 2:
        case 4:
            return t + 250;
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
            return -1;
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
            return -1;
        default:
            return -1
    }
}

function Gx(e, t) {
    for (var r = e.suspendedLanes, s = e.pingedLanes, a = e.expirationTimes, l = e.pendingLanes; 0 < l;) {
        var i = 31 - bt(l), o = 1 << i, c = a[i];
        c === -1 ? (!(o & r) || o & s) && (a[i] = Kx(o, t)) : c <= t && (e.expiredLanes |= o), l &= ~o
    }
}

function ro(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
}

function tm() {
    var e = Ks;
    return Ks <<= 1, !(Ks & 4194240) && (Ks = 64), e
}

function ai(e) {
    for (var t = [], r = 0; 31 > r; r++) t.push(e);
    return t
}

function _s(e, t, r) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - bt(t), e[t] = r
}

function Xx(e, t) {
    var r = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var s = e.eventTimes;
    for (e = e.expirationTimes; 0 < r;) {
        var a = 31 - bt(r), l = 1 << a;
        t[a] = 0, s[a] = -1, e[a] = -1, r &= ~l
    }
}

function ic(e, t) {
    var r = e.entangledLanes |= t;
    for (e = e.entanglements; r;) {
        var s = 31 - bt(r), a = 1 << s;
        a & t | e[s] & t && (e[s] |= t), r &= ~a
    }
}

var re = 0;

function rm(e) {
    return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1
}

var nm, oc, sm, am, lm, no = !1, Xs = [], ir = null, or = null, cr = null, cs = new Map, us = new Map, er = [],
    Yx = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");

function _u(e, t) {
    switch (e) {
        case"focusin":
        case"focusout":
            ir = null;
            break;
        case"dragenter":
        case"dragleave":
            or = null;
            break;
        case"mouseover":
        case"mouseout":
            cr = null;
            break;
        case"pointerover":
        case"pointerout":
            cs.delete(t.pointerId);
            break;
        case"gotpointercapture":
        case"lostpointercapture":
            us.delete(t.pointerId)
    }
}

function Mn(e, t, r, s, a, l) {
    return e === null || e.nativeEvent !== l ? (e = {
        blockedOn: t,
        domEventName: r,
        eventSystemFlags: s,
        nativeEvent: l,
        targetContainers: [a]
    }, t !== null && (t = Rs(t), t !== null && oc(t)), e) : (e.eventSystemFlags |= s, t = e.targetContainers, a !== null && t.indexOf(a) === -1 && t.push(a), e)
}

function Zx(e, t, r, s, a) {
    switch (t) {
        case"focusin":
            return ir = Mn(ir, e, t, r, s, a), !0;
        case"dragenter":
            return or = Mn(or, e, t, r, s, a), !0;
        case"mouseover":
            return cr = Mn(cr, e, t, r, s, a), !0;
        case"pointerover":
            var l = a.pointerId;
            return cs.set(l, Mn(cs.get(l) || null, e, t, r, s, a)), !0;
        case"gotpointercapture":
            return l = a.pointerId, us.set(l, Mn(us.get(l) || null, e, t, r, s, a)), !0
    }
    return !1
}

function im(e) {
    var t = _r(e.target);
    if (t !== null) {
        var r = Hr(t);
        if (r !== null) {
            if (t = r.tag, t === 13) {
                if (t = Kf(r), t !== null) {
                    e.blockedOn = t, lm(e.priority, function () {
                        sm(r)
                    });
                    return
                }
            } else if (t === 3 && r.stateNode.current.memoizedState.isDehydrated) {
                e.blockedOn = r.tag === 3 ? r.stateNode.containerInfo : null;
                return
            }
        }
    }
    e.blockedOn = null
}

function fa(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length;) {
        var r = so(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
        if (r === null) {
            r = e.nativeEvent;
            var s = new r.constructor(r.type, r);
            Yi = s, r.target.dispatchEvent(s), Yi = null
        } else return t = Rs(r), t !== null && oc(t), e.blockedOn = r, !1;
        t.shift()
    }
    return !0
}

function Ou(e, t, r) {
    fa(e) && r.delete(t)
}

function eg() {
    no = !1, ir !== null && fa(ir) && (ir = null), or !== null && fa(or) && (or = null), cr !== null && fa(cr) && (cr = null), cs.forEach(Ou), us.forEach(Ou)
}

function zn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, no || (no = !0, et.unstable_scheduleCallback(et.unstable_NormalPriority, eg)))
}

function ds(e) {
    function t(a) {
        return zn(a, e)
    }

    if (0 < Xs.length) {
        zn(Xs[0], e);
        for (var r = 1; r < Xs.length; r++) {
            var s = Xs[r];
            s.blockedOn === e && (s.blockedOn = null)
        }
    }
    for (ir !== null && zn(ir, e), or !== null && zn(or, e), cr !== null && zn(cr, e), cs.forEach(t), us.forEach(t), r = 0; r < er.length; r++) s = er[r], s.blockedOn === e && (s.blockedOn = null);
    for (; 0 < er.length && (r = er[0], r.blockedOn === null);) im(r), r.blockedOn === null && er.shift()
}

var mn = Jt.ReactCurrentBatchConfig, Ia = !0;

function tg(e, t, r, s) {
    var a = re, l = mn.transition;
    mn.transition = null;
    try {
        re = 1, cc(e, t, r, s)
    } finally {
        re = a, mn.transition = l
    }
}

function rg(e, t, r, s) {
    var a = re, l = mn.transition;
    mn.transition = null;
    try {
        re = 4, cc(e, t, r, s)
    } finally {
        re = a, mn.transition = l
    }
}

function cc(e, t, r, s) {
    if (Ia) {
        var a = so(e, t, r, s);
        if (a === null) hi(e, t, s, Aa, r), _u(e, s); else if (Zx(a, e, t, r, s)) s.stopPropagation(); else if (_u(e, s), t & 4 && -1 < Yx.indexOf(e)) {
            for (; a !== null;) {
                var l = Rs(a);
                if (l !== null && nm(l), l = so(e, t, r, s), l === null && hi(e, t, s, Aa, r), l === a) break;
                a = l
            }
            a !== null && s.stopPropagation()
        } else hi(e, t, s, null, r)
    }
}

var Aa = null;

function so(e, t, r, s) {
    if (Aa = null, e = ac(s), e = _r(e), e !== null) if (t = Hr(e), t === null) e = null; else if (r = t.tag, r === 13) {
        if (e = Kf(t), e !== null) return e;
        e = null
    } else if (r === 3) {
        if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
        e = null
    } else t !== e && (e = null);
    return Aa = e, null
}

function om(e) {
    switch (e) {
        case"cancel":
        case"click":
        case"close":
        case"contextmenu":
        case"copy":
        case"cut":
        case"auxclick":
        case"dblclick":
        case"dragend":
        case"dragstart":
        case"drop":
        case"focusin":
        case"focusout":
        case"input":
        case"invalid":
        case"keydown":
        case"keypress":
        case"keyup":
        case"mousedown":
        case"mouseup":
        case"paste":
        case"pause":
        case"play":
        case"pointercancel":
        case"pointerdown":
        case"pointerup":
        case"ratechange":
        case"reset":
        case"resize":
        case"seeked":
        case"submit":
        case"touchcancel":
        case"touchend":
        case"touchstart":
        case"volumechange":
        case"change":
        case"selectionchange":
        case"textInput":
        case"compositionstart":
        case"compositionend":
        case"compositionupdate":
        case"beforeblur":
        case"afterblur":
        case"beforeinput":
        case"blur":
        case"fullscreenchange":
        case"focus":
        case"hashchange":
        case"popstate":
        case"select":
        case"selectstart":
            return 1;
        case"drag":
        case"dragenter":
        case"dragexit":
        case"dragleave":
        case"dragover":
        case"mousemove":
        case"mouseout":
        case"mouseover":
        case"pointermove":
        case"pointerout":
        case"pointerover":
        case"scroll":
        case"toggle":
        case"touchmove":
        case"wheel":
        case"mouseenter":
        case"mouseleave":
        case"pointerenter":
        case"pointerleave":
            return 4;
        case"message":
            switch (Vx()) {
                case lc:
                    return 1;
                case Zf:
                    return 4;
                case Ra:
                case Wx:
                    return 16;
                case em:
                    return 536870912;
                default:
                    return 16
            }
        default:
            return 16
    }
}

var sr = null, uc = null, ma = null;

function cm() {
    if (ma) return ma;
    var e, t = uc, r = t.length, s, a = "value" in sr ? sr.value : sr.textContent, l = a.length;
    for (e = 0; e < r && t[e] === a[e]; e++) ;
    var i = r - e;
    for (s = 1; s <= i && t[r - s] === a[l - s]; s++) ;
    return ma = a.slice(e, 1 < s ? 1 - s : void 0)
}

function pa(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0
}

function Ys() {
    return !0
}

function Ru() {
    return !1
}

function nt(e) {
    function t(r, s, a, l, i) {
        this._reactName = r, this._targetInst = a, this.type = s, this.nativeEvent = l, this.target = i, this.currentTarget = null;
        for (var o in e) e.hasOwnProperty(o) && (r = e[o], this[o] = r ? r(l) : l[o]);
        return this.isDefaultPrevented = (l.defaultPrevented != null ? l.defaultPrevented : l.returnValue === !1) ? Ys : Ru, this.isPropagationStopped = Ru, this
    }

    return he(t.prototype, {
        preventDefault: function () {
            this.defaultPrevented = !0;
            var r = this.nativeEvent;
            r && (r.preventDefault ? r.preventDefault() : typeof r.returnValue != "unknown" && (r.returnValue = !1), this.isDefaultPrevented = Ys)
        }, stopPropagation: function () {
            var r = this.nativeEvent;
            r && (r.stopPropagation ? r.stopPropagation() : typeof r.cancelBubble != "unknown" && (r.cancelBubble = !0), this.isPropagationStopped = Ys)
        }, persist: function () {
        }, isPersistent: Ys
    }), t
}

var Rn = {
        eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function (e) {
            return e.timeStamp || Date.now()
        }, defaultPrevented: 0, isTrusted: 0
    }, dc = nt(Rn), Os = he({}, Rn, {view: 0, detail: 0}), ng = nt(Os), li, ii, Un, cl = he({}, Os, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: fc,
        button: 0,
        buttons: 0,
        relatedTarget: function (e) {
            return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget
        },
        movementX: function (e) {
            return "movementX" in e ? e.movementX : (e !== Un && (Un && e.type === "mousemove" ? (li = e.screenX - Un.screenX, ii = e.screenY - Un.screenY) : ii = li = 0, Un = e), li)
        },
        movementY: function (e) {
            return "movementY" in e ? e.movementY : ii
        }
    }), Tu = nt(cl), sg = he({}, cl, {dataTransfer: 0}), ag = nt(sg), lg = he({}, Os, {relatedTarget: 0}), oi = nt(lg),
    ig = he({}, Rn, {animationName: 0, elapsedTime: 0, pseudoElement: 0}), og = nt(ig), cg = he({}, Rn, {
        clipboardData: function (e) {
            return "clipboardData" in e ? e.clipboardData : window.clipboardData
        }
    }), ug = nt(cg), dg = he({}, Rn, {data: 0}), Iu = nt(dg), fg = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
    }, mg = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
    }, pg = {Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey"};

function hg(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = pg[e]) ? !!t[e] : !1
}

function fc() {
    return hg
}

var xg = he({}, Os, {
    key: function (e) {
        if (e.key) {
            var t = fg[e.key] || e.key;
            if (t !== "Unidentified") return t
        }
        return e.type === "keypress" ? (e = pa(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? mg[e.keyCode] || "Unidentified" : ""
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: fc,
    charCode: function (e) {
        return e.type === "keypress" ? pa(e) : 0
    },
    keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0
    },
    which: function (e) {
        return e.type === "keypress" ? pa(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0
    }
}), gg = nt(xg), yg = he({}, cl, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
}), Au = nt(yg), vg = he({}, Os, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: fc
}), bg = nt(vg), jg = he({}, Rn, {propertyName: 0, elapsedTime: 0, pseudoElement: 0}), Ng = nt(jg), wg = he({}, cl, {
    deltaX: function (e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0
    }, deltaY: function (e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0
    }, deltaZ: 0, deltaMode: 0
}), kg = nt(wg), Sg = [9, 13, 27, 32], mc = Ut && "CompositionEvent" in window, Zn = null;
Ut && "documentMode" in document && (Zn = document.documentMode);
var Cg = Ut && "TextEvent" in window && !Zn, um = Ut && (!mc || Zn && 8 < Zn && 11 >= Zn), Lu = " ", $u = !1;

function dm(e, t) {
    switch (e) {
        case"keyup":
            return Sg.indexOf(t.keyCode) !== -1;
        case"keydown":
            return t.keyCode !== 229;
        case"keypress":
        case"mousedown":
        case"focusout":
            return !0;
        default:
            return !1
    }
}

function fm(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null
}

var Zr = !1;

function Eg(e, t) {
    switch (e) {
        case"compositionend":
            return fm(t);
        case"keypress":
            return t.which !== 32 ? null : ($u = !0, Lu);
        case"textInput":
            return e = t.data, e === Lu && $u ? null : e;
        default:
            return null
    }
}

function Pg(e, t) {
    if (Zr) return e === "compositionend" || !mc && dm(e, t) ? (e = cm(), ma = uc = sr = null, Zr = !1, e) : null;
    switch (e) {
        case"paste":
            return null;
        case"keypress":
            if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
                if (t.char && 1 < t.char.length) return t.char;
                if (t.which) return String.fromCharCode(t.which)
            }
            return null;
        case"compositionend":
            return um && t.locale !== "ko" ? null : t.data;
        default:
            return null
    }
}

var _g = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
};

function Du(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!_g[e.type] : t === "textarea"
}

function mm(e, t, r, s) {
    Wf(s), t = La(t, "onChange"), 0 < t.length && (r = new dc("onChange", "change", null, r, s), e.push({
        event: r,
        listeners: t
    }))
}

var es = null, fs = null;

function Og(e) {
    km(e, 0)
}

function ul(e) {
    var t = rn(e);
    if (Df(t)) return e
}

function Rg(e, t) {
    if (e === "change") return t
}

var pm = !1;
if (Ut) {
    var ci;
    if (Ut) {
        var ui = "oninput" in document;
        if (!ui) {
            var Mu = document.createElement("div");
            Mu.setAttribute("oninput", "return;"), ui = typeof Mu.oninput == "function"
        }
        ci = ui
    } else ci = !1;
    pm = ci && (!document.documentMode || 9 < document.documentMode)
}

function zu() {
    es && (es.detachEvent("onpropertychange", hm), fs = es = null)
}

function hm(e) {
    if (e.propertyName === "value" && ul(fs)) {
        var t = [];
        mm(t, fs, e, ac(e)), Qf(Og, t)
    }
}

function Tg(e, t, r) {
    e === "focusin" ? (zu(), es = t, fs = r, es.attachEvent("onpropertychange", hm)) : e === "focusout" && zu()
}

function Ig(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return ul(fs)
}

function Ag(e, t) {
    if (e === "click") return ul(t)
}

function Lg(e, t) {
    if (e === "input" || e === "change") return ul(t)
}

function $g(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t
}

var Nt = typeof Object.is == "function" ? Object.is : $g;

function ms(e, t) {
    if (Nt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var r = Object.keys(e), s = Object.keys(t);
    if (r.length !== s.length) return !1;
    for (s = 0; s < r.length; s++) {
        var a = r[s];
        if (!Ui.call(t, a) || !Nt(e[a], t[a])) return !1
    }
    return !0
}

function Uu(e) {
    for (; e && e.firstChild;) e = e.firstChild;
    return e
}

function Fu(e, t) {
    var r = Uu(e);
    e = 0;
    for (var s; r;) {
        if (r.nodeType === 3) {
            if (s = e + r.textContent.length, e <= t && s >= t) return {node: r, offset: t - e};
            e = s
        }
        e:{
            for (; r;) {
                if (r.nextSibling) {
                    r = r.nextSibling;
                    break e
                }
                r = r.parentNode
            }
            r = void 0
        }
        r = Uu(r)
    }
}

function xm(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? xm(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1
}

function gm() {
    for (var e = window, t = Pa(); t instanceof e.HTMLIFrameElement;) {
        try {
            var r = typeof t.contentWindow.location.href == "string"
        } catch {
            r = !1
        }
        if (r) e = t.contentWindow; else break;
        t = Pa(e.document)
    }
    return t
}

function pc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true")
}

function Dg(e) {
    var t = gm(), r = e.focusedElem, s = e.selectionRange;
    if (t !== r && r && r.ownerDocument && xm(r.ownerDocument.documentElement, r)) {
        if (s !== null && pc(r)) {
            if (t = s.start, e = s.end, e === void 0 && (e = t), "selectionStart" in r) r.selectionStart = t, r.selectionEnd = Math.min(e, r.value.length); else if (e = (t = r.ownerDocument || document) && t.defaultView || window, e.getSelection) {
                e = e.getSelection();
                var a = r.textContent.length, l = Math.min(s.start, a);
                s = s.end === void 0 ? l : Math.min(s.end, a), !e.extend && l > s && (a = s, s = l, l = a), a = Fu(r, l);
                var i = Fu(r, s);
                a && i && (e.rangeCount !== 1 || e.anchorNode !== a.node || e.anchorOffset !== a.offset || e.focusNode !== i.node || e.focusOffset !== i.offset) && (t = t.createRange(), t.setStart(a.node, a.offset), e.removeAllRanges(), l > s ? (e.addRange(t), e.extend(i.node, i.offset)) : (t.setEnd(i.node, i.offset), e.addRange(t)))
            }
        }
        for (t = [], e = r; e = e.parentNode;) e.nodeType === 1 && t.push({
            element: e,
            left: e.scrollLeft,
            top: e.scrollTop
        });
        for (typeof r.focus == "function" && r.focus(), r = 0; r < t.length; r++) e = t[r], e.element.scrollLeft = e.left, e.element.scrollTop = e.top
    }
}

var Mg = Ut && "documentMode" in document && 11 >= document.documentMode, en = null, ao = null, ts = null, lo = !1;

function Bu(e, t, r) {
    var s = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
    lo || en == null || en !== Pa(s) || (s = en, "selectionStart" in s && pc(s) ? s = {
        start: s.selectionStart,
        end: s.selectionEnd
    } : (s = (s.ownerDocument && s.ownerDocument.defaultView || window).getSelection(), s = {
        anchorNode: s.anchorNode,
        anchorOffset: s.anchorOffset,
        focusNode: s.focusNode,
        focusOffset: s.focusOffset
    }), ts && ms(ts, s) || (ts = s, s = La(ao, "onSelect"), 0 < s.length && (t = new dc("onSelect", "select", null, t, r), e.push({
        event: t,
        listeners: s
    }), t.target = en)))
}

function Zs(e, t) {
    var r = {};
    return r[e.toLowerCase()] = t.toLowerCase(), r["Webkit" + e] = "webkit" + t, r["Moz" + e] = "moz" + t, r
}

var tn = {
    animationend: Zs("Animation", "AnimationEnd"),
    animationiteration: Zs("Animation", "AnimationIteration"),
    animationstart: Zs("Animation", "AnimationStart"),
    transitionend: Zs("Transition", "TransitionEnd")
}, di = {}, ym = {};
Ut && (ym = document.createElement("div").style, "AnimationEvent" in window || (delete tn.animationend.animation, delete tn.animationiteration.animation, delete tn.animationstart.animation), "TransitionEvent" in window || delete tn.transitionend.transition);

function dl(e) {
    if (di[e]) return di[e];
    if (!tn[e]) return e;
    var t = tn[e], r;
    for (r in t) if (t.hasOwnProperty(r) && r in ym) return di[e] = t[r];
    return e
}

var vm = dl("animationend"), bm = dl("animationiteration"), jm = dl("animationstart"), Nm = dl("transitionend"),
    wm = new Map,
    Vu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");

function Nr(e, t) {
    wm.set(e, t), Wr(t, [e])
}

for (var fi = 0; fi < Vu.length; fi++) {
    var mi = Vu[fi], zg = mi.toLowerCase(), Ug = mi[0].toUpperCase() + mi.slice(1);
    Nr(zg, "on" + Ug)
}
Nr(vm, "onAnimationEnd");
Nr(bm, "onAnimationIteration");
Nr(jm, "onAnimationStart");
Nr("dblclick", "onDoubleClick");
Nr("focusin", "onFocus");
Nr("focusout", "onBlur");
Nr(Nm, "onTransitionEnd");
yn("onMouseEnter", ["mouseout", "mouseover"]);
yn("onMouseLeave", ["mouseout", "mouseover"]);
yn("onPointerEnter", ["pointerout", "pointerover"]);
yn("onPointerLeave", ["pointerout", "pointerover"]);
Wr("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
Wr("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
Wr("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Wr("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
Wr("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
Wr("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var Kn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
    Fg = new Set("cancel close invalid load scroll toggle".split(" ").concat(Kn));

function Wu(e, t, r) {
    var s = e.type || "unknown-event";
    e.currentTarget = r, zx(s, t, void 0, e), e.currentTarget = null
}

function km(e, t) {
    t = (t & 4) !== 0;
    for (var r = 0; r < e.length; r++) {
        var s = e[r], a = s.event;
        s = s.listeners;
        e:{
            var l = void 0;
            if (t) for (var i = s.length - 1; 0 <= i; i--) {
                var o = s[i], c = o.instance, u = o.currentTarget;
                if (o = o.listener, c !== l && a.isPropagationStopped()) break e;
                Wu(a, o, u), l = c
            } else for (i = 0; i < s.length; i++) {
                if (o = s[i], c = o.instance, u = o.currentTarget, o = o.listener, c !== l && a.isPropagationStopped()) break e;
                Wu(a, o, u), l = c
            }
        }
    }
    if (Oa) throw e = to, Oa = !1, to = null, e
}

function le(e, t) {
    var r = t[fo];
    r === void 0 && (r = t[fo] = new Set);
    var s = e + "__bubble";
    r.has(s) || (Sm(t, e, 2, !1), r.add(s))
}

function pi(e, t, r) {
    var s = 0;
    t && (s |= 4), Sm(r, e, s, t)
}

var ea = "_reactListening" + Math.random().toString(36).slice(2);

function ps(e) {
    if (!e[ea]) {
        e[ea] = !0, Tf.forEach(function (r) {
            r !== "selectionchange" && (Fg.has(r) || pi(r, !1, e), pi(r, !0, e))
        });
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[ea] || (t[ea] = !0, pi("selectionchange", !1, t))
    }
}

function Sm(e, t, r, s) {
    switch (om(t)) {
        case 1:
            var a = tg;
            break;
        case 4:
            a = rg;
            break;
        default:
            a = cc
    }
    r = a.bind(null, t, r, e), a = void 0, !eo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (a = !0), s ? a !== void 0 ? e.addEventListener(t, r, {
        capture: !0,
        passive: a
    }) : e.addEventListener(t, r, !0) : a !== void 0 ? e.addEventListener(t, r, {passive: a}) : e.addEventListener(t, r, !1)
}

function hi(e, t, r, s, a) {
    var l = s;
    if (!(t & 1) && !(t & 2) && s !== null) e:for (; ;) {
        if (s === null) return;
        var i = s.tag;
        if (i === 3 || i === 4) {
            var o = s.stateNode.containerInfo;
            if (o === a || o.nodeType === 8 && o.parentNode === a) break;
            if (i === 4) for (i = s.return; i !== null;) {
                var c = i.tag;
                if ((c === 3 || c === 4) && (c = i.stateNode.containerInfo, c === a || c.nodeType === 8 && c.parentNode === a)) return;
                i = i.return
            }
            for (; o !== null;) {
                if (i = _r(o), i === null) return;
                if (c = i.tag, c === 5 || c === 6) {
                    s = l = i;
                    continue e
                }
                o = o.parentNode
            }
        }
        s = s.return
    }
    Qf(function () {
        var u = l, f = ac(r), m = [];
        e:{
            var y = wm.get(e);
            if (y !== void 0) {
                var b = dc, p = e;
                switch (e) {
                    case"keypress":
                        if (pa(r) === 0) break e;
                    case"keydown":
                    case"keyup":
                        b = gg;
                        break;
                    case"focusin":
                        p = "focus", b = oi;
                        break;
                    case"focusout":
                        p = "blur", b = oi;
                        break;
                    case"beforeblur":
                    case"afterblur":
                        b = oi;
                        break;
                    case"click":
                        if (r.button === 2) break e;
                    case"auxclick":
                    case"dblclick":
                    case"mousedown":
                    case"mousemove":
                    case"mouseup":
                    case"mouseout":
                    case"mouseover":
                    case"contextmenu":
                        b = Tu;
                        break;
                    case"drag":
                    case"dragend":
                    case"dragenter":
                    case"dragexit":
                    case"dragleave":
                    case"dragover":
                    case"dragstart":
                    case"drop":
                        b = ag;
                        break;
                    case"touchcancel":
                    case"touchend":
                    case"touchmove":
                    case"touchstart":
                        b = bg;
                        break;
                    case vm:
                    case bm:
                    case jm:
                        b = og;
                        break;
                    case Nm:
                        b = Ng;
                        break;
                    case"scroll":
                        b = ng;
                        break;
                    case"wheel":
                        b = kg;
                        break;
                    case"copy":
                    case"cut":
                    case"paste":
                        b = ug;
                        break;
                    case"gotpointercapture":
                    case"lostpointercapture":
                    case"pointercancel":
                    case"pointerdown":
                    case"pointermove":
                    case"pointerout":
                    case"pointerover":
                    case"pointerup":
                        b = Au
                }
                var d = (t & 4) !== 0, x = !d && e === "scroll", h = d ? y !== null ? y + "Capture" : null : y;
                d = [];
                for (var g = u, v; g !== null;) {
                    v = g;
                    var w = v.stateNode;
                    if (v.tag === 5 && w !== null && (v = w, h !== null && (w = os(g, h), w != null && d.push(hs(g, w, v)))), x) break;
                    g = g.return
                }
                0 < d.length && (y = new b(y, p, null, r, f), m.push({event: y, listeners: d}))
            }
        }
        if (!(t & 7)) {
            e:{
                if (y = e === "mouseover" || e === "pointerover", b = e === "mouseout" || e === "pointerout", y && r !== Yi && (p = r.relatedTarget || r.fromElement) && (_r(p) || p[Ft])) break e;
                if ((b || y) && (y = f.window === f ? f : (y = f.ownerDocument) ? y.defaultView || y.parentWindow : window, b ? (p = r.relatedTarget || r.toElement, b = u, p = p ? _r(p) : null, p !== null && (x = Hr(p), p !== x || p.tag !== 5 && p.tag !== 6) && (p = null)) : (b = null, p = u), b !== p)) {
                    if (d = Tu, w = "onMouseLeave", h = "onMouseEnter", g = "mouse", (e === "pointerout" || e === "pointerover") && (d = Au, w = "onPointerLeave", h = "onPointerEnter", g = "pointer"), x = b == null ? y : rn(b), v = p == null ? y : rn(p), y = new d(w, g + "leave", b, r, f), y.target = x, y.relatedTarget = v, w = null, _r(f) === u && (d = new d(h, g + "enter", p, r, f), d.target = v, d.relatedTarget = x, w = d), x = w, b && p) t:{
                        for (d = b, h = p, g = 0, v = d; v; v = Gr(v)) g++;
                        for (v = 0, w = h; w; w = Gr(w)) v++;
                        for (; 0 < g - v;) d = Gr(d), g--;
                        for (; 0 < v - g;) h = Gr(h), v--;
                        for (; g--;) {
                            if (d === h || h !== null && d === h.alternate) break t;
                            d = Gr(d), h = Gr(h)
                        }
                        d = null
                    } else d = null;
                    b !== null && Hu(m, y, b, d, !1), p !== null && x !== null && Hu(m, x, p, d, !0)
                }
            }
            e:{
                if (y = u ? rn(u) : window, b = y.nodeName && y.nodeName.toLowerCase(), b === "select" || b === "input" && y.type === "file") var N = Rg; else if (Du(y)) if (pm) N = Lg; else {
                    N = Ig;
                    var k = Tg
                } else (b = y.nodeName) && b.toLowerCase() === "input" && (y.type === "checkbox" || y.type === "radio") && (N = Ag);
                if (N && (N = N(e, u))) {
                    mm(m, N, r, f);
                    break e
                }
                k && k(e, y, u), e === "focusout" && (k = y._wrapperState) && k.controlled && y.type === "number" && qi(y, "number", y.value)
            }
            switch (k = u ? rn(u) : window, e) {
                case"focusin":
                    (Du(k) || k.contentEditable === "true") && (en = k, ao = u, ts = null);
                    break;
                case"focusout":
                    ts = ao = en = null;
                    break;
                case"mousedown":
                    lo = !0;
                    break;
                case"contextmenu":
                case"mouseup":
                case"dragend":
                    lo = !1, Bu(m, r, f);
                    break;
                case"selectionchange":
                    if (Mg) break;
                case"keydown":
                case"keyup":
                    Bu(m, r, f)
            }
            var E;
            if (mc) e:{
                switch (e) {
                    case"compositionstart":
                        var R = "onCompositionStart";
                        break e;
                    case"compositionend":
                        R = "onCompositionEnd";
                        break e;
                    case"compositionupdate":
                        R = "onCompositionUpdate";
                        break e
                }
                R = void 0
            } else Zr ? dm(e, r) && (R = "onCompositionEnd") : e === "keydown" && r.keyCode === 229 && (R = "onCompositionStart");
            R && (um && r.locale !== "ko" && (Zr || R !== "onCompositionStart" ? R === "onCompositionEnd" && Zr && (E = cm()) : (sr = f, uc = "value" in sr ? sr.value : sr.textContent, Zr = !0)), k = La(u, R), 0 < k.length && (R = new Iu(R, e, null, r, f), m.push({
                event: R,
                listeners: k
            }), E ? R.data = E : (E = fm(r), E !== null && (R.data = E)))), (E = Cg ? Eg(e, r) : Pg(e, r)) && (u = La(u, "onBeforeInput"), 0 < u.length && (f = new Iu("onBeforeInput", "beforeinput", null, r, f), m.push({
                event: f,
                listeners: u
            }), f.data = E))
        }
        km(m, t)
    })
}

function hs(e, t, r) {
    return {instance: e, listener: t, currentTarget: r}
}

function La(e, t) {
    for (var r = t + "Capture", s = []; e !== null;) {
        var a = e, l = a.stateNode;
        a.tag === 5 && l !== null && (a = l, l = os(e, r), l != null && s.unshift(hs(e, l, a)), l = os(e, t), l != null && s.push(hs(e, l, a))), e = e.return
    }
    return s
}

function Gr(e) {
    if (e === null) return null;
    do e = e.return; while (e && e.tag !== 5);
    return e || null
}

function Hu(e, t, r, s, a) {
    for (var l = t._reactName, i = []; r !== null && r !== s;) {
        var o = r, c = o.alternate, u = o.stateNode;
        if (c !== null && c === s) break;
        o.tag === 5 && u !== null && (o = u, a ? (c = os(r, l), c != null && i.unshift(hs(r, c, o))) : a || (c = os(r, l), c != null && i.push(hs(r, c, o)))), r = r.return
    }
    i.length !== 0 && e.push({event: t, listeners: i})
}

var Bg = /\r\n?/g, Vg = /\u0000|\uFFFD/g;

function Ju(e) {
    return (typeof e == "string" ? e : "" + e).replace(Bg, `
`).replace(Vg, "")
}

function ta(e, t, r) {
    if (t = Ju(t), Ju(e) !== t && r) throw Error(I(425))
}

function $a() {
}

var io = null, oo = null;

function co(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null
}

var uo = typeof setTimeout == "function" ? setTimeout : void 0,
    Wg = typeof clearTimeout == "function" ? clearTimeout : void 0,
    qu = typeof Promise == "function" ? Promise : void 0,
    Hg = typeof queueMicrotask == "function" ? queueMicrotask : typeof qu < "u" ? function (e) {
        return qu.resolve(null).then(e).catch(Jg)
    } : uo;

function Jg(e) {
    setTimeout(function () {
        throw e
    })
}

function xi(e, t) {
    var r = t, s = 0;
    do {
        var a = r.nextSibling;
        if (e.removeChild(r), a && a.nodeType === 8) if (r = a.data, r === "/$") {
            if (s === 0) {
                e.removeChild(a), ds(t);
                return
            }
            s--
        } else r !== "$" && r !== "$?" && r !== "$!" || s++;
        r = a
    } while (r);
    ds(t)
}

function ur(e) {
    for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
            if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
            if (t === "/$") return null
        }
    }
    return e
}

function Qu(e) {
    e = e.previousSibling;
    for (var t = 0; e;) {
        if (e.nodeType === 8) {
            var r = e.data;
            if (r === "$" || r === "$!" || r === "$?") {
                if (t === 0) return e;
                t--
            } else r === "/$" && t++
        }
        e = e.previousSibling
    }
    return null
}

var Tn = Math.random().toString(36).slice(2), Et = "__reactFiber$" + Tn, xs = "__reactProps$" + Tn,
    Ft = "__reactContainer$" + Tn, fo = "__reactEvents$" + Tn, qg = "__reactListeners$" + Tn,
    Qg = "__reactHandles$" + Tn;

function _r(e) {
    var t = e[Et];
    if (t) return t;
    for (var r = e.parentNode; r;) {
        if (t = r[Ft] || r[Et]) {
            if (r = t.alternate, t.child !== null || r !== null && r.child !== null) for (e = Qu(e); e !== null;) {
                if (r = e[Et]) return r;
                e = Qu(e)
            }
            return t
        }
        e = r, r = e.parentNode
    }
    return null
}

function Rs(e) {
    return e = e[Et] || e[Ft], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e
}

function rn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(I(33))
}

function fl(e) {
    return e[xs] || null
}

var mo = [], nn = -1;

function wr(e) {
    return {current: e}
}

function ie(e) {
    0 > nn || (e.current = mo[nn], mo[nn] = null, nn--)
}

function ae(e, t) {
    nn++, mo[nn] = e.current, e.current = t
}

var vr = {}, Me = wr(vr), He = wr(!1), $r = vr;

function vn(e, t) {
    var r = e.type.contextTypes;
    if (!r) return vr;
    var s = e.stateNode;
    if (s && s.__reactInternalMemoizedUnmaskedChildContext === t) return s.__reactInternalMemoizedMaskedChildContext;
    var a = {}, l;
    for (l in r) a[l] = t[l];
    return s && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = a), a
}

function Je(e) {
    return e = e.childContextTypes, e != null
}

function Da() {
    ie(He), ie(Me)
}

function Ku(e, t, r) {
    if (Me.current !== vr) throw Error(I(168));
    ae(Me, t), ae(He, r)
}

function Cm(e, t, r) {
    var s = e.stateNode;
    if (t = t.childContextTypes, typeof s.getChildContext != "function") return r;
    s = s.getChildContext();
    for (var a in s) if (!(a in t)) throw Error(I(108, Tx(e) || "Unknown", a));
    return he({}, r, s)
}

function Ma(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || vr, $r = Me.current, ae(Me, e), ae(He, He.current), !0
}

function Gu(e, t, r) {
    var s = e.stateNode;
    if (!s) throw Error(I(169));
    r ? (e = Cm(e, t, $r), s.__reactInternalMemoizedMergedChildContext = e, ie(He), ie(Me), ae(Me, e)) : ie(He), ae(He, r)
}

var $t = null, ml = !1, gi = !1;

function Em(e) {
    $t === null ? $t = [e] : $t.push(e)
}

function Kg(e) {
    ml = !0, Em(e)
}

function kr() {
    if (!gi && $t !== null) {
        gi = !0;
        var e = 0, t = re;
        try {
            var r = $t;
            for (re = 1; e < r.length; e++) {
                var s = r[e];
                do s = s(!0); while (s !== null)
            }
            $t = null, ml = !1
        } catch (a) {
            throw $t !== null && ($t = $t.slice(e + 1)), Yf(lc, kr), a
        } finally {
            re = t, gi = !1
        }
    }
    return null
}

var sn = [], an = 0, za = null, Ua = 0, ot = [], ct = 0, Dr = null, Dt = 1, Mt = "";

function Cr(e, t) {
    sn[an++] = Ua, sn[an++] = za, za = e, Ua = t
}

function Pm(e, t, r) {
    ot[ct++] = Dt, ot[ct++] = Mt, ot[ct++] = Dr, Dr = e;
    var s = Dt;
    e = Mt;
    var a = 32 - bt(s) - 1;
    s &= ~(1 << a), r += 1;
    var l = 32 - bt(t) + a;
    if (30 < l) {
        var i = a - a % 5;
        l = (s & (1 << i) - 1).toString(32), s >>= i, a -= i, Dt = 1 << 32 - bt(t) + a | r << a | s, Mt = l + e
    } else Dt = 1 << l | r << a | s, Mt = e
}

function hc(e) {
    e.return !== null && (Cr(e, 1), Pm(e, 1, 0))
}

function xc(e) {
    for (; e === za;) za = sn[--an], sn[an] = null, Ua = sn[--an], sn[an] = null;
    for (; e === Dr;) Dr = ot[--ct], ot[ct] = null, Mt = ot[--ct], ot[ct] = null, Dt = ot[--ct], ot[ct] = null
}

var Ye = null, Xe = null, de = !1, yt = null;

function _m(e, t) {
    var r = ut(5, null, null, 0);
    r.elementType = "DELETED", r.stateNode = t, r.return = e, t = e.deletions, t === null ? (e.deletions = [r], e.flags |= 16) : t.push(r)
}

function Xu(e, t) {
    switch (e.tag) {
        case 5:
            var r = e.type;
            return t = t.nodeType !== 1 || r.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Ye = e, Xe = ur(t.firstChild), !0) : !1;
        case 6:
            return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Ye = e, Xe = null, !0) : !1;
        case 13:
            return t = t.nodeType !== 8 ? null : t, t !== null ? (r = Dr !== null ? {
                id: Dt,
                overflow: Mt
            } : null, e.memoizedState = {
                dehydrated: t,
                treeContext: r,
                retryLane: 1073741824
            }, r = ut(18, null, null, 0), r.stateNode = t, r.return = e, e.child = r, Ye = e, Xe = null, !0) : !1;
        default:
            return !1
    }
}

function po(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0
}

function ho(e) {
    if (de) {
        var t = Xe;
        if (t) {
            var r = t;
            if (!Xu(e, t)) {
                if (po(e)) throw Error(I(418));
                t = ur(r.nextSibling);
                var s = Ye;
                t && Xu(e, t) ? _m(s, r) : (e.flags = e.flags & -4097 | 2, de = !1, Ye = e)
            }
        } else {
            if (po(e)) throw Error(I(418));
            e.flags = e.flags & -4097 | 2, de = !1, Ye = e
        }
    }
}

function Yu(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;) e = e.return;
    Ye = e
}

function ra(e) {
    if (e !== Ye) return !1;
    if (!de) return Yu(e), de = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !co(e.type, e.memoizedProps)), t && (t = Xe)) {
        if (po(e)) throw Om(), Error(I(418));
        for (; t;) _m(e, t), t = ur(t.nextSibling)
    }
    if (Yu(e), e.tag === 13) {
        if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(I(317));
        e:{
            for (e = e.nextSibling, t = 0; e;) {
                if (e.nodeType === 8) {
                    var r = e.data;
                    if (r === "/$") {
                        if (t === 0) {
                            Xe = ur(e.nextSibling);
                            break e
                        }
                        t--
                    } else r !== "$" && r !== "$!" && r !== "$?" || t++
                }
                e = e.nextSibling
            }
            Xe = null
        }
    } else Xe = Ye ? ur(e.stateNode.nextSibling) : null;
    return !0
}

function Om() {
    for (var e = Xe; e;) e = ur(e.nextSibling)
}

function bn() {
    Xe = Ye = null, de = !1
}

function gc(e) {
    yt === null ? yt = [e] : yt.push(e)
}

var Gg = Jt.ReactCurrentBatchConfig;

function Fn(e, t, r) {
    if (e = r.ref, e !== null && typeof e != "function" && typeof e != "object") {
        if (r._owner) {
            if (r = r._owner, r) {
                if (r.tag !== 1) throw Error(I(309));
                var s = r.stateNode
            }
            if (!s) throw Error(I(147, e));
            var a = s, l = "" + e;
            return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === l ? t.ref : (t = function (i) {
                var o = a.refs;
                i === null ? delete o[l] : o[l] = i
            }, t._stringRef = l, t)
        }
        if (typeof e != "string") throw Error(I(284));
        if (!r._owner) throw Error(I(290, e))
    }
    return e
}

function na(e, t) {
    throw e = Object.prototype.toString.call(t), Error(I(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e))
}

function Zu(e) {
    var t = e._init;
    return t(e._payload)
}

function Rm(e) {
    function t(h, g) {
        if (e) {
            var v = h.deletions;
            v === null ? (h.deletions = [g], h.flags |= 16) : v.push(g)
        }
    }

    function r(h, g) {
        if (!e) return null;
        for (; g !== null;) t(h, g), g = g.sibling;
        return null
    }

    function s(h, g) {
        for (h = new Map; g !== null;) g.key !== null ? h.set(g.key, g) : h.set(g.index, g), g = g.sibling;
        return h
    }

    function a(h, g) {
        return h = pr(h, g), h.index = 0, h.sibling = null, h
    }

    function l(h, g, v) {
        return h.index = v, e ? (v = h.alternate, v !== null ? (v = v.index, v < g ? (h.flags |= 2, g) : v) : (h.flags |= 2, g)) : (h.flags |= 1048576, g)
    }

    function i(h) {
        return e && h.alternate === null && (h.flags |= 2), h
    }

    function o(h, g, v, w) {
        return g === null || g.tag !== 6 ? (g = ki(v, h.mode, w), g.return = h, g) : (g = a(g, v), g.return = h, g)
    }

    function c(h, g, v, w) {
        var N = v.type;
        return N === Yr ? f(h, g, v.props.children, w, v.key) : g !== null && (g.elementType === N || typeof N == "object" && N !== null && N.$$typeof === Yt && Zu(N) === g.type) ? (w = a(g, v.props), w.ref = Fn(h, g, v), w.return = h, w) : (w = ja(v.type, v.key, v.props, null, h.mode, w), w.ref = Fn(h, g, v), w.return = h, w)
    }

    function u(h, g, v, w) {
        return g === null || g.tag !== 4 || g.stateNode.containerInfo !== v.containerInfo || g.stateNode.implementation !== v.implementation ? (g = Si(v, h.mode, w), g.return = h, g) : (g = a(g, v.children || []), g.return = h, g)
    }

    function f(h, g, v, w, N) {
        return g === null || g.tag !== 7 ? (g = Ar(v, h.mode, w, N), g.return = h, g) : (g = a(g, v), g.return = h, g)
    }

    function m(h, g, v) {
        if (typeof g == "string" && g !== "" || typeof g == "number") return g = ki("" + g, h.mode, v), g.return = h, g;
        if (typeof g == "object" && g !== null) {
            switch (g.$$typeof) {
                case Js:
                    return v = ja(g.type, g.key, g.props, null, h.mode, v), v.ref = Fn(h, null, g), v.return = h, v;
                case Xr:
                    return g = Si(g, h.mode, v), g.return = h, g;
                case Yt:
                    var w = g._init;
                    return m(h, w(g._payload), v)
            }
            if (qn(g) || $n(g)) return g = Ar(g, h.mode, v, null), g.return = h, g;
            na(h, g)
        }
        return null
    }

    function y(h, g, v, w) {
        var N = g !== null ? g.key : null;
        if (typeof v == "string" && v !== "" || typeof v == "number") return N !== null ? null : o(h, g, "" + v, w);
        if (typeof v == "object" && v !== null) {
            switch (v.$$typeof) {
                case Js:
                    return v.key === N ? c(h, g, v, w) : null;
                case Xr:
                    return v.key === N ? u(h, g, v, w) : null;
                case Yt:
                    return N = v._init, y(h, g, N(v._payload), w)
            }
            if (qn(v) || $n(v)) return N !== null ? null : f(h, g, v, w, null);
            na(h, v)
        }
        return null
    }

    function b(h, g, v, w, N) {
        if (typeof w == "string" && w !== "" || typeof w == "number") return h = h.get(v) || null, o(g, h, "" + w, N);
        if (typeof w == "object" && w !== null) {
            switch (w.$$typeof) {
                case Js:
                    return h = h.get(w.key === null ? v : w.key) || null, c(g, h, w, N);
                case Xr:
                    return h = h.get(w.key === null ? v : w.key) || null, u(g, h, w, N);
                case Yt:
                    var k = w._init;
                    return b(h, g, v, k(w._payload), N)
            }
            if (qn(w) || $n(w)) return h = h.get(v) || null, f(g, h, w, N, null);
            na(g, w)
        }
        return null
    }

    function p(h, g, v, w) {
        for (var N = null, k = null, E = g, R = g = 0, z = null; E !== null && R < v.length; R++) {
            E.index > R ? (z = E, E = null) : z = E.sibling;
            var $ = y(h, E, v[R], w);
            if ($ === null) {
                E === null && (E = z);
                break
            }
            e && E && $.alternate === null && t(h, E), g = l($, g, R), k === null ? N = $ : k.sibling = $, k = $, E = z
        }
        if (R === v.length) return r(h, E), de && Cr(h, R), N;
        if (E === null) {
            for (; R < v.length; R++) E = m(h, v[R], w), E !== null && (g = l(E, g, R), k === null ? N = E : k.sibling = E, k = E);
            return de && Cr(h, R), N
        }
        for (E = s(h, E); R < v.length; R++) z = b(E, h, R, v[R], w), z !== null && (e && z.alternate !== null && E.delete(z.key === null ? R : z.key), g = l(z, g, R), k === null ? N = z : k.sibling = z, k = z);
        return e && E.forEach(function (L) {
            return t(h, L)
        }), de && Cr(h, R), N
    }

    function d(h, g, v, w) {
        var N = $n(v);
        if (typeof N != "function") throw Error(I(150));
        if (v = N.call(v), v == null) throw Error(I(151));
        for (var k = N = null, E = g, R = g = 0, z = null, $ = v.next(); E !== null && !$.done; R++, $ = v.next()) {
            E.index > R ? (z = E, E = null) : z = E.sibling;
            var L = y(h, E, $.value, w);
            if (L === null) {
                E === null && (E = z);
                break
            }
            e && E && L.alternate === null && t(h, E), g = l(L, g, R), k === null ? N = L : k.sibling = L, k = L, E = z
        }
        if ($.done) return r(h, E), de && Cr(h, R), N;
        if (E === null) {
            for (; !$.done; R++, $ = v.next()) $ = m(h, $.value, w), $ !== null && (g = l($, g, R), k === null ? N = $ : k.sibling = $, k = $);
            return de && Cr(h, R), N
        }
        for (E = s(h, E); !$.done; R++, $ = v.next()) $ = b(E, h, R, $.value, w), $ !== null && (e && $.alternate !== null && E.delete($.key === null ? R : $.key), g = l($, g, R), k === null ? N = $ : k.sibling = $, k = $);
        return e && E.forEach(function (G) {
            return t(h, G)
        }), de && Cr(h, R), N
    }

    function x(h, g, v, w) {
        if (typeof v == "object" && v !== null && v.type === Yr && v.key === null && (v = v.props.children), typeof v == "object" && v !== null) {
            switch (v.$$typeof) {
                case Js:
                    e:{
                        for (var N = v.key, k = g; k !== null;) {
                            if (k.key === N) {
                                if (N = v.type, N === Yr) {
                                    if (k.tag === 7) {
                                        r(h, k.sibling), g = a(k, v.props.children), g.return = h, h = g;
                                        break e
                                    }
                                } else if (k.elementType === N || typeof N == "object" && N !== null && N.$$typeof === Yt && Zu(N) === k.type) {
                                    r(h, k.sibling), g = a(k, v.props), g.ref = Fn(h, k, v), g.return = h, h = g;
                                    break e
                                }
                                r(h, k);
                                break
                            } else t(h, k);
                            k = k.sibling
                        }
                        v.type === Yr ? (g = Ar(v.props.children, h.mode, w, v.key), g.return = h, h = g) : (w = ja(v.type, v.key, v.props, null, h.mode, w), w.ref = Fn(h, g, v), w.return = h, h = w)
                    }
                    return i(h);
                case Xr:
                    e:{
                        for (k = v.key; g !== null;) {
                            if (g.key === k) if (g.tag === 4 && g.stateNode.containerInfo === v.containerInfo && g.stateNode.implementation === v.implementation) {
                                r(h, g.sibling), g = a(g, v.children || []), g.return = h, h = g;
                                break e
                            } else {
                                r(h, g);
                                break
                            } else t(h, g);
                            g = g.sibling
                        }
                        g = Si(v, h.mode, w), g.return = h, h = g
                    }
                    return i(h);
                case Yt:
                    return k = v._init, x(h, g, k(v._payload), w)
            }
            if (qn(v)) return p(h, g, v, w);
            if ($n(v)) return d(h, g, v, w);
            na(h, v)
        }
        return typeof v == "string" && v !== "" || typeof v == "number" ? (v = "" + v, g !== null && g.tag === 6 ? (r(h, g.sibling), g = a(g, v), g.return = h, h = g) : (r(h, g), g = ki(v, h.mode, w), g.return = h, h = g), i(h)) : r(h, g)
    }

    return x
}

var jn = Rm(!0), Tm = Rm(!1), Fa = wr(null), Ba = null, ln = null, yc = null;

function vc() {
    yc = ln = Ba = null
}

function bc(e) {
    var t = Fa.current;
    ie(Fa), e._currentValue = t
}

function xo(e, t, r) {
    for (; e !== null;) {
        var s = e.alternate;
        if ((e.childLanes & t) !== t ? (e.childLanes |= t, s !== null && (s.childLanes |= t)) : s !== null && (s.childLanes & t) !== t && (s.childLanes |= t), e === r) break;
        e = e.return
    }
}

function pn(e, t) {
    Ba = e, yc = ln = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (We = !0), e.firstContext = null)
}

function ft(e) {
    var t = e._currentValue;
    if (yc !== e) if (e = {context: e, memoizedValue: t, next: null}, ln === null) {
        if (Ba === null) throw Error(I(308));
        ln = e, Ba.dependencies = {lanes: 0, firstContext: e}
    } else ln = ln.next = e;
    return t
}

var Or = null;

function jc(e) {
    Or === null ? Or = [e] : Or.push(e)
}

function Im(e, t, r, s) {
    var a = t.interleaved;
    return a === null ? (r.next = r, jc(t)) : (r.next = a.next, a.next = r), t.interleaved = r, Bt(e, s)
}

function Bt(e, t) {
    e.lanes |= t;
    var r = e.alternate;
    for (r !== null && (r.lanes |= t), r = e, e = e.return; e !== null;) e.childLanes |= t, r = e.alternate, r !== null && (r.childLanes |= t), r = e, e = e.return;
    return r.tag === 3 ? r.stateNode : null
}

var Zt = !1;

function Nc(e) {
    e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {pending: null, interleaved: null, lanes: 0},
        effects: null
    }
}

function Am(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects
    })
}

function zt(e, t) {
    return {eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null}
}

function dr(e, t, r) {
    var s = e.updateQueue;
    if (s === null) return null;
    if (s = s.shared, Y & 2) {
        var a = s.pending;
        return a === null ? t.next = t : (t.next = a.next, a.next = t), s.pending = t, Bt(e, r)
    }
    return a = s.interleaved, a === null ? (t.next = t, jc(s)) : (t.next = a.next, a.next = t), s.interleaved = t, Bt(e, r)
}

function ha(e, t, r) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (r & 4194240) !== 0)) {
        var s = t.lanes;
        s &= e.pendingLanes, r |= s, t.lanes = r, ic(e, r)
    }
}

function ed(e, t) {
    var r = e.updateQueue, s = e.alternate;
    if (s !== null && (s = s.updateQueue, r === s)) {
        var a = null, l = null;
        if (r = r.firstBaseUpdate, r !== null) {
            do {
                var i = {
                    eventTime: r.eventTime,
                    lane: r.lane,
                    tag: r.tag,
                    payload: r.payload,
                    callback: r.callback,
                    next: null
                };
                l === null ? a = l = i : l = l.next = i, r = r.next
            } while (r !== null);
            l === null ? a = l = t : l = l.next = t
        } else a = l = t;
        r = {
            baseState: s.baseState,
            firstBaseUpdate: a,
            lastBaseUpdate: l,
            shared: s.shared,
            effects: s.effects
        }, e.updateQueue = r;
        return
    }
    e = r.lastBaseUpdate, e === null ? r.firstBaseUpdate = t : e.next = t, r.lastBaseUpdate = t
}

function Va(e, t, r, s) {
    var a = e.updateQueue;
    Zt = !1;
    var l = a.firstBaseUpdate, i = a.lastBaseUpdate, o = a.shared.pending;
    if (o !== null) {
        a.shared.pending = null;
        var c = o, u = c.next;
        c.next = null, i === null ? l = u : i.next = u, i = c;
        var f = e.alternate;
        f !== null && (f = f.updateQueue, o = f.lastBaseUpdate, o !== i && (o === null ? f.firstBaseUpdate = u : o.next = u, f.lastBaseUpdate = c))
    }
    if (l !== null) {
        var m = a.baseState;
        i = 0, f = u = c = null, o = l;
        do {
            var y = o.lane, b = o.eventTime;
            if ((s & y) === y) {
                f !== null && (f = f.next = {
                    eventTime: b,
                    lane: 0,
                    tag: o.tag,
                    payload: o.payload,
                    callback: o.callback,
                    next: null
                });
                e:{
                    var p = e, d = o;
                    switch (y = t, b = r, d.tag) {
                        case 1:
                            if (p = d.payload, typeof p == "function") {
                                m = p.call(b, m, y);
                                break e
                            }
                            m = p;
                            break e;
                        case 3:
                            p.flags = p.flags & -65537 | 128;
                        case 0:
                            if (p = d.payload, y = typeof p == "function" ? p.call(b, m, y) : p, y == null) break e;
                            m = he({}, m, y);
                            break e;
                        case 2:
                            Zt = !0
                    }
                }
                o.callback !== null && o.lane !== 0 && (e.flags |= 64, y = a.effects, y === null ? a.effects = [o] : y.push(o))
            } else b = {
                eventTime: b,
                lane: y,
                tag: o.tag,
                payload: o.payload,
                callback: o.callback,
                next: null
            }, f === null ? (u = f = b, c = m) : f = f.next = b, i |= y;
            if (o = o.next, o === null) {
                if (o = a.shared.pending, o === null) break;
                y = o, o = y.next, y.next = null, a.lastBaseUpdate = y, a.shared.pending = null
            }
        } while (!0);
        if (f === null && (c = m), a.baseState = c, a.firstBaseUpdate = u, a.lastBaseUpdate = f, t = a.shared.interleaved, t !== null) {
            a = t;
            do i |= a.lane, a = a.next; while (a !== t)
        } else l === null && (a.shared.lanes = 0);
        zr |= i, e.lanes = i, e.memoizedState = m
    }
}

function td(e, t, r) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
        var s = e[t], a = s.callback;
        if (a !== null) {
            if (s.callback = null, s = r, typeof a != "function") throw Error(I(191, a));
            a.call(s)
        }
    }
}

var Ts = {}, Rt = wr(Ts), gs = wr(Ts), ys = wr(Ts);

function Rr(e) {
    if (e === Ts) throw Error(I(174));
    return e
}

function wc(e, t) {
    switch (ae(ys, t), ae(gs, e), ae(Rt, Ts), e = t.nodeType, e) {
        case 9:
        case 11:
            t = (t = t.documentElement) ? t.namespaceURI : Ki(null, "");
            break;
        default:
            e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Ki(t, e)
    }
    ie(Rt), ae(Rt, t)
}

function Nn() {
    ie(Rt), ie(gs), ie(ys)
}

function Lm(e) {
    Rr(ys.current);
    var t = Rr(Rt.current), r = Ki(t, e.type);
    t !== r && (ae(gs, e), ae(Rt, r))
}

function kc(e) {
    gs.current === e && (ie(Rt), ie(gs))
}

var me = wr(0);

function Wa(e) {
    for (var t = e; t !== null;) {
        if (t.tag === 13) {
            var r = t.memoizedState;
            if (r !== null && (r = r.dehydrated, r === null || r.data === "$?" || r.data === "$!")) return t
        } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
            if (t.flags & 128) return t
        } else if (t.child !== null) {
            t.child.return = t, t = t.child;
            continue
        }
        if (t === e) break;
        for (; t.sibling === null;) {
            if (t.return === null || t.return === e) return null;
            t = t.return
        }
        t.sibling.return = t.return, t = t.sibling
    }
    return null
}

var yi = [];

function Sc() {
    for (var e = 0; e < yi.length; e++) yi[e]._workInProgressVersionPrimary = null;
    yi.length = 0
}

var xa = Jt.ReactCurrentDispatcher, vi = Jt.ReactCurrentBatchConfig, Mr = 0, pe = null, we = null, Ee = null, Ha = !1,
    rs = !1, vs = 0, Xg = 0;

function Ie() {
    throw Error(I(321))
}

function Cc(e, t) {
    if (t === null) return !1;
    for (var r = 0; r < t.length && r < e.length; r++) if (!Nt(e[r], t[r])) return !1;
    return !0
}

function Ec(e, t, r, s, a, l) {
    if (Mr = l, pe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, xa.current = e === null || e.memoizedState === null ? t0 : r0, e = r(s, a), rs) {
        l = 0;
        do {
            if (rs = !1, vs = 0, 25 <= l) throw Error(I(301));
            l += 1, Ee = we = null, t.updateQueue = null, xa.current = n0, e = r(s, a)
        } while (rs)
    }
    if (xa.current = Ja, t = we !== null && we.next !== null, Mr = 0, Ee = we = pe = null, Ha = !1, t) throw Error(I(300));
    return e
}

function Pc() {
    var e = vs !== 0;
    return vs = 0, e
}

function Ct() {
    var e = {memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null};
    return Ee === null ? pe.memoizedState = Ee = e : Ee = Ee.next = e, Ee
}

function mt() {
    if (we === null) {
        var e = pe.alternate;
        e = e !== null ? e.memoizedState : null
    } else e = we.next;
    var t = Ee === null ? pe.memoizedState : Ee.next;
    if (t !== null) Ee = t, we = e; else {
        if (e === null) throw Error(I(310));
        we = e, e = {
            memoizedState: we.memoizedState,
            baseState: we.baseState,
            baseQueue: we.baseQueue,
            queue: we.queue,
            next: null
        }, Ee === null ? pe.memoizedState = Ee = e : Ee = Ee.next = e
    }
    return Ee
}

function bs(e, t) {
    return typeof t == "function" ? t(e) : t
}

function bi(e) {
    var t = mt(), r = t.queue;
    if (r === null) throw Error(I(311));
    r.lastRenderedReducer = e;
    var s = we, a = s.baseQueue, l = r.pending;
    if (l !== null) {
        if (a !== null) {
            var i = a.next;
            a.next = l.next, l.next = i
        }
        s.baseQueue = a = l, r.pending = null
    }
    if (a !== null) {
        l = a.next, s = s.baseState;
        var o = i = null, c = null, u = l;
        do {
            var f = u.lane;
            if ((Mr & f) === f) c !== null && (c = c.next = {
                lane: 0,
                action: u.action,
                hasEagerState: u.hasEagerState,
                eagerState: u.eagerState,
                next: null
            }), s = u.hasEagerState ? u.eagerState : e(s, u.action); else {
                var m = {
                    lane: f,
                    action: u.action,
                    hasEagerState: u.hasEagerState,
                    eagerState: u.eagerState,
                    next: null
                };
                c === null ? (o = c = m, i = s) : c = c.next = m, pe.lanes |= f, zr |= f
            }
            u = u.next
        } while (u !== null && u !== l);
        c === null ? i = s : c.next = o, Nt(s, t.memoizedState) || (We = !0), t.memoizedState = s, t.baseState = i, t.baseQueue = c, r.lastRenderedState = s
    }
    if (e = r.interleaved, e !== null) {
        a = e;
        do l = a.lane, pe.lanes |= l, zr |= l, a = a.next; while (a !== e)
    } else a === null && (r.lanes = 0);
    return [t.memoizedState, r.dispatch]
}

function ji(e) {
    var t = mt(), r = t.queue;
    if (r === null) throw Error(I(311));
    r.lastRenderedReducer = e;
    var s = r.dispatch, a = r.pending, l = t.memoizedState;
    if (a !== null) {
        r.pending = null;
        var i = a = a.next;
        do l = e(l, i.action), i = i.next; while (i !== a);
        Nt(l, t.memoizedState) || (We = !0), t.memoizedState = l, t.baseQueue === null && (t.baseState = l), r.lastRenderedState = l
    }
    return [l, s]
}

function $m() {
}

function Dm(e, t) {
    var r = pe, s = mt(), a = t(), l = !Nt(s.memoizedState, a);
    if (l && (s.memoizedState = a, We = !0), s = s.queue, _c(Um.bind(null, r, s, e), [e]), s.getSnapshot !== t || l || Ee !== null && Ee.memoizedState.tag & 1) {
        if (r.flags |= 2048, js(9, zm.bind(null, r, s, a, t), void 0, null), Pe === null) throw Error(I(349));
        Mr & 30 || Mm(r, t, a)
    }
    return a
}

function Mm(e, t, r) {
    e.flags |= 16384, e = {getSnapshot: t, value: r}, t = pe.updateQueue, t === null ? (t = {
        lastEffect: null,
        stores: null
    }, pe.updateQueue = t, t.stores = [e]) : (r = t.stores, r === null ? t.stores = [e] : r.push(e))
}

function zm(e, t, r, s) {
    t.value = r, t.getSnapshot = s, Fm(t) && Bm(e)
}

function Um(e, t, r) {
    return r(function () {
        Fm(t) && Bm(e)
    })
}

function Fm(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
        var r = t();
        return !Nt(e, r)
    } catch {
        return !0
    }
}

function Bm(e) {
    var t = Bt(e, 1);
    t !== null && jt(t, e, 1, -1)
}

function rd(e) {
    var t = Ct();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: bs,
        lastRenderedState: e
    }, t.queue = e, e = e.dispatch = e0.bind(null, pe, e), [t.memoizedState, e]
}

function js(e, t, r, s) {
    return e = {
        tag: e,
        create: t,
        destroy: r,
        deps: s,
        next: null
    }, t = pe.updateQueue, t === null ? (t = {
        lastEffect: null,
        stores: null
    }, pe.updateQueue = t, t.lastEffect = e.next = e) : (r = t.lastEffect, r === null ? t.lastEffect = e.next = e : (s = r.next, r.next = e, e.next = s, t.lastEffect = e)), e
}

function Vm() {
    return mt().memoizedState
}

function ga(e, t, r, s) {
    var a = Ct();
    pe.flags |= e, a.memoizedState = js(1 | t, r, void 0, s === void 0 ? null : s)
}

function pl(e, t, r, s) {
    var a = mt();
    s = s === void 0 ? null : s;
    var l = void 0;
    if (we !== null) {
        var i = we.memoizedState;
        if (l = i.destroy, s !== null && Cc(s, i.deps)) {
            a.memoizedState = js(t, r, l, s);
            return
        }
    }
    pe.flags |= e, a.memoizedState = js(1 | t, r, l, s)
}

function nd(e, t) {
    return ga(8390656, 8, e, t)
}

function _c(e, t) {
    return pl(2048, 8, e, t)
}

function Wm(e, t) {
    return pl(4, 2, e, t)
}

function Hm(e, t) {
    return pl(4, 4, e, t)
}

function Jm(e, t) {
    if (typeof t == "function") return e = e(), t(e), function () {
        t(null)
    };
    if (t != null) return e = e(), t.current = e, function () {
        t.current = null
    }
}

function qm(e, t, r) {
    return r = r != null ? r.concat([e]) : null, pl(4, 4, Jm.bind(null, t, e), r)
}

function Oc() {
}

function Qm(e, t) {
    var r = mt();
    t = t === void 0 ? null : t;
    var s = r.memoizedState;
    return s !== null && t !== null && Cc(t, s[1]) ? s[0] : (r.memoizedState = [e, t], e)
}

function Km(e, t) {
    var r = mt();
    t = t === void 0 ? null : t;
    var s = r.memoizedState;
    return s !== null && t !== null && Cc(t, s[1]) ? s[0] : (e = e(), r.memoizedState = [e, t], e)
}

function Gm(e, t, r) {
    return Mr & 21 ? (Nt(r, t) || (r = tm(), pe.lanes |= r, zr |= r, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, We = !0), e.memoizedState = r)
}

function Yg(e, t) {
    var r = re;
    re = r !== 0 && 4 > r ? r : 4, e(!0);
    var s = vi.transition;
    vi.transition = {};
    try {
        e(!1), t()
    } finally {
        re = r, vi.transition = s
    }
}

function Xm() {
    return mt().memoizedState
}

function Zg(e, t, r) {
    var s = mr(e);
    if (r = {
        lane: s,
        action: r,
        hasEagerState: !1,
        eagerState: null,
        next: null
    }, Ym(e)) Zm(t, r); else if (r = Im(e, t, r, s), r !== null) {
        var a = Ue();
        jt(r, e, s, a), ep(r, t, s)
    }
}

function e0(e, t, r) {
    var s = mr(e), a = {lane: s, action: r, hasEagerState: !1, eagerState: null, next: null};
    if (Ym(e)) Zm(t, a); else {
        var l = e.alternate;
        if (e.lanes === 0 && (l === null || l.lanes === 0) && (l = t.lastRenderedReducer, l !== null)) try {
            var i = t.lastRenderedState, o = l(i, r);
            if (a.hasEagerState = !0, a.eagerState = o, Nt(o, i)) {
                var c = t.interleaved;
                c === null ? (a.next = a, jc(t)) : (a.next = c.next, c.next = a), t.interleaved = a;
                return
            }
        } catch {
        } finally {
        }
        r = Im(e, t, a, s), r !== null && (a = Ue(), jt(r, e, s, a), ep(r, t, s))
    }
}

function Ym(e) {
    var t = e.alternate;
    return e === pe || t !== null && t === pe
}

function Zm(e, t) {
    rs = Ha = !0;
    var r = e.pending;
    r === null ? t.next = t : (t.next = r.next, r.next = t), e.pending = t
}

function ep(e, t, r) {
    if (r & 4194240) {
        var s = t.lanes;
        s &= e.pendingLanes, r |= s, t.lanes = r, ic(e, r)
    }
}

var Ja = {
    readContext: ft,
    useCallback: Ie,
    useContext: Ie,
    useEffect: Ie,
    useImperativeHandle: Ie,
    useInsertionEffect: Ie,
    useLayoutEffect: Ie,
    useMemo: Ie,
    useReducer: Ie,
    useRef: Ie,
    useState: Ie,
    useDebugValue: Ie,
    useDeferredValue: Ie,
    useTransition: Ie,
    useMutableSource: Ie,
    useSyncExternalStore: Ie,
    useId: Ie,
    unstable_isNewReconciler: !1
}, t0 = {
    readContext: ft, useCallback: function (e, t) {
        return Ct().memoizedState = [e, t === void 0 ? null : t], e
    }, useContext: ft, useEffect: nd, useImperativeHandle: function (e, t, r) {
        return r = r != null ? r.concat([e]) : null, ga(4194308, 4, Jm.bind(null, t, e), r)
    }, useLayoutEffect: function (e, t) {
        return ga(4194308, 4, e, t)
    }, useInsertionEffect: function (e, t) {
        return ga(4, 2, e, t)
    }, useMemo: function (e, t) {
        var r = Ct();
        return t = t === void 0 ? null : t, e = e(), r.memoizedState = [e, t], e
    }, useReducer: function (e, t, r) {
        var s = Ct();
        return t = r !== void 0 ? r(t) : t, s.memoizedState = s.baseState = t, e = {
            pending: null,
            interleaved: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: t
        }, s.queue = e, e = e.dispatch = Zg.bind(null, pe, e), [s.memoizedState, e]
    }, useRef: function (e) {
        var t = Ct();
        return e = {current: e}, t.memoizedState = e
    }, useState: rd, useDebugValue: Oc, useDeferredValue: function (e) {
        return Ct().memoizedState = e
    }, useTransition: function () {
        var e = rd(!1), t = e[0];
        return e = Yg.bind(null, e[1]), Ct().memoizedState = e, [t, e]
    }, useMutableSource: function () {
    }, useSyncExternalStore: function (e, t, r) {
        var s = pe, a = Ct();
        if (de) {
            if (r === void 0) throw Error(I(407));
            r = r()
        } else {
            if (r = t(), Pe === null) throw Error(I(349));
            Mr & 30 || Mm(s, t, r)
        }
        a.memoizedState = r;
        var l = {value: r, getSnapshot: t};
        return a.queue = l, nd(Um.bind(null, s, l, e), [e]), s.flags |= 2048, js(9, zm.bind(null, s, l, r, t), void 0, null), r
    }, useId: function () {
        var e = Ct(), t = Pe.identifierPrefix;
        if (de) {
            var r = Mt, s = Dt;
            r = (s & ~(1 << 32 - bt(s) - 1)).toString(32) + r, t = ":" + t + "R" + r, r = vs++, 0 < r && (t += "H" + r.toString(32)), t += ":"
        } else r = Xg++, t = ":" + t + "r" + r.toString(32) + ":";
        return e.memoizedState = t
    }, unstable_isNewReconciler: !1
}, r0 = {
    readContext: ft,
    useCallback: Qm,
    useContext: ft,
    useEffect: _c,
    useImperativeHandle: qm,
    useInsertionEffect: Wm,
    useLayoutEffect: Hm,
    useMemo: Km,
    useReducer: bi,
    useRef: Vm,
    useState: function () {
        return bi(bs)
    },
    useDebugValue: Oc,
    useDeferredValue: function (e) {
        var t = mt();
        return Gm(t, we.memoizedState, e)
    },
    useTransition: function () {
        var e = bi(bs)[0], t = mt().memoizedState;
        return [e, t]
    },
    useMutableSource: $m,
    useSyncExternalStore: Dm,
    useId: Xm,
    unstable_isNewReconciler: !1
}, n0 = {
    readContext: ft,
    useCallback: Qm,
    useContext: ft,
    useEffect: _c,
    useImperativeHandle: qm,
    useInsertionEffect: Wm,
    useLayoutEffect: Hm,
    useMemo: Km,
    useReducer: ji,
    useRef: Vm,
    useState: function () {
        return ji(bs)
    },
    useDebugValue: Oc,
    useDeferredValue: function (e) {
        var t = mt();
        return we === null ? t.memoizedState = e : Gm(t, we.memoizedState, e)
    },
    useTransition: function () {
        var e = ji(bs)[0], t = mt().memoizedState;
        return [e, t]
    },
    useMutableSource: $m,
    useSyncExternalStore: Dm,
    useId: Xm,
    unstable_isNewReconciler: !1
};

function xt(e, t) {
    if (e && e.defaultProps) {
        t = he({}, t), e = e.defaultProps;
        for (var r in e) t[r] === void 0 && (t[r] = e[r]);
        return t
    }
    return t
}

function go(e, t, r, s) {
    t = e.memoizedState, r = r(s, t), r = r == null ? t : he({}, t, r), e.memoizedState = r, e.lanes === 0 && (e.updateQueue.baseState = r)
}

var hl = {
    isMounted: function (e) {
        return (e = e._reactInternals) ? Hr(e) === e : !1
    }, enqueueSetState: function (e, t, r) {
        e = e._reactInternals;
        var s = Ue(), a = mr(e), l = zt(s, a);
        l.payload = t, r != null && (l.callback = r), t = dr(e, l, a), t !== null && (jt(t, e, a, s), ha(t, e, a))
    }, enqueueReplaceState: function (e, t, r) {
        e = e._reactInternals;
        var s = Ue(), a = mr(e), l = zt(s, a);
        l.tag = 1, l.payload = t, r != null && (l.callback = r), t = dr(e, l, a), t !== null && (jt(t, e, a, s), ha(t, e, a))
    }, enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var r = Ue(), s = mr(e), a = zt(r, s);
        a.tag = 2, t != null && (a.callback = t), t = dr(e, a, s), t !== null && (jt(t, e, s, r), ha(t, e, s))
    }
};

function sd(e, t, r, s, a, l, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(s, l, i) : t.prototype && t.prototype.isPureReactComponent ? !ms(r, s) || !ms(a, l) : !0
}

function tp(e, t, r) {
    var s = !1, a = vr, l = t.contextType;
    return typeof l == "object" && l !== null ? l = ft(l) : (a = Je(t) ? $r : Me.current, s = t.contextTypes, l = (s = s != null) ? vn(e, a) : vr), t = new t(r, l), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = hl, e.stateNode = t, t._reactInternals = e, s && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = a, e.__reactInternalMemoizedMaskedChildContext = l), t
}

function ad(e, t, r, s) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(r, s), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(r, s), t.state !== e && hl.enqueueReplaceState(t, t.state, null)
}

function yo(e, t, r, s) {
    var a = e.stateNode;
    a.props = r, a.state = e.memoizedState, a.refs = {}, Nc(e);
    var l = t.contextType;
    typeof l == "object" && l !== null ? a.context = ft(l) : (l = Je(t) ? $r : Me.current, a.context = vn(e, l)), a.state = e.memoizedState, l = t.getDerivedStateFromProps, typeof l == "function" && (go(e, t, l, r), a.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (t = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), t !== a.state && hl.enqueueReplaceState(a, a.state, null), Va(e, r, a, s), a.state = e.memoizedState), typeof a.componentDidMount == "function" && (e.flags |= 4194308)
}

function wn(e, t) {
    try {
        var r = "", s = t;
        do r += Rx(s), s = s.return; while (s);
        var a = r
    } catch (l) {
        a = `
Error generating stack: ` + l.message + `
` + l.stack
    }
    return {value: e, source: t, stack: a, digest: null}
}

function Ni(e, t, r) {
    return {value: e, source: null, stack: r ?? null, digest: t ?? null}
}

function vo(e, t) {
    try {
        console.error(t.value)
    } catch (r) {
        setTimeout(function () {
            throw r
        })
    }
}

var s0 = typeof WeakMap == "function" ? WeakMap : Map;

function rp(e, t, r) {
    r = zt(-1, r), r.tag = 3, r.payload = {element: null};
    var s = t.value;
    return r.callback = function () {
        Qa || (Qa = !0, _o = s), vo(e, t)
    }, r
}

function np(e, t, r) {
    r = zt(-1, r), r.tag = 3;
    var s = e.type.getDerivedStateFromError;
    if (typeof s == "function") {
        var a = t.value;
        r.payload = function () {
            return s(a)
        }, r.callback = function () {
            vo(e, t)
        }
    }
    var l = e.stateNode;
    return l !== null && typeof l.componentDidCatch == "function" && (r.callback = function () {
        vo(e, t), typeof s != "function" && (fr === null ? fr = new Set([this]) : fr.add(this));
        var i = t.stack;
        this.componentDidCatch(t.value, {componentStack: i !== null ? i : ""})
    }), r
}

function ld(e, t, r) {
    var s = e.pingCache;
    if (s === null) {
        s = e.pingCache = new s0;
        var a = new Set;
        s.set(t, a)
    } else a = s.get(t), a === void 0 && (a = new Set, s.set(t, a));
    a.has(r) || (a.add(r), e = y0.bind(null, e, t, r), t.then(e, e))
}

function id(e) {
    do {
        var t;
        if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
        e = e.return
    } while (e !== null);
    return null
}

function od(e, t, r, s, a) {
    return e.mode & 1 ? (e.flags |= 65536, e.lanes = a, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, r.flags |= 131072, r.flags &= -52805, r.tag === 1 && (r.alternate === null ? r.tag = 17 : (t = zt(-1, 1), t.tag = 2, dr(r, t, 1))), r.lanes |= 1), e)
}

var a0 = Jt.ReactCurrentOwner, We = !1;

function ze(e, t, r, s) {
    t.child = e === null ? Tm(t, null, r, s) : jn(t, e.child, r, s)
}

function cd(e, t, r, s, a) {
    r = r.render;
    var l = t.ref;
    return pn(t, a), s = Ec(e, t, r, s, l, a), r = Pc(), e !== null && !We ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~a, Vt(e, t, a)) : (de && r && hc(t), t.flags |= 1, ze(e, t, s, a), t.child)
}

function ud(e, t, r, s, a) {
    if (e === null) {
        var l = r.type;
        return typeof l == "function" && !Mc(l) && l.defaultProps === void 0 && r.compare === null && r.defaultProps === void 0 ? (t.tag = 15, t.type = l, sp(e, t, l, s, a)) : (e = ja(r.type, null, s, t, t.mode, a), e.ref = t.ref, e.return = t, t.child = e)
    }
    if (l = e.child, !(e.lanes & a)) {
        var i = l.memoizedProps;
        if (r = r.compare, r = r !== null ? r : ms, r(i, s) && e.ref === t.ref) return Vt(e, t, a)
    }
    return t.flags |= 1, e = pr(l, s), e.ref = t.ref, e.return = t, t.child = e
}

function sp(e, t, r, s, a) {
    if (e !== null) {
        var l = e.memoizedProps;
        if (ms(l, s) && e.ref === t.ref) if (We = !1, t.pendingProps = s = l, (e.lanes & a) !== 0) e.flags & 131072 && (We = !0); else return t.lanes = e.lanes, Vt(e, t, a)
    }
    return bo(e, t, r, s, a)
}

function ap(e, t, r) {
    var s = t.pendingProps, a = s.children, l = e !== null ? e.memoizedState : null;
    if (s.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = {
        baseLanes: 0,
        cachePool: null,
        transitions: null
    }, ae(cn, Ge), Ge |= r; else {
        if (!(r & 1073741824)) return e = l !== null ? l.baseLanes | r : r, t.lanes = t.childLanes = 1073741824, t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null
        }, t.updateQueue = null, ae(cn, Ge), Ge |= e, null;
        t.memoizedState = {
            baseLanes: 0,
            cachePool: null,
            transitions: null
        }, s = l !== null ? l.baseLanes : r, ae(cn, Ge), Ge |= s
    } else l !== null ? (s = l.baseLanes | r, t.memoizedState = null) : s = r, ae(cn, Ge), Ge |= s;
    return ze(e, t, a, r), t.child
}

function lp(e, t) {
    var r = t.ref;
    (e === null && r !== null || e !== null && e.ref !== r) && (t.flags |= 512, t.flags |= 2097152)
}

function bo(e, t, r, s, a) {
    var l = Je(r) ? $r : Me.current;
    return l = vn(t, l), pn(t, a), r = Ec(e, t, r, s, l, a), s = Pc(), e !== null && !We ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~a, Vt(e, t, a)) : (de && s && hc(t), t.flags |= 1, ze(e, t, r, a), t.child)
}

function dd(e, t, r, s, a) {
    if (Je(r)) {
        var l = !0;
        Ma(t)
    } else l = !1;
    if (pn(t, a), t.stateNode === null) ya(e, t), tp(t, r, s), yo(t, r, s, a), s = !0; else if (e === null) {
        var i = t.stateNode, o = t.memoizedProps;
        i.props = o;
        var c = i.context, u = r.contextType;
        typeof u == "object" && u !== null ? u = ft(u) : (u = Je(r) ? $r : Me.current, u = vn(t, u));
        var f = r.getDerivedStateFromProps,
            m = typeof f == "function" || typeof i.getSnapshotBeforeUpdate == "function";
        m || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (o !== s || c !== u) && ad(t, i, s, u), Zt = !1;
        var y = t.memoizedState;
        i.state = y, Va(t, s, i, a), c = t.memoizedState, o !== s || y !== c || He.current || Zt ? (typeof f == "function" && (go(t, r, f, s), c = t.memoizedState), (o = Zt || sd(t, r, o, s, y, c, u)) ? (m || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = s, t.memoizedState = c), i.props = s, i.state = c, i.context = u, s = o) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), s = !1)
    } else {
        i = t.stateNode, Am(e, t), o = t.memoizedProps, u = t.type === t.elementType ? o : xt(t.type, o), i.props = u, m = t.pendingProps, y = i.context, c = r.contextType, typeof c == "object" && c !== null ? c = ft(c) : (c = Je(r) ? $r : Me.current, c = vn(t, c));
        var b = r.getDerivedStateFromProps;
        (f = typeof b == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (o !== m || y !== c) && ad(t, i, s, c), Zt = !1, y = t.memoizedState, i.state = y, Va(t, s, i, a);
        var p = t.memoizedState;
        o !== m || y !== p || He.current || Zt ? (typeof b == "function" && (go(t, r, b, s), p = t.memoizedState), (u = Zt || sd(t, r, u, s, y, p, c) || !1) ? (f || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(s, p, c), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(s, p, c)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || o === e.memoizedProps && y === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && y === e.memoizedState || (t.flags |= 1024), t.memoizedProps = s, t.memoizedState = p), i.props = s, i.state = p, i.context = c, s = u) : (typeof i.componentDidUpdate != "function" || o === e.memoizedProps && y === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && y === e.memoizedState || (t.flags |= 1024), s = !1)
    }
    return jo(e, t, r, s, l, a)
}

function jo(e, t, r, s, a, l) {
    lp(e, t);
    var i = (t.flags & 128) !== 0;
    if (!s && !i) return a && Gu(t, r, !1), Vt(e, t, l);
    s = t.stateNode, a0.current = t;
    var o = i && typeof r.getDerivedStateFromError != "function" ? null : s.render();
    return t.flags |= 1, e !== null && i ? (t.child = jn(t, e.child, null, l), t.child = jn(t, null, o, l)) : ze(e, t, o, l), t.memoizedState = s.state, a && Gu(t, r, !0), t.child
}

function ip(e) {
    var t = e.stateNode;
    t.pendingContext ? Ku(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Ku(e, t.context, !1), wc(e, t.containerInfo)
}

function fd(e, t, r, s, a) {
    return bn(), gc(a), t.flags |= 256, ze(e, t, r, s), t.child
}

var No = {dehydrated: null, treeContext: null, retryLane: 0};

function wo(e) {
    return {baseLanes: e, cachePool: null, transitions: null}
}

function op(e, t, r) {
    var s = t.pendingProps, a = me.current, l = !1, i = (t.flags & 128) !== 0, o;
    if ((o = i) || (o = e !== null && e.memoizedState === null ? !1 : (a & 2) !== 0), o ? (l = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (a |= 1), ae(me, a & 1), e === null) return ho(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (i = s.children, e = s.fallback, l ? (s = t.mode, l = t.child, i = {
        mode: "hidden",
        children: i
    }, !(s & 1) && l !== null ? (l.childLanes = 0, l.pendingProps = i) : l = yl(i, s, 0, null), e = Ar(e, s, r, null), l.return = t, e.return = t, l.sibling = e, t.child = l, t.child.memoizedState = wo(r), t.memoizedState = No, e) : Rc(t, i));
    if (a = e.memoizedState, a !== null && (o = a.dehydrated, o !== null)) return l0(e, t, i, s, o, a, r);
    if (l) {
        l = s.fallback, i = t.mode, a = e.child, o = a.sibling;
        var c = {mode: "hidden", children: s.children};
        return !(i & 1) && t.child !== a ? (s = t.child, s.childLanes = 0, s.pendingProps = c, t.deletions = null) : (s = pr(a, c), s.subtreeFlags = a.subtreeFlags & 14680064), o !== null ? l = pr(o, l) : (l = Ar(l, i, r, null), l.flags |= 2), l.return = t, s.return = t, s.sibling = l, t.child = s, s = l, l = t.child, i = e.child.memoizedState, i = i === null ? wo(r) : {
            baseLanes: i.baseLanes | r,
            cachePool: null,
            transitions: i.transitions
        }, l.memoizedState = i, l.childLanes = e.childLanes & ~r, t.memoizedState = No, s
    }
    return l = e.child, e = l.sibling, s = pr(l, {
        mode: "visible",
        children: s.children
    }), !(t.mode & 1) && (s.lanes = r), s.return = t, s.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = s, t.memoizedState = null, s
}

function Rc(e, t) {
    return t = yl({mode: "visible", children: t}, e.mode, 0, null), t.return = e, e.child = t
}

function sa(e, t, r, s) {
    return s !== null && gc(s), jn(t, e.child, null, r), e = Rc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e
}

function l0(e, t, r, s, a, l, i) {
    if (r) return t.flags & 256 ? (t.flags &= -257, s = Ni(Error(I(422))), sa(e, t, i, s)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (l = s.fallback, a = t.mode, s = yl({
        mode: "visible",
        children: s.children
    }, a, 0, null), l = Ar(l, a, i, null), l.flags |= 2, s.return = t, l.return = t, s.sibling = l, t.child = s, t.mode & 1 && jn(t, e.child, null, i), t.child.memoizedState = wo(i), t.memoizedState = No, l);
    if (!(t.mode & 1)) return sa(e, t, i, null);
    if (a.data === "$!") {
        if (s = a.nextSibling && a.nextSibling.dataset, s) var o = s.dgst;
        return s = o, l = Error(I(419)), s = Ni(l, s, void 0), sa(e, t, i, s)
    }
    if (o = (i & e.childLanes) !== 0, We || o) {
        if (s = Pe, s !== null) {
            switch (i & -i) {
                case 4:
                    a = 2;
                    break;
                case 16:
                    a = 8;
                    break;
                case 64:
                case 128:
                case 256:
                case 512:
                case 1024:
                case 2048:
                case 4096:
                case 8192:
                case 16384:
                case 32768:
                case 65536:
                case 131072:
                case 262144:
                case 524288:
                case 1048576:
                case 2097152:
                case 4194304:
                case 8388608:
                case 16777216:
                case 33554432:
                case 67108864:
                    a = 32;
                    break;
                case 536870912:
                    a = 268435456;
                    break;
                default:
                    a = 0
            }
            a = a & (s.suspendedLanes | i) ? 0 : a, a !== 0 && a !== l.retryLane && (l.retryLane = a, Bt(e, a), jt(s, e, a, -1))
        }
        return Dc(), s = Ni(Error(I(421))), sa(e, t, i, s)
    }
    return a.data === "$?" ? (t.flags |= 128, t.child = e.child, t = v0.bind(null, e), a._reactRetry = t, null) : (e = l.treeContext, Xe = ur(a.nextSibling), Ye = t, de = !0, yt = null, e !== null && (ot[ct++] = Dt, ot[ct++] = Mt, ot[ct++] = Dr, Dt = e.id, Mt = e.overflow, Dr = t), t = Rc(t, s.children), t.flags |= 4096, t)
}

function md(e, t, r) {
    e.lanes |= t;
    var s = e.alternate;
    s !== null && (s.lanes |= t), xo(e.return, t, r)
}

function wi(e, t, r, s, a) {
    var l = e.memoizedState;
    l === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: s,
        tail: r,
        tailMode: a
    } : (l.isBackwards = t, l.rendering = null, l.renderingStartTime = 0, l.last = s, l.tail = r, l.tailMode = a)
}

function cp(e, t, r) {
    var s = t.pendingProps, a = s.revealOrder, l = s.tail;
    if (ze(e, t, s.children, r), s = me.current, s & 2) s = s & 1 | 2, t.flags |= 128; else {
        if (e !== null && e.flags & 128) e:for (e = t.child; e !== null;) {
            if (e.tag === 13) e.memoizedState !== null && md(e, r, t); else if (e.tag === 19) md(e, r, t); else if (e.child !== null) {
                e.child.return = e, e = e.child;
                continue
            }
            if (e === t) break e;
            for (; e.sibling === null;) {
                if (e.return === null || e.return === t) break e;
                e = e.return
            }
            e.sibling.return = e.return, e = e.sibling
        }
        s &= 1
    }
    if (ae(me, s), !(t.mode & 1)) t.memoizedState = null; else switch (a) {
        case"forwards":
            for (r = t.child, a = null; r !== null;) e = r.alternate, e !== null && Wa(e) === null && (a = r), r = r.sibling;
            r = a, r === null ? (a = t.child, t.child = null) : (a = r.sibling, r.sibling = null), wi(t, !1, a, r, l);
            break;
        case"backwards":
            for (r = null, a = t.child, t.child = null; a !== null;) {
                if (e = a.alternate, e !== null && Wa(e) === null) {
                    t.child = a;
                    break
                }
                e = a.sibling, a.sibling = r, r = a, a = e
            }
            wi(t, !0, r, null, l);
            break;
        case"together":
            wi(t, !1, null, null, void 0);
            break;
        default:
            t.memoizedState = null
    }
    return t.child
}

function ya(e, t) {
    !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2)
}

function Vt(e, t, r) {
    if (e !== null && (t.dependencies = e.dependencies), zr |= t.lanes, !(r & t.childLanes)) return null;
    if (e !== null && t.child !== e.child) throw Error(I(153));
    if (t.child !== null) {
        for (e = t.child, r = pr(e, e.pendingProps), t.child = r, r.return = t; e.sibling !== null;) e = e.sibling, r = r.sibling = pr(e, e.pendingProps), r.return = t;
        r.sibling = null
    }
    return t.child
}

function i0(e, t, r) {
    switch (t.tag) {
        case 3:
            ip(t), bn();
            break;
        case 5:
            Lm(t);
            break;
        case 1:
            Je(t.type) && Ma(t);
            break;
        case 4:
            wc(t, t.stateNode.containerInfo);
            break;
        case 10:
            var s = t.type._context, a = t.memoizedProps.value;
            ae(Fa, s._currentValue), s._currentValue = a;
            break;
        case 13:
            if (s = t.memoizedState, s !== null) return s.dehydrated !== null ? (ae(me, me.current & 1), t.flags |= 128, null) : r & t.child.childLanes ? op(e, t, r) : (ae(me, me.current & 1), e = Vt(e, t, r), e !== null ? e.sibling : null);
            ae(me, me.current & 1);
            break;
        case 19:
            if (s = (r & t.childLanes) !== 0, e.flags & 128) {
                if (s) return cp(e, t, r);
                t.flags |= 128
            }
            if (a = t.memoizedState, a !== null && (a.rendering = null, a.tail = null, a.lastEffect = null), ae(me, me.current), s) break;
            return null;
        case 22:
        case 23:
            return t.lanes = 0, ap(e, t, r)
    }
    return Vt(e, t, r)
}

var up, ko, dp, fp;
up = function (e, t) {
    for (var r = t.child; r !== null;) {
        if (r.tag === 5 || r.tag === 6) e.appendChild(r.stateNode); else if (r.tag !== 4 && r.child !== null) {
            r.child.return = r, r = r.child;
            continue
        }
        if (r === t) break;
        for (; r.sibling === null;) {
            if (r.return === null || r.return === t) return;
            r = r.return
        }
        r.sibling.return = r.return, r = r.sibling
    }
};
ko = function () {
};
dp = function (e, t, r, s) {
    var a = e.memoizedProps;
    if (a !== s) {
        e = t.stateNode, Rr(Rt.current);
        var l = null;
        switch (r) {
            case"input":
                a = Hi(e, a), s = Hi(e, s), l = [];
                break;
            case"select":
                a = he({}, a, {value: void 0}), s = he({}, s, {value: void 0}), l = [];
                break;
            case"textarea":
                a = Qi(e, a), s = Qi(e, s), l = [];
                break;
            default:
                typeof a.onClick != "function" && typeof s.onClick == "function" && (e.onclick = $a)
        }
        Gi(r, s);
        var i;
        r = null;
        for (u in a) if (!s.hasOwnProperty(u) && a.hasOwnProperty(u) && a[u] != null) if (u === "style") {
            var o = a[u];
            for (i in o) o.hasOwnProperty(i) && (r || (r = {}), r[i] = "")
        } else u !== "dangerouslySetInnerHTML" && u !== "children" && u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && u !== "autoFocus" && (ls.hasOwnProperty(u) ? l || (l = []) : (l = l || []).push(u, null));
        for (u in s) {
            var c = s[u];
            if (o = a != null ? a[u] : void 0, s.hasOwnProperty(u) && c !== o && (c != null || o != null)) if (u === "style") if (o) {
                for (i in o) !o.hasOwnProperty(i) || c && c.hasOwnProperty(i) || (r || (r = {}), r[i] = "");
                for (i in c) c.hasOwnProperty(i) && o[i] !== c[i] && (r || (r = {}), r[i] = c[i])
            } else r || (l || (l = []), l.push(u, r)), r = c; else u === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, o = o ? o.__html : void 0, c != null && o !== c && (l = l || []).push(u, c)) : u === "children" ? typeof c != "string" && typeof c != "number" || (l = l || []).push(u, "" + c) : u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && (ls.hasOwnProperty(u) ? (c != null && u === "onScroll" && le("scroll", e), l || o === c || (l = [])) : (l = l || []).push(u, c))
        }
        r && (l = l || []).push("style", r);
        var u = l;
        (t.updateQueue = u) && (t.flags |= 4)
    }
};
fp = function (e, t, r, s) {
    r !== s && (t.flags |= 4)
};

function Bn(e, t) {
    if (!de) switch (e.tailMode) {
        case"hidden":
            t = e.tail;
            for (var r = null; t !== null;) t.alternate !== null && (r = t), t = t.sibling;
            r === null ? e.tail = null : r.sibling = null;
            break;
        case"collapsed":
            r = e.tail;
            for (var s = null; r !== null;) r.alternate !== null && (s = r), r = r.sibling;
            s === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : s.sibling = null
    }
}

function Ae(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, r = 0, s = 0;
    if (t) for (var a = e.child; a !== null;) r |= a.lanes | a.childLanes, s |= a.subtreeFlags & 14680064, s |= a.flags & 14680064, a.return = e, a = a.sibling; else for (a = e.child; a !== null;) r |= a.lanes | a.childLanes, s |= a.subtreeFlags, s |= a.flags, a.return = e, a = a.sibling;
    return e.subtreeFlags |= s, e.childLanes = r, t
}

function o0(e, t, r) {
    var s = t.pendingProps;
    switch (xc(t), t.tag) {
        case 2:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
            return Ae(t), null;
        case 1:
            return Je(t.type) && Da(), Ae(t), null;
        case 3:
            return s = t.stateNode, Nn(), ie(He), ie(Me), Sc(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), (e === null || e.child === null) && (ra(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, yt !== null && (To(yt), yt = null))), ko(e, t), Ae(t), null;
        case 5:
            kc(t);
            var a = Rr(ys.current);
            if (r = t.type, e !== null && t.stateNode != null) dp(e, t, r, s, a), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152); else {
                if (!s) {
                    if (t.stateNode === null) throw Error(I(166));
                    return Ae(t), null
                }
                if (e = Rr(Rt.current), ra(t)) {
                    s = t.stateNode, r = t.type;
                    var l = t.memoizedProps;
                    switch (s[Et] = t, s[xs] = l, e = (t.mode & 1) !== 0, r) {
                        case"dialog":
                            le("cancel", s), le("close", s);
                            break;
                        case"iframe":
                        case"object":
                        case"embed":
                            le("load", s);
                            break;
                        case"video":
                        case"audio":
                            for (a = 0; a < Kn.length; a++) le(Kn[a], s);
                            break;
                        case"source":
                            le("error", s);
                            break;
                        case"img":
                        case"image":
                        case"link":
                            le("error", s), le("load", s);
                            break;
                        case"details":
                            le("toggle", s);
                            break;
                        case"input":
                            Nu(s, l), le("invalid", s);
                            break;
                        case"select":
                            s._wrapperState = {wasMultiple: !!l.multiple}, le("invalid", s);
                            break;
                        case"textarea":
                            ku(s, l), le("invalid", s)
                    }
                    Gi(r, l), a = null;
                    for (var i in l) if (l.hasOwnProperty(i)) {
                        var o = l[i];
                        i === "children" ? typeof o == "string" ? s.textContent !== o && (l.suppressHydrationWarning !== !0 && ta(s.textContent, o, e), a = ["children", o]) : typeof o == "number" && s.textContent !== "" + o && (l.suppressHydrationWarning !== !0 && ta(s.textContent, o, e), a = ["children", "" + o]) : ls.hasOwnProperty(i) && o != null && i === "onScroll" && le("scroll", s)
                    }
                    switch (r) {
                        case"input":
                            qs(s), wu(s, l, !0);
                            break;
                        case"textarea":
                            qs(s), Su(s);
                            break;
                        case"select":
                        case"option":
                            break;
                        default:
                            typeof l.onClick == "function" && (s.onclick = $a)
                    }
                    s = a, t.updateQueue = s, s !== null && (t.flags |= 4)
                } else {
                    i = a.nodeType === 9 ? a : a.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Uf(r)), e === "http://www.w3.org/1999/xhtml" ? r === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof s.is == "string" ? e = i.createElement(r, {is: s.is}) : (e = i.createElement(r), r === "select" && (i = e, s.multiple ? i.multiple = !0 : s.size && (i.size = s.size))) : e = i.createElementNS(e, r), e[Et] = t, e[xs] = s, up(e, t, !1, !1), t.stateNode = e;
                    e:{
                        switch (i = Xi(r, s), r) {
                            case"dialog":
                                le("cancel", e), le("close", e), a = s;
                                break;
                            case"iframe":
                            case"object":
                            case"embed":
                                le("load", e), a = s;
                                break;
                            case"video":
                            case"audio":
                                for (a = 0; a < Kn.length; a++) le(Kn[a], e);
                                a = s;
                                break;
                            case"source":
                                le("error", e), a = s;
                                break;
                            case"img":
                            case"image":
                            case"link":
                                le("error", e), le("load", e), a = s;
                                break;
                            case"details":
                                le("toggle", e), a = s;
                                break;
                            case"input":
                                Nu(e, s), a = Hi(e, s), le("invalid", e);
                                break;
                            case"option":
                                a = s;
                                break;
                            case"select":
                                e._wrapperState = {wasMultiple: !!s.multiple}, a = he({}, s, {value: void 0}), le("invalid", e);
                                break;
                            case"textarea":
                                ku(e, s), a = Qi(e, s), le("invalid", e);
                                break;
                            default:
                                a = s
                        }
                        Gi(r, a), o = a;
                        for (l in o) if (o.hasOwnProperty(l)) {
                            var c = o[l];
                            l === "style" ? Vf(e, c) : l === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && Ff(e, c)) : l === "children" ? typeof c == "string" ? (r !== "textarea" || c !== "") && is(e, c) : typeof c == "number" && is(e, "" + c) : l !== "suppressContentEditableWarning" && l !== "suppressHydrationWarning" && l !== "autoFocus" && (ls.hasOwnProperty(l) ? c != null && l === "onScroll" && le("scroll", e) : c != null && tc(e, l, c, i))
                        }
                        switch (r) {
                            case"input":
                                qs(e), wu(e, s, !1);
                                break;
                            case"textarea":
                                qs(e), Su(e);
                                break;
                            case"option":
                                s.value != null && e.setAttribute("value", "" + yr(s.value));
                                break;
                            case"select":
                                e.multiple = !!s.multiple, l = s.value, l != null ? un(e, !!s.multiple, l, !1) : s.defaultValue != null && un(e, !!s.multiple, s.defaultValue, !0);
                                break;
                            default:
                                typeof a.onClick == "function" && (e.onclick = $a)
                        }
                        switch (r) {
                            case"button":
                            case"input":
                            case"select":
                            case"textarea":
                                s = !!s.autoFocus;
                                break e;
                            case"img":
                                s = !0;
                                break e;
                            default:
                                s = !1
                        }
                    }
                    s && (t.flags |= 4)
                }
                t.ref !== null && (t.flags |= 512, t.flags |= 2097152)
            }
            return Ae(t), null;
        case 6:
            if (e && t.stateNode != null) fp(e, t, e.memoizedProps, s); else {
                if (typeof s != "string" && t.stateNode === null) throw Error(I(166));
                if (r = Rr(ys.current), Rr(Rt.current), ra(t)) {
                    if (s = t.stateNode, r = t.memoizedProps, s[Et] = t, (l = s.nodeValue !== r) && (e = Ye, e !== null)) switch (e.tag) {
                        case 3:
                            ta(s.nodeValue, r, (e.mode & 1) !== 0);
                            break;
                        case 5:
                            e.memoizedProps.suppressHydrationWarning !== !0 && ta(s.nodeValue, r, (e.mode & 1) !== 0)
                    }
                    l && (t.flags |= 4)
                } else s = (r.nodeType === 9 ? r : r.ownerDocument).createTextNode(s), s[Et] = t, t.stateNode = s
            }
            return Ae(t), null;
        case 13:
            if (ie(me), s = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
                if (de && Xe !== null && t.mode & 1 && !(t.flags & 128)) Om(), bn(), t.flags |= 98560, l = !1; else if (l = ra(t), s !== null && s.dehydrated !== null) {
                    if (e === null) {
                        if (!l) throw Error(I(318));
                        if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(I(317));
                        l[Et] = t
                    } else bn(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
                    Ae(t), l = !1
                } else yt !== null && (To(yt), yt = null), l = !0;
                if (!l) return t.flags & 65536 ? t : null
            }
            return t.flags & 128 ? (t.lanes = r, t) : (s = s !== null, s !== (e !== null && e.memoizedState !== null) && s && (t.child.flags |= 8192, t.mode & 1 && (e === null || me.current & 1 ? Se === 0 && (Se = 3) : Dc())), t.updateQueue !== null && (t.flags |= 4), Ae(t), null);
        case 4:
            return Nn(), ko(e, t), e === null && ps(t.stateNode.containerInfo), Ae(t), null;
        case 10:
            return bc(t.type._context), Ae(t), null;
        case 17:
            return Je(t.type) && Da(), Ae(t), null;
        case 19:
            if (ie(me), l = t.memoizedState, l === null) return Ae(t), null;
            if (s = (t.flags & 128) !== 0, i = l.rendering, i === null) if (s) Bn(l, !1); else {
                if (Se !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
                    if (i = Wa(e), i !== null) {
                        for (t.flags |= 128, Bn(l, !1), s = i.updateQueue, s !== null && (t.updateQueue = s, t.flags |= 4), t.subtreeFlags = 0, s = r, r = t.child; r !== null;) l = r, e = s, l.flags &= 14680066, i = l.alternate, i === null ? (l.childLanes = 0, l.lanes = e, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = i.childLanes, l.lanes = i.lanes, l.child = i.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = i.memoizedProps, l.memoizedState = i.memoizedState, l.updateQueue = i.updateQueue, l.type = i.type, e = i.dependencies, l.dependencies = e === null ? null : {
                            lanes: e.lanes,
                            firstContext: e.firstContext
                        }), r = r.sibling;
                        return ae(me, me.current & 1 | 2), t.child
                    }
                    e = e.sibling
                }
                l.tail !== null && ve() > kn && (t.flags |= 128, s = !0, Bn(l, !1), t.lanes = 4194304)
            } else {
                if (!s) if (e = Wa(i), e !== null) {
                    if (t.flags |= 128, s = !0, r = e.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), Bn(l, !0), l.tail === null && l.tailMode === "hidden" && !i.alternate && !de) return Ae(t), null
                } else 2 * ve() - l.renderingStartTime > kn && r !== 1073741824 && (t.flags |= 128, s = !0, Bn(l, !1), t.lanes = 4194304);
                l.isBackwards ? (i.sibling = t.child, t.child = i) : (r = l.last, r !== null ? r.sibling = i : t.child = i, l.last = i)
            }
            return l.tail !== null ? (t = l.tail, l.rendering = t, l.tail = t.sibling, l.renderingStartTime = ve(), t.sibling = null, r = me.current, ae(me, s ? r & 1 | 2 : r & 1), t) : (Ae(t), null);
        case 22:
        case 23:
            return $c(), s = t.memoizedState !== null, e !== null && e.memoizedState !== null !== s && (t.flags |= 8192), s && t.mode & 1 ? Ge & 1073741824 && (Ae(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ae(t), null;
        case 24:
            return null;
        case 25:
            return null
    }
    throw Error(I(156, t.tag))
}

function c0(e, t) {
    switch (xc(t), t.tag) {
        case 1:
            return Je(t.type) && Da(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 3:
            return Nn(), ie(He), ie(Me), Sc(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
        case 5:
            return kc(t), null;
        case 13:
            if (ie(me), e = t.memoizedState, e !== null && e.dehydrated !== null) {
                if (t.alternate === null) throw Error(I(340));
                bn()
            }
            return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
        case 19:
            return ie(me), null;
        case 4:
            return Nn(), null;
        case 10:
            return bc(t.type._context), null;
        case 22:
        case 23:
            return $c(), null;
        case 24:
            return null;
        default:
            return null
    }
}

var aa = !1, $e = !1, u0 = typeof WeakSet == "function" ? WeakSet : Set, F = null;

function on(e, t) {
    var r = e.ref;
    if (r !== null) if (typeof r == "function") try {
        r(null)
    } catch (s) {
        xe(e, t, s)
    } else r.current = null
}

function So(e, t, r) {
    try {
        r()
    } catch (s) {
        xe(e, t, s)
    }
}

var pd = !1;

function d0(e, t) {
    if (io = Ia, e = gm(), pc(e)) {
        if ("selectionStart" in e) var r = {start: e.selectionStart, end: e.selectionEnd}; else e:{
            r = (r = e.ownerDocument) && r.defaultView || window;
            var s = r.getSelection && r.getSelection();
            if (s && s.rangeCount !== 0) {
                r = s.anchorNode;
                var a = s.anchorOffset, l = s.focusNode;
                s = s.focusOffset;
                try {
                    r.nodeType, l.nodeType
                } catch {
                    r = null;
                    break e
                }
                var i = 0, o = -1, c = -1, u = 0, f = 0, m = e, y = null;
                t:for (; ;) {
                    for (var b; m !== r || a !== 0 && m.nodeType !== 3 || (o = i + a), m !== l || s !== 0 && m.nodeType !== 3 || (c = i + s), m.nodeType === 3 && (i += m.nodeValue.length), (b = m.firstChild) !== null;) y = m, m = b;
                    for (; ;) {
                        if (m === e) break t;
                        if (y === r && ++u === a && (o = i), y === l && ++f === s && (c = i), (b = m.nextSibling) !== null) break;
                        m = y, y = m.parentNode
                    }
                    m = b
                }
                r = o === -1 || c === -1 ? null : {start: o, end: c}
            } else r = null
        }
        r = r || {start: 0, end: 0}
    } else r = null;
    for (oo = {
        focusedElem: e,
        selectionRange: r
    }, Ia = !1, F = t; F !== null;) if (t = F, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, F = e; else for (; F !== null;) {
        t = F;
        try {
            var p = t.alternate;
            if (t.flags & 1024) switch (t.tag) {
                case 0:
                case 11:
                case 15:
                    break;
                case 1:
                    if (p !== null) {
                        var d = p.memoizedProps, x = p.memoizedState, h = t.stateNode,
                            g = h.getSnapshotBeforeUpdate(t.elementType === t.type ? d : xt(t.type, d), x);
                        h.__reactInternalSnapshotBeforeUpdate = g
                    }
                    break;
                case 3:
                    var v = t.stateNode.containerInfo;
                    v.nodeType === 1 ? v.textContent = "" : v.nodeType === 9 && v.documentElement && v.removeChild(v.documentElement);
                    break;
                case 5:
                case 6:
                case 4:
                case 17:
                    break;
                default:
                    throw Error(I(163))
            }
        } catch (w) {
            xe(t, t.return, w)
        }
        if (e = t.sibling, e !== null) {
            e.return = t.return, F = e;
            break
        }
        F = t.return
    }
    return p = pd, pd = !1, p
}

function ns(e, t, r) {
    var s = t.updateQueue;
    if (s = s !== null ? s.lastEffect : null, s !== null) {
        var a = s = s.next;
        do {
            if ((a.tag & e) === e) {
                var l = a.destroy;
                a.destroy = void 0, l !== void 0 && So(t, r, l)
            }
            a = a.next
        } while (a !== s)
    }
}

function xl(e, t) {
    if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
        var r = t = t.next;
        do {
            if ((r.tag & e) === e) {
                var s = r.create;
                r.destroy = s()
            }
            r = r.next
        } while (r !== t)
    }
}

function Co(e) {
    var t = e.ref;
    if (t !== null) {
        var r = e.stateNode;
        switch (e.tag) {
            case 5:
                e = r;
                break;
            default:
                e = r
        }
        typeof t == "function" ? t(e) : t.current = e
    }
}

function mp(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, mp(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Et], delete t[xs], delete t[fo], delete t[qg], delete t[Qg])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null
}

function pp(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4
}

function hd(e) {
    e:for (; ;) {
        for (; e.sibling === null;) {
            if (e.return === null || pp(e.return)) return null;
            e = e.return
        }
        for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
            if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
            e.child.return = e, e = e.child
        }
        if (!(e.flags & 2)) return e.stateNode
    }
}

function Eo(e, t, r) {
    var s = e.tag;
    if (s === 5 || s === 6) e = e.stateNode, t ? r.nodeType === 8 ? r.parentNode.insertBefore(e, t) : r.insertBefore(e, t) : (r.nodeType === 8 ? (t = r.parentNode, t.insertBefore(e, r)) : (t = r, t.appendChild(e)), r = r._reactRootContainer, r != null || t.onclick !== null || (t.onclick = $a)); else if (s !== 4 && (e = e.child, e !== null)) for (Eo(e, t, r), e = e.sibling; e !== null;) Eo(e, t, r), e = e.sibling
}

function Po(e, t, r) {
    var s = e.tag;
    if (s === 5 || s === 6) e = e.stateNode, t ? r.insertBefore(e, t) : r.appendChild(e); else if (s !== 4 && (e = e.child, e !== null)) for (Po(e, t, r), e = e.sibling; e !== null;) Po(e, t, r), e = e.sibling
}

var Oe = null, gt = !1;

function Xt(e, t, r) {
    for (r = r.child; r !== null;) hp(e, t, r), r = r.sibling
}

function hp(e, t, r) {
    if (Ot && typeof Ot.onCommitFiberUnmount == "function") try {
        Ot.onCommitFiberUnmount(ol, r)
    } catch {
    }
    switch (r.tag) {
        case 5:
            $e || on(r, t);
        case 6:
            var s = Oe, a = gt;
            Oe = null, Xt(e, t, r), Oe = s, gt = a, Oe !== null && (gt ? (e = Oe, r = r.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(r) : e.removeChild(r)) : Oe.removeChild(r.stateNode));
            break;
        case 18:
            Oe !== null && (gt ? (e = Oe, r = r.stateNode, e.nodeType === 8 ? xi(e.parentNode, r) : e.nodeType === 1 && xi(e, r), ds(e)) : xi(Oe, r.stateNode));
            break;
        case 4:
            s = Oe, a = gt, Oe = r.stateNode.containerInfo, gt = !0, Xt(e, t, r), Oe = s, gt = a;
            break;
        case 0:
        case 11:
        case 14:
        case 15:
            if (!$e && (s = r.updateQueue, s !== null && (s = s.lastEffect, s !== null))) {
                a = s = s.next;
                do {
                    var l = a, i = l.destroy;
                    l = l.tag, i !== void 0 && (l & 2 || l & 4) && So(r, t, i), a = a.next
                } while (a !== s)
            }
            Xt(e, t, r);
            break;
        case 1:
            if (!$e && (on(r, t), s = r.stateNode, typeof s.componentWillUnmount == "function")) try {
                s.props = r.memoizedProps, s.state = r.memoizedState, s.componentWillUnmount()
            } catch (o) {
                xe(r, t, o)
            }
            Xt(e, t, r);
            break;
        case 21:
            Xt(e, t, r);
            break;
        case 22:
            r.mode & 1 ? ($e = (s = $e) || r.memoizedState !== null, Xt(e, t, r), $e = s) : Xt(e, t, r);
            break;
        default:
            Xt(e, t, r)
    }
}

function xd(e) {
    var t = e.updateQueue;
    if (t !== null) {
        e.updateQueue = null;
        var r = e.stateNode;
        r === null && (r = e.stateNode = new u0), t.forEach(function (s) {
            var a = b0.bind(null, e, s);
            r.has(s) || (r.add(s), s.then(a, a))
        })
    }
}

function ht(e, t) {
    var r = t.deletions;
    if (r !== null) for (var s = 0; s < r.length; s++) {
        var a = r[s];
        try {
            var l = e, i = t, o = i;
            e:for (; o !== null;) {
                switch (o.tag) {
                    case 5:
                        Oe = o.stateNode, gt = !1;
                        break e;
                    case 3:
                        Oe = o.stateNode.containerInfo, gt = !0;
                        break e;
                    case 4:
                        Oe = o.stateNode.containerInfo, gt = !0;
                        break e
                }
                o = o.return
            }
            if (Oe === null) throw Error(I(160));
            hp(l, i, a), Oe = null, gt = !1;
            var c = a.alternate;
            c !== null && (c.return = null), a.return = null
        } catch (u) {
            xe(a, t, u)
        }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null;) xp(t, e), t = t.sibling
}

function xp(e, t) {
    var r = e.alternate, s = e.flags;
    switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
            if (ht(t, e), St(e), s & 4) {
                try {
                    ns(3, e, e.return), xl(3, e)
                } catch (d) {
                    xe(e, e.return, d)
                }
                try {
                    ns(5, e, e.return)
                } catch (d) {
                    xe(e, e.return, d)
                }
            }
            break;
        case 1:
            ht(t, e), St(e), s & 512 && r !== null && on(r, r.return);
            break;
        case 5:
            if (ht(t, e), St(e), s & 512 && r !== null && on(r, r.return), e.flags & 32) {
                var a = e.stateNode;
                try {
                    is(a, "")
                } catch (d) {
                    xe(e, e.return, d)
                }
            }
            if (s & 4 && (a = e.stateNode, a != null)) {
                var l = e.memoizedProps, i = r !== null ? r.memoizedProps : l, o = e.type, c = e.updateQueue;
                if (e.updateQueue = null, c !== null) try {
                    o === "input" && l.type === "radio" && l.name != null && Mf(a, l), Xi(o, i);
                    var u = Xi(o, l);
                    for (i = 0; i < c.length; i += 2) {
                        var f = c[i], m = c[i + 1];
                        f === "style" ? Vf(a, m) : f === "dangerouslySetInnerHTML" ? Ff(a, m) : f === "children" ? is(a, m) : tc(a, f, m, u)
                    }
                    switch (o) {
                        case"input":
                            Ji(a, l);
                            break;
                        case"textarea":
                            zf(a, l);
                            break;
                        case"select":
                            var y = a._wrapperState.wasMultiple;
                            a._wrapperState.wasMultiple = !!l.multiple;
                            var b = l.value;
                            b != null ? un(a, !!l.multiple, b, !1) : y !== !!l.multiple && (l.defaultValue != null ? un(a, !!l.multiple, l.defaultValue, !0) : un(a, !!l.multiple, l.multiple ? [] : "", !1))
                    }
                    a[xs] = l
                } catch (d) {
                    xe(e, e.return, d)
                }
            }
            break;
        case 6:
            if (ht(t, e), St(e), s & 4) {
                if (e.stateNode === null) throw Error(I(162));
                a = e.stateNode, l = e.memoizedProps;
                try {
                    a.nodeValue = l
                } catch (d) {
                    xe(e, e.return, d)
                }
            }
            break;
        case 3:
            if (ht(t, e), St(e), s & 4 && r !== null && r.memoizedState.isDehydrated) try {
                ds(t.containerInfo)
            } catch (d) {
                xe(e, e.return, d)
            }
            break;
        case 4:
            ht(t, e), St(e);
            break;
        case 13:
            ht(t, e), St(e), a = e.child, a.flags & 8192 && (l = a.memoizedState !== null, a.stateNode.isHidden = l, !l || a.alternate !== null && a.alternate.memoizedState !== null || (Ac = ve())), s & 4 && xd(e);
            break;
        case 22:
            if (f = r !== null && r.memoizedState !== null, e.mode & 1 ? ($e = (u = $e) || f, ht(t, e), $e = u) : ht(t, e), St(e), s & 8192) {
                if (u = e.memoizedState !== null, (e.stateNode.isHidden = u) && !f && e.mode & 1) for (F = e, f = e.child; f !== null;) {
                    for (m = F = f; F !== null;) {
                        switch (y = F, b = y.child, y.tag) {
                            case 0:
                            case 11:
                            case 14:
                            case 15:
                                ns(4, y, y.return);
                                break;
                            case 1:
                                on(y, y.return);
                                var p = y.stateNode;
                                if (typeof p.componentWillUnmount == "function") {
                                    s = y, r = y.return;
                                    try {
                                        t = s, p.props = t.memoizedProps, p.state = t.memoizedState, p.componentWillUnmount()
                                    } catch (d) {
                                        xe(s, r, d)
                                    }
                                }
                                break;
                            case 5:
                                on(y, y.return);
                                break;
                            case 22:
                                if (y.memoizedState !== null) {
                                    yd(m);
                                    continue
                                }
                        }
                        b !== null ? (b.return = y, F = b) : yd(m)
                    }
                    f = f.sibling
                }
                e:for (f = null, m = e; ;) {
                    if (m.tag === 5) {
                        if (f === null) {
                            f = m;
                            try {
                                a = m.stateNode, u ? (l = a.style, typeof l.setProperty == "function" ? l.setProperty("display", "none", "important") : l.display = "none") : (o = m.stateNode, c = m.memoizedProps.style, i = c != null && c.hasOwnProperty("display") ? c.display : null, o.style.display = Bf("display", i))
                            } catch (d) {
                                xe(e, e.return, d)
                            }
                        }
                    } else if (m.tag === 6) {
                        if (f === null) try {
                            m.stateNode.nodeValue = u ? "" : m.memoizedProps
                        } catch (d) {
                            xe(e, e.return, d)
                        }
                    } else if ((m.tag !== 22 && m.tag !== 23 || m.memoizedState === null || m === e) && m.child !== null) {
                        m.child.return = m, m = m.child;
                        continue
                    }
                    if (m === e) break e;
                    for (; m.sibling === null;) {
                        if (m.return === null || m.return === e) break e;
                        f === m && (f = null), m = m.return
                    }
                    f === m && (f = null), m.sibling.return = m.return, m = m.sibling
                }
            }
            break;
        case 19:
            ht(t, e), St(e), s & 4 && xd(e);
            break;
        case 21:
            break;
        default:
            ht(t, e), St(e)
    }
}

function St(e) {
    var t = e.flags;
    if (t & 2) {
        try {
            e:{
                for (var r = e.return; r !== null;) {
                    if (pp(r)) {
                        var s = r;
                        break e
                    }
                    r = r.return
                }
                throw Error(I(160))
            }
            switch (s.tag) {
                case 5:
                    var a = s.stateNode;
                    s.flags & 32 && (is(a, ""), s.flags &= -33);
                    var l = hd(e);
                    Po(e, l, a);
                    break;
                case 3:
                case 4:
                    var i = s.stateNode.containerInfo, o = hd(e);
                    Eo(e, o, i);
                    break;
                default:
                    throw Error(I(161))
            }
        } catch (c) {
            xe(e, e.return, c)
        }
        e.flags &= -3
    }
    t & 4096 && (e.flags &= -4097)
}

function f0(e, t, r) {
    F = e, gp(e)
}

function gp(e, t, r) {
    for (var s = (e.mode & 1) !== 0; F !== null;) {
        var a = F, l = a.child;
        if (a.tag === 22 && s) {
            var i = a.memoizedState !== null || aa;
            if (!i) {
                var o = a.alternate, c = o !== null && o.memoizedState !== null || $e;
                o = aa;
                var u = $e;
                if (aa = i, ($e = c) && !u) for (F = a; F !== null;) i = F, c = i.child, i.tag === 22 && i.memoizedState !== null ? vd(a) : c !== null ? (c.return = i, F = c) : vd(a);
                for (; l !== null;) F = l, gp(l), l = l.sibling;
                F = a, aa = o, $e = u
            }
            gd(e)
        } else a.subtreeFlags & 8772 && l !== null ? (l.return = a, F = l) : gd(e)
    }
}

function gd(e) {
    for (; F !== null;) {
        var t = F;
        if (t.flags & 8772) {
            var r = t.alternate;
            try {
                if (t.flags & 8772) switch (t.tag) {
                    case 0:
                    case 11:
                    case 15:
                        $e || xl(5, t);
                        break;
                    case 1:
                        var s = t.stateNode;
                        if (t.flags & 4 && !$e) if (r === null) s.componentDidMount(); else {
                            var a = t.elementType === t.type ? r.memoizedProps : xt(t.type, r.memoizedProps);
                            s.componentDidUpdate(a, r.memoizedState, s.__reactInternalSnapshotBeforeUpdate)
                        }
                        var l = t.updateQueue;
                        l !== null && td(t, l, s);
                        break;
                    case 3:
                        var i = t.updateQueue;
                        if (i !== null) {
                            if (r = null, t.child !== null) switch (t.child.tag) {
                                case 5:
                                    r = t.child.stateNode;
                                    break;
                                case 1:
                                    r = t.child.stateNode
                            }
                            td(t, i, r)
                        }
                        break;
                    case 5:
                        var o = t.stateNode;
                        if (r === null && t.flags & 4) {
                            r = o;
                            var c = t.memoizedProps;
                            switch (t.type) {
                                case"button":
                                case"input":
                                case"select":
                                case"textarea":
                                    c.autoFocus && r.focus();
                                    break;
                                case"img":
                                    c.src && (r.src = c.src)
                            }
                        }
                        break;
                    case 6:
                        break;
                    case 4:
                        break;
                    case 12:
                        break;
                    case 13:
                        if (t.memoizedState === null) {
                            var u = t.alternate;
                            if (u !== null) {
                                var f = u.memoizedState;
                                if (f !== null) {
                                    var m = f.dehydrated;
                                    m !== null && ds(m)
                                }
                            }
                        }
                        break;
                    case 19:
                    case 17:
                    case 21:
                    case 22:
                    case 23:
                    case 25:
                        break;
                    default:
                        throw Error(I(163))
                }
                $e || t.flags & 512 && Co(t)
            } catch (y) {
                xe(t, t.return, y)
            }
        }
        if (t === e) {
            F = null;
            break
        }
        if (r = t.sibling, r !== null) {
            r.return = t.return, F = r;
            break
        }
        F = t.return
    }
}

function yd(e) {
    for (; F !== null;) {
        var t = F;
        if (t === e) {
            F = null;
            break
        }
        var r = t.sibling;
        if (r !== null) {
            r.return = t.return, F = r;
            break
        }
        F = t.return
    }
}

function vd(e) {
    for (; F !== null;) {
        var t = F;
        try {
            switch (t.tag) {
                case 0:
                case 11:
                case 15:
                    var r = t.return;
                    try {
                        xl(4, t)
                    } catch (c) {
                        xe(t, r, c)
                    }
                    break;
                case 1:
                    var s = t.stateNode;
                    if (typeof s.componentDidMount == "function") {
                        var a = t.return;
                        try {
                            s.componentDidMount()
                        } catch (c) {
                            xe(t, a, c)
                        }
                    }
                    var l = t.return;
                    try {
                        Co(t)
                    } catch (c) {
                        xe(t, l, c)
                    }
                    break;
                case 5:
                    var i = t.return;
                    try {
                        Co(t)
                    } catch (c) {
                        xe(t, i, c)
                    }
            }
        } catch (c) {
            xe(t, t.return, c)
        }
        if (t === e) {
            F = null;
            break
        }
        var o = t.sibling;
        if (o !== null) {
            o.return = t.return, F = o;
            break
        }
        F = t.return
    }
}

var m0 = Math.ceil, qa = Jt.ReactCurrentDispatcher, Tc = Jt.ReactCurrentOwner, dt = Jt.ReactCurrentBatchConfig, Y = 0,
    Pe = null, je = null, Re = 0, Ge = 0, cn = wr(0), Se = 0, Ns = null, zr = 0, gl = 0, Ic = 0, ss = null, Ve = null,
    Ac = 0, kn = 1 / 0, Lt = null, Qa = !1, _o = null, fr = null, la = !1, ar = null, Ka = 0, as = 0, Oo = null,
    va = -1, ba = 0;

function Ue() {
    return Y & 6 ? ve() : va !== -1 ? va : va = ve()
}

function mr(e) {
    return e.mode & 1 ? Y & 2 && Re !== 0 ? Re & -Re : Gg.transition !== null ? (ba === 0 && (ba = tm()), ba) : (e = re, e !== 0 || (e = window.event, e = e === void 0 ? 16 : om(e.type)), e) : 1
}

function jt(e, t, r, s) {
    if (50 < as) throw as = 0, Oo = null, Error(I(185));
    _s(e, r, s), (!(Y & 2) || e !== Pe) && (e === Pe && (!(Y & 2) && (gl |= r), Se === 4 && tr(e, Re)), qe(e, s), r === 1 && Y === 0 && !(t.mode & 1) && (kn = ve() + 500, ml && kr()))
}

function qe(e, t) {
    var r = e.callbackNode;
    Gx(e, t);
    var s = Ta(e, e === Pe ? Re : 0);
    if (s === 0) r !== null && Pu(r), e.callbackNode = null, e.callbackPriority = 0; else if (t = s & -s, e.callbackPriority !== t) {
        if (r != null && Pu(r), t === 1) e.tag === 0 ? Kg(bd.bind(null, e)) : Em(bd.bind(null, e)), Hg(function () {
            !(Y & 6) && kr()
        }), r = null; else {
            switch (rm(s)) {
                case 1:
                    r = lc;
                    break;
                case 4:
                    r = Zf;
                    break;
                case 16:
                    r = Ra;
                    break;
                case 536870912:
                    r = em;
                    break;
                default:
                    r = Ra
            }
            r = Sp(r, yp.bind(null, e))
        }
        e.callbackPriority = t, e.callbackNode = r
    }
}

function yp(e, t) {
    if (va = -1, ba = 0, Y & 6) throw Error(I(327));
    var r = e.callbackNode;
    if (hn() && e.callbackNode !== r) return null;
    var s = Ta(e, e === Pe ? Re : 0);
    if (s === 0) return null;
    if (s & 30 || s & e.expiredLanes || t) t = Ga(e, s); else {
        t = s;
        var a = Y;
        Y |= 2;
        var l = bp();
        (Pe !== e || Re !== t) && (Lt = null, kn = ve() + 500, Ir(e, t));
        do try {
            x0();
            break
        } catch (o) {
            vp(e, o)
        } while (!0);
        vc(), qa.current = l, Y = a, je !== null ? t = 0 : (Pe = null, Re = 0, t = Se)
    }
    if (t !== 0) {
        if (t === 2 && (a = ro(e), a !== 0 && (s = a, t = Ro(e, a))), t === 1) throw r = Ns, Ir(e, 0), tr(e, s), qe(e, ve()), r;
        if (t === 6) tr(e, s); else {
            if (a = e.current.alternate, !(s & 30) && !p0(a) && (t = Ga(e, s), t === 2 && (l = ro(e), l !== 0 && (s = l, t = Ro(e, l))), t === 1)) throw r = Ns, Ir(e, 0), tr(e, s), qe(e, ve()), r;
            switch (e.finishedWork = a, e.finishedLanes = s, t) {
                case 0:
                case 1:
                    throw Error(I(345));
                case 2:
                    Er(e, Ve, Lt);
                    break;
                case 3:
                    if (tr(e, s), (s & 130023424) === s && (t = Ac + 500 - ve(), 10 < t)) {
                        if (Ta(e, 0) !== 0) break;
                        if (a = e.suspendedLanes, (a & s) !== s) {
                            Ue(), e.pingedLanes |= e.suspendedLanes & a;
                            break
                        }
                        e.timeoutHandle = uo(Er.bind(null, e, Ve, Lt), t);
                        break
                    }
                    Er(e, Ve, Lt);
                    break;
                case 4:
                    if (tr(e, s), (s & 4194240) === s) break;
                    for (t = e.eventTimes, a = -1; 0 < s;) {
                        var i = 31 - bt(s);
                        l = 1 << i, i = t[i], i > a && (a = i), s &= ~l
                    }
                    if (s = a, s = ve() - s, s = (120 > s ? 120 : 480 > s ? 480 : 1080 > s ? 1080 : 1920 > s ? 1920 : 3e3 > s ? 3e3 : 4320 > s ? 4320 : 1960 * m0(s / 1960)) - s, 10 < s) {
                        e.timeoutHandle = uo(Er.bind(null, e, Ve, Lt), s);
                        break
                    }
                    Er(e, Ve, Lt);
                    break;
                case 5:
                    Er(e, Ve, Lt);
                    break;
                default:
                    throw Error(I(329))
            }
        }
    }
    return qe(e, ve()), e.callbackNode === r ? yp.bind(null, e) : null
}

function Ro(e, t) {
    var r = ss;
    return e.current.memoizedState.isDehydrated && (Ir(e, t).flags |= 256), e = Ga(e, t), e !== 2 && (t = Ve, Ve = r, t !== null && To(t)), e
}

function To(e) {
    Ve === null ? Ve = e : Ve.push.apply(Ve, e)
}

function p0(e) {
    for (var t = e; ;) {
        if (t.flags & 16384) {
            var r = t.updateQueue;
            if (r !== null && (r = r.stores, r !== null)) for (var s = 0; s < r.length; s++) {
                var a = r[s], l = a.getSnapshot;
                a = a.value;
                try {
                    if (!Nt(l(), a)) return !1
                } catch {
                    return !1
                }
            }
        }
        if (r = t.child, t.subtreeFlags & 16384 && r !== null) r.return = t, t = r; else {
            if (t === e) break;
            for (; t.sibling === null;) {
                if (t.return === null || t.return === e) return !0;
                t = t.return
            }
            t.sibling.return = t.return, t = t.sibling
        }
    }
    return !0
}

function tr(e, t) {
    for (t &= ~Ic, t &= ~gl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t;) {
        var r = 31 - bt(t), s = 1 << r;
        e[r] = -1, t &= ~s
    }
}

function bd(e) {
    if (Y & 6) throw Error(I(327));
    hn();
    var t = Ta(e, 0);
    if (!(t & 1)) return qe(e, ve()), null;
    var r = Ga(e, t);
    if (e.tag !== 0 && r === 2) {
        var s = ro(e);
        s !== 0 && (t = s, r = Ro(e, s))
    }
    if (r === 1) throw r = Ns, Ir(e, 0), tr(e, t), qe(e, ve()), r;
    if (r === 6) throw Error(I(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, Er(e, Ve, Lt), qe(e, ve()), null
}

function Lc(e, t) {
    var r = Y;
    Y |= 1;
    try {
        return e(t)
    } finally {
        Y = r, Y === 0 && (kn = ve() + 500, ml && kr())
    }
}

function Ur(e) {
    ar !== null && ar.tag === 0 && !(Y & 6) && hn();
    var t = Y;
    Y |= 1;
    var r = dt.transition, s = re;
    try {
        if (dt.transition = null, re = 1, e) return e()
    } finally {
        re = s, dt.transition = r, Y = t, !(Y & 6) && kr()
    }
}

function $c() {
    Ge = cn.current, ie(cn)
}

function Ir(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var r = e.timeoutHandle;
    if (r !== -1 && (e.timeoutHandle = -1, Wg(r)), je !== null) for (r = je.return; r !== null;) {
        var s = r;
        switch (xc(s), s.tag) {
            case 1:
                s = s.type.childContextTypes, s != null && Da();
                break;
            case 3:
                Nn(), ie(He), ie(Me), Sc();
                break;
            case 5:
                kc(s);
                break;
            case 4:
                Nn();
                break;
            case 13:
                ie(me);
                break;
            case 19:
                ie(me);
                break;
            case 10:
                bc(s.type._context);
                break;
            case 22:
            case 23:
                $c()
        }
        r = r.return
    }
    if (Pe = e, je = e = pr(e.current, null), Re = Ge = t, Se = 0, Ns = null, Ic = gl = zr = 0, Ve = ss = null, Or !== null) {
        for (t = 0; t < Or.length; t++) if (r = Or[t], s = r.interleaved, s !== null) {
            r.interleaved = null;
            var a = s.next, l = r.pending;
            if (l !== null) {
                var i = l.next;
                l.next = a, s.next = i
            }
            r.pending = s
        }
        Or = null
    }
    return e
}

function vp(e, t) {
    do {
        var r = je;
        try {
            if (vc(), xa.current = Ja, Ha) {
                for (var s = pe.memoizedState; s !== null;) {
                    var a = s.queue;
                    a !== null && (a.pending = null), s = s.next
                }
                Ha = !1
            }
            if (Mr = 0, Ee = we = pe = null, rs = !1, vs = 0, Tc.current = null, r === null || r.return === null) {
                Se = 1, Ns = t, je = null;
                break
            }
            e:{
                var l = e, i = r.return, o = r, c = t;
                if (t = Re, o.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
                    var u = c, f = o, m = f.tag;
                    if (!(f.mode & 1) && (m === 0 || m === 11 || m === 15)) {
                        var y = f.alternate;
                        y ? (f.updateQueue = y.updateQueue, f.memoizedState = y.memoizedState, f.lanes = y.lanes) : (f.updateQueue = null, f.memoizedState = null)
                    }
                    var b = id(i);
                    if (b !== null) {
                        b.flags &= -257, od(b, i, o, l, t), b.mode & 1 && ld(l, u, t), t = b, c = u;
                        var p = t.updateQueue;
                        if (p === null) {
                            var d = new Set;
                            d.add(c), t.updateQueue = d
                        } else p.add(c);
                        break e
                    } else {
                        if (!(t & 1)) {
                            ld(l, u, t), Dc();
                            break e
                        }
                        c = Error(I(426))
                    }
                } else if (de && o.mode & 1) {
                    var x = id(i);
                    if (x !== null) {
                        !(x.flags & 65536) && (x.flags |= 256), od(x, i, o, l, t), gc(wn(c, o));
                        break e
                    }
                }
                l = c = wn(c, o), Se !== 4 && (Se = 2), ss === null ? ss = [l] : ss.push(l), l = i;
                do {
                    switch (l.tag) {
                        case 3:
                            l.flags |= 65536, t &= -t, l.lanes |= t;
                            var h = rp(l, c, t);
                            ed(l, h);
                            break e;
                        case 1:
                            o = c;
                            var g = l.type, v = l.stateNode;
                            if (!(l.flags & 128) && (typeof g.getDerivedStateFromError == "function" || v !== null && typeof v.componentDidCatch == "function" && (fr === null || !fr.has(v)))) {
                                l.flags |= 65536, t &= -t, l.lanes |= t;
                                var w = np(l, o, t);
                                ed(l, w);
                                break e
                            }
                    }
                    l = l.return
                } while (l !== null)
            }
            Np(r)
        } catch (N) {
            t = N, je === r && r !== null && (je = r = r.return);
            continue
        }
        break
    } while (!0)
}

function bp() {
    var e = qa.current;
    return qa.current = Ja, e === null ? Ja : e
}

function Dc() {
    (Se === 0 || Se === 3 || Se === 2) && (Se = 4), Pe === null || !(zr & 268435455) && !(gl & 268435455) || tr(Pe, Re)
}

function Ga(e, t) {
    var r = Y;
    Y |= 2;
    var s = bp();
    (Pe !== e || Re !== t) && (Lt = null, Ir(e, t));
    do try {
        h0();
        break
    } catch (a) {
        vp(e, a)
    } while (!0);
    if (vc(), Y = r, qa.current = s, je !== null) throw Error(I(261));
    return Pe = null, Re = 0, Se
}

function h0() {
    for (; je !== null;) jp(je)
}

function x0() {
    for (; je !== null && !Fx();) jp(je)
}

function jp(e) {
    var t = kp(e.alternate, e, Ge);
    e.memoizedProps = e.pendingProps, t === null ? Np(e) : je = t, Tc.current = null
}

function Np(e) {
    var t = e;
    do {
        var r = t.alternate;
        if (e = t.return, t.flags & 32768) {
            if (r = c0(r, t), r !== null) {
                r.flags &= 32767, je = r;
                return
            }
            if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null; else {
                Se = 6, je = null;
                return
            }
        } else if (r = o0(r, t, Ge), r !== null) {
            je = r;
            return
        }
        if (t = t.sibling, t !== null) {
            je = t;
            return
        }
        je = t = e
    } while (t !== null);
    Se === 0 && (Se = 5)
}

function Er(e, t, r) {
    var s = re, a = dt.transition;
    try {
        dt.transition = null, re = 1, g0(e, t, r, s)
    } finally {
        dt.transition = a, re = s
    }
    return null
}

function g0(e, t, r, s) {
    do hn(); while (ar !== null);
    if (Y & 6) throw Error(I(327));
    r = e.finishedWork;
    var a = e.finishedLanes;
    if (r === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, r === e.current) throw Error(I(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var l = r.lanes | r.childLanes;
    if (Xx(e, l), e === Pe && (je = Pe = null, Re = 0), !(r.subtreeFlags & 2064) && !(r.flags & 2064) || la || (la = !0, Sp(Ra, function () {
        return hn(), null
    })), l = (r.flags & 15990) !== 0, r.subtreeFlags & 15990 || l) {
        l = dt.transition, dt.transition = null;
        var i = re;
        re = 1;
        var o = Y;
        Y |= 4, Tc.current = null, d0(e, r), xp(r, e), Dg(oo), Ia = !!io, oo = io = null, e.current = r, f0(r), Bx(), Y = o, re = i, dt.transition = l
    } else e.current = r;
    if (la && (la = !1, ar = e, Ka = a), l = e.pendingLanes, l === 0 && (fr = null), Hx(r.stateNode), qe(e, ve()), t !== null) for (s = e.onRecoverableError, r = 0; r < t.length; r++) a = t[r], s(a.value, {
        componentStack: a.stack,
        digest: a.digest
    });
    if (Qa) throw Qa = !1, e = _o, _o = null, e;
    return Ka & 1 && e.tag !== 0 && hn(), l = e.pendingLanes, l & 1 ? e === Oo ? as++ : (as = 0, Oo = e) : as = 0, kr(), null
}

function hn() {
    if (ar !== null) {
        var e = rm(Ka), t = dt.transition, r = re;
        try {
            if (dt.transition = null, re = 16 > e ? 16 : e, ar === null) var s = !1; else {
                if (e = ar, ar = null, Ka = 0, Y & 6) throw Error(I(331));
                var a = Y;
                for (Y |= 4, F = e.current; F !== null;) {
                    var l = F, i = l.child;
                    if (F.flags & 16) {
                        var o = l.deletions;
                        if (o !== null) {
                            for (var c = 0; c < o.length; c++) {
                                var u = o[c];
                                for (F = u; F !== null;) {
                                    var f = F;
                                    switch (f.tag) {
                                        case 0:
                                        case 11:
                                        case 15:
                                            ns(8, f, l)
                                    }
                                    var m = f.child;
                                    if (m !== null) m.return = f, F = m; else for (; F !== null;) {
                                        f = F;
                                        var y = f.sibling, b = f.return;
                                        if (mp(f), f === u) {
                                            F = null;
                                            break
                                        }
                                        if (y !== null) {
                                            y.return = b, F = y;
                                            break
                                        }
                                        F = b
                                    }
                                }
                            }
                            var p = l.alternate;
                            if (p !== null) {
                                var d = p.child;
                                if (d !== null) {
                                    p.child = null;
                                    do {
                                        var x = d.sibling;
                                        d.sibling = null, d = x
                                    } while (d !== null)
                                }
                            }
                            F = l
                        }
                    }
                    if (l.subtreeFlags & 2064 && i !== null) i.return = l, F = i; else e:for (; F !== null;) {
                        if (l = F, l.flags & 2048) switch (l.tag) {
                            case 0:
                            case 11:
                            case 15:
                                ns(9, l, l.return)
                        }
                        var h = l.sibling;
                        if (h !== null) {
                            h.return = l.return, F = h;
                            break e
                        }
                        F = l.return
                    }
                }
                var g = e.current;
                for (F = g; F !== null;) {
                    i = F;
                    var v = i.child;
                    if (i.subtreeFlags & 2064 && v !== null) v.return = i, F = v; else e:for (i = g; F !== null;) {
                        if (o = F, o.flags & 2048) try {
                            switch (o.tag) {
                                case 0:
                                case 11:
                                case 15:
                                    xl(9, o)
                            }
                        } catch (N) {
                            xe(o, o.return, N)
                        }
                        if (o === i) {
                            F = null;
                            break e
                        }
                        var w = o.sibling;
                        if (w !== null) {
                            w.return = o.return, F = w;
                            break e
                        }
                        F = o.return
                    }
                }
                if (Y = a, kr(), Ot && typeof Ot.onPostCommitFiberRoot == "function") try {
                    Ot.onPostCommitFiberRoot(ol, e)
                } catch {
                }
                s = !0
            }
            return s
        } finally {
            re = r, dt.transition = t
        }
    }
    return !1
}

function jd(e, t, r) {
    t = wn(r, t), t = rp(e, t, 1), e = dr(e, t, 1), t = Ue(), e !== null && (_s(e, 1, t), qe(e, t))
}

function xe(e, t, r) {
    if (e.tag === 3) jd(e, e, r); else for (; t !== null;) {
        if (t.tag === 3) {
            jd(t, e, r);
            break
        } else if (t.tag === 1) {
            var s = t.stateNode;
            if (typeof t.type.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && (fr === null || !fr.has(s))) {
                e = wn(r, e), e = np(t, e, 1), t = dr(t, e, 1), e = Ue(), t !== null && (_s(t, 1, e), qe(t, e));
                break
            }
        }
        t = t.return
    }
}

function y0(e, t, r) {
    var s = e.pingCache;
    s !== null && s.delete(t), t = Ue(), e.pingedLanes |= e.suspendedLanes & r, Pe === e && (Re & r) === r && (Se === 4 || Se === 3 && (Re & 130023424) === Re && 500 > ve() - Ac ? Ir(e, 0) : Ic |= r), qe(e, t)
}

function wp(e, t) {
    t === 0 && (e.mode & 1 ? (t = Gs, Gs <<= 1, !(Gs & 130023424) && (Gs = 4194304)) : t = 1);
    var r = Ue();
    e = Bt(e, t), e !== null && (_s(e, t, r), qe(e, r))
}

function v0(e) {
    var t = e.memoizedState, r = 0;
    t !== null && (r = t.retryLane), wp(e, r)
}

function b0(e, t) {
    var r = 0;
    switch (e.tag) {
        case 13:
            var s = e.stateNode, a = e.memoizedState;
            a !== null && (r = a.retryLane);
            break;
        case 19:
            s = e.stateNode;
            break;
        default:
            throw Error(I(314))
    }
    s !== null && s.delete(t), wp(e, r)
}

var kp;
kp = function (e, t, r) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || He.current) We = !0; else {
        if (!(e.lanes & r) && !(t.flags & 128)) return We = !1, i0(e, t, r);
        We = !!(e.flags & 131072)
    } else We = !1, de && t.flags & 1048576 && Pm(t, Ua, t.index);
    switch (t.lanes = 0, t.tag) {
        case 2:
            var s = t.type;
            ya(e, t), e = t.pendingProps;
            var a = vn(t, Me.current);
            pn(t, r), a = Ec(null, t, s, e, a, r);
            var l = Pc();
            return t.flags |= 1, typeof a == "object" && a !== null && typeof a.render == "function" && a.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Je(s) ? (l = !0, Ma(t)) : l = !1, t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, Nc(t), a.updater = hl, t.stateNode = a, a._reactInternals = t, yo(t, s, e, r), t = jo(null, t, s, !0, l, r)) : (t.tag = 0, de && l && hc(t), ze(null, t, a, r), t = t.child), t;
        case 16:
            s = t.elementType;
            e:{
                switch (ya(e, t), e = t.pendingProps, a = s._init, s = a(s._payload), t.type = s, a = t.tag = N0(s), e = xt(s, e), a) {
                    case 0:
                        t = bo(null, t, s, e, r);
                        break e;
                    case 1:
                        t = dd(null, t, s, e, r);
                        break e;
                    case 11:
                        t = cd(null, t, s, e, r);
                        break e;
                    case 14:
                        t = ud(null, t, s, xt(s.type, e), r);
                        break e
                }
                throw Error(I(306, s, ""))
            }
            return t;
        case 0:
            return s = t.type, a = t.pendingProps, a = t.elementType === s ? a : xt(s, a), bo(e, t, s, a, r);
        case 1:
            return s = t.type, a = t.pendingProps, a = t.elementType === s ? a : xt(s, a), dd(e, t, s, a, r);
        case 3:
            e:{
                if (ip(t), e === null) throw Error(I(387));
                s = t.pendingProps, l = t.memoizedState, a = l.element, Am(e, t), Va(t, s, null, r);
                var i = t.memoizedState;
                if (s = i.element, l.isDehydrated) if (l = {
                    element: s,
                    isDehydrated: !1,
                    cache: i.cache,
                    pendingSuspenseBoundaries: i.pendingSuspenseBoundaries,
                    transitions: i.transitions
                }, t.updateQueue.baseState = l, t.memoizedState = l, t.flags & 256) {
                    a = wn(Error(I(423)), t), t = fd(e, t, s, r, a);
                    break e
                } else if (s !== a) {
                    a = wn(Error(I(424)), t), t = fd(e, t, s, r, a);
                    break e
                } else for (Xe = ur(t.stateNode.containerInfo.firstChild), Ye = t, de = !0, yt = null, r = Tm(t, null, s, r), t.child = r; r;) r.flags = r.flags & -3 | 4096, r = r.sibling; else {
                    if (bn(), s === a) {
                        t = Vt(e, t, r);
                        break e
                    }
                    ze(e, t, s, r)
                }
                t = t.child
            }
            return t;
        case 5:
            return Lm(t), e === null && ho(t), s = t.type, a = t.pendingProps, l = e !== null ? e.memoizedProps : null, i = a.children, co(s, a) ? i = null : l !== null && co(s, l) && (t.flags |= 32), lp(e, t), ze(e, t, i, r), t.child;
        case 6:
            return e === null && ho(t), null;
        case 13:
            return op(e, t, r);
        case 4:
            return wc(t, t.stateNode.containerInfo), s = t.pendingProps, e === null ? t.child = jn(t, null, s, r) : ze(e, t, s, r), t.child;
        case 11:
            return s = t.type, a = t.pendingProps, a = t.elementType === s ? a : xt(s, a), cd(e, t, s, a, r);
        case 7:
            return ze(e, t, t.pendingProps, r), t.child;
        case 8:
            return ze(e, t, t.pendingProps.children, r), t.child;
        case 12:
            return ze(e, t, t.pendingProps.children, r), t.child;
        case 10:
            e:{
                if (s = t.type._context, a = t.pendingProps, l = t.memoizedProps, i = a.value, ae(Fa, s._currentValue), s._currentValue = i, l !== null) if (Nt(l.value, i)) {
                    if (l.children === a.children && !He.current) {
                        t = Vt(e, t, r);
                        break e
                    }
                } else for (l = t.child, l !== null && (l.return = t); l !== null;) {
                    var o = l.dependencies;
                    if (o !== null) {
                        i = l.child;
                        for (var c = o.firstContext; c !== null;) {
                            if (c.context === s) {
                                if (l.tag === 1) {
                                    c = zt(-1, r & -r), c.tag = 2;
                                    var u = l.updateQueue;
                                    if (u !== null) {
                                        u = u.shared;
                                        var f = u.pending;
                                        f === null ? c.next = c : (c.next = f.next, f.next = c), u.pending = c
                                    }
                                }
                                l.lanes |= r, c = l.alternate, c !== null && (c.lanes |= r), xo(l.return, r, t), o.lanes |= r;
                                break
                            }
                            c = c.next
                        }
                    } else if (l.tag === 10) i = l.type === t.type ? null : l.child; else if (l.tag === 18) {
                        if (i = l.return, i === null) throw Error(I(341));
                        i.lanes |= r, o = i.alternate, o !== null && (o.lanes |= r), xo(i, r, t), i = l.sibling
                    } else i = l.child;
                    if (i !== null) i.return = l; else for (i = l; i !== null;) {
                        if (i === t) {
                            i = null;
                            break
                        }
                        if (l = i.sibling, l !== null) {
                            l.return = i.return, i = l;
                            break
                        }
                        i = i.return
                    }
                    l = i
                }
                ze(e, t, a.children, r), t = t.child
            }
            return t;
        case 9:
            return a = t.type, s = t.pendingProps.children, pn(t, r), a = ft(a), s = s(a), t.flags |= 1, ze(e, t, s, r), t.child;
        case 14:
            return s = t.type, a = xt(s, t.pendingProps), a = xt(s.type, a), ud(e, t, s, a, r);
        case 15:
            return sp(e, t, t.type, t.pendingProps, r);
        case 17:
            return s = t.type, a = t.pendingProps, a = t.elementType === s ? a : xt(s, a), ya(e, t), t.tag = 1, Je(s) ? (e = !0, Ma(t)) : e = !1, pn(t, r), tp(t, s, a), yo(t, s, a, r), jo(null, t, s, !0, e, r);
        case 19:
            return cp(e, t, r);
        case 22:
            return ap(e, t, r)
    }
    throw Error(I(156, t.tag))
};

function Sp(e, t) {
    return Yf(e, t)
}

function j0(e, t, r, s) {
    this.tag = e, this.key = r, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = s, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null
}

function ut(e, t, r, s) {
    return new j0(e, t, r, s)
}

function Mc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent)
}

function N0(e) {
    if (typeof e == "function") return Mc(e) ? 1 : 0;
    if (e != null) {
        if (e = e.$$typeof, e === nc) return 11;
        if (e === sc) return 14
    }
    return 2
}

function pr(e, t) {
    var r = e.alternate;
    return r === null ? (r = ut(e.tag, t, e.key, e.mode), r.elementType = e.elementType, r.type = e.type, r.stateNode = e.stateNode, r.alternate = e, e.alternate = r) : (r.pendingProps = t, r.type = e.type, r.flags = 0, r.subtreeFlags = 0, r.deletions = null), r.flags = e.flags & 14680064, r.childLanes = e.childLanes, r.lanes = e.lanes, r.child = e.child, r.memoizedProps = e.memoizedProps, r.memoizedState = e.memoizedState, r.updateQueue = e.updateQueue, t = e.dependencies, r.dependencies = t === null ? null : {
        lanes: t.lanes,
        firstContext: t.firstContext
    }, r.sibling = e.sibling, r.index = e.index, r.ref = e.ref, r
}

function ja(e, t, r, s, a, l) {
    var i = 2;
    if (s = e, typeof e == "function") Mc(e) && (i = 1); else if (typeof e == "string") i = 5; else e:switch (e) {
        case Yr:
            return Ar(r.children, a, l, t);
        case rc:
            i = 8, a |= 8;
            break;
        case Fi:
            return e = ut(12, r, t, a | 2), e.elementType = Fi, e.lanes = l, e;
        case Bi:
            return e = ut(13, r, t, a), e.elementType = Bi, e.lanes = l, e;
        case Vi:
            return e = ut(19, r, t, a), e.elementType = Vi, e.lanes = l, e;
        case Lf:
            return yl(r, a, l, t);
        default:
            if (typeof e == "object" && e !== null) switch (e.$$typeof) {
                case If:
                    i = 10;
                    break e;
                case Af:
                    i = 9;
                    break e;
                case nc:
                    i = 11;
                    break e;
                case sc:
                    i = 14;
                    break e;
                case Yt:
                    i = 16, s = null;
                    break e
            }
            throw Error(I(130, e == null ? e : typeof e, ""))
    }
    return t = ut(i, r, t, a), t.elementType = e, t.type = s, t.lanes = l, t
}

function Ar(e, t, r, s) {
    return e = ut(7, e, s, t), e.lanes = r, e
}

function yl(e, t, r, s) {
    return e = ut(22, e, s, t), e.elementType = Lf, e.lanes = r, e.stateNode = {isHidden: !1}, e
}

function ki(e, t, r) {
    return e = ut(6, e, null, t), e.lanes = r, e
}

function Si(e, t, r) {
    return t = ut(4, e.children !== null ? e.children : [], e.key, t), t.lanes = r, t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation
    }, t
}

function w0(e, t, r, s, a) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = ai(0), this.expirationTimes = ai(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ai(0), this.identifierPrefix = s, this.onRecoverableError = a, this.mutableSourceEagerHydrationData = null
}

function zc(e, t, r, s, a, l, i, o, c) {
    return e = new w0(e, t, r, o, c), t === 1 ? (t = 1, l === !0 && (t |= 8)) : t = 0, l = ut(3, null, null, t), e.current = l, l.stateNode = e, l.memoizedState = {
        element: s,
        isDehydrated: r,
        cache: null,
        transitions: null,
        pendingSuspenseBoundaries: null
    }, Nc(l), e
}

function k0(e, t, r) {
    var s = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {$$typeof: Xr, key: s == null ? null : "" + s, children: e, containerInfo: t, implementation: r}
}

function Cp(e) {
    if (!e) return vr;
    e = e._reactInternals;
    e:{
        if (Hr(e) !== e || e.tag !== 1) throw Error(I(170));
        var t = e;
        do {
            switch (t.tag) {
                case 3:
                    t = t.stateNode.context;
                    break e;
                case 1:
                    if (Je(t.type)) {
                        t = t.stateNode.__reactInternalMemoizedMergedChildContext;
                        break e
                    }
            }
            t = t.return
        } while (t !== null);
        throw Error(I(171))
    }
    if (e.tag === 1) {
        var r = e.type;
        if (Je(r)) return Cm(e, r, t)
    }
    return t
}

function Ep(e, t, r, s, a, l, i, o, c) {
    return e = zc(r, s, !0, e, a, l, i, o, c), e.context = Cp(null), r = e.current, s = Ue(), a = mr(r), l = zt(s, a), l.callback = t ?? null, dr(r, l, a), e.current.lanes = a, _s(e, a, s), qe(e, s), e
}

function vl(e, t, r, s) {
    var a = t.current, l = Ue(), i = mr(a);
    return r = Cp(r), t.context === null ? t.context = r : t.pendingContext = r, t = zt(l, i), t.payload = {element: e}, s = s === void 0 ? null : s, s !== null && (t.callback = s), e = dr(a, t, i), e !== null && (jt(e, a, i, l), ha(e, a, i)), i
}

function Xa(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
        case 5:
            return e.child.stateNode;
        default:
            return e.child.stateNode
    }
}

function Nd(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
        var r = e.retryLane;
        e.retryLane = r !== 0 && r < t ? r : t
    }
}

function Uc(e, t) {
    Nd(e, t), (e = e.alternate) && Nd(e, t)
}

function S0() {
    return null
}

var Pp = typeof reportError == "function" ? reportError : function (e) {
    console.error(e)
};

function Fc(e) {
    this._internalRoot = e
}

bl.prototype.render = Fc.prototype.render = function (e) {
    var t = this._internalRoot;
    if (t === null) throw Error(I(409));
    vl(e, t, null, null)
};
bl.prototype.unmount = Fc.prototype.unmount = function () {
    var e = this._internalRoot;
    if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        Ur(function () {
            vl(null, e, null, null)
        }), t[Ft] = null
    }
};

function bl(e) {
    this._internalRoot = e
}

bl.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
        var t = am();
        e = {blockedOn: null, target: e, priority: t};
        for (var r = 0; r < er.length && t !== 0 && t < er[r].priority; r++) ;
        er.splice(r, 0, e), r === 0 && im(e)
    }
};

function Bc(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
}

function jl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
}

function wd() {
}

function C0(e, t, r, s, a) {
    if (a) {
        if (typeof s == "function") {
            var l = s;
            s = function () {
                var u = Xa(i);
                l.call(u)
            }
        }
        var i = Ep(t, s, e, 0, null, !1, !1, "", wd);
        return e._reactRootContainer = i, e[Ft] = i.current, ps(e.nodeType === 8 ? e.parentNode : e), Ur(), i
    }
    for (; a = e.lastChild;) e.removeChild(a);
    if (typeof s == "function") {
        var o = s;
        s = function () {
            var u = Xa(c);
            o.call(u)
        }
    }
    var c = zc(e, 0, !1, null, null, !1, !1, "", wd);
    return e._reactRootContainer = c, e[Ft] = c.current, ps(e.nodeType === 8 ? e.parentNode : e), Ur(function () {
        vl(t, c, r, s)
    }), c
}

function Nl(e, t, r, s, a) {
    var l = r._reactRootContainer;
    if (l) {
        var i = l;
        if (typeof a == "function") {
            var o = a;
            a = function () {
                var c = Xa(i);
                o.call(c)
            }
        }
        vl(t, i, e, a)
    } else i = C0(r, t, e, a, s);
    return Xa(i)
}

nm = function (e) {
    switch (e.tag) {
        case 3:
            var t = e.stateNode;
            if (t.current.memoizedState.isDehydrated) {
                var r = Qn(t.pendingLanes);
                r !== 0 && (ic(t, r | 1), qe(t, ve()), !(Y & 6) && (kn = ve() + 500, kr()))
            }
            break;
        case 13:
            Ur(function () {
                var s = Bt(e, 1);
                if (s !== null) {
                    var a = Ue();
                    jt(s, e, 1, a)
                }
            }), Uc(e, 1)
    }
};
oc = function (e) {
    if (e.tag === 13) {
        var t = Bt(e, 134217728);
        if (t !== null) {
            var r = Ue();
            jt(t, e, 134217728, r)
        }
        Uc(e, 134217728)
    }
};
sm = function (e) {
    if (e.tag === 13) {
        var t = mr(e), r = Bt(e, t);
        if (r !== null) {
            var s = Ue();
            jt(r, e, t, s)
        }
        Uc(e, t)
    }
};
am = function () {
    return re
};
lm = function (e, t) {
    var r = re;
    try {
        return re = e, t()
    } finally {
        re = r
    }
};
Zi = function (e, t, r) {
    switch (t) {
        case"input":
            if (Ji(e, r), t = r.name, r.type === "radio" && t != null) {
                for (r = e; r.parentNode;) r = r.parentNode;
                for (r = r.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < r.length; t++) {
                    var s = r[t];
                    if (s !== e && s.form === e.form) {
                        var a = fl(s);
                        if (!a) throw Error(I(90));
                        Df(s), Ji(s, a)
                    }
                }
            }
            break;
        case"textarea":
            zf(e, r);
            break;
        case"select":
            t = r.value, t != null && un(e, !!r.multiple, t, !1)
    }
};
Jf = Lc;
qf = Ur;
var E0 = {usingClientEntryPoint: !1, Events: [Rs, rn, fl, Wf, Hf, Lc]},
    Vn = {findFiberByHostInstance: _r, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom"}, P0 = {
        bundleType: Vn.bundleType,
        version: Vn.version,
        rendererPackageName: Vn.rendererPackageName,
        rendererConfig: Vn.rendererConfig,
        overrideHookState: null,
        overrideHookStateDeletePath: null,
        overrideHookStateRenamePath: null,
        overrideProps: null,
        overridePropsDeletePath: null,
        overridePropsRenamePath: null,
        setErrorHandler: null,
        setSuspenseHandler: null,
        scheduleUpdate: null,
        currentDispatcherRef: Jt.ReactCurrentDispatcher,
        findHostInstanceByFiber: function (e) {
            return e = Gf(e), e === null ? null : e.stateNode
        },
        findFiberByHostInstance: Vn.findFiberByHostInstance || S0,
        findHostInstancesForRefresh: null,
        scheduleRefresh: null,
        scheduleRoot: null,
        setRefreshHandler: null,
        getCurrentFiber: null,
        reconcilerVersion: "18.3.1-next-f1338f8080-20240426"
    };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ia = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ia.isDisabled && ia.supportsFiber) try {
        ol = ia.inject(P0), Ot = ia
    } catch {
    }
}
rt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = E0;
rt.createPortal = function (e, t) {
    var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Bc(t)) throw Error(I(200));
    return k0(e, t, null, r)
};
rt.createRoot = function (e, t) {
    if (!Bc(e)) throw Error(I(299));
    var r = !1, s = "", a = Pp;
    return t != null && (t.unstable_strictMode === !0 && (r = !0), t.identifierPrefix !== void 0 && (s = t.identifierPrefix), t.onRecoverableError !== void 0 && (a = t.onRecoverableError)), t = zc(e, 1, !1, null, null, r, !1, s, a), e[Ft] = t.current, ps(e.nodeType === 8 ? e.parentNode : e), new Fc(t)
};
rt.findDOMNode = function (e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0) throw typeof e.render == "function" ? Error(I(188)) : (e = Object.keys(e).join(","), Error(I(268, e)));
    return e = Gf(t), e = e === null ? null : e.stateNode, e
};
rt.flushSync = function (e) {
    return Ur(e)
};
rt.hydrate = function (e, t, r) {
    if (!jl(t)) throw Error(I(200));
    return Nl(null, e, t, !0, r)
};
rt.hydrateRoot = function (e, t, r) {
    if (!Bc(e)) throw Error(I(405));
    var s = r != null && r.hydratedSources || null, a = !1, l = "", i = Pp;
    if (r != null && (r.unstable_strictMode === !0 && (a = !0), r.identifierPrefix !== void 0 && (l = r.identifierPrefix), r.onRecoverableError !== void 0 && (i = r.onRecoverableError)), t = Ep(t, null, e, 1, r ?? null, a, !1, l, i), e[Ft] = t.current, ps(e), s) for (e = 0; e < s.length; e++) r = s[e], a = r._getVersion, a = a(r._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [r, a] : t.mutableSourceEagerHydrationData.push(r, a);
    return new bl(t)
};
rt.render = function (e, t, r) {
    if (!jl(t)) throw Error(I(200));
    return Nl(null, e, t, !1, r)
};
rt.unmountComponentAtNode = function (e) {
    if (!jl(e)) throw Error(I(40));
    return e._reactRootContainer ? (Ur(function () {
        Nl(null, null, e, !1, function () {
            e._reactRootContainer = null, e[Ft] = null
        })
    }), !0) : !1
};
rt.unstable_batchedUpdates = Lc;
rt.unstable_renderSubtreeIntoContainer = function (e, t, r, s) {
    if (!jl(r)) throw Error(I(200));
    if (e == null || e._reactInternals === void 0) throw Error(I(38));
    return Nl(e, t, r, !1, s)
};
rt.version = "18.3.1-next-f1338f8080-20240426";

function _p() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(_p)
    } catch (e) {
        console.error(e)
    }
}

_p(), _f.exports = rt;
var Op = _f.exports, kd = Op;
zi.createRoot = kd.createRoot, zi.hydrateRoot = kd.hydrateRoot;
var Rp = {exports: {}}, Tp = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sn = j;

function _0(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t
}

var O0 = typeof Object.is == "function" ? Object.is : _0, R0 = Sn.useState, T0 = Sn.useEffect, I0 = Sn.useLayoutEffect,
    A0 = Sn.useDebugValue;

function L0(e, t) {
    var r = t(), s = R0({inst: {value: r, getSnapshot: t}}), a = s[0].inst, l = s[1];
    return I0(function () {
        a.value = r, a.getSnapshot = t, Ci(a) && l({inst: a})
    }, [e, r, t]), T0(function () {
        return Ci(a) && l({inst: a}), e(function () {
            Ci(a) && l({inst: a})
        })
    }, [e]), A0(r), r
}

function Ci(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
        var r = t();
        return !O0(e, r)
    } catch {
        return !0
    }
}

function $0(e, t) {
    return t()
}

var D0 = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? $0 : L0;
Tp.useSyncExternalStore = Sn.useSyncExternalStore !== void 0 ? Sn.useSyncExternalStore : D0;
Rp.exports = Tp;
var M0 = Rp.exports, Ip = {exports: {}}, Ap = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var wl = j, z0 = M0;

function U0(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t
}

var F0 = typeof Object.is == "function" ? Object.is : U0, B0 = z0.useSyncExternalStore, V0 = wl.useRef,
    W0 = wl.useEffect, H0 = wl.useMemo, J0 = wl.useDebugValue;
Ap.useSyncExternalStoreWithSelector = function (e, t, r, s, a) {
    var l = V0(null);
    if (l.current === null) {
        var i = {hasValue: !1, value: null};
        l.current = i
    } else i = l.current;
    l = H0(function () {
        function c(b) {
            if (!u) {
                if (u = !0, f = b, b = s(b), a !== void 0 && i.hasValue) {
                    var p = i.value;
                    if (a(p, b)) return m = p
                }
                return m = b
            }
            if (p = m, F0(f, b)) return p;
            var d = s(b);
            return a !== void 0 && a(p, d) ? (f = b, p) : (f = b, m = d)
        }

        var u = !1, f, m, y = r === void 0 ? null : r;
        return [function () {
            return c(t())
        }, y === null ? void 0 : function () {
            return c(y())
        }]
    }, [t, r, s, a]);
    var o = B0(e, l[0], l[1]);
    return W0(function () {
        i.hasValue = !0, i.value = o
    }, [o]), J0(o), o
};
Ip.exports = Ap;
var q0 = Ip.exports;

function Q0(e) {
    e()
}

let Lp = Q0;
const K0 = e => Lp = e, G0 = () => Lp, Sd = Symbol.for("react-redux-context"),
    Cd = typeof globalThis < "u" ? globalThis : {};

function X0() {
    var e;
    if (!j.createContext) return {};
    const t = (e = Cd[Sd]) != null ? e : Cd[Sd] = new Map;
    let r = t.get(j.createContext);
    return r || (r = j.createContext(null), t.set(j.createContext, r)), r
}

const br = X0();

function Vc(e = br) {
    return function () {
        return j.useContext(e)
    }
}

const $p = Vc(), Y0 = () => {
    throw new Error("uSES not initialized!")
};
let Dp = Y0;
const Z0 = e => {
    Dp = e
}, ey = (e, t) => e === t;

function ty(e = br) {
    const t = e === br ? $p : Vc(e);
    return function (s, a = {}) {
        const {
            equalityFn: l = ey,
            stabilityCheck: i = void 0,
            noopCheck: o = void 0
        } = typeof a == "function" ? {equalityFn: a} : a, {
            store: c,
            subscription: u,
            getServerState: f,
            stabilityCheck: m,
            noopCheck: y
        } = t();
        j.useRef(!0);
        const b = j.useCallback({
            [s.name](d) {
                return s(d)
            }
        }[s.name], [s, m, i]), p = Dp(u.addNestedSub, c.getState, f || c.getState, b, l);
        return j.useDebugValue(p), p
    }
}

const Ze = ty();
var Mp = {exports: {}}, ne = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _e = typeof Symbol == "function" && Symbol.for, Wc = _e ? Symbol.for("react.element") : 60103,
    Hc = _e ? Symbol.for("react.portal") : 60106, kl = _e ? Symbol.for("react.fragment") : 60107,
    Sl = _e ? Symbol.for("react.strict_mode") : 60108, Cl = _e ? Symbol.for("react.profiler") : 60114,
    El = _e ? Symbol.for("react.provider") : 60109, Pl = _e ? Symbol.for("react.context") : 60110,
    Jc = _e ? Symbol.for("react.async_mode") : 60111, _l = _e ? Symbol.for("react.concurrent_mode") : 60111,
    Ol = _e ? Symbol.for("react.forward_ref") : 60112, Rl = _e ? Symbol.for("react.suspense") : 60113,
    ry = _e ? Symbol.for("react.suspense_list") : 60120, Tl = _e ? Symbol.for("react.memo") : 60115,
    Il = _e ? Symbol.for("react.lazy") : 60116, ny = _e ? Symbol.for("react.block") : 60121,
    sy = _e ? Symbol.for("react.fundamental") : 60117, ay = _e ? Symbol.for("react.responder") : 60118,
    ly = _e ? Symbol.for("react.scope") : 60119;

function st(e) {
    if (typeof e == "object" && e !== null) {
        var t = e.$$typeof;
        switch (t) {
            case Wc:
                switch (e = e.type, e) {
                    case Jc:
                    case _l:
                    case kl:
                    case Cl:
                    case Sl:
                    case Rl:
                        return e;
                    default:
                        switch (e = e && e.$$typeof, e) {
                            case Pl:
                            case Ol:
                            case Il:
                            case Tl:
                            case El:
                                return e;
                            default:
                                return t
                        }
                }
            case Hc:
                return t
        }
    }
}

function zp(e) {
    return st(e) === _l
}

ne.AsyncMode = Jc;
ne.ConcurrentMode = _l;
ne.ContextConsumer = Pl;
ne.ContextProvider = El;
ne.Element = Wc;
ne.ForwardRef = Ol;
ne.Fragment = kl;
ne.Lazy = Il;
ne.Memo = Tl;
ne.Portal = Hc;
ne.Profiler = Cl;
ne.StrictMode = Sl;
ne.Suspense = Rl;
ne.isAsyncMode = function (e) {
    return zp(e) || st(e) === Jc
};
ne.isConcurrentMode = zp;
ne.isContextConsumer = function (e) {
    return st(e) === Pl
};
ne.isContextProvider = function (e) {
    return st(e) === El
};
ne.isElement = function (e) {
    return typeof e == "object" && e !== null && e.$$typeof === Wc
};
ne.isForwardRef = function (e) {
    return st(e) === Ol
};
ne.isFragment = function (e) {
    return st(e) === kl
};
ne.isLazy = function (e) {
    return st(e) === Il
};
ne.isMemo = function (e) {
    return st(e) === Tl
};
ne.isPortal = function (e) {
    return st(e) === Hc
};
ne.isProfiler = function (e) {
    return st(e) === Cl
};
ne.isStrictMode = function (e) {
    return st(e) === Sl
};
ne.isSuspense = function (e) {
    return st(e) === Rl
};
ne.isValidElementType = function (e) {
    return typeof e == "string" || typeof e == "function" || e === kl || e === _l || e === Cl || e === Sl || e === Rl || e === ry || typeof e == "object" && e !== null && (e.$$typeof === Il || e.$$typeof === Tl || e.$$typeof === El || e.$$typeof === Pl || e.$$typeof === Ol || e.$$typeof === sy || e.$$typeof === ay || e.$$typeof === ly || e.$$typeof === ny)
};
ne.typeOf = st;
Mp.exports = ne;
var iy = Mp.exports, Up = iy, oy = {$$typeof: !0, render: !0, defaultProps: !0, displayName: !0, propTypes: !0},
    cy = {$$typeof: !0, compare: !0, defaultProps: !0, displayName: !0, propTypes: !0, type: !0}, Fp = {};
Fp[Up.ForwardRef] = oy;
Fp[Up.Memo] = cy;
var se = {};
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qc = Symbol.for("react.element"), Qc = Symbol.for("react.portal"), Al = Symbol.for("react.fragment"),
    Ll = Symbol.for("react.strict_mode"), $l = Symbol.for("react.profiler"), Dl = Symbol.for("react.provider"),
    Ml = Symbol.for("react.context"), uy = Symbol.for("react.server_context"), zl = Symbol.for("react.forward_ref"),
    Ul = Symbol.for("react.suspense"), Fl = Symbol.for("react.suspense_list"), Bl = Symbol.for("react.memo"),
    Vl = Symbol.for("react.lazy"), dy = Symbol.for("react.offscreen"), Bp;
Bp = Symbol.for("react.module.reference");

function pt(e) {
    if (typeof e == "object" && e !== null) {
        var t = e.$$typeof;
        switch (t) {
            case qc:
                switch (e = e.type, e) {
                    case Al:
                    case $l:
                    case Ll:
                    case Ul:
                    case Fl:
                        return e;
                    default:
                        switch (e = e && e.$$typeof, e) {
                            case uy:
                            case Ml:
                            case zl:
                            case Vl:
                            case Bl:
                            case Dl:
                                return e;
                            default:
                                return t
                        }
                }
            case Qc:
                return t
        }
    }
}

se.ContextConsumer = Ml;
se.ContextProvider = Dl;
se.Element = qc;
se.ForwardRef = zl;
se.Fragment = Al;
se.Lazy = Vl;
se.Memo = Bl;
se.Portal = Qc;
se.Profiler = $l;
se.StrictMode = Ll;
se.Suspense = Ul;
se.SuspenseList = Fl;
se.isAsyncMode = function () {
    return !1
};
se.isConcurrentMode = function () {
    return !1
};
se.isContextConsumer = function (e) {
    return pt(e) === Ml
};
se.isContextProvider = function (e) {
    return pt(e) === Dl
};
se.isElement = function (e) {
    return typeof e == "object" && e !== null && e.$$typeof === qc
};
se.isForwardRef = function (e) {
    return pt(e) === zl
};
se.isFragment = function (e) {
    return pt(e) === Al
};
se.isLazy = function (e) {
    return pt(e) === Vl
};
se.isMemo = function (e) {
    return pt(e) === Bl
};
se.isPortal = function (e) {
    return pt(e) === Qc
};
se.isProfiler = function (e) {
    return pt(e) === $l
};
se.isStrictMode = function (e) {
    return pt(e) === Ll
};
se.isSuspense = function (e) {
    return pt(e) === Ul
};
se.isSuspenseList = function (e) {
    return pt(e) === Fl
};
se.isValidElementType = function (e) {
    return typeof e == "string" || typeof e == "function" || e === Al || e === $l || e === Ll || e === Ul || e === Fl || e === dy || typeof e == "object" && e !== null && (e.$$typeof === Vl || e.$$typeof === Bl || e.$$typeof === Dl || e.$$typeof === Ml || e.$$typeof === zl || e.$$typeof === Bp || e.getModuleId !== void 0)
};
se.typeOf = pt;

function fy() {
    const e = G0();
    let t = null, r = null;
    return {
        clear() {
            t = null, r = null
        }, notify() {
            e(() => {
                let s = t;
                for (; s;) s.callback(), s = s.next
            })
        }, get() {
            let s = [], a = t;
            for (; a;) s.push(a), a = a.next;
            return s
        }, subscribe(s) {
            let a = !0, l = r = {callback: s, next: null, prev: r};
            return l.prev ? l.prev.next = l : t = l, function () {
                !a || t === null || (a = !1, l.next ? l.next.prev = l.prev : r = l.prev, l.prev ? l.prev.next = l.next : t = l.next)
            }
        }
    }
}

const Ed = {
    notify() {
    }, get: () => []
};

function my(e, t) {
    let r, s = Ed, a = 0, l = !1;

    function i(d) {
        f();
        const x = s.subscribe(d);
        let h = !1;
        return () => {
            h || (h = !0, x(), m())
        }
    }

    function o() {
        s.notify()
    }

    function c() {
        p.onStateChange && p.onStateChange()
    }

    function u() {
        return l
    }

    function f() {
        a++, r || (r = e.subscribe(c), s = fy())
    }

    function m() {
        a--, r && a === 0 && (r(), r = void 0, s.clear(), s = Ed)
    }

    function y() {
        l || (l = !0, f())
    }

    function b() {
        l && (l = !1, m())
    }

    const p = {
        addNestedSub: i,
        notifyNestedSubs: o,
        handleChangeWrapper: c,
        isSubscribed: u,
        trySubscribe: y,
        tryUnsubscribe: b,
        getListeners: () => s
    };
    return p
}

const py = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u",
    hy = py ? j.useLayoutEffect : j.useEffect;

function Vp({store: e, context: t, children: r, serverState: s, stabilityCheck: a = "once", noopCheck: l = "once"}) {
    const i = j.useMemo(() => {
        const u = my(e);
        return {store: e, subscription: u, getServerState: s ? () => s : void 0, stabilityCheck: a, noopCheck: l}
    }, [e, s, a, l]), o = j.useMemo(() => e.getState(), [e]);
    hy(() => {
        const {subscription: u} = i;
        return u.onStateChange = u.notifyNestedSubs, u.trySubscribe(), o !== e.getState() && u.notifyNestedSubs(), () => {
            u.tryUnsubscribe(), u.onStateChange = void 0
        }
    }, [i, o]);
    const c = t || br;
    return j.createElement(c.Provider, {value: i}, r)
}

function Wp(e = br) {
    const t = e === br ? $p : Vc(e);
    return function () {
        const {store: s} = t();
        return s
    }
}

const xy = Wp();

function gy(e = br) {
    const t = e === br ? xy : Wp(e);
    return function () {
        return t().dispatch
    }
}

const Jr = gy();
Z0(q0.useSyncExternalStoreWithSelector);
K0(Op.unstable_batchedUpdates);

function vt(e) {
    for (var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) r[s - 1] = arguments[s];
    throw Error("[Immer] minified error nr: " + e + (r.length ? " " + r.map(function (a) {
        return "'" + a + "'"
    }).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf")
}

function jr(e) {
    return !!e && !!e[ue]
}

function Wt(e) {
    var t;
    return !!e && (function (r) {
        if (!r || typeof r != "object") return !1;
        var s = Object.getPrototypeOf(r);
        if (s === null) return !0;
        var a = Object.hasOwnProperty.call(s, "constructor") && s.constructor;
        return a === Object || typeof a == "function" && Function.toString.call(a) === Cy
    }(e) || Array.isArray(e) || !!e[Ad] || !!(!((t = e.constructor) === null || t === void 0) && t[Ad]) || Kc(e) || Gc(e))
}

function Fr(e, t, r) {
    r === void 0 && (r = !1), In(e) === 0 ? (r ? Object.keys : gn)(e).forEach(function (s) {
        r && typeof s == "symbol" || t(s, e[s], e)
    }) : e.forEach(function (s, a) {
        return t(a, s, e)
    })
}

function In(e) {
    var t = e[ue];
    return t ? t.i > 3 ? t.i - 4 : t.i : Array.isArray(e) ? 1 : Kc(e) ? 2 : Gc(e) ? 3 : 0
}

function xn(e, t) {
    return In(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t)
}

function yy(e, t) {
    return In(e) === 2 ? e.get(t) : e[t]
}

function Hp(e, t, r) {
    var s = In(e);
    s === 2 ? e.set(t, r) : s === 3 ? e.add(r) : e[t] = r
}

function Jp(e, t) {
    return e === t ? e !== 0 || 1 / e == 1 / t : e != e && t != t
}

function Kc(e) {
    return ky && e instanceof Map
}

function Gc(e) {
    return Sy && e instanceof Set
}

function Pr(e) {
    return e.o || e.t
}

function Xc(e) {
    if (Array.isArray(e)) return Array.prototype.slice.call(e);
    var t = Qp(e);
    delete t[ue];
    for (var r = gn(t), s = 0; s < r.length; s++) {
        var a = r[s], l = t[a];
        l.writable === !1 && (l.writable = !0, l.configurable = !0), (l.get || l.set) && (t[a] = {
            configurable: !0,
            writable: !0,
            enumerable: l.enumerable,
            value: e[a]
        })
    }
    return Object.create(Object.getPrototypeOf(e), t)
}

function Yc(e, t) {
    return t === void 0 && (t = !1), Zc(e) || jr(e) || !Wt(e) || (In(e) > 1 && (e.set = e.add = e.clear = e.delete = vy), Object.freeze(e), t && Fr(e, function (r, s) {
        return Yc(s, !0)
    }, !0)), e
}

function vy() {
    vt(2)
}

function Zc(e) {
    return e == null || typeof e != "object" || Object.isFrozen(e)
}

function Tt(e) {
    var t = $o[e];
    return t || vt(18, e), t
}

function by(e, t) {
    $o[e] || ($o[e] = t)
}

function Io() {
    return ws
}

function Ei(e, t) {
    t && (Tt("Patches"), e.u = [], e.s = [], e.v = t)
}

function Ya(e) {
    Ao(e), e.p.forEach(jy), e.p = null
}

function Ao(e) {
    e === ws && (ws = e.l)
}

function Pd(e) {
    return ws = {p: [], l: ws, h: e, m: !0, _: 0}
}

function jy(e) {
    var t = e[ue];
    t.i === 0 || t.i === 1 ? t.j() : t.g = !0
}

function Pi(e, t) {
    t._ = t.p.length;
    var r = t.p[0], s = e !== void 0 && e !== r;
    return t.h.O || Tt("ES5").S(t, e, s), s ? (r[ue].P && (Ya(t), vt(4)), Wt(e) && (e = Za(t, e), t.l || el(t, e)), t.u && Tt("Patches").M(r[ue].t, e, t.u, t.s)) : e = Za(t, r, []), Ya(t), t.u && t.v(t.u, t.s), e !== qp ? e : void 0
}

function Za(e, t, r) {
    if (Zc(t)) return t;
    var s = t[ue];
    if (!s) return Fr(t, function (o, c) {
        return _d(e, s, t, o, c, r)
    }, !0), t;
    if (s.A !== e) return t;
    if (!s.P) return el(e, s.t, !0), s.t;
    if (!s.I) {
        s.I = !0, s.A._--;
        var a = s.i === 4 || s.i === 5 ? s.o = Xc(s.k) : s.o, l = a, i = !1;
        s.i === 3 && (l = new Set(a), a.clear(), i = !0), Fr(l, function (o, c) {
            return _d(e, s, a, o, c, r, i)
        }), el(e, a, !1), r && e.u && Tt("Patches").N(s, r, e.u, e.s)
    }
    return s.o
}

function _d(e, t, r, s, a, l, i) {
    if (jr(a)) {
        var o = Za(e, a, l && t && t.i !== 3 && !xn(t.R, s) ? l.concat(s) : void 0);
        if (Hp(r, s, o), !jr(o)) return;
        e.m = !1
    } else i && r.add(a);
    if (Wt(a) && !Zc(a)) {
        if (!e.h.D && e._ < 1) return;
        Za(e, a), t && t.A.l || el(e, a)
    }
}

function el(e, t, r) {
    r === void 0 && (r = !1), !e.l && e.h.D && e.m && Yc(t, r)
}

function _i(e, t) {
    var r = e[ue];
    return (r ? Pr(r) : e)[t]
}

function Od(e, t) {
    if (t in e) for (var r = Object.getPrototypeOf(e); r;) {
        var s = Object.getOwnPropertyDescriptor(r, t);
        if (s) return s;
        r = Object.getPrototypeOf(r)
    }
}

function rr(e) {
    e.P || (e.P = !0, e.l && rr(e.l))
}

function Oi(e) {
    e.o || (e.o = Xc(e.t))
}

function Lo(e, t, r) {
    var s = Kc(t) ? Tt("MapSet").F(t, r) : Gc(t) ? Tt("MapSet").T(t, r) : e.O ? function (a, l) {
        var i = Array.isArray(a),
            o = {i: i ? 1 : 0, A: l ? l.A : Io(), P: !1, I: !1, R: {}, l, t: a, k: null, o: null, j: null, C: !1},
            c = o, u = ks;
        i && (c = [o], u = Gn);
        var f = Proxy.revocable(c, u), m = f.revoke, y = f.proxy;
        return o.k = y, o.j = m, y
    }(t, r) : Tt("ES5").J(t, r);
    return (r ? r.A : Io()).p.push(s), s
}

function Ny(e) {
    return jr(e) || vt(22, e), function t(r) {
        if (!Wt(r)) return r;
        var s, a = r[ue], l = In(r);
        if (a) {
            if (!a.P && (a.i < 4 || !Tt("ES5").K(a))) return a.t;
            a.I = !0, s = Rd(r, l), a.I = !1
        } else s = Rd(r, l);
        return Fr(s, function (i, o) {
            a && yy(a.t, i) === o || Hp(s, i, t(o))
        }), l === 3 ? new Set(s) : s
    }(e)
}

function Rd(e, t) {
    switch (t) {
        case 2:
            return new Map(e);
        case 3:
            return Array.from(e)
    }
    return Xc(e)
}

function wy() {
    function e(l, i) {
        var o = a[l];
        return o ? o.enumerable = i : a[l] = o = {
            configurable: !0, enumerable: i, get: function () {
                var c = this[ue];
                return ks.get(c, l)
            }, set: function (c) {
                var u = this[ue];
                ks.set(u, l, c)
            }
        }, o
    }

    function t(l) {
        for (var i = l.length - 1; i >= 0; i--) {
            var o = l[i][ue];
            if (!o.P) switch (o.i) {
                case 5:
                    s(o) && rr(o);
                    break;
                case 4:
                    r(o) && rr(o)
            }
        }
    }

    function r(l) {
        for (var i = l.t, o = l.k, c = gn(o), u = c.length - 1; u >= 0; u--) {
            var f = c[u];
            if (f !== ue) {
                var m = i[f];
                if (m === void 0 && !xn(i, f)) return !0;
                var y = o[f], b = y && y[ue];
                if (b ? b.t !== m : !Jp(y, m)) return !0
            }
        }
        var p = !!i[ue];
        return c.length !== gn(i).length + (p ? 0 : 1)
    }

    function s(l) {
        var i = l.k;
        if (i.length !== l.t.length) return !0;
        var o = Object.getOwnPropertyDescriptor(i, i.length - 1);
        if (o && !o.get) return !0;
        for (var c = 0; c < i.length; c++) if (!i.hasOwnProperty(c)) return !0;
        return !1
    }

    var a = {};
    by("ES5", {
        J: function (l, i) {
            var o = Array.isArray(l), c = function (f, m) {
                    if (f) {
                        for (var y = Array(m.length), b = 0; b < m.length; b++) Object.defineProperty(y, "" + b, e(b, !0));
                        return y
                    }
                    var p = Qp(m);
                    delete p[ue];
                    for (var d = gn(p), x = 0; x < d.length; x++) {
                        var h = d[x];
                        p[h] = e(h, f || !!p[h].enumerable)
                    }
                    return Object.create(Object.getPrototypeOf(m), p)
                }(o, l),
                u = {i: o ? 5 : 4, A: i ? i.A : Io(), P: !1, I: !1, R: {}, l: i, t: l, k: c, o: null, g: !1, C: !1};
            return Object.defineProperty(c, ue, {value: u, writable: !0}), c
        }, S: function (l, i, o) {
            o ? jr(i) && i[ue].A === l && t(l.p) : (l.u && function c(u) {
                if (u && typeof u == "object") {
                    var f = u[ue];
                    if (f) {
                        var m = f.t, y = f.k, b = f.R, p = f.i;
                        if (p === 4) Fr(y, function (v) {
                            v !== ue && (m[v] !== void 0 || xn(m, v) ? b[v] || c(y[v]) : (b[v] = !0, rr(f)))
                        }), Fr(m, function (v) {
                            y[v] !== void 0 || xn(y, v) || (b[v] = !1, rr(f))
                        }); else if (p === 5) {
                            if (s(f) && (rr(f), b.length = !0), y.length < m.length) for (var d = y.length; d < m.length; d++) b[d] = !1; else for (var x = m.length; x < y.length; x++) b[x] = !0;
                            for (var h = Math.min(y.length, m.length), g = 0; g < h; g++) y.hasOwnProperty(g) || (b[g] = !0), b[g] === void 0 && c(y[g])
                        }
                    }
                }
            }(l.p[0]), t(l.p))
        }, K: function (l) {
            return l.i === 4 ? r(l) : s(l)
        }
    })
}

var Td, ws, eu = typeof Symbol < "u" && typeof Symbol("x") == "symbol", ky = typeof Map < "u", Sy = typeof Set < "u",
    Id = typeof Proxy < "u" && Proxy.revocable !== void 0 && typeof Reflect < "u",
    qp = eu ? Symbol.for("immer-nothing") : ((Td = {})["immer-nothing"] = !0, Td),
    Ad = eu ? Symbol.for("immer-draftable") : "__$immer_draftable",
    ue = eu ? Symbol.for("immer-state") : "__$immer_state", Cy = "" + Object.prototype.constructor,
    gn = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : Object.getOwnPropertySymbols !== void 0 ? function (e) {
        return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))
    } : Object.getOwnPropertyNames, Qp = Object.getOwnPropertyDescriptors || function (e) {
        var t = {};
        return gn(e).forEach(function (r) {
            t[r] = Object.getOwnPropertyDescriptor(e, r)
        }), t
    }, $o = {}, ks = {
        get: function (e, t) {
            if (t === ue) return e;
            var r = Pr(e);
            if (!xn(r, t)) return function (a, l, i) {
                var o, c = Od(l, i);
                return c ? "value" in c ? c.value : (o = c.get) === null || o === void 0 ? void 0 : o.call(a.k) : void 0
            }(e, r, t);
            var s = r[t];
            return e.I || !Wt(s) ? s : s === _i(e.t, t) ? (Oi(e), e.o[t] = Lo(e.A.h, s, e)) : s
        }, has: function (e, t) {
            return t in Pr(e)
        }, ownKeys: function (e) {
            return Reflect.ownKeys(Pr(e))
        }, set: function (e, t, r) {
            var s = Od(Pr(e), t);
            if (s != null && s.set) return s.set.call(e.k, r), !0;
            if (!e.P) {
                var a = _i(Pr(e), t), l = a == null ? void 0 : a[ue];
                if (l && l.t === r) return e.o[t] = r, e.R[t] = !1, !0;
                if (Jp(r, a) && (r !== void 0 || xn(e.t, t))) return !0;
                Oi(e), rr(e)
            }
            return e.o[t] === r && (r !== void 0 || t in e.o) || Number.isNaN(r) && Number.isNaN(e.o[t]) || (e.o[t] = r, e.R[t] = !0), !0
        }, deleteProperty: function (e, t) {
            return _i(e.t, t) !== void 0 || t in e.t ? (e.R[t] = !1, Oi(e), rr(e)) : delete e.R[t], e.o && delete e.o[t], !0
        }, getOwnPropertyDescriptor: function (e, t) {
            var r = Pr(e), s = Reflect.getOwnPropertyDescriptor(r, t);
            return s && {writable: !0, configurable: e.i !== 1 || t !== "length", enumerable: s.enumerable, value: r[t]}
        }, defineProperty: function () {
            vt(11)
        }, getPrototypeOf: function (e) {
            return Object.getPrototypeOf(e.t)
        }, setPrototypeOf: function () {
            vt(12)
        }
    }, Gn = {};
Fr(ks, function (e, t) {
    Gn[e] = function () {
        return arguments[0] = arguments[0][0], t.apply(this, arguments)
    }
}), Gn.deleteProperty = function (e, t) {
    return Gn.set.call(this, e, t, void 0)
}, Gn.set = function (e, t, r) {
    return ks.set.call(this, e[0], t, r, e[0])
};
var Ey = function () {
    function e(r) {
        var s = this;
        this.O = Id, this.D = !0, this.produce = function (a, l, i) {
            if (typeof a == "function" && typeof l != "function") {
                var o = l;
                l = a;
                var c = s;
                return function (d) {
                    var x = this;
                    d === void 0 && (d = o);
                    for (var h = arguments.length, g = Array(h > 1 ? h - 1 : 0), v = 1; v < h; v++) g[v - 1] = arguments[v];
                    return c.produce(d, function (w) {
                        var N;
                        return (N = l).call.apply(N, [x, w].concat(g))
                    })
                }
            }
            var u;
            if (typeof l != "function" && vt(6), i !== void 0 && typeof i != "function" && vt(7), Wt(a)) {
                var f = Pd(s), m = Lo(s, a, void 0), y = !0;
                try {
                    u = l(m), y = !1
                } finally {
                    y ? Ya(f) : Ao(f)
                }
                return typeof Promise < "u" && u instanceof Promise ? u.then(function (d) {
                    return Ei(f, i), Pi(d, f)
                }, function (d) {
                    throw Ya(f), d
                }) : (Ei(f, i), Pi(u, f))
            }
            if (!a || typeof a != "object") {
                if ((u = l(a)) === void 0 && (u = a), u === qp && (u = void 0), s.D && Yc(u, !0), i) {
                    var b = [], p = [];
                    Tt("Patches").M(a, u, b, p), i(b, p)
                }
                return u
            }
            vt(21, a)
        }, this.produceWithPatches = function (a, l) {
            if (typeof a == "function") return function (u) {
                for (var f = arguments.length, m = Array(f > 1 ? f - 1 : 0), y = 1; y < f; y++) m[y - 1] = arguments[y];
                return s.produceWithPatches(u, function (b) {
                    return a.apply(void 0, [b].concat(m))
                })
            };
            var i, o, c = s.produce(a, l, function (u, f) {
                i = u, o = f
            });
            return typeof Promise < "u" && c instanceof Promise ? c.then(function (u) {
                return [u, i, o]
            }) : [c, i, o]
        }, typeof (r == null ? void 0 : r.useProxies) == "boolean" && this.setUseProxies(r.useProxies), typeof (r == null ? void 0 : r.autoFreeze) == "boolean" && this.setAutoFreeze(r.autoFreeze)
    }

    var t = e.prototype;
    return t.createDraft = function (r) {
        Wt(r) || vt(8), jr(r) && (r = Ny(r));
        var s = Pd(this), a = Lo(this, r, void 0);
        return a[ue].C = !0, Ao(s), a
    }, t.finishDraft = function (r, s) {
        var a = r && r[ue], l = a.A;
        return Ei(l, s), Pi(void 0, l)
    }, t.setAutoFreeze = function (r) {
        this.D = r
    }, t.setUseProxies = function (r) {
        r && !Id && vt(20), this.O = r
    }, t.applyPatches = function (r, s) {
        var a;
        for (a = s.length - 1; a >= 0; a--) {
            var l = s[a];
            if (l.path.length === 0 && l.op === "replace") {
                r = l.value;
                break
            }
        }
        a > -1 && (s = s.slice(a + 1));
        var i = Tt("Patches").$;
        return jr(r) ? i(r, s) : this.produce(r, function (o) {
            return i(o, s)
        })
    }, e
}(), tt = new Ey, Kp = tt.produce;
tt.produceWithPatches.bind(tt);
tt.setAutoFreeze.bind(tt);
tt.setUseProxies.bind(tt);
tt.applyPatches.bind(tt);
tt.createDraft.bind(tt);
tt.finishDraft.bind(tt);

function Ss(e) {
    "@babel/helpers - typeof";
    return Ss = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function (t) {
        return typeof t
    } : function (t) {
        return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    }, Ss(e)
}

function Py(e, t) {
    if (Ss(e) != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
        var s = r.call(e, t);
        if (Ss(s) != "object") return s;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (t === "string" ? String : Number)(e)
}

function _y(e) {
    var t = Py(e, "string");
    return Ss(t) == "symbol" ? t : t + ""
}

function Oy(e, t, r) {
    return (t = _y(t)) in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}

function Ld(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var s = Object.getOwnPropertySymbols(e);
        t && (s = s.filter(function (a) {
            return Object.getOwnPropertyDescriptor(e, a).enumerable
        })), r.push.apply(r, s)
    }
    return r
}

function $d(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t] != null ? arguments[t] : {};
        t % 2 ? Ld(Object(r), !0).forEach(function (s) {
            Oy(e, s, r[s])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ld(Object(r)).forEach(function (s) {
            Object.defineProperty(e, s, Object.getOwnPropertyDescriptor(r, s))
        })
    }
    return e
}

function Le(e) {
    return "Minified Redux error #" + e + "; visit https://redux.js.org/Errors?code=" + e + " for the full message or use the non-minified dev environment for full errors. "
}

var Dd = function () {
    return typeof Symbol == "function" && Symbol.observable || "@@observable"
}(), Ri = function () {
    return Math.random().toString(36).substring(7).split("").join(".")
}, tl = {
    INIT: "@@redux/INIT" + Ri(), REPLACE: "@@redux/REPLACE" + Ri(), PROBE_UNKNOWN_ACTION: function () {
        return "@@redux/PROBE_UNKNOWN_ACTION" + Ri()
    }
};

function Ry(e) {
    if (typeof e != "object" || e === null) return !1;
    for (var t = e; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
    return Object.getPrototypeOf(e) === t
}

function Gp(e, t, r) {
    var s;
    if (typeof t == "function" && typeof r == "function" || typeof r == "function" && typeof arguments[3] == "function") throw new Error(Le(0));
    if (typeof t == "function" && typeof r > "u" && (r = t, t = void 0), typeof r < "u") {
        if (typeof r != "function") throw new Error(Le(1));
        return r(Gp)(e, t)
    }
    if (typeof e != "function") throw new Error(Le(2));
    var a = e, l = t, i = [], o = i, c = !1;

    function u() {
        o === i && (o = i.slice())
    }

    function f() {
        if (c) throw new Error(Le(3));
        return l
    }

    function m(d) {
        if (typeof d != "function") throw new Error(Le(4));
        if (c) throw new Error(Le(5));
        var x = !0;
        return u(), o.push(d), function () {
            if (x) {
                if (c) throw new Error(Le(6));
                x = !1, u();
                var g = o.indexOf(d);
                o.splice(g, 1), i = null
            }
        }
    }

    function y(d) {
        if (!Ry(d)) throw new Error(Le(7));
        if (typeof d.type > "u") throw new Error(Le(8));
        if (c) throw new Error(Le(9));
        try {
            c = !0, l = a(l, d)
        } finally {
            c = !1
        }
        for (var x = i = o, h = 0; h < x.length; h++) {
            var g = x[h];
            g()
        }
        return d
    }

    function b(d) {
        if (typeof d != "function") throw new Error(Le(10));
        a = d, y({type: tl.REPLACE})
    }

    function p() {
        var d, x = m;
        return d = {
            subscribe: function (g) {
                if (typeof g != "object" || g === null) throw new Error(Le(11));

                function v() {
                    g.next && g.next(f())
                }

                v();
                var w = x(v);
                return {unsubscribe: w}
            }
        }, d[Dd] = function () {
            return this
        }, d
    }

    return y({type: tl.INIT}), s = {dispatch: y, subscribe: m, getState: f, replaceReducer: b}, s[Dd] = p, s
}

function Ty(e) {
    Object.keys(e).forEach(function (t) {
        var r = e[t], s = r(void 0, {type: tl.INIT});
        if (typeof s > "u") throw new Error(Le(12));
        if (typeof r(void 0, {type: tl.PROBE_UNKNOWN_ACTION()}) > "u") throw new Error(Le(13))
    })
}

function Iy(e) {
    for (var t = Object.keys(e), r = {}, s = 0; s < t.length; s++) {
        var a = t[s];
        typeof e[a] == "function" && (r[a] = e[a])
    }
    var l = Object.keys(r), i;
    try {
        Ty(r)
    } catch (o) {
        i = o
    }
    return function (c, u) {
        if (c === void 0 && (c = {}), i) throw i;
        for (var f = !1, m = {}, y = 0; y < l.length; y++) {
            var b = l[y], p = r[b], d = c[b], x = p(d, u);
            if (typeof x > "u") throw u && u.type, new Error(Le(14));
            m[b] = x, f = f || x !== d
        }
        return f = f || l.length !== Object.keys(c).length, f ? m : c
    }
}

function rl() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
    return t.length === 0 ? function (s) {
        return s
    } : t.length === 1 ? t[0] : t.reduce(function (s, a) {
        return function () {
            return s(a.apply(void 0, arguments))
        }
    })
}

function Ay() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
    return function (s) {
        return function () {
            var a = s.apply(void 0, arguments), l = function () {
                throw new Error(Le(15))
            }, i = {
                getState: a.getState, dispatch: function () {
                    return l.apply(void 0, arguments)
                }
            }, o = t.map(function (c) {
                return c(i)
            });
            return l = rl.apply(void 0, o)(a.dispatch), $d($d({}, a), {}, {dispatch: l})
        }
    }
}

function Xp(e) {
    var t = function (s) {
        var a = s.dispatch, l = s.getState;
        return function (i) {
            return function (o) {
                return typeof o == "function" ? o(a, l, e) : i(o)
            }
        }
    };
    return t
}

var Do = Xp();
Do.withExtraArgument = Xp;
var Yp = function () {
        var e = function (t, r) {
            return e = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (s, a) {
                s.__proto__ = a
            } || function (s, a) {
                for (var l in a) Object.prototype.hasOwnProperty.call(a, l) && (s[l] = a[l])
            }, e(t, r)
        };
        return function (t, r) {
            if (typeof r != "function" && r !== null) throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
            e(t, r);

            function s() {
                this.constructor = t
            }

            t.prototype = r === null ? Object.create(r) : (s.prototype = r.prototype, new s)
        }
    }(), Ly = function (e, t) {
        var r = {
            label: 0, sent: function () {
                if (l[0] & 1) throw l[1];
                return l[1]
            }, trys: [], ops: []
        }, s, a, l, i;
        return i = {
            next: o(0),
            throw: o(1),
            return: o(2)
        }, typeof Symbol == "function" && (i[Symbol.iterator] = function () {
            return this
        }), i;

        function o(u) {
            return function (f) {
                return c([u, f])
            }
        }

        function c(u) {
            if (s) throw new TypeError("Generator is already executing.");
            for (; r;) try {
                if (s = 1, a && (l = u[0] & 2 ? a.return : u[0] ? a.throw || ((l = a.return) && l.call(a), 0) : a.next) && !(l = l.call(a, u[1])).done) return l;
                switch (a = 0, l && (u = [u[0] & 2, l.value]), u[0]) {
                    case 0:
                    case 1:
                        l = u;
                        break;
                    case 4:
                        return r.label++, {value: u[1], done: !1};
                    case 5:
                        r.label++, a = u[1], u = [0];
                        continue;
                    case 7:
                        u = r.ops.pop(), r.trys.pop();
                        continue;
                    default:
                        if (l = r.trys, !(l = l.length > 0 && l[l.length - 1]) && (u[0] === 6 || u[0] === 2)) {
                            r = 0;
                            continue
                        }
                        if (u[0] === 3 && (!l || u[1] > l[0] && u[1] < l[3])) {
                            r.label = u[1];
                            break
                        }
                        if (u[0] === 6 && r.label < l[1]) {
                            r.label = l[1], l = u;
                            break
                        }
                        if (l && r.label < l[2]) {
                            r.label = l[2], r.ops.push(u);
                            break
                        }
                        l[2] && r.ops.pop(), r.trys.pop();
                        continue
                }
                u = t.call(e, r)
            } catch (f) {
                u = [6, f], a = 0
            } finally {
                s = l = 0
            }
            if (u[0] & 5) throw u[1];
            return {value: u[0] ? u[1] : void 0, done: !0}
        }
    }, Cn = function (e, t) {
        for (var r = 0, s = t.length, a = e.length; r < s; r++, a++) e[a] = t[r];
        return e
    }, $y = Object.defineProperty, Dy = Object.defineProperties, My = Object.getOwnPropertyDescriptors,
    Md = Object.getOwnPropertySymbols, zy = Object.prototype.hasOwnProperty, Uy = Object.prototype.propertyIsEnumerable,
    zd = function (e, t, r) {
        return t in e ? $y(e, t, {enumerable: !0, configurable: !0, writable: !0, value: r}) : e[t] = r
    }, hr = function (e, t) {
        for (var r in t || (t = {})) zy.call(t, r) && zd(e, r, t[r]);
        if (Md) for (var s = 0, a = Md(t); s < a.length; s++) {
            var r = a[s];
            Uy.call(t, r) && zd(e, r, t[r])
        }
        return e
    }, Ti = function (e, t) {
        return Dy(e, My(t))
    }, Fy = function (e, t, r) {
        return new Promise(function (s, a) {
            var l = function (c) {
                try {
                    o(r.next(c))
                } catch (u) {
                    a(u)
                }
            }, i = function (c) {
                try {
                    o(r.throw(c))
                } catch (u) {
                    a(u)
                }
            }, o = function (c) {
                return c.done ? s(c.value) : Promise.resolve(c.value).then(l, i)
            };
            o((r = r.apply(e, t)).next())
        })
    },
    By = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function () {
        if (arguments.length !== 0) return typeof arguments[0] == "object" ? rl : rl.apply(null, arguments)
    };

function Vy(e) {
    if (typeof e != "object" || e === null) return !1;
    var t = Object.getPrototypeOf(e);
    if (t === null) return !0;
    for (var r = t; Object.getPrototypeOf(r) !== null;) r = Object.getPrototypeOf(r);
    return t === r
}

function xr(e, t) {
    function r() {
        for (var s = [], a = 0; a < arguments.length; a++) s[a] = arguments[a];
        if (t) {
            var l = t.apply(void 0, s);
            if (!l) throw new Error("prepareAction did not return an object");
            return hr(hr({
                type: e,
                payload: l.payload
            }, "meta" in l && {meta: l.meta}), "error" in l && {error: l.error})
        }
        return {type: e, payload: s[0]}
    }

    return r.toString = function () {
        return "" + e
    }, r.type = e, r.match = function (s) {
        return s.type === e
    }, r
}

var Wy = function (e) {
    Yp(t, e);

    function t() {
        for (var r = [], s = 0; s < arguments.length; s++) r[s] = arguments[s];
        var a = e.apply(this, r) || this;
        return Object.setPrototypeOf(a, t.prototype), a
    }

    return Object.defineProperty(t, Symbol.species, {
        get: function () {
            return t
        }, enumerable: !1, configurable: !0
    }), t.prototype.concat = function () {
        for (var r = [], s = 0; s < arguments.length; s++) r[s] = arguments[s];
        return e.prototype.concat.apply(this, r)
    }, t.prototype.prepend = function () {
        for (var r = [], s = 0; s < arguments.length; s++) r[s] = arguments[s];
        return r.length === 1 && Array.isArray(r[0]) ? new (t.bind.apply(t, Cn([void 0], r[0].concat(this)))) : new (t.bind.apply(t, Cn([void 0], r.concat(this))))
    }, t
}(Array), Hy = function (e) {
    Yp(t, e);

    function t() {
        for (var r = [], s = 0; s < arguments.length; s++) r[s] = arguments[s];
        var a = e.apply(this, r) || this;
        return Object.setPrototypeOf(a, t.prototype), a
    }

    return Object.defineProperty(t, Symbol.species, {
        get: function () {
            return t
        }, enumerable: !1, configurable: !0
    }), t.prototype.concat = function () {
        for (var r = [], s = 0; s < arguments.length; s++) r[s] = arguments[s];
        return e.prototype.concat.apply(this, r)
    }, t.prototype.prepend = function () {
        for (var r = [], s = 0; s < arguments.length; s++) r[s] = arguments[s];
        return r.length === 1 && Array.isArray(r[0]) ? new (t.bind.apply(t, Cn([void 0], r[0].concat(this)))) : new (t.bind.apply(t, Cn([void 0], r.concat(this))))
    }, t
}(Array);

function Mo(e) {
    return Wt(e) ? Kp(e, function () {
    }) : e
}

function Jy(e) {
    return typeof e == "boolean"
}

function qy() {
    return function (t) {
        return Qy(t)
    }
}

function Qy(e) {
    e === void 0 && (e = {});
    var t = e.thunk, r = t === void 0 ? !0 : t;
    e.immutableCheck, e.serializableCheck, e.actionCreatorCheck;
    var s = new Wy;
    return r && (Jy(r) ? s.push(Do) : s.push(Do.withExtraArgument(r.extraArgument))), s
}

function Zp(e) {
    var t = qy(), r = e || {}, s = r.reducer, a = s === void 0 ? void 0 : s, l = r.middleware,
        i = l === void 0 ? t() : l, o = r.devTools, c = o === void 0 ? !0 : o, u = r.preloadedState,
        f = u === void 0 ? void 0 : u, m = r.enhancers, y = m === void 0 ? void 0 : m, b;
    if (typeof a == "function") b = a; else if (Vy(a)) b = Iy(a); else throw new Error('"reducer" is a required argument, and must be a function or an object of functions that can be passed to combineReducers');
    var p = i;
    typeof p == "function" && (p = p(t));
    var d = Ay.apply(void 0, p), x = rl;
    c && (x = By(hr({trace: !1}, typeof c == "object" && c)));
    var h = new Hy(d), g = h;
    Array.isArray(y) ? g = Cn([d], y) : typeof y == "function" && (g = y(h));
    var v = x.apply(void 0, g);
    return Gp(b, f, v)
}

function eh(e) {
    var t = {}, r = [], s, a = {
        addCase: function (l, i) {
            var o = typeof l == "string" ? l : l.type;
            if (!o) throw new Error("`builder.addCase` cannot be called with an empty action type");
            if (o in t) throw new Error("`builder.addCase` cannot be called with two reducers for the same action type");
            return t[o] = i, a
        }, addMatcher: function (l, i) {
            return r.push({matcher: l, reducer: i}), a
        }, addDefaultCase: function (l) {
            return s = l, a
        }
    };
    return e(a), [t, r, s]
}

function Ky(e) {
    return typeof e == "function"
}

function Gy(e, t, r, s) {
    r === void 0 && (r = []);
    var a = typeof t == "function" ? eh(t) : [t, r, s], l = a[0], i = a[1], o = a[2], c;
    if (Ky(e)) c = function () {
        return Mo(e())
    }; else {
        var u = Mo(e);
        c = function () {
            return u
        }
    }

    function f(m, y) {
        m === void 0 && (m = c());
        var b = Cn([l[y.type]], i.filter(function (p) {
            var d = p.matcher;
            return d(y)
        }).map(function (p) {
            var d = p.reducer;
            return d
        }));
        return b.filter(function (p) {
            return !!p
        }).length === 0 && (b = [o]), b.reduce(function (p, d) {
            if (d) if (jr(p)) {
                var x = p, h = d(x, y);
                return h === void 0 ? p : h
            } else {
                if (Wt(p)) return Kp(p, function (g) {
                    return d(g, y)
                });
                var h = d(p, y);
                if (h === void 0) {
                    if (p === null) return p;
                    throw Error("A case reducer on a non-draftable value must not return undefined")
                }
                return h
            }
            return p
        }, m)
    }

    return f.getInitialState = c, f
}

function Xy(e, t) {
    return e + "/" + t
}

function tu(e) {
    var t = e.name;
    if (!t) throw new Error("`name` is a required option for createSlice");
    var r = typeof e.initialState == "function" ? e.initialState : Mo(e.initialState), s = e.reducers || {},
        a = Object.keys(s), l = {}, i = {}, o = {};
    a.forEach(function (f) {
        var m = s[f], y = Xy(t, f), b, p;
        "reducer" in m ? (b = m.reducer, p = m.prepare) : b = m, l[f] = b, i[y] = b, o[f] = p ? xr(y, p) : xr(y)
    });

    function c() {
        var f = typeof e.extraReducers == "function" ? eh(e.extraReducers) : [e.extraReducers], m = f[0],
            y = m === void 0 ? {} : m, b = f[1], p = b === void 0 ? [] : b, d = f[2], x = d === void 0 ? void 0 : d,
            h = hr(hr({}, y), i);
        return Gy(r, function (g) {
            for (var v in h) g.addCase(v, h[v]);
            for (var w = 0, N = p; w < N.length; w++) {
                var k = N[w];
                g.addMatcher(k.matcher, k.reducer)
            }
            x && g.addDefaultCase(x)
        })
    }

    var u;
    return {
        name: t, reducer: function (f, m) {
            return u || (u = c()), u(f, m)
        }, actions: o, caseReducers: l, getInitialState: function () {
            return u || (u = c()), u.getInitialState()
        }
    }
}

var Yy = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW", Zy = function (e) {
    e === void 0 && (e = 21);
    for (var t = "", r = e; r--;) t += Yy[Math.random() * 64 | 0];
    return t
}, ev = ["name", "message", "stack", "code"], Ii = function () {
    function e(t, r) {
        this.payload = t, this.meta = r
    }

    return e
}(), Ud = function () {
    function e(t, r) {
        this.payload = t, this.meta = r
    }

    return e
}(), tv = function (e) {
    if (typeof e == "object" && e !== null) {
        for (var t = {}, r = 0, s = ev; r < s.length; r++) {
            var a = s[r];
            typeof e[a] == "string" && (t[a] = e[a])
        }
        return t
    }
    return {message: String(e)}
}, It = function () {
    function e(t, r, s) {
        var a = xr(t + "/fulfilled", function (u, f, m, y) {
            return {payload: u, meta: Ti(hr({}, y || {}), {arg: m, requestId: f, requestStatus: "fulfilled"})}
        }), l = xr(t + "/pending", function (u, f, m) {
            return {payload: void 0, meta: Ti(hr({}, m || {}), {arg: f, requestId: u, requestStatus: "pending"})}
        }), i = xr(t + "/rejected", function (u, f, m, y, b) {
            return {
                payload: y,
                error: (s && s.serializeError || tv)(u || "Rejected"),
                meta: Ti(hr({}, b || {}), {
                    arg: m,
                    requestId: f,
                    rejectedWithValue: !!y,
                    requestStatus: "rejected",
                    aborted: (u == null ? void 0 : u.name) === "AbortError",
                    condition: (u == null ? void 0 : u.name) === "ConditionError"
                })
            }
        }), o = typeof AbortController < "u" ? AbortController : function () {
            function u() {
                this.signal = {
                    aborted: !1, addEventListener: function () {
                    }, dispatchEvent: function () {
                        return !1
                    }, onabort: function () {
                    }, removeEventListener: function () {
                    }, reason: void 0, throwIfAborted: function () {
                    }
                }
            }

            return u.prototype.abort = function () {
            }, u
        }();

        function c(u) {
            return function (f, m, y) {
                var b = s != null && s.idGenerator ? s.idGenerator(u) : Zy(), p = new o, d;

                function x(g) {
                    d = g, p.abort()
                }

                var h = function () {
                    return Fy(this, null, function () {
                        var g, v, w, N, k, E, R;
                        return Ly(this, function (z) {
                            switch (z.label) {
                                case 0:
                                    return z.trys.push([0, 4, , 5]), N = (g = s == null ? void 0 : s.condition) == null ? void 0 : g.call(s, u, {
                                        getState: m,
                                        extra: y
                                    }), nv(N) ? [4, N] : [3, 2];
                                case 1:
                                    N = z.sent(), z.label = 2;
                                case 2:
                                    if (N === !1 || p.signal.aborted) throw {
                                        name: "ConditionError",
                                        message: "Aborted due to condition callback returning false."
                                    };
                                    return k = new Promise(function ($, L) {
                                        return p.signal.addEventListener("abort", function () {
                                            return L({name: "AbortError", message: d || "Aborted"})
                                        })
                                    }), f(l(b, u, (v = s == null ? void 0 : s.getPendingMeta) == null ? void 0 : v.call(s, {
                                        requestId: b,
                                        arg: u
                                    }, {
                                        getState: m,
                                        extra: y
                                    }))), [4, Promise.race([k, Promise.resolve(r(u, {
                                        dispatch: f,
                                        getState: m,
                                        extra: y,
                                        requestId: b,
                                        signal: p.signal,
                                        abort: x,
                                        rejectWithValue: function ($, L) {
                                            return new Ii($, L)
                                        },
                                        fulfillWithValue: function ($, L) {
                                            return new Ud($, L)
                                        }
                                    })).then(function ($) {
                                        if ($ instanceof Ii) throw $;
                                        return $ instanceof Ud ? a($.payload, b, u, $.meta) : a($, b, u)
                                    })])];
                                case 3:
                                    return w = z.sent(), [3, 5];
                                case 4:
                                    return E = z.sent(), w = E instanceof Ii ? i(null, b, u, E.payload, E.meta) : i(E, b, u), [3, 5];
                                case 5:
                                    return R = s && !s.dispatchConditionRejection && i.match(w) && w.meta.condition, R || f(w), [2, w]
                            }
                        })
                    })
                }();
                return Object.assign(h, {
                    abort: x, requestId: b, arg: u, unwrap: function () {
                        return h.then(rv)
                    }
                })
            }
        }

        return Object.assign(c, {pending: l, rejected: i, fulfilled: a, typePrefix: t})
    }

    return e.withTypes = function () {
        return e
    }, e
}();

function rv(e) {
    if (e.meta && e.meta.rejectedWithValue) throw e.payload;
    if (e.error) throw e.error;
    return e.payload
}

function nv(e) {
    return e !== null && typeof e == "object" && typeof e.then == "function"
}

var ru = "listenerMiddleware";
xr(ru + "/add");
xr(ru + "/removeAll");
xr(ru + "/remove");
var Fd;
typeof queueMicrotask == "function" && queueMicrotask.bind(typeof window < "u" ? window : typeof global < "u" ? global : globalThis);
wy();
const Bd = e => new Promise(t => setTimeout(t, e)), Pt = {
    getAll: async () => (await Bd(300), {data: JSON.parse(localStorage.getItem("misat_products") || "[]")}),
    getById: async e => (await Bd(200), {data: JSON.parse(localStorage.getItem("misat_products") || "[]").find(s => s.id === e)}),
    create: async e => {
        const t = JSON.parse(localStorage.getItem("misat_products") || "[]"), r = {...e, id: Date.now()};
        return t.push(r), localStorage.setItem("misat_products", JSON.stringify(t)), {data: r}
    },
    update: async (e, t) => {
        const r = JSON.parse(localStorage.getItem("misat_products") || "[]"), s = r.findIndex(a => a.id === e);
        return s !== -1 && (r[s] = {...r[s], ...t}, localStorage.setItem("misat_products", JSON.stringify(r))), {data: r[s]}
    },
    delete: async e => {
        const r = JSON.parse(localStorage.getItem("misat_products") || "[]").filter(s => s.id !== e);
        return localStorage.setItem("misat_products", JSON.stringify(r)), {data: {success: !0}}
    }
}, wt = {}, th = {}, Wn = {
    getAll: async () => ({data: JSON.parse(localStorage.getItem("misat_categories") || "[]")}),
    getById: async e => ({data: JSON.parse(localStorage.getItem("misat_categories") || "[]").find(s => s.id === e)}),
    create: async e => {
        const t = JSON.parse(localStorage.getItem("misat_categories") || "[]"), r = {...e, id: Date.now()};
        return t.push(r), localStorage.setItem("misat_categories", JSON.stringify(t)), {data: r}
    },
    update: async (e, t) => {
        const r = JSON.parse(localStorage.getItem("misat_categories") || "[]"), s = r.findIndex(a => a.id === e);
        return s !== -1 && (r[s] = {...r[s], ...t}, localStorage.setItem("misat_categories", JSON.stringify(r))), {data: r[s]}
    },
    delete: async e => {
        const r = JSON.parse(localStorage.getItem("misat_categories") || "[]").filter(s => s.id !== e);
        return localStorage.setItem("misat_categories", JSON.stringify(r)), {data: {success: !0}}
    }
}, ee = {
    USERS: "misat_users",
    PRODUCTS: "misat_products",
    CART: "misat_cart",
    ORDERS: "misat_orders",
    REVIEWS: "misat_reviews",
    FAVORITES: "misat_favorites",
    CURRENT_USER: "misat_current_user",
    GIFT_CARDS: "misat_gift_cards",
    CHAT_MESSAGES: "misat_chat_messages",
    CATEGORIES: "misat_categories",
    PROMOCODES: "misat_promocodes"
}, sv = () => {
    localStorage.getItem(ee.USERS) || localStorage.setItem(ee.USERS, JSON.stringify([])), localStorage.getItem(ee.PRODUCTS) || localStorage.setItem(ee.PRODUCTS, JSON.stringify([])), localStorage.getItem(ee.CART) || localStorage.setItem(ee.CART, JSON.stringify([])), localStorage.getItem(ee.ORDERS) || localStorage.setItem(ee.ORDERS, JSON.stringify([])), localStorage.getItem(ee.REVIEWS) || localStorage.setItem(ee.REVIEWS, JSON.stringify([])), localStorage.getItem(ee.FAVORITES) || localStorage.setItem(ee.FAVORITES, JSON.stringify([])), localStorage.getItem(ee.GIFT_CARDS) || localStorage.setItem(ee.GIFT_CARDS, JSON.stringify([])), localStorage.getItem(ee.CHAT_MESSAGES) || localStorage.setItem(ee.CHAT_MESSAGES, JSON.stringify([])), localStorage.getItem(ee.CATEGORIES) || localStorage.setItem(ee.CATEGORIES, JSON.stringify([])), localStorage.getItem(ee.PROMOCODES) || localStorage.setItem(ee.PROMOCODES, JSON.stringify([]))
};
sv();
const En = () => JSON.parse(localStorage.getItem(ee.USERS) || "[]"), nl = e => {
        localStorage.setItem(ee.USERS, JSON.stringify(e))
    }, at = () => {
        const e = localStorage.getItem(ee.CURRENT_USER);
        return e ? JSON.parse(e) : null
    }, rh = (e, t) => {
        const r = En(), s = r.findIndex(a => a.id === e);
        if (s !== -1) {
            r[s].balance = (r[s].balance || 0) + t, nl(r);
            const a = at();
            return a && a.id === e && (a.balance = r[s].balance, localStorage.setItem(ee.CURRENT_USER, JSON.stringify(a))), !0
        }
        return !1
    }, av = (e, t) => {
        const r = En(), s = r.findIndex(a => a.id === e);
        if (s !== -1 && (r[s].balance || 0) >= t) {
            r[s].balance = (r[s].balance || 0) - t, nl(r);
            const a = at();
            return a && a.id === e && (a.balance = r[s].balance, localStorage.setItem(ee.CURRENT_USER, JSON.stringify(a))), !0
        }
        return !1
    }, nu = () => JSON.parse(localStorage.getItem(ee.PRODUCTS) || "[]"),
    lv = e => JSON.parse(localStorage.getItem(ee.CART) || "[]").filter(r => r.userId === e), iv = e => {
        localStorage.setItem(ee.CART, JSON.stringify(e))
    }, ov = e => {
        const r = lv(e).filter(s => s.userId !== e);
        iv(r)
    }, Wl = () => JSON.parse(localStorage.getItem(ee.ORDERS) || "[]"), nh = e => {
        localStorage.setItem(ee.ORDERS, JSON.stringify(e))
    }, cv = (e, t, r, s, a, l, i, o) => {
        const c = Wl(), u = {
            id: `MISAT-${Date.now()}`,
            userId: e,
            items: t,
            total: r,
            prepaymentAmount: s,
            remainingAmount: a,
            paymentStatus: a > 0 ? "partial" : "prepaid",
            status: "pending",
            address: l,
            phone: i,
            comment: o,
            created_at: new Date().toISOString()
        };
        return c.push(u), nh(c), ov(e), u
    },
    sh = e => Wl().filter(r => r.userId === e).sort((r, s) => new Date(s.created_at).getTime() - new Date(r.created_at).getTime()),
    Is = () => Wl(), uv = (e, t) => {
        const r = Wl(), s = r.find(a => a.id === e);
        s && (s.status = t, nh(r))
    }, dv = () => {
        const e = nu(), t = Is(), r = En();
        return {
            totalProducts: e.length,
            totalOrders: t.length,
            totalUsers: r.length,
            totalRevenue: t.reduce((s, a) => s + a.total, 0),
            pendingOrders: t.filter(s => s.status === "pending").length,
            lowStock: e.filter(s => s.stock < 10).length
        }
    }, As = () => {
        const e = localStorage.getItem("guest_cart");
        if (e) try {
            return JSON.parse(e)
        } catch {
            return []
        }
        return []
    }, Ls = e => {
        localStorage.setItem("guest_cart", JSON.stringify(e))
    }, fv = {items: As(), total: 0, loading: !1}, su = It("cart/fetch", async () => at() ? (await wt.get()).data : []),
    Pn = It("cart/add", async ({productId: e, quantity: t, size: r, product: s}) => {
        const a = at();
        let l;
        if (s && s.price && s.image) l = s; else try {
            l = (await Pt.getById(e)).data
        } catch {
            l = {
                id: e,
                name: "Товар",
                price: 0,
                image: "https://placehold.co/400x400/eeeeee/cccccc?text=No+Image",
                sizes: ["S", "M", "L"],
                stockType: "in_stock",
                preorderDays: null,
                prepaymentPercent: 100
            }
        }
        const i = {
            id: Date.now(),
            productId: l.id,
            name: l.name,
            price: l.price,
            quantity: t,
            size: r,
            image: l.image,
            stockType: l.stockType,
            preorderDays: l.preorderDays,
            prepaymentPercent: l.prepaymentPercent
        };
        if (a) return await wt.add(e, t, r), (await wt.get()).data;
        {
            const o = As(), c = o.findIndex(u => u.productId === e && u.size === r);
            return c !== -1 ? o[c].quantity += t : o.push(i), Ls(o), o
        }
    }), ah = It("cart/update", async ({itemId: e, quantity: t}) => {
        if (at()) return await wt.update(e, t), (await wt.get()).data;
        {
            const s = As(), a = s.findIndex(l => l.id === e);
            return a !== -1 && (s[a].quantity = t, Ls(s)), s
        }
    }), lh = It("cart/remove", async e => {
        if (at()) return await wt.remove(e), (await wt.get()).data;
        {
            const s = As().filter(a => a.id !== e);
            return Ls(s), s
        }
    }), au = It("cart/clear", async () => at() ? (await wt.clear(), (await wt.get()).data) : (Ls([]), [])),
    ih = It("cart/merge", async () => {
        if (!at()) return [];
        const t = As();
        if (t.length === 0) return [];
        for (const s of t) await wt.add(s.productId, s.quantity, s.size);
        return Ls([]), (await wt.get()).data
    }), mv = tu({
        name: "cart", initialState: fv, reducers: {}, extraReducers: e => {
            e.addCase(su.fulfilled, (t, r) => {
                t.items = r.payload, t.total = r.payload.reduce((s, a) => s + a.price * a.quantity, 0)
            }).addCase(Pn.fulfilled, (t, r) => {
                t.items = r.payload, t.total = r.payload.reduce((s, a) => s + a.price * a.quantity, 0)
            }).addCase(ah.fulfilled, (t, r) => {
                t.items = r.payload, t.total = r.payload.reduce((s, a) => s + a.price * a.quantity, 0)
            }).addCase(lh.fulfilled, (t, r) => {
                t.items = r.payload, t.total = r.payload.reduce((s, a) => s + a.price * a.quantity, 0)
            }).addCase(au.fulfilled, t => {
                t.items = [], t.total = 0
            }).addCase(ih.fulfilled, (t, r) => {
                t.items = r.payload, t.total = r.payload.reduce((s, a) => s + a.price * a.quantity, 0)
            })
        }
    }), oh = mv.reducer, pv = {items: [], loading: !1},
    ch = It("favorites/fetch", async () => at() ? (await th.get()).data : []), $s = It("favorites/toggle", async e => {
        const t = await th.toggle(e);
        return {productId: e, isFavorite: t.data.isFavorite}
    }), hv = tu({
        name: "favorites", initialState: pv, reducers: {}, extraReducers: e => {
            e.addCase(ch.fulfilled, (t, r) => {
                t.items = r.payload
            }).addCase($s.fulfilled, (t, r) => {
                r.payload.isFavorite ? t.items.push(r.payload.productId) : t.items = t.items.filter(s => s !== r.payload.productId)
            })
        }
    }), uh = hv.reducer;

function dh(e, t) {
    return function () {
        return e.apply(t, arguments)
    }
}

const {toString: xv} = Object.prototype, {getPrototypeOf: lu} = Object, {iterator: Hl, toStringTag: fh} = Symbol,
    Jl = (e => t => {
        const r = xv.call(t);
        return e[r] || (e[r] = r.slice(8, -1).toLowerCase())
    })(Object.create(null)), kt = e => (e = e.toLowerCase(), t => Jl(t) === e),
    ql = e => t => typeof t === e, {isArray: An} = Array, _n = ql("undefined");

function Ds(e) {
    return e !== null && !_n(e) && e.constructor !== null && !_n(e.constructor) && Qe(e.constructor.isBuffer) && e.constructor.isBuffer(e)
}

const mh = kt("ArrayBuffer");

function gv(e) {
    let t;
    return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && mh(e.buffer), t
}

const yv = ql("string"), Qe = ql("function"), ph = ql("number"), Ms = e => e !== null && typeof e == "object",
    vv = e => e === !0 || e === !1, Na = e => {
        if (Jl(e) !== "object") return !1;
        const t = lu(e);
        return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(fh in e) && !(Hl in e)
    }, bv = e => {
        if (!Ms(e) || Ds(e)) return !1;
        try {
            return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype
        } catch {
            return !1
        }
    }, jv = kt("Date"), Nv = kt("File"), wv = e => !!(e && typeof e.uri < "u"), kv = e => e && typeof e.getParts < "u",
    Sv = kt("Blob"), Cv = kt("FileList"), Ev = e => Ms(e) && Qe(e.pipe);

function Pv() {
    return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}
}

const Vd = Pv(), Wd = typeof Vd.FormData < "u" ? Vd.FormData : void 0, _v = e => {
        let t;
        return e && (Wd && e instanceof Wd || Qe(e.append) && ((t = Jl(e)) === "formdata" || t === "object" && Qe(e.toString) && e.toString() === "[object FormData]"))
    }, Ov = kt("URLSearchParams"), [Rv, Tv, Iv, Av] = ["ReadableStream", "Request", "Response", "Headers"].map(kt),
    Lv = e => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");

function zs(e, t, {allOwnKeys: r = !1} = {}) {
    if (e === null || typeof e > "u") return;
    let s, a;
    if (typeof e != "object" && (e = [e]), An(e)) for (s = 0, a = e.length; s < a; s++) t.call(null, e[s], s, e); else {
        if (Ds(e)) return;
        const l = r ? Object.getOwnPropertyNames(e) : Object.keys(e), i = l.length;
        let o;
        for (s = 0; s < i; s++) o = l[s], t.call(null, e[o], o, e)
    }
}

function hh(e, t) {
    if (Ds(e)) return null;
    t = t.toLowerCase();
    const r = Object.keys(e);
    let s = r.length, a;
    for (; s-- > 0;) if (a = r[s], t === a.toLowerCase()) return a;
    return null
}

const Tr = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global,
    xh = e => !_n(e) && e !== Tr;

function zo() {
    const {caseless: e, skipUndefined: t} = xh(this) && this || {}, r = {}, s = (a, l) => {
        if (l === "__proto__" || l === "constructor" || l === "prototype") return;
        const i = e && hh(r, l) || l;
        Na(r[i]) && Na(a) ? r[i] = zo(r[i], a) : Na(a) ? r[i] = zo({}, a) : An(a) ? r[i] = a.slice() : (!t || !_n(a)) && (r[i] = a)
    };
    for (let a = 0, l = arguments.length; a < l; a++) arguments[a] && zs(arguments[a], s);
    return r
}

const $v = (e, t, r, {allOwnKeys: s} = {}) => (zs(t, (a, l) => {
    r && Qe(a) ? Object.defineProperty(e, l, {
        value: dh(a, r),
        writable: !0,
        enumerable: !0,
        configurable: !0
    }) : Object.defineProperty(e, l, {value: a, writable: !0, enumerable: !0, configurable: !0})
}, {allOwnKeys: s}), e), Dv = e => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Mv = (e, t, r, s) => {
    e.prototype = Object.create(t.prototype, s), Object.defineProperty(e.prototype, "constructor", {
        value: e,
        writable: !0,
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e, "super", {value: t.prototype}), r && Object.assign(e.prototype, r)
}, zv = (e, t, r, s) => {
    let a, l, i;
    const o = {};
    if (t = t || {}, e == null) return t;
    do {
        for (a = Object.getOwnPropertyNames(e), l = a.length; l-- > 0;) i = a[l], (!s || s(i, e, t)) && !o[i] && (t[i] = e[i], o[i] = !0);
        e = r !== !1 && lu(e)
    } while (e && (!r || r(e, t)) && e !== Object.prototype);
    return t
}, Uv = (e, t, r) => {
    e = String(e), (r === void 0 || r > e.length) && (r = e.length), r -= t.length;
    const s = e.indexOf(t, r);
    return s !== -1 && s === r
}, Fv = e => {
    if (!e) return null;
    if (An(e)) return e;
    let t = e.length;
    if (!ph(t)) return null;
    const r = new Array(t);
    for (; t-- > 0;) r[t] = e[t];
    return r
}, Bv = (e => t => e && t instanceof e)(typeof Uint8Array < "u" && lu(Uint8Array)), Vv = (e, t) => {
    const s = (e && e[Hl]).call(e);
    let a;
    for (; (a = s.next()) && !a.done;) {
        const l = a.value;
        t.call(e, l[0], l[1])
    }
}, Wv = (e, t) => {
    let r;
    const s = [];
    for (; (r = e.exec(t)) !== null;) s.push(r);
    return s
}, Hv = kt("HTMLFormElement"), Jv = e => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (r, s, a) {
    return s.toUpperCase() + a
}), Hd = (({hasOwnProperty: e}) => (t, r) => e.call(t, r))(Object.prototype), qv = kt("RegExp"), gh = (e, t) => {
    const r = Object.getOwnPropertyDescriptors(e), s = {};
    zs(r, (a, l) => {
        let i;
        (i = t(a, l, e)) !== !1 && (s[l] = i || a)
    }), Object.defineProperties(e, s)
}, Qv = e => {
    gh(e, (t, r) => {
        if (Qe(e) && ["arguments", "caller", "callee"].indexOf(r) !== -1) return !1;
        const s = e[r];
        if (Qe(s)) {
            if (t.enumerable = !1, "writable" in t) {
                t.writable = !1;
                return
            }
            t.set || (t.set = () => {
                throw Error("Can not rewrite read-only method '" + r + "'")
            })
        }
    })
}, Kv = (e, t) => {
    const r = {}, s = a => {
        a.forEach(l => {
            r[l] = !0
        })
    };
    return An(e) ? s(e) : s(String(e).split(t)), r
}, Gv = () => {
}, Xv = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;

function Yv(e) {
    return !!(e && Qe(e.append) && e[fh] === "FormData" && e[Hl])
}

const Zv = e => {
        const t = new Array(10), r = (s, a) => {
            if (Ms(s)) {
                if (t.indexOf(s) >= 0) return;
                if (Ds(s)) return s;
                if (!("toJSON" in s)) {
                    t[a] = s;
                    const l = An(s) ? [] : {};
                    return zs(s, (i, o) => {
                        const c = r(i, a + 1);
                        !_n(c) && (l[o] = c)
                    }), t[a] = void 0, l
                }
            }
            return s
        };
        return r(e, 0)
    }, eb = kt("AsyncFunction"), tb = e => e && (Ms(e) || Qe(e)) && Qe(e.then) && Qe(e.catch),
    yh = ((e, t) => e ? setImmediate : t ? ((r, s) => (Tr.addEventListener("message", ({source: a, data: l}) => {
        a === Tr && l === r && s.length && s.shift()()
    }, !1), a => {
        s.push(a), Tr.postMessage(r, "*")
    }))(`axios@${Math.random()}`, []) : r => setTimeout(r))(typeof setImmediate == "function", Qe(Tr.postMessage)),
    rb = typeof queueMicrotask < "u" ? queueMicrotask.bind(Tr) : typeof process < "u" && process.nextTick || yh,
    nb = e => e != null && Qe(e[Hl]), C = {
        isArray: An,
        isArrayBuffer: mh,
        isBuffer: Ds,
        isFormData: _v,
        isArrayBufferView: gv,
        isString: yv,
        isNumber: ph,
        isBoolean: vv,
        isObject: Ms,
        isPlainObject: Na,
        isEmptyObject: bv,
        isReadableStream: Rv,
        isRequest: Tv,
        isResponse: Iv,
        isHeaders: Av,
        isUndefined: _n,
        isDate: jv,
        isFile: Nv,
        isReactNativeBlob: wv,
        isReactNative: kv,
        isBlob: Sv,
        isRegExp: qv,
        isFunction: Qe,
        isStream: Ev,
        isURLSearchParams: Ov,
        isTypedArray: Bv,
        isFileList: Cv,
        forEach: zs,
        merge: zo,
        extend: $v,
        trim: Lv,
        stripBOM: Dv,
        inherits: Mv,
        toFlatObject: zv,
        kindOf: Jl,
        kindOfTest: kt,
        endsWith: Uv,
        toArray: Fv,
        forEachEntry: Vv,
        matchAll: Wv,
        isHTMLForm: Hv,
        hasOwnProperty: Hd,
        hasOwnProp: Hd,
        reduceDescriptors: gh,
        freezeMethods: Qv,
        toObjectSet: Kv,
        toCamelCase: Jv,
        noop: Gv,
        toFiniteNumber: Xv,
        findKey: hh,
        global: Tr,
        isContextDefined: xh,
        isSpecCompliantForm: Yv,
        toJSONObject: Zv,
        isAsyncFn: eb,
        isThenable: tb,
        setImmediate: yh,
        asap: rb,
        isIterable: nb
    };
let q = class vh extends Error {
    static from(t, r, s, a, l, i) {
        const o = new vh(t.message, r || t.code, s, a, l);
        return o.cause = t, o.name = t.name, t.status != null && o.status == null && (o.status = t.status), i && Object.assign(o, i), o
    }

    constructor(t, r, s, a, l) {
        super(t), Object.defineProperty(this, "message", {
            value: t,
            enumerable: !0,
            writable: !0,
            configurable: !0
        }), this.name = "AxiosError", this.isAxiosError = !0, r && (this.code = r), s && (this.config = s), a && (this.request = a), l && (this.response = l, this.status = l.status)
    }

    toJSON() {
        return {
            message: this.message,
            name: this.name,
            description: this.description,
            number: this.number,
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            config: C.toJSONObject(this.config),
            code: this.code,
            status: this.status
        }
    }
};
q.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
q.ERR_BAD_OPTION = "ERR_BAD_OPTION";
q.ECONNABORTED = "ECONNABORTED";
q.ETIMEDOUT = "ETIMEDOUT";
q.ERR_NETWORK = "ERR_NETWORK";
q.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
q.ERR_DEPRECATED = "ERR_DEPRECATED";
q.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
q.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
q.ERR_CANCELED = "ERR_CANCELED";
q.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
q.ERR_INVALID_URL = "ERR_INVALID_URL";
const sb = null;

function Uo(e) {
    return C.isPlainObject(e) || C.isArray(e)
}

function bh(e) {
    return C.endsWith(e, "[]") ? e.slice(0, -2) : e
}

function Ai(e, t, r) {
    return e ? e.concat(t).map(function (a, l) {
        return a = bh(a), !r && l ? "[" + a + "]" : a
    }).join(r ? "." : "") : t
}

function ab(e) {
    return C.isArray(e) && !e.some(Uo)
}

const lb = C.toFlatObject(C, {}, null, function (t) {
    return /^is[A-Z]/.test(t)
});

function Ql(e, t, r) {
    if (!C.isObject(e)) throw new TypeError("target must be an object");
    t = t || new FormData, r = C.toFlatObject(r, {metaTokens: !0, dots: !1, indexes: !1}, !1, function (d, x) {
        return !C.isUndefined(x[d])
    });
    const s = r.metaTokens, a = r.visitor || f, l = r.dots, i = r.indexes,
        c = (r.Blob || typeof Blob < "u" && Blob) && C.isSpecCompliantForm(t);
    if (!C.isFunction(a)) throw new TypeError("visitor must be a function");

    function u(p) {
        if (p === null) return "";
        if (C.isDate(p)) return p.toISOString();
        if (C.isBoolean(p)) return p.toString();
        if (!c && C.isBlob(p)) throw new q("Blob is not supported. Use a Buffer instead.");
        return C.isArrayBuffer(p) || C.isTypedArray(p) ? c && typeof Blob == "function" ? new Blob([p]) : Buffer.from(p) : p
    }

    function f(p, d, x) {
        let h = p;
        if (C.isReactNative(t) && C.isReactNativeBlob(p)) return t.append(Ai(x, d, l), u(p)), !1;
        if (p && !x && typeof p == "object") {
            if (C.endsWith(d, "{}")) d = s ? d : d.slice(0, -2), p = JSON.stringify(p); else if (C.isArray(p) && ab(p) || (C.isFileList(p) || C.endsWith(d, "[]")) && (h = C.toArray(p))) return d = bh(d), h.forEach(function (v, w) {
                !(C.isUndefined(v) || v === null) && t.append(i === !0 ? Ai([d], w, l) : i === null ? d : d + "[]", u(v))
            }), !1
        }
        return Uo(p) ? !0 : (t.append(Ai(x, d, l), u(p)), !1)
    }

    const m = [], y = Object.assign(lb, {defaultVisitor: f, convertValue: u, isVisitable: Uo});

    function b(p, d) {
        if (!C.isUndefined(p)) {
            if (m.indexOf(p) !== -1) throw Error("Circular reference detected in " + d.join("."));
            m.push(p), C.forEach(p, function (h, g) {
                (!(C.isUndefined(h) || h === null) && a.call(t, h, C.isString(g) ? g.trim() : g, d, y)) === !0 && b(h, d ? d.concat(g) : [g])
            }), m.pop()
        }
    }

    if (!C.isObject(e)) throw new TypeError("data must be an object");
    return b(e), t
}

function Jd(e) {
    const t = {"!": "%21", "'": "%27", "(": "%28", ")": "%29", "~": "%7E", "%20": "+", "%00": "\0"};
    return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (s) {
        return t[s]
    })
}

function iu(e, t) {
    this._pairs = [], e && Ql(e, this, t)
}

const jh = iu.prototype;
jh.append = function (t, r) {
    this._pairs.push([t, r])
};
jh.toString = function (t) {
    const r = t ? function (s) {
        return t.call(this, s, Jd)
    } : Jd;
    return this._pairs.map(function (a) {
        return r(a[0]) + "=" + r(a[1])
    }, "").join("&")
};

function ib(e) {
    return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+")
}

function Nh(e, t, r) {
    if (!t) return e;
    const s = r && r.encode || ib, a = C.isFunction(r) ? {serialize: r} : r, l = a && a.serialize;
    let i;
    if (l ? i = l(t, a) : i = C.isURLSearchParams(t) ? t.toString() : new iu(t, a).toString(s), i) {
        const o = e.indexOf("#");
        o !== -1 && (e = e.slice(0, o)), e += (e.indexOf("?") === -1 ? "?" : "&") + i
    }
    return e
}

class qd {
    constructor() {
        this.handlers = []
    }

    use(t, r, s) {
        return this.handlers.push({
            fulfilled: t,
            rejected: r,
            synchronous: s ? s.synchronous : !1,
            runWhen: s ? s.runWhen : null
        }), this.handlers.length - 1
    }

    eject(t) {
        this.handlers[t] && (this.handlers[t] = null)
    }

    clear() {
        this.handlers && (this.handlers = [])
    }

    forEach(t) {
        C.forEach(this.handlers, function (s) {
            s !== null && t(s)
        })
    }
}

const ou = {silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1, legacyInterceptorReqResOrdering: !0},
    ob = typeof URLSearchParams < "u" ? URLSearchParams : iu, cb = typeof FormData < "u" ? FormData : null,
    ub = typeof Blob < "u" ? Blob : null, db = {
        isBrowser: !0,
        classes: {URLSearchParams: ob, FormData: cb, Blob: ub},
        protocols: ["http", "https", "file", "blob", "url", "data"]
    }, cu = typeof window < "u" && typeof document < "u", Fo = typeof navigator == "object" && navigator || void 0,
    fb = cu && (!Fo || ["ReactNative", "NativeScript", "NS"].indexOf(Fo.product) < 0),
    mb = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && typeof self.importScripts == "function",
    pb = cu && window.location.href || "http://localhost", hb = Object.freeze(Object.defineProperty({
        __proto__: null,
        hasBrowserEnv: cu,
        hasStandardBrowserEnv: fb,
        hasStandardBrowserWebWorkerEnv: mb,
        navigator: Fo,
        origin: pb
    }, Symbol.toStringTag, {value: "Module"})), De = {...hb, ...db};

function xb(e, t) {
    return Ql(e, new De.classes.URLSearchParams, {
        visitor: function (r, s, a, l) {
            return De.isNode && C.isBuffer(r) ? (this.append(s, r.toString("base64")), !1) : l.defaultVisitor.apply(this, arguments)
        }, ...t
    })
}

function gb(e) {
    return C.matchAll(/\w+|\[(\w*)]/g, e).map(t => t[0] === "[]" ? "" : t[1] || t[0])
}

function yb(e) {
    const t = {}, r = Object.keys(e);
    let s;
    const a = r.length;
    let l;
    for (s = 0; s < a; s++) l = r[s], t[l] = e[l];
    return t
}

function wh(e) {
    function t(r, s, a, l) {
        let i = r[l++];
        if (i === "__proto__") return !0;
        const o = Number.isFinite(+i), c = l >= r.length;
        return i = !i && C.isArray(a) ? a.length : i, c ? (C.hasOwnProp(a, i) ? a[i] = [a[i], s] : a[i] = s, !o) : ((!a[i] || !C.isObject(a[i])) && (a[i] = []), t(r, s, a[i], l) && C.isArray(a[i]) && (a[i] = yb(a[i])), !o)
    }

    if (C.isFormData(e) && C.isFunction(e.entries)) {
        const r = {};
        return C.forEachEntry(e, (s, a) => {
            t(gb(s), a, r, 0)
        }), r
    }
    return null
}

function vb(e, t, r) {
    if (C.isString(e)) try {
        return (t || JSON.parse)(e), C.trim(e)
    } catch (s) {
        if (s.name !== "SyntaxError") throw s
    }
    return (r || JSON.stringify)(e)
}

const Us = {
    transitional: ou,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function (t, r) {
        const s = r.getContentType() || "", a = s.indexOf("application/json") > -1, l = C.isObject(t);
        if (l && C.isHTMLForm(t) && (t = new FormData(t)), C.isFormData(t)) return a ? JSON.stringify(wh(t)) : t;
        if (C.isArrayBuffer(t) || C.isBuffer(t) || C.isStream(t) || C.isFile(t) || C.isBlob(t) || C.isReadableStream(t)) return t;
        if (C.isArrayBufferView(t)) return t.buffer;
        if (C.isURLSearchParams(t)) return r.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
        let o;
        if (l) {
            if (s.indexOf("application/x-www-form-urlencoded") > -1) return xb(t, this.formSerializer).toString();
            if ((o = C.isFileList(t)) || s.indexOf("multipart/form-data") > -1) {
                const c = this.env && this.env.FormData;
                return Ql(o ? {"files[]": t} : t, c && new c, this.formSerializer)
            }
        }
        return l || a ? (r.setContentType("application/json", !1), vb(t)) : t
    }],
    transformResponse: [function (t) {
        const r = this.transitional || Us.transitional, s = r && r.forcedJSONParsing, a = this.responseType === "json";
        if (C.isResponse(t) || C.isReadableStream(t)) return t;
        if (t && C.isString(t) && (s && !this.responseType || a)) {
            const i = !(r && r.silentJSONParsing) && a;
            try {
                return JSON.parse(t, this.parseReviver)
            } catch (o) {
                if (i) throw o.name === "SyntaxError" ? q.from(o, q.ERR_BAD_RESPONSE, this, null, this.response) : o
            }
        }
        return t
    }],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {FormData: De.classes.FormData, Blob: De.classes.Blob},
    validateStatus: function (t) {
        return t >= 200 && t < 300
    },
    headers: {common: {Accept: "application/json, text/plain, */*", "Content-Type": void 0}}
};
C.forEach(["delete", "get", "head", "post", "put", "patch"], e => {
    Us.headers[e] = {}
});
const bb = C.toObjectSet(["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"]),
    jb = e => {
        const t = {};
        let r, s, a;
        return e && e.split(`
`).forEach(function (i) {
            a = i.indexOf(":"), r = i.substring(0, a).trim().toLowerCase(), s = i.substring(a + 1).trim(), !(!r || t[r] && bb[r]) && (r === "set-cookie" ? t[r] ? t[r].push(s) : t[r] = [s] : t[r] = t[r] ? t[r] + ", " + s : s)
        }), t
    }, Qd = Symbol("internals"), Nb = e => !/[\r\n]/.test(e);

function kh(e, t) {
    if (!(e === !1 || e == null)) {
        if (C.isArray(e)) {
            e.forEach(r => kh(r, t));
            return
        }
        if (!Nb(String(e))) throw new Error(`Invalid character in header content ["${t}"]`)
    }
}

function Hn(e) {
    return e && String(e).trim().toLowerCase()
}

function wb(e) {
    let t = e.length;
    for (; t > 0;) {
        const r = e.charCodeAt(t - 1);
        if (r !== 10 && r !== 13) break;
        t -= 1
    }
    return t === e.length ? e : e.slice(0, t)
}

function wa(e) {
    return e === !1 || e == null ? e : C.isArray(e) ? e.map(wa) : wb(String(e))
}

function kb(e) {
    const t = Object.create(null), r = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let s;
    for (; s = r.exec(e);) t[s[1]] = s[2];
    return t
}

const Sb = e => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());

function Li(e, t, r, s, a) {
    if (C.isFunction(s)) return s.call(this, t, r);
    if (a && (t = r), !!C.isString(t)) {
        if (C.isString(s)) return t.indexOf(s) !== -1;
        if (C.isRegExp(s)) return s.test(t)
    }
}

function Cb(e) {
    return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, r, s) => r.toUpperCase() + s)
}

function Eb(e, t) {
    const r = C.toCamelCase(" " + t);
    ["get", "set", "has"].forEach(s => {
        Object.defineProperty(e, s + r, {
            value: function (a, l, i) {
                return this[s].call(this, t, a, l, i)
            }, configurable: !0
        })
    })
}

let Ke = class {
    constructor(t) {
        t && this.set(t)
    }

    set(t, r, s) {
        const a = this;

        function l(o, c, u) {
            const f = Hn(c);
            if (!f) throw new Error("header name must be a non-empty string");
            const m = C.findKey(a, f);
            (!m || a[m] === void 0 || u === !0 || u === void 0 && a[m] !== !1) && (kh(o, c), a[m || c] = wa(o))
        }

        const i = (o, c) => C.forEach(o, (u, f) => l(u, f, c));
        if (C.isPlainObject(t) || t instanceof this.constructor) i(t, r); else if (C.isString(t) && (t = t.trim()) && !Sb(t)) i(jb(t), r); else if (C.isObject(t) && C.isIterable(t)) {
            let o = {}, c, u;
            for (const f of t) {
                if (!C.isArray(f)) throw TypeError("Object iterator must return a key-value pair");
                o[u = f[0]] = (c = o[u]) ? C.isArray(c) ? [...c, f[1]] : [c, f[1]] : f[1]
            }
            i(o, r)
        } else t != null && l(r, t, s);
        return this
    }

    get(t, r) {
        if (t = Hn(t), t) {
            const s = C.findKey(this, t);
            if (s) {
                const a = this[s];
                if (!r) return a;
                if (r === !0) return kb(a);
                if (C.isFunction(r)) return r.call(this, a, s);
                if (C.isRegExp(r)) return r.exec(a);
                throw new TypeError("parser must be boolean|regexp|function")
            }
        }
    }

    has(t, r) {
        if (t = Hn(t), t) {
            const s = C.findKey(this, t);
            return !!(s && this[s] !== void 0 && (!r || Li(this, this[s], s, r)))
        }
        return !1
    }

    delete(t, r) {
        const s = this;
        let a = !1;

        function l(i) {
            if (i = Hn(i), i) {
                const o = C.findKey(s, i);
                o && (!r || Li(s, s[o], o, r)) && (delete s[o], a = !0)
            }
        }

        return C.isArray(t) ? t.forEach(l) : l(t), a
    }

    clear(t) {
        const r = Object.keys(this);
        let s = r.length, a = !1;
        for (; s--;) {
            const l = r[s];
            (!t || Li(this, this[l], l, t, !0)) && (delete this[l], a = !0)
        }
        return a
    }

    normalize(t) {
        const r = this, s = {};
        return C.forEach(this, (a, l) => {
            const i = C.findKey(s, l);
            if (i) {
                r[i] = wa(a), delete r[l];
                return
            }
            const o = t ? Cb(l) : String(l).trim();
            o !== l && delete r[l], r[o] = wa(a), s[o] = !0
        }), this
    }

    concat(...t) {
        return this.constructor.concat(this, ...t)
    }

    toJSON(t) {
        const r = Object.create(null);
        return C.forEach(this, (s, a) => {
            s != null && s !== !1 && (r[a] = t && C.isArray(s) ? s.join(", ") : s)
        }), r
    }

    [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]()
    }

    toString() {
        return Object.entries(this.toJSON()).map(([t, r]) => t + ": " + r).join(`
`)
    }

    getSetCookie() {
        return this.get("set-cookie") || []
    }

    get [Symbol.toStringTag]() {
        return "AxiosHeaders"
    }

    static from(t) {
        return t instanceof this ? t : new this(t)
    }

    static concat(t, ...r) {
        const s = new this(t);
        return r.forEach(a => s.set(a)), s
    }

    static accessor(t) {
        const s = (this[Qd] = this[Qd] = {accessors: {}}).accessors, a = this.prototype;

        function l(i) {
            const o = Hn(i);
            s[o] || (Eb(a, i), s[o] = !0)
        }

        return C.isArray(t) ? t.forEach(l) : l(t), this
    }
};
Ke.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
C.reduceDescriptors(Ke.prototype, ({value: e}, t) => {
    let r = t[0].toUpperCase() + t.slice(1);
    return {
        get: () => e, set(s) {
            this[r] = s
        }
    }
});
C.freezeMethods(Ke);

function $i(e, t) {
    const r = this || Us, s = t || r, a = Ke.from(s.headers);
    let l = s.data;
    return C.forEach(e, function (o) {
        l = o.call(r, l, a.normalize(), t ? t.status : void 0)
    }), a.normalize(), l
}

function Sh(e) {
    return !!(e && e.__CANCEL__)
}

let Fs = class extends q {
    constructor(t, r, s) {
        super(t ?? "canceled", q.ERR_CANCELED, r, s), this.name = "CanceledError", this.__CANCEL__ = !0
    }
};

function Ch(e, t, r) {
    const s = r.config.validateStatus;
    !r.status || !s || s(r.status) ? e(r) : t(new q("Request failed with status code " + r.status, [q.ERR_BAD_REQUEST, q.ERR_BAD_RESPONSE][Math.floor(r.status / 100) - 4], r.config, r.request, r))
}

function Pb(e) {
    const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
    return t && t[1] || ""
}

function _b(e, t) {
    e = e || 10;
    const r = new Array(e), s = new Array(e);
    let a = 0, l = 0, i;
    return t = t !== void 0 ? t : 1e3, function (c) {
        const u = Date.now(), f = s[l];
        i || (i = u), r[a] = c, s[a] = u;
        let m = l, y = 0;
        for (; m !== a;) y += r[m++], m = m % e;
        if (a = (a + 1) % e, a === l && (l = (l + 1) % e), u - i < t) return;
        const b = f && u - f;
        return b ? Math.round(y * 1e3 / b) : void 0
    }
}

function Ob(e, t) {
    let r = 0, s = 1e3 / t, a, l;
    const i = (u, f = Date.now()) => {
        r = f, a = null, l && (clearTimeout(l), l = null), e(...u)
    };
    return [(...u) => {
        const f = Date.now(), m = f - r;
        m >= s ? i(u, f) : (a = u, l || (l = setTimeout(() => {
            l = null, i(a)
        }, s - m)))
    }, () => a && i(a)]
}

const sl = (e, t, r = 3) => {
        let s = 0;
        const a = _b(50, 250);
        return Ob(l => {
            const i = l.loaded, o = l.lengthComputable ? l.total : void 0, c = i - s, u = a(c), f = i <= o;
            s = i;
            const m = {
                loaded: i,
                total: o,
                progress: o ? i / o : void 0,
                bytes: c,
                rate: u || void 0,
                estimated: u && o && f ? (o - i) / u : void 0,
                event: l,
                lengthComputable: o != null,
                [t ? "download" : "upload"]: !0
            };
            e(m)
        }, r)
    }, Kd = (e, t) => {
        const r = e != null;
        return [s => t[0]({lengthComputable: r, total: e, loaded: s}), t[1]]
    }, Gd = e => (...t) => C.asap(() => e(...t)),
    Rb = De.hasStandardBrowserEnv ? ((e, t) => r => (r = new URL(r, De.origin), e.protocol === r.protocol && e.host === r.host && (t || e.port === r.port)))(new URL(De.origin), De.navigator && /(msie|trident)/i.test(De.navigator.userAgent)) : () => !0,
    Tb = De.hasStandardBrowserEnv ? {
        write(e, t, r, s, a, l, i) {
            if (typeof document > "u") return;
            const o = [`${e}=${encodeURIComponent(t)}`];
            C.isNumber(r) && o.push(`expires=${new Date(r).toUTCString()}`), C.isString(s) && o.push(`path=${s}`), C.isString(a) && o.push(`domain=${a}`), l === !0 && o.push("secure"), C.isString(i) && o.push(`SameSite=${i}`), document.cookie = o.join("; ")
        }, read(e) {
            if (typeof document > "u") return null;
            const t = document.cookie.match(new RegExp("(?:^|; )" + e + "=([^;]*)"));
            return t ? decodeURIComponent(t[1]) : null
        }, remove(e) {
            this.write(e, "", Date.now() - 864e5, "/")
        }
    } : {
        write() {
        }, read() {
            return null
        }, remove() {
        }
    };

function Ib(e) {
    return typeof e != "string" ? !1 : /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)
}

function Ab(e, t) {
    return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e
}

function Eh(e, t, r) {
    let s = !Ib(t);
    return e && (s || r == !1) ? Ab(e, t) : t
}

const Xd = e => e instanceof Ke ? {...e} : e;

function Br(e, t) {
    t = t || {};
    const r = {};

    function s(u, f, m, y) {
        return C.isPlainObject(u) && C.isPlainObject(f) ? C.merge.call({caseless: y}, u, f) : C.isPlainObject(f) ? C.merge({}, f) : C.isArray(f) ? f.slice() : f
    }

    function a(u, f, m, y) {
        if (C.isUndefined(f)) {
            if (!C.isUndefined(u)) return s(void 0, u, m, y)
        } else return s(u, f, m, y)
    }

    function l(u, f) {
        if (!C.isUndefined(f)) return s(void 0, f)
    }

    function i(u, f) {
        if (C.isUndefined(f)) {
            if (!C.isUndefined(u)) return s(void 0, u)
        } else return s(void 0, f)
    }

    function o(u, f, m) {
        if (m in t) return s(u, f);
        if (m in e) return s(void 0, u)
    }

    const c = {
        url: l,
        method: l,
        data: l,
        baseURL: i,
        transformRequest: i,
        transformResponse: i,
        paramsSerializer: i,
        timeout: i,
        timeoutMessage: i,
        withCredentials: i,
        withXSRFToken: i,
        adapter: i,
        responseType: i,
        xsrfCookieName: i,
        xsrfHeaderName: i,
        onUploadProgress: i,
        onDownloadProgress: i,
        decompress: i,
        maxContentLength: i,
        maxBodyLength: i,
        beforeRedirect: i,
        transport: i,
        httpAgent: i,
        httpsAgent: i,
        cancelToken: i,
        socketPath: i,
        responseEncoding: i,
        validateStatus: o,
        headers: (u, f, m) => a(Xd(u), Xd(f), m, !0)
    };
    return C.forEach(Object.keys({...e, ...t}), function (f) {
        if (f === "__proto__" || f === "constructor" || f === "prototype") return;
        const m = C.hasOwnProp(c, f) ? c[f] : a, y = m(e[f], t[f], f);
        C.isUndefined(y) && m !== o || (r[f] = y)
    }), r
}

const Ph = e => {
    const t = Br({}, e);
    let {data: r, withXSRFToken: s, xsrfHeaderName: a, xsrfCookieName: l, headers: i, auth: o} = t;
    if (t.headers = i = Ke.from(i), t.url = Nh(Eh(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer), o && i.set("Authorization", "Basic " + btoa((o.username || "") + ":" + (o.password ? unescape(encodeURIComponent(o.password)) : ""))), C.isFormData(r)) {
        if (De.hasStandardBrowserEnv || De.hasStandardBrowserWebWorkerEnv) i.setContentType(void 0); else if (C.isFunction(r.getHeaders)) {
            const c = r.getHeaders(), u = ["content-type", "content-length"];
            Object.entries(c).forEach(([f, m]) => {
                u.includes(f.toLowerCase()) && i.set(f, m)
            })
        }
    }
    if (De.hasStandardBrowserEnv && (s && C.isFunction(s) && (s = s(t)), s || s !== !1 && Rb(t.url))) {
        const c = a && l && Tb.read(l);
        c && i.set(a, c)
    }
    return t
}, Lb = typeof XMLHttpRequest < "u", $b = Lb && function (e) {
    return new Promise(function (r, s) {
        const a = Ph(e);
        let l = a.data;
        const i = Ke.from(a.headers).normalize();
        let {responseType: o, onUploadProgress: c, onDownloadProgress: u} = a, f, m, y, b, p;

        function d() {
            b && b(), p && p(), a.cancelToken && a.cancelToken.unsubscribe(f), a.signal && a.signal.removeEventListener("abort", f)
        }

        let x = new XMLHttpRequest;
        x.open(a.method.toUpperCase(), a.url, !0), x.timeout = a.timeout;

        function h() {
            if (!x) return;
            const v = Ke.from("getAllResponseHeaders" in x && x.getAllResponseHeaders()), N = {
                data: !o || o === "text" || o === "json" ? x.responseText : x.response,
                status: x.status,
                statusText: x.statusText,
                headers: v,
                config: e,
                request: x
            };
            Ch(function (E) {
                r(E), d()
            }, function (E) {
                s(E), d()
            }, N), x = null
        }

        "onloadend" in x ? x.onloadend = h : x.onreadystatechange = function () {
            !x || x.readyState !== 4 || x.status === 0 && !(x.responseURL && x.responseURL.indexOf("file:") === 0) || setTimeout(h)
        }, x.onabort = function () {
            x && (s(new q("Request aborted", q.ECONNABORTED, e, x)), x = null)
        }, x.onerror = function (w) {
            const N = w && w.message ? w.message : "Network Error", k = new q(N, q.ERR_NETWORK, e, x);
            k.event = w || null, s(k), x = null
        }, x.ontimeout = function () {
            let w = a.timeout ? "timeout of " + a.timeout + "ms exceeded" : "timeout exceeded";
            const N = a.transitional || ou;
            a.timeoutErrorMessage && (w = a.timeoutErrorMessage), s(new q(w, N.clarifyTimeoutError ? q.ETIMEDOUT : q.ECONNABORTED, e, x)), x = null
        }, l === void 0 && i.setContentType(null), "setRequestHeader" in x && C.forEach(i.toJSON(), function (w, N) {
            x.setRequestHeader(N, w)
        }), C.isUndefined(a.withCredentials) || (x.withCredentials = !!a.withCredentials), o && o !== "json" && (x.responseType = a.responseType), u && ([y, p] = sl(u, !0), x.addEventListener("progress", y)), c && x.upload && ([m, b] = sl(c), x.upload.addEventListener("progress", m), x.upload.addEventListener("loadend", b)), (a.cancelToken || a.signal) && (f = v => {
            x && (s(!v || v.type ? new Fs(null, e, x) : v), x.abort(), x = null)
        }, a.cancelToken && a.cancelToken.subscribe(f), a.signal && (a.signal.aborted ? f() : a.signal.addEventListener("abort", f)));
        const g = Pb(a.url);
        if (g && De.protocols.indexOf(g) === -1) {
            s(new q("Unsupported protocol " + g + ":", q.ERR_BAD_REQUEST, e));
            return
        }
        x.send(l || null)
    })
}, Db = (e, t) => {
    const {length: r} = e = e ? e.filter(Boolean) : [];
    if (t || r) {
        let s = new AbortController, a;
        const l = function (u) {
            if (!a) {
                a = !0, o();
                const f = u instanceof Error ? u : this.reason;
                s.abort(f instanceof q ? f : new Fs(f instanceof Error ? f.message : f))
            }
        };
        let i = t && setTimeout(() => {
            i = null, l(new q(`timeout of ${t}ms exceeded`, q.ETIMEDOUT))
        }, t);
        const o = () => {
            e && (i && clearTimeout(i), i = null, e.forEach(u => {
                u.unsubscribe ? u.unsubscribe(l) : u.removeEventListener("abort", l)
            }), e = null)
        };
        e.forEach(u => u.addEventListener("abort", l));
        const {signal: c} = s;
        return c.unsubscribe = () => C.asap(o), c
    }
}, Mb = function* (e, t) {
    let r = e.byteLength;
    if (r < t) {
        yield e;
        return
    }
    let s = 0, a;
    for (; s < r;) a = s + t, yield e.slice(s, a), s = a
}, zb = async function* (e, t) {
    for await(const r of Ub(e)) yield* Mb(r, t)
}, Ub = async function* (e) {
    if (e[Symbol.asyncIterator]) {
        yield* e;
        return
    }
    const t = e.getReader();
    try {
        for (; ;) {
            const {done: r, value: s} = await t.read();
            if (r) break;
            yield s
        }
    } finally {
        await t.cancel()
    }
}, Yd = (e, t, r, s) => {
    const a = zb(e, t);
    let l = 0, i, o = c => {
        i || (i = !0, s && s(c))
    };
    return new ReadableStream({
        async pull(c) {
            try {
                const {done: u, value: f} = await a.next();
                if (u) {
                    o(), c.close();
                    return
                }
                let m = f.byteLength;
                if (r) {
                    let y = l += m;
                    r(y)
                }
                c.enqueue(new Uint8Array(f))
            } catch (u) {
                throw o(u), u
            }
        }, cancel(c) {
            return o(c), a.return()
        }
    }, {highWaterMark: 2})
}, Zd = 64 * 1024, {isFunction: oa} = C, Fb = (({Request: e, Response: t}) => ({Request: e, Response: t}))(C.global), {
    ReadableStream: ef,
    TextEncoder: tf
} = C.global, rf = (e, ...t) => {
    try {
        return !!e(...t)
    } catch {
        return !1
    }
}, Bb = e => {
    e = C.merge.call({skipUndefined: !0}, Fb, e);
    const {fetch: t, Request: r, Response: s} = e, a = t ? oa(t) : typeof fetch == "function", l = oa(r), i = oa(s);
    if (!a) return !1;
    const o = a && oa(ef),
        c = a && (typeof tf == "function" ? (p => d => p.encode(d))(new tf) : async p => new Uint8Array(await new r(p).arrayBuffer())),
        u = l && o && rf(() => {
            let p = !1;
            const d = new ef, x = new r(De.origin, {
                body: d, method: "POST", get duplex() {
                    return p = !0, "half"
                }
            }).headers.has("Content-Type");
            return d.cancel(), p && !x
        }), f = i && o && rf(() => C.isReadableStream(new s("").body)), m = {stream: f && (p => p.body)};
    a && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach(p => {
        !m[p] && (m[p] = (d, x) => {
            let h = d && d[p];
            if (h) return h.call(d);
            throw new q(`Response type '${p}' is not supported`, q.ERR_NOT_SUPPORT, x)
        })
    });
    const y = async p => {
        if (p == null) return 0;
        if (C.isBlob(p)) return p.size;
        if (C.isSpecCompliantForm(p)) return (await new r(De.origin, {
            method: "POST",
            body: p
        }).arrayBuffer()).byteLength;
        if (C.isArrayBufferView(p) || C.isArrayBuffer(p)) return p.byteLength;
        if (C.isURLSearchParams(p) && (p = p + ""), C.isString(p)) return (await c(p)).byteLength
    }, b = async (p, d) => {
        const x = C.toFiniteNumber(p.getContentLength());
        return x ?? y(d)
    };
    return async p => {
        let {
            url: d,
            method: x,
            data: h,
            signal: g,
            cancelToken: v,
            timeout: w,
            onDownloadProgress: N,
            onUploadProgress: k,
            responseType: E,
            headers: R,
            withCredentials: z = "same-origin",
            fetchOptions: $
        } = Ph(p), L = t || fetch;
        E = E ? (E + "").toLowerCase() : "text";
        let G = Db([g, v && v.toAbortSignal()], w), X = null;
        const P = G && G.unsubscribe && (() => {
            G.unsubscribe()
        });
        let W;
        try {
            if (k && u && x !== "get" && x !== "head" && (W = await b(R, h)) !== 0) {
                let M = new r(d, {method: "POST", body: h, duplex: "half"}), B;
                if (C.isFormData(h) && (B = M.headers.get("content-type")) && R.setContentType(B), M.body) {
                    const [oe, fe] = Kd(W, sl(Gd(k)));
                    h = Yd(M.body, Zd, oe, fe)
                }
            }
            C.isString(z) || (z = z ? "include" : "omit");
            const H = l && "credentials" in r.prototype, te = {
                ...$,
                signal: G,
                method: x.toUpperCase(),
                headers: R.normalize().toJSON(),
                body: h,
                duplex: "half",
                credentials: H ? z : void 0
            };
            X = l && new r(d, te);
            let A = await (l ? L(X, $) : L(d, te));
            const U = f && (E === "stream" || E === "response");
            if (f && (N || U && P)) {
                const M = {};
                ["status", "statusText", "headers"].forEach(O => {
                    M[O] = A[O]
                });
                const B = C.toFiniteNumber(A.headers.get("content-length")), [oe, fe] = N && Kd(B, sl(Gd(N), !0)) || [];
                A = new s(Yd(A.body, Zd, oe, () => {
                    fe && fe(), P && P()
                }), M)
            }
            E = E || "text";
            let S = await m[C.findKey(m, E) || "text"](A, p);
            return !U && P && P(), await new Promise((M, B) => {
                Ch(M, B, {
                    data: S,
                    headers: Ke.from(A.headers),
                    status: A.status,
                    statusText: A.statusText,
                    config: p,
                    request: X
                })
            })
        } catch (H) {
            throw P && P(), H && H.name === "TypeError" && /Load failed|fetch/i.test(H.message) ? Object.assign(new q("Network Error", q.ERR_NETWORK, p, X, H && H.response), {cause: H.cause || H}) : q.from(H, H && H.code, p, X, H && H.response)
        }
    }
}, Vb = new Map, _h = e => {
    let t = e && e.env || {};
    const {fetch: r, Request: s, Response: a} = t, l = [s, a, r];
    let i = l.length, o = i, c, u, f = Vb;
    for (; o--;) c = l[o], u = f.get(c), u === void 0 && f.set(c, u = o ? new Map : Bb(t)), f = u;
    return u
};
_h();
const uu = {http: sb, xhr: $b, fetch: {get: _h}};
C.forEach(uu, (e, t) => {
    if (e) {
        try {
            Object.defineProperty(e, "name", {value: t})
        } catch {
        }
        Object.defineProperty(e, "adapterName", {value: t})
    }
});
const nf = e => `- ${e}`, Wb = e => C.isFunction(e) || e === null || e === !1;

function Hb(e, t) {
    e = C.isArray(e) ? e : [e];
    const {length: r} = e;
    let s, a;
    const l = {};
    for (let i = 0; i < r; i++) {
        s = e[i];
        let o;
        if (a = s, !Wb(s) && (a = uu[(o = String(s)).toLowerCase()], a === void 0)) throw new q(`Unknown adapter '${o}'`);
        if (a && (C.isFunction(a) || (a = a.get(t)))) break;
        l[o || "#" + i] = a
    }
    if (!a) {
        const i = Object.entries(l).map(([c, u]) => `adapter ${c} ` + (u === !1 ? "is not supported by the environment" : "is not available in the build"));
        let o = r ? i.length > 1 ? `since :
` + i.map(nf).join(`
`) : " " + nf(i[0]) : "as no adapter specified";
        throw new q("There is no suitable adapter to dispatch the request " + o, "ERR_NOT_SUPPORT")
    }
    return a
}

const Oh = {getAdapter: Hb, adapters: uu};

function Di(e) {
    if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted) throw new Fs(null, e)
}

function sf(e) {
    return Di(e), e.headers = Ke.from(e.headers), e.data = $i.call(e, e.transformRequest), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), Oh.getAdapter(e.adapter || Us.adapter, e)(e).then(function (s) {
        return Di(e), s.data = $i.call(e, e.transformResponse, s), s.headers = Ke.from(s.headers), s
    }, function (s) {
        return Sh(s) || (Di(e), s && s.response && (s.response.data = $i.call(e, e.transformResponse, s.response), s.response.headers = Ke.from(s.response.headers))), Promise.reject(s)
    })
}

const Rh = "1.15.0", Kl = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
    Kl[e] = function (s) {
        return typeof s === e || "a" + (t < 1 ? "n " : " ") + e
    }
});
const af = {};
Kl.transitional = function (t, r, s) {
    function a(l, i) {
        return "[Axios v" + Rh + "] Transitional option '" + l + "'" + i + (s ? ". " + s : "")
    }

    return (l, i, o) => {
        if (t === !1) throw new q(a(i, " has been removed" + (r ? " in " + r : "")), q.ERR_DEPRECATED);
        return r && !af[i] && (af[i] = !0, console.warn(a(i, " has been deprecated since v" + r + " and will be removed in the near future"))), t ? t(l, i, o) : !0
    }
};
Kl.spelling = function (t) {
    return (r, s) => (console.warn(`${s} is likely a misspelling of ${t}`), !0)
};

function Jb(e, t, r) {
    if (typeof e != "object") throw new q("options must be an object", q.ERR_BAD_OPTION_VALUE);
    const s = Object.keys(e);
    let a = s.length;
    for (; a-- > 0;) {
        const l = s[a], i = t[l];
        if (i) {
            const o = e[l], c = o === void 0 || i(o, l, e);
            if (c !== !0) throw new q("option " + l + " must be " + c, q.ERR_BAD_OPTION_VALUE);
            continue
        }
        if (r !== !0) throw new q("Unknown option " + l, q.ERR_BAD_OPTION)
    }
}

const ka = {assertOptions: Jb, validators: Kl}, it = ka.validators;
let Lr = class {
    constructor(t) {
        this.defaults = t || {}, this.interceptors = {request: new qd, response: new qd}
    }

    async request(t, r) {
        try {
            return await this._request(t, r)
        } catch (s) {
            if (s instanceof Error) {
                let a = {};
                Error.captureStackTrace ? Error.captureStackTrace(a) : a = new Error;
                const l = (() => {
                    if (!a.stack) return "";
                    const i = a.stack.indexOf(`
`);
                    return i === -1 ? "" : a.stack.slice(i + 1)
                })();
                try {
                    if (!s.stack) s.stack = l; else if (l) {
                        const i = l.indexOf(`
`), o = i === -1 ? -1 : l.indexOf(`
`, i + 1), c = o === -1 ? "" : l.slice(o + 1);
                        String(s.stack).endsWith(c) || (s.stack += `
` + l)
                    }
                } catch {
                }
            }
            throw s
        }
    }

    _request(t, r) {
        typeof t == "string" ? (r = r || {}, r.url = t) : r = t || {}, r = Br(this.defaults, r);
        const {transitional: s, paramsSerializer: a, headers: l} = r;
        s !== void 0 && ka.assertOptions(s, {
            silentJSONParsing: it.transitional(it.boolean),
            forcedJSONParsing: it.transitional(it.boolean),
            clarifyTimeoutError: it.transitional(it.boolean),
            legacyInterceptorReqResOrdering: it.transitional(it.boolean)
        }, !1), a != null && (C.isFunction(a) ? r.paramsSerializer = {serialize: a} : ka.assertOptions(a, {
            encode: it.function,
            serialize: it.function
        }, !0)), r.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? r.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : r.allowAbsoluteUrls = !0), ka.assertOptions(r, {
            baseUrl: it.spelling("baseURL"),
            withXsrfToken: it.spelling("withXSRFToken")
        }, !0), r.method = (r.method || this.defaults.method || "get").toLowerCase();
        let i = l && C.merge(l.common, l[r.method]);
        l && C.forEach(["delete", "get", "head", "post", "put", "patch", "common"], p => {
            delete l[p]
        }), r.headers = Ke.concat(i, l);
        const o = [];
        let c = !0;
        this.interceptors.request.forEach(function (d) {
            if (typeof d.runWhen == "function" && d.runWhen(r) === !1) return;
            c = c && d.synchronous;
            const x = r.transitional || ou;
            x && x.legacyInterceptorReqResOrdering ? o.unshift(d.fulfilled, d.rejected) : o.push(d.fulfilled, d.rejected)
        });
        const u = [];
        this.interceptors.response.forEach(function (d) {
            u.push(d.fulfilled, d.rejected)
        });
        let f, m = 0, y;
        if (!c) {
            const p = [sf.bind(this), void 0];
            for (p.unshift(...o), p.push(...u), y = p.length, f = Promise.resolve(r); m < y;) f = f.then(p[m++], p[m++]);
            return f
        }
        y = o.length;
        let b = r;
        for (; m < y;) {
            const p = o[m++], d = o[m++];
            try {
                b = p(b)
            } catch (x) {
                d.call(this, x);
                break
            }
        }
        try {
            f = sf.call(this, b)
        } catch (p) {
            return Promise.reject(p)
        }
        for (m = 0, y = u.length; m < y;) f = f.then(u[m++], u[m++]);
        return f
    }

    getUri(t) {
        t = Br(this.defaults, t);
        const r = Eh(t.baseURL, t.url, t.allowAbsoluteUrls);
        return Nh(r, t.params, t.paramsSerializer)
    }
};
C.forEach(["delete", "get", "head", "options"], function (t) {
    Lr.prototype[t] = function (r, s) {
        return this.request(Br(s || {}, {method: t, url: r, data: (s || {}).data}))
    }
});
C.forEach(["post", "put", "patch"], function (t) {
    function r(s) {
        return function (l, i, o) {
            return this.request(Br(o || {}, {
                method: t,
                headers: s ? {"Content-Type": "multipart/form-data"} : {},
                url: l,
                data: i
            }))
        }
    }

    Lr.prototype[t] = r(), Lr.prototype[t + "Form"] = r(!0)
});
let qb = class Th {
    constructor(t) {
        if (typeof t != "function") throw new TypeError("executor must be a function.");
        let r;
        this.promise = new Promise(function (l) {
            r = l
        });
        const s = this;
        this.promise.then(a => {
            if (!s._listeners) return;
            let l = s._listeners.length;
            for (; l-- > 0;) s._listeners[l](a);
            s._listeners = null
        }), this.promise.then = a => {
            let l;
            const i = new Promise(o => {
                s.subscribe(o), l = o
            }).then(a);
            return i.cancel = function () {
                s.unsubscribe(l)
            }, i
        }, t(function (l, i, o) {
            s.reason || (s.reason = new Fs(l, i, o), r(s.reason))
        })
    }

    throwIfRequested() {
        if (this.reason) throw this.reason
    }

    subscribe(t) {
        if (this.reason) {
            t(this.reason);
            return
        }
        this._listeners ? this._listeners.push(t) : this._listeners = [t]
    }

    unsubscribe(t) {
        if (!this._listeners) return;
        const r = this._listeners.indexOf(t);
        r !== -1 && this._listeners.splice(r, 1)
    }

    toAbortSignal() {
        const t = new AbortController, r = s => {
            t.abort(s)
        };
        return this.subscribe(r), t.signal.unsubscribe = () => this.unsubscribe(r), t.signal
    }

    static source() {
        let t;
        return {
            token: new Th(function (a) {
                t = a
            }), cancel: t
        }
    }
};

function Qb(e) {
    return function (r) {
        return e.apply(null, r)
    }
}

function Kb(e) {
    return C.isObject(e) && e.isAxiosError === !0
}

const Bo = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
};
Object.entries(Bo).forEach(([e, t]) => {
    Bo[t] = e
});

function Ih(e) {
    const t = new Lr(e), r = dh(Lr.prototype.request, t);
    return C.extend(r, Lr.prototype, t, {allOwnKeys: !0}), C.extend(r, t, null, {allOwnKeys: !0}), r.create = function (a) {
        return Ih(Br(e, a))
    }, r
}

const ge = Ih(Us);
ge.Axios = Lr;
ge.CanceledError = Fs;
ge.CancelToken = qb;
ge.isCancel = Sh;
ge.VERSION = Rh;
ge.toFormData = Ql;
ge.AxiosError = q;
ge.Cancel = ge.CanceledError;
ge.all = function (t) {
    return Promise.all(t)
};
ge.spread = Qb;
ge.isAxiosError = Kb;
ge.mergeConfig = Br;
ge.AxiosHeaders = Ke;
ge.formToJSON = e => wh(C.isHTMLForm(e) ? new FormData(e) : e);
ge.getAdapter = Oh.getAdapter;
ge.HttpStatusCode = Bo;
ge.default = ge;
const {
        Axios: Iw,
        AxiosError: Aw,
        CanceledError: Lw,
        isCancel: $w,
        CancelToken: Dw,
        VERSION: Mw,
        all: zw,
        Cancel: Uw,
        isAxiosError: Fw,
        spread: Bw,
        toFormData: Vw,
        AxiosHeaders: Ww,
        HttpStatusCode: Hw,
        formToJSON: Jw,
        getAdapter: qw,
        mergeConfig: Qw
    } = ge, Ah = "/api/auth", Sa = It("auth/login", async ({email: e, password: t}) => (await ge.post(`${Ah}/login`, {
        email: e,
        password: t
    })).data), Ca = It("auth/register", async e => (await ge.post(`${Ah}/register`, e)).data), Lh = tu({
        name: "auth",
        initialState: {
            user: JSON.parse(localStorage.getItem("user") || "null"),
            token: localStorage.getItem("token"),
            isAuthenticated: !!localStorage.getItem("token"),
            loading: !1,
            error: null
        },
        reducers: {
            logout: e => {
                e.user = null, e.token = null, e.isAuthenticated = !1, localStorage.removeItem("token"), localStorage.removeItem("user"), localStorage.removeItem("misat_current_user")
            }, updateUserBalance: (e, t) => {
                if (e.user) {
                    e.user.balance = t.payload;
                    const r = JSON.parse(localStorage.getItem("user") || "{}");
                    r.balance = t.payload, localStorage.setItem("user", JSON.stringify(r)), localStorage.setItem("misat_current_user", JSON.stringify(r))
                }
            }
        },
        extraReducers: e => {
            e.addCase(Sa.pending, t => {
                t.loading = !0, t.error = null
            }).addCase(Sa.fulfilled, (t, r) => {
                t.loading = !1, t.user = r.payload.user, t.token = r.payload.token, t.isAuthenticated = !0, localStorage.setItem("token", r.payload.token), localStorage.setItem("user", JSON.stringify(r.payload.user)), localStorage.setItem("misat_current_user", JSON.stringify(r.payload.user))
            }).addCase(Sa.rejected, (t, r) => {
                t.loading = !1, t.error = r.error.message
            }).addCase(Ca.pending, t => {
                t.loading = !0, t.error = null
            }).addCase(Ca.fulfilled, (t, r) => {
                t.loading = !1, t.user = r.payload.user, t.token = r.payload.token, t.isAuthenticated = !0, localStorage.setItem("token", r.payload.token), localStorage.setItem("user", JSON.stringify(r.payload.user)), localStorage.setItem("misat_current_user", JSON.stringify(r.payload.user))
            }).addCase(Ca.rejected, (t, r) => {
                t.loading = !1, t.error = r.error.message
            })
        }
    }), {logout: du, updateUserBalance: Gb} = Lh.actions, $h = Lh.reducer,
    Xb = Zp({reducer: {cart: oh, favorites: uh, auth: $h}, middleware: e => e({serializableCheck: !1})});

/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Cs() {
    return Cs = Object.assign ? Object.assign.bind() : function (e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var s in r) Object.prototype.hasOwnProperty.call(r, s) && (e[s] = r[s])
        }
        return e
    }, Cs.apply(this, arguments)
}

var lr;
(function (e) {
    e.Pop = "POP", e.Push = "PUSH", e.Replace = "REPLACE"
})(lr || (lr = {}));
const lf = "popstate";

function Yb(e) {
    e === void 0 && (e = {});

    function t(s, a) {
        let {pathname: l, search: i, hash: o} = s.location;
        return Vo("", {
            pathname: l,
            search: i,
            hash: o
        }, a.state && a.state.usr || null, a.state && a.state.key || "default")
    }

    function r(s, a) {
        return typeof a == "string" ? a : al(a)
    }

    return ej(t, r, null, e)
}

function Ne(e, t) {
    if (e === !1 || e === null || typeof e > "u") throw new Error(t)
}

function fu(e, t) {
    if (!e) {
        typeof console < "u" && console.warn(t);
        try {
            throw new Error(t)
        } catch {
        }
    }
}

function Zb() {
    return Math.random().toString(36).substr(2, 8)
}

function of(e, t) {
    return {usr: e.state, key: e.key, idx: t}
}

function Vo(e, t, r, s) {
    return r === void 0 && (r = null), Cs({
        pathname: typeof e == "string" ? e : e.pathname,
        search: "",
        hash: ""
    }, typeof t == "string" ? Ln(t) : t, {state: r, key: t && t.key || s || Zb()})
}

function al(e) {
    let {pathname: t = "/", search: r = "", hash: s = ""} = e;
    return r && r !== "?" && (t += r.charAt(0) === "?" ? r : "?" + r), s && s !== "#" && (t += s.charAt(0) === "#" ? s : "#" + s), t
}

function Ln(e) {
    let t = {};
    if (e) {
        let r = e.indexOf("#");
        r >= 0 && (t.hash = e.substr(r), e = e.substr(0, r));
        let s = e.indexOf("?");
        s >= 0 && (t.search = e.substr(s), e = e.substr(0, s)), e && (t.pathname = e)
    }
    return t
}

function ej(e, t, r, s) {
    s === void 0 && (s = {});
    let {window: a = document.defaultView, v5Compat: l = !1} = s, i = a.history, o = lr.Pop, c = null, u = f();
    u == null && (u = 0, i.replaceState(Cs({}, i.state, {idx: u}), ""));

    function f() {
        return (i.state || {idx: null}).idx
    }

    function m() {
        o = lr.Pop;
        let x = f(), h = x == null ? null : x - u;
        u = x, c && c({action: o, location: d.location, delta: h})
    }

    function y(x, h) {
        o = lr.Push;
        let g = Vo(d.location, x, h);
        u = f() + 1;
        let v = of(g, u), w = d.createHref(g);
        try {
            i.pushState(v, "", w)
        } catch (N) {
            if (N instanceof DOMException && N.name === "DataCloneError") throw N;
            a.location.assign(w)
        }
        l && c && c({action: o, location: d.location, delta: 1})
    }

    function b(x, h) {
        o = lr.Replace;
        let g = Vo(d.location, x, h);
        u = f();
        let v = of(g, u), w = d.createHref(g);
        i.replaceState(v, "", w), l && c && c({action: o, location: d.location, delta: 0})
    }

    function p(x) {
        let h = a.location.origin !== "null" ? a.location.origin : a.location.href,
            g = typeof x == "string" ? x : al(x);
        return g = g.replace(/ $/, "%20"), Ne(h, "No window.location.(origin|href) available to create URL for href: " + g), new URL(g, h)
    }

    let d = {
        get action() {
            return o
        }, get location() {
            return e(a, i)
        }, listen(x) {
            if (c) throw new Error("A history only accepts one active listener");
            return a.addEventListener(lf, m), c = x, () => {
                a.removeEventListener(lf, m), c = null
            }
        }, createHref(x) {
            return t(a, x)
        }, createURL: p, encodeLocation(x) {
            let h = p(x);
            return {pathname: h.pathname, search: h.search, hash: h.hash}
        }, push: y, replace: b, go(x) {
            return i.go(x)
        }
    };
    return d
}

var cf;
(function (e) {
    e.data = "data", e.deferred = "deferred", e.redirect = "redirect", e.error = "error"
})(cf || (cf = {}));

function tj(e, t, r) {
    return r === void 0 && (r = "/"), rj(e, t, r)
}

function rj(e, t, r, s) {
    let a = typeof t == "string" ? Ln(t) : t, l = mu(a.pathname || "/", r);
    if (l == null) return null;
    let i = Dh(e);
    nj(i);
    let o = null;
    for (let c = 0; o == null && c < i.length; ++c) {
        let u = hj(l);
        o = fj(i[c], u)
    }
    return o
}

function Dh(e, t, r, s) {
    t === void 0 && (t = []), r === void 0 && (r = []), s === void 0 && (s = "");
    let a = (l, i, o) => {
        let c = {
            relativePath: o === void 0 ? l.path || "" : o,
            caseSensitive: l.caseSensitive === !0,
            childrenIndex: i,
            route: l
        };
        c.relativePath.startsWith("/") && (Ne(c.relativePath.startsWith(s), 'Absolute route path "' + c.relativePath + '" nested under path ' + ('"' + s + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes."), c.relativePath = c.relativePath.slice(s.length));
        let u = gr([s, c.relativePath]), f = r.concat(c);
        l.children && l.children.length > 0 && (Ne(l.index !== !0, "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + u + '".')), Dh(l.children, t, f, u)), !(l.path == null && !l.index) && t.push({
            path: u,
            score: uj(u, l.index),
            routesMeta: f
        })
    };
    return e.forEach((l, i) => {
        var o;
        if (l.path === "" || !((o = l.path) != null && o.includes("?"))) a(l, i); else for (let c of Mh(l.path)) a(l, i, c)
    }), t
}

function Mh(e) {
    let t = e.split("/");
    if (t.length === 0) return [];
    let [r, ...s] = t, a = r.endsWith("?"), l = r.replace(/\?$/, "");
    if (s.length === 0) return a ? [l, ""] : [l];
    let i = Mh(s.join("/")), o = [];
    return o.push(...i.map(c => c === "" ? l : [l, c].join("/"))), a && o.push(...i), o.map(c => e.startsWith("/") && c === "" ? "/" : c)
}

function nj(e) {
    e.sort((t, r) => t.score !== r.score ? r.score - t.score : dj(t.routesMeta.map(s => s.childrenIndex), r.routesMeta.map(s => s.childrenIndex)))
}

const sj = /^:[\w-]+$/, aj = 3, lj = 2, ij = 1, oj = 10, cj = -2, uf = e => e === "*";

function uj(e, t) {
    let r = e.split("/"), s = r.length;
    return r.some(uf) && (s += cj), t && (s += lj), r.filter(a => !uf(a)).reduce((a, l) => a + (sj.test(l) ? aj : l === "" ? ij : oj), s)
}

function dj(e, t) {
    return e.length === t.length && e.slice(0, -1).every((s, a) => s === t[a]) ? e[e.length - 1] - t[t.length - 1] : 0
}

function fj(e, t, r) {
    let {routesMeta: s} = e, a = {}, l = "/", i = [];
    for (let o = 0; o < s.length; ++o) {
        let c = s[o], u = o === s.length - 1, f = l === "/" ? t : t.slice(l.length) || "/",
            m = mj({path: c.relativePath, caseSensitive: c.caseSensitive, end: u}, f), y = c.route;
        if (!m) return null;
        Object.assign(a, m.params), i.push({
            params: a,
            pathname: gr([l, m.pathname]),
            pathnameBase: bj(gr([l, m.pathnameBase])),
            route: y
        }), m.pathnameBase !== "/" && (l = gr([l, m.pathnameBase]))
    }
    return i
}

function mj(e, t) {
    typeof e == "string" && (e = {path: e, caseSensitive: !1, end: !0});
    let [r, s] = pj(e.path, e.caseSensitive, e.end), a = t.match(r);
    if (!a) return null;
    let l = a[0], i = l.replace(/(.)\/+$/, "$1"), o = a.slice(1);
    return {
        params: s.reduce((u, f, m) => {
            let {paramName: y, isOptional: b} = f;
            if (y === "*") {
                let d = o[m] || "";
                i = l.slice(0, l.length - d.length).replace(/(.)\/+$/, "$1")
            }
            const p = o[m];
            return b && !p ? u[y] = void 0 : u[y] = (p || "").replace(/%2F/g, "/"), u
        }, {}), pathname: l, pathnameBase: i, pattern: e
    }
}

function pj(e, t, r) {
    t === void 0 && (t = !1), r === void 0 && (r = !0), fu(e === "*" || !e.endsWith("*") || e.endsWith("/*"), 'Route path "' + e + '" will be treated as if it were ' + ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + e.replace(/\*$/, "/*") + '".'));
    let s = [],
        a = "^" + e.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (i, o, c) => (s.push({
            paramName: o,
            isOptional: c != null
        }), c ? "/?([^\\/]+)?" : "/([^\\/]+)"));
    return e.endsWith("*") ? (s.push({paramName: "*"}), a += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? a += "\\/*$" : e !== "" && e !== "/" && (a += "(?:(?=\\/|$))"), [new RegExp(a, t ? void 0 : "i"), s]
}

function hj(e) {
    try {
        return e.split("/").map(t => decodeURIComponent(t).replace(/\//g, "%2F")).join("/")
    } catch (t) {
        return fu(!1, 'The URL path "' + e + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + t + ").")), e
    }
}

function mu(e, t) {
    if (t === "/") return e;
    if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
    let r = t.endsWith("/") ? t.length - 1 : t.length, s = e.charAt(r);
    return s && s !== "/" ? null : e.slice(r) || "/"
}

const xj = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, gj = e => xj.test(e);

function yj(e, t) {
    t === void 0 && (t = "/");
    let {pathname: r, search: s = "", hash: a = ""} = typeof e == "string" ? Ln(e) : e, l;
    if (r) if (gj(r)) l = r; else {
        if (r.includes("//")) {
            let i = r;
            r = r.replace(/\/\/+/g, "/"), fu(!1, "Pathnames cannot have embedded double slashes - normalizing " + (i + " -> " + r))
        }
        r.startsWith("/") ? l = df(r.substring(1), "/") : l = df(r, t)
    } else l = t;
    return {pathname: l, search: jj(s), hash: Nj(a)}
}

function df(e, t) {
    let r = t.replace(/\/+$/, "").split("/");
    return e.split("/").forEach(a => {
        a === ".." ? r.length > 1 && r.pop() : a !== "." && r.push(a)
    }), r.length > 1 ? r.join("/") : "/"
}

function Mi(e, t, r, s) {
    return "Cannot include a '" + e + "' character in a manually specified " + ("`to." + t + "` field [" + JSON.stringify(s) + "].  Please separate it out to the ") + ("`to." + r + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.'
}

function vj(e) {
    return e.filter((t, r) => r === 0 || t.route.path && t.route.path.length > 0)
}

function zh(e, t) {
    let r = vj(e);
    return t ? r.map((s, a) => a === r.length - 1 ? s.pathname : s.pathnameBase) : r.map(s => s.pathnameBase)
}

function Uh(e, t, r, s) {
    s === void 0 && (s = !1);
    let a;
    typeof e == "string" ? a = Ln(e) : (a = Cs({}, e), Ne(!a.pathname || !a.pathname.includes("?"), Mi("?", "pathname", "search", a)), Ne(!a.pathname || !a.pathname.includes("#"), Mi("#", "pathname", "hash", a)), Ne(!a.search || !a.search.includes("#"), Mi("#", "search", "hash", a)));
    let l = e === "" || a.pathname === "", i = l ? "/" : a.pathname, o;
    if (i == null) o = r; else {
        let m = t.length - 1;
        if (!s && i.startsWith("..")) {
            let y = i.split("/");
            for (; y[0] === "..";) y.shift(), m -= 1;
            a.pathname = y.join("/")
        }
        o = m >= 0 ? t[m] : "/"
    }
    let c = yj(a, o), u = i && i !== "/" && i.endsWith("/"), f = (l || i === ".") && r.endsWith("/");
    return !c.pathname.endsWith("/") && (u || f) && (c.pathname += "/"), c
}

const gr = e => e.join("/").replace(/\/\/+/g, "/"), bj = e => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
    jj = e => !e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e,
    Nj = e => !e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e;

function wj(e) {
    return e != null && typeof e.status == "number" && typeof e.statusText == "string" && typeof e.internal == "boolean" && "data" in e
}

const Fh = ["post", "put", "patch", "delete"];
new Set(Fh);
const kj = ["get", ...Fh];
new Set(kj);

/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Es() {
    return Es = Object.assign ? Object.assign.bind() : function (e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var s in r) Object.prototype.hasOwnProperty.call(r, s) && (e[s] = r[s])
        }
        return e
    }, Es.apply(this, arguments)
}

const pu = j.createContext(null), Sj = j.createContext(null), qr = j.createContext(null), Gl = j.createContext(null),
    qt = j.createContext({outlet: null, matches: [], isDataRoute: !1}), Bh = j.createContext(null);

function Cj(e, t) {
    let {relative: r} = t === void 0 ? {} : t;
    Bs() || Ne(!1);
    let {basename: s, navigator: a} = j.useContext(qr), {hash: l, pathname: i, search: o} = Wh(e, {relative: r}), c = i;
    return s !== "/" && (c = i === "/" ? s : gr([s, i])), a.createHref({pathname: c, search: o, hash: l})
}

function Bs() {
    return j.useContext(Gl) != null
}

function Qr() {
    return Bs() || Ne(!1), j.useContext(Gl).location
}

function Vh(e) {
    j.useContext(qr).static || j.useLayoutEffect(e)
}

function Qt() {
    let {isDataRoute: e} = j.useContext(qt);
    return e ? Bj() : Ej()
}

function Ej() {
    Bs() || Ne(!1);
    let e = j.useContext(pu), {
            basename: t,
            future: r,
            navigator: s
        } = j.useContext(qr), {matches: a} = j.useContext(qt), {pathname: l} = Qr(),
        i = JSON.stringify(zh(a, r.v7_relativeSplatPath)), o = j.useRef(!1);
    return Vh(() => {
        o.current = !0
    }), j.useCallback(function (u, f) {
        if (f === void 0 && (f = {}), !o.current) return;
        if (typeof u == "number") {
            s.go(u);
            return
        }
        let m = Uh(u, JSON.parse(i), l, f.relative === "path");
        e == null && t !== "/" && (m.pathname = m.pathname === "/" ? t : gr([t, m.pathname])), (f.replace ? s.replace : s.push)(m, f.state, f)
    }, [t, s, i, l, e])
}

const Pj = j.createContext(null);

function _j(e) {
    let t = j.useContext(qt).outlet;
    return t && j.createElement(Pj.Provider, {value: e}, t)
}

function Oj() {
    let {matches: e} = j.useContext(qt), t = e[e.length - 1];
    return t ? t.params : {}
}

function Wh(e, t) {
    let {relative: r} = t === void 0 ? {} : t, {future: s} = j.useContext(qr), {matches: a} = j.useContext(qt), {pathname: l} = Qr(),
        i = JSON.stringify(zh(a, s.v7_relativeSplatPath));
    return j.useMemo(() => Uh(e, JSON.parse(i), l, r === "path"), [e, i, l, r])
}

function Rj(e, t) {
    return Tj(e, t)
}

function Tj(e, t, r, s) {
    Bs() || Ne(!1);
    let {navigator: a} = j.useContext(qr), {matches: l} = j.useContext(qt), i = l[l.length - 1], o = i ? i.params : {};
    i && i.pathname;
    let c = i ? i.pathnameBase : "/";
    i && i.route;
    let u = Qr(), f;
    if (t) {
        var m;
        let x = typeof t == "string" ? Ln(t) : t;
        c === "/" || (m = x.pathname) != null && m.startsWith(c) || Ne(!1), f = x
    } else f = u;
    let y = f.pathname || "/", b = y;
    if (c !== "/") {
        let x = c.replace(/^\//, "").split("/");
        b = "/" + y.replace(/^\//, "").split("/").slice(x.length).join("/")
    }
    let p = tj(e, {pathname: b}), d = Dj(p && p.map(x => Object.assign({}, x, {
        params: Object.assign({}, o, x.params),
        pathname: gr([c, a.encodeLocation ? a.encodeLocation(x.pathname).pathname : x.pathname]),
        pathnameBase: x.pathnameBase === "/" ? c : gr([c, a.encodeLocation ? a.encodeLocation(x.pathnameBase).pathname : x.pathnameBase])
    })), l, r, s);
    return t && d ? j.createElement(Gl.Provider, {
        value: {
            location: Es({
                pathname: "/",
                search: "",
                hash: "",
                state: null,
                key: "default"
            }, f), navigationType: lr.Pop
        }
    }, d) : d
}

function Ij() {
    let e = Fj(), t = wj(e) ? e.status + " " + e.statusText : e instanceof Error ? e.message : JSON.stringify(e),
        r = e instanceof Error ? e.stack : null, a = {padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)"};
    return j.createElement(j.Fragment, null, j.createElement("h2", null, "Unexpected Application Error!"), j.createElement("h3", {style: {fontStyle: "italic"}}, t), r ? j.createElement("pre", {style: a}, r) : null, null)
}

const Aj = j.createElement(Ij, null);

class Lj extends j.Component {
    constructor(t) {
        super(t), this.state = {location: t.location, revalidation: t.revalidation, error: t.error}
    }

    static getDerivedStateFromError(t) {
        return {error: t}
    }

    static getDerivedStateFromProps(t, r) {
        return r.location !== t.location || r.revalidation !== "idle" && t.revalidation === "idle" ? {
            error: t.error,
            location: t.location,
            revalidation: t.revalidation
        } : {
            error: t.error !== void 0 ? t.error : r.error,
            location: r.location,
            revalidation: t.revalidation || r.revalidation
        }
    }

    componentDidCatch(t, r) {
        console.error("React Router caught the following error during render", t, r)
    }

    render() {
        return this.state.error !== void 0 ? j.createElement(qt.Provider, {value: this.props.routeContext}, j.createElement(Bh.Provider, {
            value: this.state.error,
            children: this.props.component
        })) : this.props.children
    }
}

function $j(e) {
    let {routeContext: t, match: r, children: s} = e, a = j.useContext(pu);
    return a && a.static && a.staticContext && (r.route.errorElement || r.route.ErrorBoundary) && (a.staticContext._deepestRenderedBoundaryId = r.route.id), j.createElement(qt.Provider, {value: t}, s)
}

function Dj(e, t, r, s) {
    var a;
    if (t === void 0 && (t = []), r === void 0 && (r = null), s === void 0 && (s = null), e == null) {
        var l;
        if (!r) return null;
        if (r.errors) e = r.matches; else if ((l = s) != null && l.v7_partialHydration && t.length === 0 && !r.initialized && r.matches.length > 0) e = r.matches; else return null
    }
    let i = e, o = (a = r) == null ? void 0 : a.errors;
    if (o != null) {
        let f = i.findIndex(m => m.route.id && (o == null ? void 0 : o[m.route.id]) !== void 0);
        f >= 0 || Ne(!1), i = i.slice(0, Math.min(i.length, f + 1))
    }
    let c = !1, u = -1;
    if (r && s && s.v7_partialHydration) for (let f = 0; f < i.length; f++) {
        let m = i[f];
        if ((m.route.HydrateFallback || m.route.hydrateFallbackElement) && (u = f), m.route.id) {
            let {loaderData: y, errors: b} = r,
                p = m.route.loader && y[m.route.id] === void 0 && (!b || b[m.route.id] === void 0);
            if (m.route.lazy || p) {
                c = !0, u >= 0 ? i = i.slice(0, u + 1) : i = [i[0]];
                break
            }
        }
    }
    return i.reduceRight((f, m, y) => {
        let b, p = !1, d = null, x = null;
        r && (b = o && m.route.id ? o[m.route.id] : void 0, d = m.route.errorElement || Aj, c && (u < 0 && y === 0 ? (Vj("route-fallback"), p = !0, x = null) : u === y && (p = !0, x = m.route.hydrateFallbackElement || null)));
        let h = t.concat(i.slice(0, y + 1)), g = () => {
            let v;
            return b ? v = d : p ? v = x : m.route.Component ? v = j.createElement(m.route.Component, null) : m.route.element ? v = m.route.element : v = f, j.createElement($j, {
                match: m,
                routeContext: {outlet: f, matches: h, isDataRoute: r != null},
                children: v
            })
        };
        return r && (m.route.ErrorBoundary || m.route.errorElement || y === 0) ? j.createElement(Lj, {
            location: r.location,
            revalidation: r.revalidation,
            component: d,
            error: b,
            children: g(),
            routeContext: {outlet: null, matches: h, isDataRoute: !0}
        }) : g()
    }, null)
}

var Hh = function (e) {
    return e.UseBlocker = "useBlocker", e.UseRevalidator = "useRevalidator", e.UseNavigateStable = "useNavigate", e
}(Hh || {}), Jh = function (e) {
    return e.UseBlocker = "useBlocker", e.UseLoaderData = "useLoaderData", e.UseActionData = "useActionData", e.UseRouteError = "useRouteError", e.UseNavigation = "useNavigation", e.UseRouteLoaderData = "useRouteLoaderData", e.UseMatches = "useMatches", e.UseRevalidator = "useRevalidator", e.UseNavigateStable = "useNavigate", e.UseRouteId = "useRouteId", e
}(Jh || {});

function Mj(e) {
    let t = j.useContext(pu);
    return t || Ne(!1), t
}

function zj(e) {
    let t = j.useContext(Sj);
    return t || Ne(!1), t
}

function Uj(e) {
    let t = j.useContext(qt);
    return t || Ne(!1), t
}

function qh(e) {
    let t = Uj(), r = t.matches[t.matches.length - 1];
    return r.route.id || Ne(!1), r.route.id
}

function Fj() {
    var e;
    let t = j.useContext(Bh), r = zj(), s = qh();
    return t !== void 0 ? t : (e = r.errors) == null ? void 0 : e[s]
}

function Bj() {
    let {router: e} = Mj(Hh.UseNavigateStable), t = qh(Jh.UseNavigateStable), r = j.useRef(!1);
    return Vh(() => {
        r.current = !0
    }), j.useCallback(function (a, l) {
        l === void 0 && (l = {}), r.current && (typeof a == "number" ? e.navigate(a) : e.navigate(a, Es({fromRouteId: t}, l)))
    }, [e, t])
}

const ff = {};

function Vj(e, t, r) {
    ff[e] || (ff[e] = !0)
}

function Wj(e, t) {
    e == null || e.v7_startTransition, e == null || e.v7_relativeSplatPath
}

function Hj(e) {
    return _j(e.context)
}

function Z(e) {
    Ne(!1)
}

function Jj(e) {
    let {
        basename: t = "/",
        children: r = null,
        location: s,
        navigationType: a = lr.Pop,
        navigator: l,
        static: i = !1,
        future: o
    } = e;
    Bs() && Ne(!1);
    let c = t.replace(/^\/*/, "/"), u = j.useMemo(() => ({
        basename: c,
        navigator: l,
        static: i,
        future: Es({v7_relativeSplatPath: !1}, o)
    }), [c, o, l, i]);
    typeof s == "string" && (s = Ln(s));
    let {pathname: f = "/", search: m = "", hash: y = "", state: b = null, key: p = "default"} = s,
        d = j.useMemo(() => {
            let x = mu(f, c);
            return x == null ? null : {location: {pathname: x, search: m, hash: y, state: b, key: p}, navigationType: a}
        }, [c, f, m, y, b, p, a]);
    return d == null ? null : j.createElement(qr.Provider, {value: u}, j.createElement(Gl.Provider, {
        children: r,
        value: d
    }))
}

function qj(e) {
    let {children: t, location: r} = e;
    return Rj(Wo(t), r)
}

new Promise(() => {
});

function Wo(e, t) {
    t === void 0 && (t = []);
    let r = [];
    return j.Children.forEach(e, (s, a) => {
        if (!j.isValidElement(s)) return;
        let l = [...t, a];
        if (s.type === j.Fragment) {
            r.push.apply(r, Wo(s.props.children, l));
            return
        }
        s.type !== Z && Ne(!1), !s.props.index || !s.props.children || Ne(!1);
        let i = {
            id: s.props.id || l.join("-"),
            caseSensitive: s.props.caseSensitive,
            element: s.props.element,
            Component: s.props.Component,
            index: s.props.index,
            path: s.props.path,
            loader: s.props.loader,
            action: s.props.action,
            errorElement: s.props.errorElement,
            ErrorBoundary: s.props.ErrorBoundary,
            hasErrorBoundary: s.props.ErrorBoundary != null || s.props.errorElement != null,
            shouldRevalidate: s.props.shouldRevalidate,
            handle: s.props.handle,
            lazy: s.props.lazy
        };
        s.props.children && (i.children = Wo(s.props.children, l)), r.push(i)
    }), r
}

/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Ho() {
    return Ho = Object.assign ? Object.assign.bind() : function (e) {
        for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var s in r) Object.prototype.hasOwnProperty.call(r, s) && (e[s] = r[s])
        }
        return e
    }, Ho.apply(this, arguments)
}

function Qj(e, t) {
    if (e == null) return {};
    var r = {}, s = Object.keys(e), a, l;
    for (l = 0; l < s.length; l++) a = s[l], !(t.indexOf(a) >= 0) && (r[a] = e[a]);
    return r
}

function Kj(e) {
    return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
}

function Gj(e, t) {
    return e.button === 0 && (!t || t === "_self") && !Kj(e)
}

function Jo(e) {
    return e === void 0 && (e = ""), new URLSearchParams(typeof e == "string" || Array.isArray(e) || e instanceof URLSearchParams ? e : Object.keys(e).reduce((t, r) => {
        let s = e[r];
        return t.concat(Array.isArray(s) ? s.map(a => [r, a]) : [[r, s]])
    }, []))
}

function Xj(e, t) {
    let r = Jo(e);
    return t && t.forEach((s, a) => {
        r.has(a) || t.getAll(a).forEach(l => {
            r.append(a, l)
        })
    }), r
}

const Yj = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"],
    Zj = "6";
try {
    window.__reactRouterVersion = Zj
} catch {
}
const eN = "startTransition", mf = yx[eN];

function tN(e) {
    let {basename: t, children: r, future: s, window: a} = e, l = j.useRef();
    l.current == null && (l.current = Yb({window: a, v5Compat: !0}));
    let i = l.current, [o, c] = j.useState({action: i.action, location: i.location}), {v7_startTransition: u} = s || {},
        f = j.useCallback(m => {
            u && mf ? mf(() => c(m)) : c(m)
        }, [c, u]);
    return j.useLayoutEffect(() => i.listen(f), [i, f]), j.useEffect(() => Wj(s), [s]), j.createElement(Jj, {
        basename: t,
        children: r,
        location: o.location,
        navigationType: o.action,
        navigator: i,
        future: s
    })
}

const rN = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u",
    nN = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, D = j.forwardRef(function (t, r) {
        let {
            onClick: s,
            relative: a,
            reloadDocument: l,
            replace: i,
            state: o,
            target: c,
            to: u,
            preventScrollReset: f,
            viewTransition: m
        } = t, y = Qj(t, Yj), {basename: b} = j.useContext(qr), p, d = !1;
        if (typeof u == "string" && nN.test(u) && (p = u, rN)) try {
            let v = new URL(window.location.href), w = u.startsWith("//") ? new URL(v.protocol + u) : new URL(u),
                N = mu(w.pathname, b);
            w.origin === v.origin && N != null ? u = N + w.search + w.hash : d = !0
        } catch {
        }
        let x = Cj(u, {relative: a}),
            h = sN(u, {replace: i, state: o, target: c, preventScrollReset: f, relative: a, viewTransition: m});

        function g(v) {
            s && s(v), v.defaultPrevented || h(v)
        }

        return j.createElement("a", Ho({}, y, {href: p || x, onClick: d || l ? s : g, ref: r, target: c}))
    });
var pf;
(function (e) {
    e.UseScrollRestoration = "useScrollRestoration", e.UseSubmit = "useSubmit", e.UseSubmitFetcher = "useSubmitFetcher", e.UseFetcher = "useFetcher", e.useViewTransitionState = "useViewTransitionState"
})(pf || (pf = {}));
var hf;
(function (e) {
    e.UseFetcher = "useFetcher", e.UseFetchers = "useFetchers", e.UseScrollRestoration = "useScrollRestoration"
})(hf || (hf = {}));

function sN(e, t) {
    let {
        target: r,
        replace: s,
        state: a,
        preventScrollReset: l,
        relative: i,
        viewTransition: o
    } = t === void 0 ? {} : t, c = Qt(), u = Qr(), f = Wh(e, {relative: i});
    return j.useCallback(m => {
        if (Gj(m, r)) {
            m.preventDefault();
            let y = s !== void 0 ? s : al(u) === al(f);
            c(e, {replace: y, state: a, preventScrollReset: l, relative: i, viewTransition: o})
        }
    }, [u, c, f, s, a, r, e, l, i, o])
}

function aN(e) {
    let t = j.useRef(Jo(e)), r = j.useRef(!1), s = Qr(),
        a = j.useMemo(() => Xj(s.search, r.current ? null : t.current), [s.search]), l = Qt(),
        i = j.useCallback((o, c) => {
            const u = Jo(typeof o == "function" ? o(a) : o);
            r.current = !0, l("?" + u, c)
        }, [l, a]);
    return [a, i]
}

const lN = Zp({reducer: {cart: oh, auth: $h, favorites: uh}});
let iN = {data: ""}, oN = e => {
        if (typeof window == "object") {
            let t = (e ? e.querySelector("#_goober") : window._goober) || Object.assign(document.createElement("style"), {
                innerHTML: " ",
                id: "_goober"
            });
            return t.nonce = window.__nonce__, t.parentNode || (e || document.head).appendChild(t), t.firstChild
        }
        return e || iN
    }, cN = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g, uN = /\/\*[^]*?\*\/|  +/g, xf = /\n+/g,
    nr = (e, t) => {
        let r = "", s = "", a = "";
        for (let l in e) {
            let i = e[l];
            l[0] == "@" ? l[1] == "i" ? r = l + " " + i + ";" : s += l[1] == "f" ? nr(i, l) : l + "{" + nr(i, l[1] == "k" ? "" : t) + "}" : typeof i == "object" ? s += nr(i, t ? t.replace(/([^,])+/g, o => l.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g, c => /&/.test(c) ? c.replace(/&/g, o) : o ? o + " " + c : c)) : l) : i != null && (l = /^--/.test(l) ? l : l.replace(/[A-Z]/g, "-$&").toLowerCase(), a += nr.p ? nr.p(l, i) : l + ":" + i + ";")
        }
        return r + (t && a ? t + "{" + a + "}" : a) + s
    }, At = {}, Qh = e => {
        if (typeof e == "object") {
            let t = "";
            for (let r in e) t += r + Qh(e[r]);
            return t
        }
        return e
    }, dN = (e, t, r, s, a) => {
        let l = Qh(e), i = At[l] || (At[l] = (c => {
            let u = 0, f = 11;
            for (; u < c.length;) f = 101 * f + c.charCodeAt(u++) >>> 0;
            return "go" + f
        })(l));
        if (!At[i]) {
            let c = l !== e ? e : (u => {
                let f, m, y = [{}];
                for (; f = cN.exec(u.replace(uN, ""));) f[4] ? y.shift() : f[3] ? (m = f[3].replace(xf, " ").trim(), y.unshift(y[0][m] = y[0][m] || {})) : y[0][f[1]] = f[2].replace(xf, " ").trim();
                return y[0]
            })(e);
            At[i] = nr(a ? {["@keyframes " + i]: c} : c, r ? "" : "." + i)
        }
        let o = r && At.g ? At.g : null;
        return r && (At.g = At[i]), ((c, u, f, m) => {
            m ? u.data = u.data.replace(m, c) : u.data.indexOf(c) === -1 && (u.data = f ? c + u.data : u.data + c)
        })(At[i], t, s, o), i
    }, fN = (e, t, r) => e.reduce((s, a, l) => {
        let i = t[l];
        if (i && i.call) {
            let o = i(r), c = o && o.props && o.props.className || /^go/.test(o) && o;
            i = c ? "." + c : o && typeof o == "object" ? o.props ? "" : nr(o, "") : o === !1 ? "" : o
        }
        return s + a + (i ?? "")
    }, "");

function Xl(e) {
    let t = this || {}, r = e.call ? e(t.p) : e;
    return dN(r.unshift ? r.raw ? fN(r, [].slice.call(arguments, 1), t.p) : r.reduce((s, a) => Object.assign(s, a && a.call ? a(t.p) : a), {}) : r, oN(t.target), t.g, t.o, t.k)
}

let Kh, qo, Qo;
Xl.bind({g: 1});
let Ht = Xl.bind({k: 1});

function mN(e, t, r, s) {
    nr.p = t, Kh = e, qo = r, Qo = s
}

function Sr(e, t) {
    let r = this || {};
    return function () {
        let s = arguments;

        function a(l, i) {
            let o = Object.assign({}, l), c = o.className || a.className;
            r.p = Object.assign({theme: qo && qo()}, o), r.o = / *go\d+/.test(c), o.className = Xl.apply(r, s) + (c ? " " + c : "");
            let u = e;
            return e[0] && (u = o.as || e, delete o.as), Qo && u[0] && Qo(o), Kh(u, o)
        }

        return a
    }
}

var pN = e => typeof e == "function", ll = (e, t) => pN(e) ? e(t) : e, hN = (() => {
        let e = 0;
        return () => (++e).toString()
    })(), Gh = (() => {
        let e;
        return () => {
            if (e === void 0 && typeof window < "u") {
                let t = matchMedia("(prefers-reduced-motion: reduce)");
                e = !t || t.matches
            }
            return e
        }
    })(), xN = 20, hu = "default", Xh = (e, t) => {
        let {toastLimit: r} = e.settings;
        switch (t.type) {
            case 0:
                return {...e, toasts: [t.toast, ...e.toasts].slice(0, r)};
            case 1:
                return {...e, toasts: e.toasts.map(i => i.id === t.toast.id ? {...i, ...t.toast} : i)};
            case 2:
                let {toast: s} = t;
                return Xh(e, {type: e.toasts.find(i => i.id === s.id) ? 1 : 0, toast: s});
            case 3:
                let {toastId: a} = t;
                return {
                    ...e,
                    toasts: e.toasts.map(i => i.id === a || a === void 0 ? {...i, dismissed: !0, visible: !1} : i)
                };
            case 4:
                return t.toastId === void 0 ? {...e, toasts: []} : {...e, toasts: e.toasts.filter(i => i.id !== t.toastId)};
            case 5:
                return {...e, pausedAt: t.time};
            case 6:
                let l = t.time - (e.pausedAt || 0);
                return {...e, pausedAt: void 0, toasts: e.toasts.map(i => ({...i, pauseDuration: i.pauseDuration + l}))}
        }
    }, Ea = [], Yh = {toasts: [], pausedAt: void 0, settings: {toastLimit: xN}}, _t = {}, Zh = (e, t = hu) => {
        _t[t] = Xh(_t[t] || Yh, e), Ea.forEach(([r, s]) => {
            r === t && s(_t[t])
        })
    }, ex = e => Object.keys(_t).forEach(t => Zh(e, t)),
    gN = e => Object.keys(_t).find(t => _t[t].toasts.some(r => r.id === e)), Yl = (e = hu) => t => {
        Zh(t, e)
    }, yN = {blank: 4e3, error: 4e3, success: 2e3, loading: 1 / 0, custom: 4e3}, vN = (e = {}, t = hu) => {
        let [r, s] = j.useState(_t[t] || Yh), a = j.useRef(_t[t]);
        j.useEffect(() => (a.current !== _t[t] && s(_t[t]), Ea.push([t, s]), () => {
            let i = Ea.findIndex(([o]) => o === t);
            i > -1 && Ea.splice(i, 1)
        }), [t]);
        let l = r.toasts.map(i => {
            var o, c, u;
            return {
                ...e, ...e[i.type], ...i,
                removeDelay: i.removeDelay || ((o = e[i.type]) == null ? void 0 : o.removeDelay) || (e == null ? void 0 : e.removeDelay),
                duration: i.duration || ((c = e[i.type]) == null ? void 0 : c.duration) || (e == null ? void 0 : e.duration) || yN[i.type],
                style: {...e.style, ...(u = e[i.type]) == null ? void 0 : u.style, ...i.style}
            }
        });
        return {...r, toasts: l}
    }, bN = (e, t = "blank", r) => ({
        createdAt: Date.now(),
        visible: !0,
        dismissed: !1,
        type: t,
        ariaProps: {role: "status", "aria-live": "polite"},
        message: e,
        pauseDuration: 0, ...r,
        id: (r == null ? void 0 : r.id) || hN()
    }), Vs = e => (t, r) => {
        let s = bN(t, e, r);
        return Yl(s.toasterId || gN(s.id))({type: 2, toast: s}), s.id
    }, ke = (e, t) => Vs("blank")(e, t);
ke.error = Vs("error");
ke.success = Vs("success");
ke.loading = Vs("loading");
ke.custom = Vs("custom");
ke.dismiss = (e, t) => {
    let r = {type: 3, toastId: e};
    t ? Yl(t)(r) : ex(r)
};
ke.dismissAll = e => ke.dismiss(void 0, e);
ke.remove = (e, t) => {
    let r = {type: 4, toastId: e};
    t ? Yl(t)(r) : ex(r)
};
ke.removeAll = e => ke.remove(void 0, e);
ke.promise = (e, t, r) => {
    let s = ke.loading(t.loading, {...r, ...r == null ? void 0 : r.loading});
    return typeof e == "function" && (e = e()), e.then(a => {
        let l = t.success ? ll(t.success, a) : void 0;
        return l ? ke.success(l, {id: s, ...r, ...r == null ? void 0 : r.success}) : ke.dismiss(s), a
    }).catch(a => {
        let l = t.error ? ll(t.error, a) : void 0;
        l ? ke.error(l, {id: s, ...r, ...r == null ? void 0 : r.error}) : ke.dismiss(s)
    }), e
};
var jN = 1e3, NN = (e, t = "default") => {
    let {toasts: r, pausedAt: s} = vN(e, t), a = j.useRef(new Map).current, l = j.useCallback((m, y = jN) => {
        if (a.has(m)) return;
        let b = setTimeout(() => {
            a.delete(m), i({type: 4, toastId: m})
        }, y);
        a.set(m, b)
    }, []);
    j.useEffect(() => {
        if (s) return;
        let m = Date.now(), y = r.map(b => {
            if (b.duration === 1 / 0) return;
            let p = (b.duration || 0) + b.pauseDuration - (m - b.createdAt);
            if (p < 0) {
                b.visible && ke.dismiss(b.id);
                return
            }
            return setTimeout(() => ke.dismiss(b.id, t), p)
        });
        return () => {
            y.forEach(b => b && clearTimeout(b))
        }
    }, [r, s, t]);
    let i = j.useCallback(Yl(t), [t]), o = j.useCallback(() => {
        i({type: 5, time: Date.now()})
    }, [i]), c = j.useCallback((m, y) => {
        i({type: 1, toast: {id: m, height: y}})
    }, [i]), u = j.useCallback(() => {
        s && i({type: 6, time: Date.now()})
    }, [s, i]), f = j.useCallback((m, y) => {
        let {reverseOrder: b = !1, gutter: p = 8, defaultPosition: d} = y || {},
            x = r.filter(v => (v.position || d) === (m.position || d) && v.height), h = x.findIndex(v => v.id === m.id),
            g = x.filter((v, w) => w < h && v.visible).length;
        return x.filter(v => v.visible).slice(...b ? [g + 1] : [0, g]).reduce((v, w) => v + (w.height || 0) + p, 0)
    }, [r]);
    return j.useEffect(() => {
        r.forEach(m => {
            if (m.dismissed) l(m.id, m.removeDelay); else {
                let y = a.get(m.id);
                y && (clearTimeout(y), a.delete(m.id))
            }
        })
    }, [r, l]), {toasts: r, handlers: {updateHeight: c, startPause: o, endPause: u, calculateOffset: f}}
}, wN = Ht`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`, kN = Ht`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`, SN = Ht`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`, CN = Sr("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e => e.primary || "#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${wN} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${kN} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e => e.secondary || "#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${SN} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`, EN = Ht`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`, PN = Sr("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e => e.secondary || "#e0e0e0"};
  border-right-color: ${e => e.primary || "#616161"};
  animation: ${EN} 1s linear infinite;
`, _N = Ht`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`, ON = Ht`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`, RN = Sr("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e => e.primary || "#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${_N} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ON} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e => e.secondary || "#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`, TN = Sr("div")`
  position: absolute;
`, IN = Sr("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`, AN = Ht`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`, LN = Sr("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${AN} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`, $N = ({toast: e}) => {
    let {icon: t, type: r, iconTheme: s} = e;
    return t !== void 0 ? typeof t == "string" ? j.createElement(LN, null, t) : t : r === "blank" ? null : j.createElement(IN, null, j.createElement(PN, {...s}), r !== "loading" && j.createElement(TN, null, r === "error" ? j.createElement(CN, {...s}) : j.createElement(RN, {...s})))
}, DN = e => `
0% {transform: translate3d(0,${e * -200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`, MN = e => `
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e * -150}%,-1px) scale(.6); opacity:0;}
`, zN = "0%{opacity:0;} 100%{opacity:1;}", UN = "0%{opacity:1;} 100%{opacity:0;}", FN = Sr("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`, BN = Sr("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`, VN = (e, t) => {
    let r = e.includes("top") ? 1 : -1, [s, a] = Gh() ? [zN, UN] : [DN(r), MN(r)];
    return {animation: t ? `${Ht(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards` : `${Ht(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}
}, WN = j.memo(({toast: e, position: t, style: r, children: s}) => {
    let a = e.height ? VN(e.position || t || "top-center", e.visible) : {opacity: 0},
        l = j.createElement($N, {toast: e}), i = j.createElement(BN, {...e.ariaProps}, ll(e.message, e));
    return j.createElement(FN, {
        className: e.className,
        style: {...a, ...r, ...e.style}
    }, typeof s == "function" ? s({icon: l, message: i}) : j.createElement(j.Fragment, null, l, i))
});
mN(j.createElement);
var HN = ({id: e, className: t, style: r, onHeightUpdate: s, children: a}) => {
    let l = j.useCallback(i => {
        if (i) {
            let o = () => {
                let c = i.getBoundingClientRect().height;
                s(e, c)
            };
            o(), new MutationObserver(o).observe(i, {subtree: !0, childList: !0, characterData: !0})
        }
    }, [e, s]);
    return j.createElement("div", {ref: l, className: t, style: r}, a)
}, JN = (e, t) => {
    let r = e.includes("top"), s = r ? {top: 0} : {bottom: 0},
        a = e.includes("center") ? {justifyContent: "center"} : e.includes("right") ? {justifyContent: "flex-end"} : {};
    return {
        left: 0,
        right: 0,
        display: "flex",
        position: "absolute",
        transition: Gh() ? void 0 : "all 230ms cubic-bezier(.21,1.02,.73,1)",
        transform: `translateY(${t * (r ? 1 : -1)}px)`, ...s, ...a
    }
}, qN = Xl`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`, ca = 16, QN = ({
                                 reverseOrder: e,
                                 position: t = "top-center",
                                 toastOptions: r,
                                 gutter: s,
                                 children: a,
                                 toasterId: l,
                                 containerStyle: i,
                                 containerClassName: o
                             }) => {
    let {toasts: c, handlers: u} = NN(r, l);
    return j.createElement("div", {
        "data-rht-toaster": l || "",
        style: {position: "fixed", zIndex: 9999, top: ca, left: ca, right: ca, bottom: ca, pointerEvents: "none", ...i},
        className: o,
        onMouseEnter: u.startPause,
        onMouseLeave: u.endPause
    }, c.map(f => {
        let m = f.position || t, y = u.calculateOffset(f, {reverseOrder: e, gutter: s, defaultPosition: t}),
            b = JN(m, y);
        return j.createElement(HN, {
            id: f.id,
            key: f.id,
            onHeightUpdate: u.updateHeight,
            className: f.visible ? qN : "",
            style: b
        }, f.type === "custom" ? ll(f.message, f) : a ? a(f) : j.createElement(WN, {toast: f, position: m}))
    }))
}, _ = ke;
const KN = () => {
    const {pathname: e} = Qr();
    return j.useEffect(() => {
        window.scrollTo(0, 0)
    }, [e]), null
}, GN = () => {
    var $;
    const e = Qt(), t = Jr(), {user: r, isAuthenticated: s} = Ze(L => L.auth), a = Ze(L => L.cart.items),
        l = Ze(L => L.favorites.items), [i, o] = j.useState(!1), [c, u] = j.useState(!1), [f, m] = j.useState(!1), [y, b] = j.useState(""), [p, d] = j.useState([]), [x, h] = j.useState(!1), [g, v] = j.useState(0),
        w = a.reduce((L, G) => L + G.quantity, 0), N = l.length, k = (r == null ? void 0 : r.role) === "admin";
    j.useEffect(() => {
        const L = () => {
            const G = JSON.parse(localStorage.getItem("misat_current_user") || "{}");
            v(G.balance || 0)
        };
        return L(), window.addEventListener("balanceUpdated", L), () => window.removeEventListener("balanceUpdated", L)
    }, []), j.useEffect(() => {
        const L = () => {
            o(window.scrollY > 50)
        };
        return window.addEventListener("scroll", L), () => window.removeEventListener("scroll", L)
    }, []);
    const E = L => {
        if (b(L), L.length > 1) {
            const X = nu().filter(P => P.name.toLowerCase().includes(L.toLowerCase())).slice(0, 5);
            d(X), h(!0)
        } else h(!1)
    }, R = L => {
        L.preventDefault(), y.trim() && (e(`/catalog?search=${y}`), b(""), h(!1), u(!1))
    }, z = () => {
        t(du()), e("/"), u(!1), m(!1)
    };
    return n.jsxs(n.Fragment, {
        children: [n.jsx("header", {
            className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${i ? "bg-white/95 backdrop-blur-md shadow-sm py-2" : "bg-white py-3"}`,
            children: n.jsx("div", {
                className: "container mx-auto px-4", children: n.jsxs("div", {
                    className: "flex justify-between items-center",
                    children: [n.jsxs(D, {
                        to: "/",
                        className: "flex items-center gap-2",
                        children: [n.jsx("img", {
                            src: "/images/IMG_8965.jpeg",
                            alt: "MISAT Logo",
                            className: "h-8 w-auto object-contain",
                            onError: L => {
                                L.target.style.display = "none"
                            }
                        }), n.jsx("span", {className: "text-xl font-black tracking-tighter", children: "MISAT"})]
                    }), n.jsxs("nav", {
                        className: "hidden md:flex items-center gap-6",
                        children: [n.jsx(D, {
                            to: "/",
                            className: "text-sm uppercase tracking-wider hover:opacity-60",
                            children: "Главная"
                        }), n.jsx(D, {
                            to: "/catalog",
                            className: "text-sm uppercase tracking-wider hover:opacity-60",
                            children: "Каталог"
                        }), n.jsx(D, {
                            to: "/support",
                            className: "text-sm uppercase tracking-wider hover:opacity-60",
                            children: "Поддержка"
                        }), k && n.jsx(D, {
                            to: "/admin",
                            className: "text-sm uppercase tracking-wider text-gray-500 hover:text-black",
                            children: "Админ-панель"
                        })]
                    }), n.jsxs("div", {
                        className: "hidden md:flex items-center gap-4", children: [n.jsxs("form", {
                            onSubmit: R,
                            className: "relative",
                            children: [n.jsx("input", {
                                type: "text",
                                placeholder: "Поиск...",
                                value: y,
                                onChange: L => E(L.target.value),
                                onFocus: () => y.length > 1 && h(!0),
                                onBlur: () => setTimeout(() => h(!1), 200),
                                className: "w-48 pl-9 pr-3 py-1.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black"
                            }), n.jsx("i", {className: "fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"}), x && p.length > 0 && n.jsx("div", {
                                className: "absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto",
                                children: p.map(L => {
                                    var G;
                                    return n.jsxs("button", {
                                        onClick: () => {
                                            e(`/product/${L.id}`), h(!1), b("")
                                        },
                                        className: "w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3",
                                        children: [n.jsx("img", {
                                            src: ((G = L.images) == null ? void 0 : G[0]) || L.image,
                                            alt: L.name,
                                            className: "w-8 h-8 object-cover rounded"
                                        }), n.jsxs("div", {
                                            children: [n.jsx("p", {
                                                className: "font-medium text-sm",
                                                children: L.name
                                            }), n.jsxs("p", {
                                                className: "text-xs text-gray-500",
                                                children: [L.price.toLocaleString(), " ₽"]
                                            })]
                                        })]
                                    }, L.id)
                                })
                            })]
                        }), n.jsxs(D, {
                            to: "/favorites",
                            className: "relative group",
                            children: [n.jsx("i", {className: "far fa-heart text-xl group-hover:scale-110 transition"}), N > 0 && n.jsx("span", {
                                className: "absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center",
                                children: N
                            })]
                        }), n.jsxs(D, {
                            to: "/cart",
                            className: "relative group",
                            children: [n.jsx("i", {className: "fas fa-shopping-bag text-xl group-hover:scale-110 transition"}), w > 0 && n.jsx("span", {
                                className: "absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center",
                                children: w
                            })]
                        }), s ? n.jsxs("div", {
                            className: "relative",
                            children: [n.jsxs("button", {
                                onClick: () => m(!f),
                                className: "flex items-center gap-2 hover:opacity-70 transition",
                                children: [n.jsx("i", {className: "far fa-user-circle text-xl"}), n.jsx("span", {
                                    className: "text-sm",
                                    children: (r == null ? void 0 : r.first_name) || (($ = r == null ? void 0 : r.email) == null ? void 0 : $.split("@")[0])
                                }), n.jsx("i", {className: "fas fa-chevron-down text-xs"})]
                            }), f && n.jsxs("div", {
                                className: "absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-lg z-10",
                                children: [n.jsxs("div", {
                                    className: "px-4 py-2 border-b bg-gray-50",
                                    children: [n.jsx("p", {
                                        className: "text-xs text-gray-500",
                                        children: "Баланс"
                                    }), n.jsxs("p", {
                                        className: "font-bold text-green-600",
                                        children: [g.toLocaleString(), " ₽"]
                                    })]
                                }), n.jsxs(D, {
                                    to: "/profile",
                                    className: "block px-4 py-2 text-sm hover:bg-gray-100 transition",
                                    onClick: () => m(!1),
                                    children: [n.jsx("i", {className: "fas fa-user mr-2"}), " Профиль"]
                                }), n.jsxs(D, {
                                    to: "/orders",
                                    className: "block px-4 py-2 text-sm hover:bg-gray-100 transition",
                                    onClick: () => m(!1),
                                    children: [n.jsx("i", {className: "fas fa-box mr-2"}), " Мои заказы"]
                                }), n.jsxs(D, {
                                    to: "/balance-topup",
                                    className: "block px-4 py-2 text-sm hover:bg-gray-100 transition",
                                    onClick: () => m(!1),
                                    children: [n.jsx("i", {className: "fas fa-wallet mr-2"}), " Пополнить баланс"]
                                }), n.jsxs(D, {
                                    to: "/gift-card",
                                    className: "block px-4 py-2 text-sm hover:bg-gray-100 transition",
                                    onClick: () => m(!1),
                                    children: [n.jsx("i", {className: "fas fa-gift mr-2"}), " Подарочные сертификаты"]
                                }), n.jsx("hr", {className: "my-1"}), n.jsxs("button", {
                                    onClick: z,
                                    className: "block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition",
                                    children: [n.jsx("i", {className: "fas fa-sign-out-alt mr-2"}), " Выйти"]
                                })]
                            })]
                        }) : n.jsx(D, {to: "/profile", children: n.jsx("i", {className: "far fa-user text-xl"})})]
                    }), n.jsx("button", {
                        className: "md:hidden w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100",
                        onClick: () => u(!c),
                        children: n.jsx("i", {className: `fas fa-${c ? "times" : "bars"} text-2xl`})
                    })]
                })
            })
        }), c && n.jsxs(n.Fragment, {
            children: [n.jsx("div", {
                className: "fixed inset-0 bg-black/50 z-40 md:hidden",
                onClick: () => u(!1)
            }), n.jsxs("div", {
                className: "fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl p-6 overflow-y-auto animate-slideInRight md:hidden",
                children: [n.jsxs("div", {
                    className: "flex justify-between items-center mb-6 pb-4 border-b",
                    children: [n.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [n.jsx("img", {
                            src: "/images/IMG_8965.jpeg",
                            alt: "Logo",
                            className: "h-8 w-auto"
                        }), n.jsx("span", {className: "text-xl font-black", children: "MISAT"})]
                    }), n.jsx("button", {
                        onClick: () => u(!1),
                        className: "text-2xl w-10 h-10 flex items-center justify-center",
                        children: "✕"
                    })]
                }), n.jsxs("nav", {
                    className: "flex flex-col gap-4",
                    children: [n.jsxs(D, {
                        to: "/",
                        className: "text-base py-2 hover:text-gray-600",
                        onClick: () => u(!1),
                        children: [n.jsx("i", {className: "fas fa-home w-6 mr-3"}), " Главная"]
                    }), n.jsxs(D, {
                        to: "/catalog",
                        className: "text-base py-2 hover:text-gray-600",
                        onClick: () => u(!1),
                        children: [n.jsx("i", {className: "fas fa-search w-6 mr-3"}), " Каталог"]
                    }), n.jsxs(D, {
                        to: "/favorites",
                        className: "text-base py-2 hover:text-gray-600",
                        onClick: () => u(!1),
                        children: [n.jsx("i", {className: "far fa-heart w-6 mr-3"}), " Избранное", N > 0 && n.jsx("span", {
                            className: "ml-2 bg-black text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center",
                            children: N
                        })]
                    }), n.jsxs(D, {
                        to: "/cart",
                        className: "text-base py-2 hover:text-gray-600",
                        onClick: () => u(!1),
                        children: [n.jsx("i", {className: "fas fa-shopping-bag w-6 mr-3"}), " Корзина", w > 0 && n.jsx("span", {
                            className: "ml-2 bg-black text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center",
                            children: w
                        })]
                    }), n.jsxs(D, {
                        to: "/profile",
                        className: "text-base py-2 hover:text-gray-600",
                        onClick: () => u(!1),
                        children: [n.jsx("i", {className: "far fa-user w-6 mr-3"}), " Профиль"]
                    }), n.jsxs(D, {
                        to: "/orders",
                        className: "text-base py-2 hover:text-gray-600",
                        onClick: () => u(!1),
                        children: [n.jsx("i", {className: "fas fa-box w-6 mr-3"}), " Заказы"]
                    }), n.jsxs(D, {
                        to: "/balance-topup",
                        className: "text-base py-2 hover:text-gray-600",
                        onClick: () => u(!1),
                        children: [n.jsx("i", {className: "fas fa-wallet w-6 mr-3"}), " Пополнить баланс"]
                    }), n.jsxs(D, {
                        to: "/gift-card",
                        className: "text-base py-2 hover:text-gray-600",
                        onClick: () => u(!1),
                        children: [n.jsx("i", {className: "fas fa-gift w-6 mr-3"}), " Сертификаты"]
                    }), n.jsxs(D, {
                        to: "/support",
                        className: "text-base py-2 hover:text-gray-600",
                        onClick: () => u(!1),
                        children: [n.jsx("i", {className: "fas fa-headset w-6 mr-3"}), " Поддержка"]
                    }), k && n.jsxs(D, {
                        to: "/admin",
                        className: "text-base py-2 text-purple-600",
                        onClick: () => u(!1),
                        children: [n.jsx("i", {className: "fas fa-shield-alt w-6 mr-3"}), " Админ-панель"]
                    }), n.jsx("hr", {className: "my-2"}), n.jsxs("div", {
                        className: "bg-gray-50 p-3 rounded-xl mb-2",
                        children: [n.jsx("p", {
                            className: "text-xs text-gray-500",
                            children: "Баланс"
                        }), n.jsxs("p", {
                            className: "font-bold text-green-600 text-lg",
                            children: [g.toLocaleString(), " ₽"]
                        })]
                    }), n.jsxs("form", {
                        onSubmit: R,
                        className: "relative mt-2",
                        children: [n.jsx("input", {
                            type: "text",
                            placeholder: "Поиск...",
                            value: y,
                            onChange: L => b(L.target.value),
                            className: "w-full pl-10 pr-4 py-2 border rounded-full text-sm"
                        }), n.jsx("i", {className: "fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"})]
                    }), s && n.jsxs("button", {
                        onClick: z,
                        className: "text-base py-2 text-red-500 text-left",
                        children: [n.jsx("i", {className: "fas fa-sign-out-alt w-6 mr-3"}), " Выйти"]
                    })]
                })]
            })]
        })]
    })
}, XN = () => {
    const e = new Date().getFullYear();
    return n.jsx("footer", {
        className: "bg-black text-white pt-16 pb-8 mt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [n.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12",
                children: [n.jsxs("div", {
                    children: [n.jsx(D, {
                        to: "/",
                        className: "flex items-center gap-2 mb-4 hover:opacity-80 transition",
                        children: n.jsx("span", {className: "text-2xl font-black tracking-tighter", children: "MISAT"})
                    }), n.jsx("p", {
                        className: "text-gray-400 text-sm leading-relaxed",
                        children: "Минимализм. Качество. Стиль."
                    }), n.jsxs("p", {
                        className: "text-gray-500 text-xs mt-4",
                        children: ["© ", e, " Все права защищены"]
                    })]
                }), n.jsxs("div", {
                    children: [n.jsx("h4", {
                        className: "font-semibold mb-4 text-sm uppercase tracking-wider",
                        children: "Каталог"
                    }), n.jsxs("ul", {
                        className: "space-y-2 text-sm text-gray-400",
                        children: [n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/catalog?category=clothes",
                                className: "hover:text-white transition",
                                children: "Одежда"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/catalog?category=shoes",
                                className: "hover:text-white transition",
                                children: "Обувь"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/catalog?category=accessories",
                                className: "hover:text-white transition",
                                children: "Аксессуары"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/catalog?category=sport",
                                className: "hover:text-white transition",
                                children: "Спорт"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/catalog?category=sale",
                                className: "hover:text-white transition",
                                children: "Распродажа"
                            })
                        })]
                    })]
                }), n.jsxs("div", {
                    children: [n.jsx("h4", {
                        className: "font-semibold mb-4 text-sm uppercase tracking-wider",
                        children: "Информация"
                    }), n.jsxs("ul", {
                        className: "space-y-2 text-sm text-gray-400",
                        children: [n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/about",
                                className: "hover:text-white transition",
                                children: "О магазине"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/delivery",
                                className: "hover:text-white transition",
                                children: "Доставка и оплата"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/returns",
                                className: "hover:text-white transition",
                                children: "Возврат товара"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/faq",
                                className: "hover:text-white transition",
                                children: "Вопросы и ответы"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/blog",
                                className: "hover:text-white transition",
                                children: "Блог"
                            })
                        })]
                    })]
                }), n.jsxs("div", {
                    children: [n.jsx("h4", {
                        className: "font-semibold mb-4 text-sm uppercase tracking-wider",
                        children: "Поддержка"
                    }), n.jsxs("ul", {
                        className: "space-y-2 text-sm text-gray-400",
                        children: [n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/support",
                                className: "hover:text-white transition",
                                children: "Служба поддержки"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/contacts",
                                className: "hover:text-white transition",
                                children: "Контакты"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/tracking",
                                className: "hover:text-white transition",
                                children: "Отследить заказ"
                            })
                        }), n.jsx("li", {
                            children: n.jsx(D, {
                                to: "/gift-card",
                                className: "hover:text-white transition",
                                children: "Подарочные сертификаты"
                            })
                        })]
                    })]
                }), n.jsxs("div", {
                    children: [n.jsx("h4", {
                        className: "font-semibold mb-4 text-sm uppercase tracking-wider",
                        children: "Мы в соцсетях"
                    }), n.jsxs("div", {
                        className: "flex gap-4 text-2xl mb-6",
                        children: [n.jsx("a", {
                            href: "https://www.tiktok.com/@misatchina",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "hover:text-gray-400 transition",
                            children: n.jsx("i", {className: "fab fa-tiktok"})
                        }), n.jsx("a", {
                            href: "https://vk.ru/mokidorastore",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "hover:text-gray-400 transition",
                            children: n.jsx("i", {className: "fab fa-vk"})
                        }), n.jsx("a", {
                            href: "https://t.me/misatshop",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "hover:text-gray-400 transition",
                            children: n.jsx("i", {className: "fab fa-telegram"})
                        })]
                    }), n.jsx("h4", {
                        className: "font-semibold mb-3 text-sm uppercase tracking-wider",
                        children: "Принимаем к оплате"
                    }), n.jsxs("div", {
                        className: "flex gap-3 text-2xl",
                        children: [n.jsx("i", {className: "fab fa-cc-visa text-gray-500"}), n.jsx("i", {className: "fab fa-cc-mastercard text-gray-500"}), n.jsx("i", {className: "fab fa-cc-mir text-gray-500"}), n.jsx("i", {className: "fab fa-cc-apple-pay text-gray-500"}), n.jsx("i", {className: "fab fa-cc-paypal text-gray-500"})]
                    })]
                })]
            }), n.jsx("div", {
                className: "border-t border-gray-800 pt-8 mb-4",
                children: n.jsxs("div", {
                    className: "flex flex-col md:flex-row justify-between items-center gap-3",
                    children: [n.jsx("p", {
                        className: "text-xs text-gray-600",
                        children: "ИП MISAT | ИНН: 673111219228 | ОГРНИП: 323456789012345"
                    }), n.jsx("p", {
                        className: "text-xs text-gray-600",
                        children: "Режим налогообложения: Самозанятый"
                    })]
                })
            }), n.jsx("div", {
                className: "border-t border-gray-800 pt-8",
                children: n.jsxs("div", {
                    className: "flex flex-col md:flex-row justify-between items-center gap-4",
                    children: [n.jsxs("p", {
                        className: "text-sm text-gray-500",
                        children: ["© ", e, " MISAT. Все права защищены."]
                    }), n.jsxs("div", {
                        className: "flex gap-6 text-sm text-gray-500",
                        children: [n.jsx(D, {
                            to: "/privacy",
                            className: "hover:text-white transition",
                            children: "Политика конфиденциальности"
                        }), n.jsx(D, {
                            to: "/terms",
                            className: "hover:text-white transition",
                            children: "Пользовательское соглашение"
                        }), n.jsx(D, {
                            to: "/offer",
                            className: "hover:text-white transition",
                            children: "Публичная оферта"
                        })]
                    })]
                })
            })]
        })
    })
}, Ws = () => Jr(), Vr = Ze, YN = () => {
    const e = Ws(),
        t = Vr(b => b.favorites.items), [r, s] = j.useState([]), [a, l] = j.useState(!0), [i, o] = j.useState(0), c = [{
            title: "NIKE",
            subtitle: "JUST DO IT",
            description: "Новая коллекция Air Max. Стиль и комфорт.",
            bgColor: "from-red-900 via-black to-black",
            btnText: "КУПИТЬ",
            btnLink: "/catalog?brand=nike",
            image: "/images/brands/nike.jpg"
        }, {
            title: "ADIDAS",
            subtitle: "IMPOSSIBLE IS NOTHING",
            description: "Оригинальная коллекция Originals. Классика на все времена.",
            bgColor: "from-blue-900 via-black to-black",
            btnText: "СМОТРЕТЬ",
            btnLink: "/catalog?brand=adidas",
            image: "/images/brands/adidas.jpg"
        }, {
            title: "BALENCIAGA",
            subtitle: "LUXURY STREETWEAR",
            description: "Высокая мода встречает уличный стиль.",
            bgColor: "from-purple-900 via-black to-black",
            btnText: "ВЫБРАТЬ",
            btnLink: "/catalog?brand=balenciaga",
            image: "/images/brands/balenciaga.jpg"
        }, {
            title: "RAF SIMONS",
            subtitle: "AVANT-GARDE",
            description: "Экспериментальный дизайн. Культовые силуэты.",
            bgColor: "from-emerald-900 via-black to-black",
            btnText: "ПОСМОТРЕТЬ",
            btnLink: "/catalog?brand=raf-simons",
            image: "/images/brands/raf_simons.jpg"
        }], u = [{id: "all", name: "ВСЕ", icon: "fa-grid-2"}, {
            id: "clothes",
            name: "ОДЕЖДА",
            icon: "fa-tshirt"
        }, {id: "shoes", name: "ОБУВЬ", icon: "fa-shoe-prints"}, {id: "accessories", name: "АКСЕССУАРЫ", icon: "fa-clock"}],
        f = b => {
            if (!b) return [];
            if (Array.isArray(b)) return b;
            if (typeof b == "string") try {
                return JSON.parse(b)
            } catch {
                return []
            }
            return []
        };
    j.useEffect(() => {
        (async () => {
            try {
                const d = (await Pt.getAll()).data.map(x => ({
                    ...x,
                    sizes: f(x.sizes),
                    colors: f(x.colors),
                    images: f(x.images)
                }));
                s(d.slice(0, 8))
            } catch (p) {
                console.error("Ошибка загрузки:", p)
            } finally {
                l(!1)
            }
        })()
    }, []), j.useEffect(() => {
        const b = setInterval(() => {
            o(p => (p + 1) % c.length)
        }, 6e3);
        return () => clearInterval(b)
    }, [c.length]);
    const m = b => {
        var p;
        e(Pn({
            productId: b.id,
            quantity: 1,
            size: "M",
            product: {
                id: b.id,
                name: b.name,
                price: b.price,
                image: ((p = b.images) == null ? void 0 : p[0]) || b.image,
                sizes: b.sizes || ["S", "M", "L"]
            }
        })), _.success(`${b.name} добавлен в корзину`, {icon: "🛒"})
    }, y = (b, p) => {
        p.preventDefault(), p.stopPropagation(), e($s(b))
    };
    return a ? n.jsx("div", {
        className: "min-h-screen bg-white pt-20 flex items-center justify-center",
        children: n.jsxs("div", {
            className: "text-center",
            children: [n.jsx("div", {className: "w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"}), n.jsx("p", {
                className: "text-gray-500",
                children: "Загрузка..."
            })]
        })
    }) : n.jsxs("div", {
        className: "min-h-screen bg-white", children: [n.jsxs("section", {
            className: "relative h-[60vh] md:h-screen overflow-hidden", children: [c.map((b, p) => n.jsxs("div", {
                className: `absolute inset-0 transition-all duration-1000 ${i === p ? "opacity-100 z-10" : "opacity-0 z-0"}`,
                children: [n.jsx("div", {
                    className: "absolute inset-0 bg-cover bg-center bg-no-repeat",
                    style: {backgroundImage: `url(${b.image})`, backgroundSize: "cover", backgroundPosition: "center"}
                }), n.jsx("div", {className: "absolute inset-0 bg-black/40"}), n.jsx("div", {className: `absolute inset-0 bg-gradient-to-br ${b.bgColor} opacity-50`}), n.jsx("div", {
                    className: "relative h-full flex items-center justify-center text-white px-4",
                    children: n.jsxs("div", {
                        className: "text-center max-w-4xl",
                        children: [n.jsx("p", {
                            className: "text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-300 mb-2 md:mb-4 animate-fadeInUp",
                            children: b.subtitle
                        }), n.jsx("h1", {
                            className: "text-5xl md:text-8xl font-black mb-3 md:mb-6 tracking-tighter animate-fadeInUp delay-100",
                            children: b.title
                        }), n.jsx("p", {
                            className: "text-sm md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4 animate-fadeInUp delay-200",
                            children: b.description
                        }), n.jsx(D, {
                            to: b.btnLink,
                            className: "inline-block bg-white text-black px-6 md:px-10 py-2 md:py-4 text-xs md:text-sm font-black tracking-[0.15em] md:tracking-[0.2em] hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300 animate-fadeInUp delay-300",
                            children: b.btnText
                        })]
                    })
                })]
            }, p)), n.jsx("div", {
                className: "absolute bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-3 z-20",
                children: c.map((b, p) => n.jsx("button", {
                    onClick: () => o(p),
                    className: `transition-all duration-300 ${i === p ? "w-4 md:w-8 bg-white" : "w-1.5 md:w-2 bg-white/50"} h-1 md:h-2 rounded-full`
                }, p))
            }), n.jsx("button", {
                onClick: () => o(b => (b - 1 + c.length) % c.length),
                className: "hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur items-center justify-center text-white text-lg md:text-xl transition z-20",
                children: n.jsx("i", {className: "fas fa-chevron-left"})
            }), n.jsx("button", {
                onClick: () => o(b => (b + 1) % c.length),
                className: "hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur items-center justify-center text-white text-lg md:text-xl transition z-20",
                children: n.jsx("i", {className: "fas fa-chevron-right"})
            })]
        }), n.jsx("section", {
            className: "py-8 md:py-16 bg-white",
            children: n.jsxs("div", {
                className: "container mx-auto px-4",
                children: [n.jsxs("div", {
                    className: "text-center mb-6 md:mb-12",
                    children: [n.jsx("p", {
                        className: "text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 mb-1 md:mb-2",
                        children: "Категории"
                    }), n.jsx("h2", {
                        className: "text-2xl md:text-5xl font-black tracking-tighter",
                        children: "ВЫБЕРИТЕ КАТЕГОРИЮ"
                    }), n.jsx("div", {className: "w-12 md:w-20 h-0.5 bg-black mx-auto mt-2 md:mt-4"})]
                }), n.jsx("div", {
                    className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4",
                    children: u.map(b => n.jsxs(D, {
                        to: `/catalog?category=${b.id}`,
                        className: "group p-3 md:p-6 rounded-xl md:rounded-2xl text-center transition-all duration-300 bg-gray-100 text-black hover:bg-black hover:text-white",
                        children: [n.jsx("i", {className: `fas ${b.icon} text-2xl md:text-4xl mb-2 md:mb-3 group-hover:scale-110 transition`}), n.jsx("p", {
                            className: "font-black text-xs md:text-sm tracking-wider",
                            children: b.name
                        })]
                    }, b.id))
                })]
            })
        }), n.jsx("section", {
            className: "py-8 md:py-16 bg-gray-50", children: n.jsxs("div", {
                className: "container mx-auto px-4",
                children: [n.jsxs("div", {
                    className: "flex justify-between items-end mb-6 md:mb-8 flex-wrap gap-4",
                    children: [n.jsxs("div", {
                        children: [n.jsx("p", {
                            className: "text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 mb-1",
                            children: "Популярные товары"
                        }), n.jsx("h2", {
                            className: "text-2xl md:text-4xl font-black tracking-tighter",
                            children: "ЛУЧШИЕ ПРЕДЛОЖЕНИЯ"
                        })]
                    }), n.jsxs(D, {
                        to: "/catalog",
                        className: "text-xs md:text-sm font-black uppercase tracking-wider border-b-2 border-black pb-1 hover:opacity-70 transition",
                        children: ["ВЕСЬ КАТАЛОГ ", n.jsx("i", {className: "fas fa-arrow-right ml-1"})]
                    })]
                }), n.jsx("div", {
                    className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6", children: r.map(b => {
                        var p;
                        return n.jsxs("div", {
                            className: "group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2",
                            children: [n.jsx(D, {
                                to: `/product/${b.id}`,
                                children: n.jsxs("div", {
                                    className: "relative bg-gray-100 aspect-square overflow-hidden",
                                    children: [n.jsx("img", {
                                        src: ((p = b.images) == null ? void 0 : p[0]) || b.image || "https://placehold.co/400x400/eeeeee/cccccc?text=No+Image",
                                        alt: b.name,
                                        className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    }), b.is_new && n.jsx("span", {
                                        className: "absolute top-2 md:top-3 left-2 md:left-3 bg-green-500 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full",
                                        children: "NEW"
                                    }), n.jsx("button", {
                                        onClick: d => y(b.id, d),
                                        className: "absolute bottom-2 md:bottom-3 right-2 md:right-3 w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition",
                                        children: n.jsx("i", {className: `${t.includes(b.id) ? "fas fa-heart text-red-500" : "far fa-heart"} text-xs md:text-sm`})
                                    })]
                                })
                            }), n.jsxs("div", {
                                className: "p-2 md:p-4",
                                children: [n.jsx(D, {
                                    to: `/product/${b.id}`,
                                    children: n.jsx("h3", {
                                        className: "font-black text-xs md:text-lg mb-1 hover:opacity-70 transition line-clamp-1",
                                        children: b.name
                                    })
                                }), n.jsxs("p", {
                                    className: "font-bold text-sm md:text-xl mt-0.5 md:mt-1",
                                    children: [b.price.toLocaleString(), " ₽"]
                                }), n.jsx("button", {
                                    onClick: () => m(b),
                                    className: "mt-2 md:mt-4 w-full bg-black text-white py-1.5 md:py-2 rounded-full text-xs md:text-sm font-black hover:bg-gray-800 transition",
                                    children: "В КОРЗИНУ"
                                })]
                            })]
                        }, b.id)
                    })
                })]
            })
        }), n.jsx("section", {
            className: "py-8 md:py-16 bg-white border-y border-gray-100",
            children: n.jsx("div", {
                className: "container mx-auto px-4",
                children: n.jsx("div", {
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center",
                    children: [{
                        icon: "fa-truck-fast",
                        title: "Бесплатная доставка",
                        desc: "от 5000 ₽"
                    }, {
                        icon: "fa-arrows-spin",
                        title: "Возврат 30 дней",
                        desc: "без вопросов"
                    }, {
                        icon: "fa-credit-card",
                        title: "Безопасная оплата",
                        desc: "картой или наличными"
                    }, {
                        icon: "fa-gift",
                        title: "Подарочные карты",
                        desc: "для близких"
                    }].map((b, p) => n.jsxs("div", {
                        className: "group",
                        children: [n.jsx("div", {
                            className: "w-12 h-12 md:w-16 md:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:bg-black transition",
                            children: n.jsx("i", {className: `fas ${b.icon} text-xl md:text-2xl text-gray-600 group-hover:text-white transition`})
                        }), n.jsx("h3", {
                            className: "font-black text-xs md:text-sm uppercase tracking-wider",
                            children: b.title
                        }), n.jsx("p", {className: "text-[10px] md:text-xs text-gray-400 mt-1", children: b.desc})]
                    }, p))
                })
            })
        }), n.jsxs("section", {
            className: "relative py-12 md:py-20 overflow-hidden mx-4 md:mx-auto rounded-2xl md:rounded-none my-8 md:my-0",
            children: [n.jsx("div", {
                className: "absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl md:rounded-none",
                style: {
                    backgroundImage: "url(/images/brands/raspr.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }
            }), n.jsx("div", {className: "absolute inset-0 bg-black/60 rounded-2xl md:rounded-none"}), n.jsxs("div", {
                className: "relative container mx-auto px-4 text-center z-10",
                children: [n.jsx("i", {className: "fas fa-tag text-3xl md:text-5xl text-white/80 mb-3 md:mb-4"}), n.jsx("h2", {
                    className: "text-2xl md:text-6xl font-black mb-2 md:mb-4 text-white",
                    children: "СЕЗОННАЯ РАСПРОДАЖА"
                }), n.jsx("p", {
                    className: "text-white/80 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-lg",
                    children: "Скидка до 50% на коллекцию прошлого сезона"
                }), n.jsx(D, {
                    to: "/catalog?category=sale",
                    className: "inline-block bg-white text-black px-6 md:px-10 py-2 md:py-4 text-xs md:text-sm font-black tracking-[0.15em] md:tracking-[0.2em] hover:bg-transparent hover:text-white border-2 border-white transition rounded-full md:rounded-none",
                    children: "ВЫБРАТЬ"
                })]
            })]
        }), n.jsx("section", {
            className: "py-8 md:py-16 bg-gray-50",
            children: n.jsxs("div", {
                className: "container mx-auto px-4 text-center max-w-2xl",
                children: [n.jsx("i", {className: "far fa-envelope text-3xl md:text-4xl text-gray-400 mb-3 md:mb-4"}), n.jsx("h2", {
                    className: "text-2xl md:text-3xl font-black mb-2 md:mb-3",
                    children: "ПОДПИШИТЕСЬ НА НОВОСТИ"
                }), n.jsx("p", {
                    className: "text-gray-500 mb-4 md:mb-6 text-sm md:text-base",
                    children: "Будьте в курсе новых коллекций и эксклюзивных предложений"
                }), n.jsxs("div", {
                    className: "flex flex-col sm:flex-row gap-3",
                    children: [n.jsx("input", {
                        type: "email",
                        placeholder: "Ваш email",
                        className: "flex-1 px-4 md:px-5 py-2 md:py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition text-sm md:text-base rounded-full md:rounded-none"
                    }), n.jsx("button", {
                        className: "bg-black text-white px-6 md:px-8 py-2 md:py-3 font-black tracking-wider hover:bg-gray-800 transition text-sm md:text-base rounded-full md:rounded-none",
                        children: "ПОДПИСАТЬСЯ"
                    })]
                })]
            })
        }), n.jsx("style", {
            children: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `
        })]
    })
}, ZN = () => {
    const e = Ws(),
        t = Vr(O => O.favorites.items), [r] = aN(), [s, a] = j.useState([]), [l, i] = j.useState([]), [o, c] = j.useState(!0), [u, f] = j.useState(!1), [m, y] = j.useState(r.get("category") || "all"), [b, p] = j.useState("all"), [d, x] = j.useState([0, 5e4]), [h, g] = j.useState("popular"), [v, w] = j.useState(r.get("search") || ""), [N, k] = j.useState([]), [E, R] = j.useState(!1), [z, $] = j.useState(!1), [L, G] = j.useState(1), [X, P] = j.useState(1),
        W = 12, H = j.useRef(null), te = [{id: "all", name: "Все товары"}, {id: "clothes", name: "Одежда"}, {
            id: "shoes",
            name: "Обувь"
        }, {id: "accessories", name: "Аксессуары"}], A = [{id: "all", name: "Все бренды"}, {id: "nike", name: "Nike"}, {
            id: "adidas",
            name: "Adidas"
        }, {id: "balenciaga", name: "Balenciaga"}, {id: "raf-simons", name: "Raf Simons"}, {
            id: "carhartt",
            name: "Carhartt WIP"
        }, {id: "tnf", name: "The North Face"}], U = O => {
            if (!O) return [];
            if (Array.isArray(O)) return O;
            if (typeof O == "string") try {
                return JSON.parse(O)
            } catch {
                return []
            }
            return []
        };
    j.useEffect(() => {
        (async () => {
            try {
                c(!0);
                const T = (await Pt.getAll()).data.map(J => ({
                    ...J,
                    sizes: U(J.sizes),
                    colors: U(J.colors),
                    images: U(J.images)
                }));
                a(T), S(T)
            } catch (V) {
                console.error("Ошибка загрузки:", V), _.error("Ошибка загрузки товаров")
            } finally {
                c(!1)
            }
        })()
    }, []), j.useEffect(() => {
        if (v.length > 1) {
            $(!0);
            const O = setTimeout(() => {
                const V = s.filter(T => T.name.toLowerCase().includes(v.toLowerCase()) || T.description.toLowerCase().includes(v.toLowerCase())).slice(0, 6);
                k(V), R(!0), $(!1)
            }, 300);
            return () => clearTimeout(O)
        } else R(!1), k([])
    }, [v, s]), j.useEffect(() => {
        const O = V => {
            H.current && !H.current.contains(V.target) && R(!1)
        };
        return document.addEventListener("mousedown", O), () => document.removeEventListener("mousedown", O)
    }, []), j.useEffect(() => {
        G(1)
    }, [m, b, d, h, v]), j.useEffect(() => {
        S(s)
    }, [m, b, d, h, v, s]);
    const S = O => {
        let V = [...O];
        v && (V = V.filter(ce => ce.name.toLowerCase().includes(v.toLowerCase()) || ce.description.toLowerCase().includes(v.toLowerCase()))), m !== "all" && (V = V.filter(ce => ce.category === m)), b !== "all" && (V = V.filter(ce => {
            var be;
            return (be = ce.name) == null ? void 0 : be.toLowerCase().includes(b.toLowerCase())
        })), V = V.filter(ce => ce.price >= d[0] && ce.price <= d[1]), h === "price-asc" && V.sort((ce, be) => ce.price - be.price), h === "price-desc" && V.sort((ce, be) => be.price - ce.price), h === "rating" && V.sort((ce, be) => be.rating - ce.rating);
        const T = V.length, J = Math.ceil(T / W);
        P(J);
        const Q = (L - 1) * W, Ce = V.slice(Q, Q + W);
        i(Ce)
    }, M = O => {
        var V, T;
        e(Pn({
            productId: O.id,
            quantity: 1,
            size: ((V = O.sizes) == null ? void 0 : V[0]) || "M",
            product: {
                id: O.id,
                name: O.name,
                price: O.price,
                image: ((T = O.images) == null ? void 0 : T[0]) || O.image,
                sizes: O.sizes,
                stockType: O.stockType,
                preorderDays: O.preorderDays
            }
        })), _.success(`${O.name} добавлен в корзину`)
    }, B = (O, V) => {
        V.preventDefault(), V.stopPropagation(), e($s(O))
    }, oe = O => {
        w(O.name), R(!1)
    }, fe = () => {
        y("all"), p("all"), x([0, 5e4]), g("popular"), w(""), G(1), R(!1), f(!1)
    };
    return o ? n.jsx("div", {
        className: "min-h-screen bg-white pt-20 flex items-center justify-center",
        children: n.jsxs("div", {
            className: "text-center",
            children: [n.jsx("div", {className: "w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-3"}), n.jsx("p", {
                className: "text-gray-500 text-sm",
                children: "Загрузка товаров..."
            })]
        })
    }) : s.length === 0 ? n.jsx("div", {
        className: "min-h-screen bg-white pt-20",
        children: n.jsxs("div", {
            className: "container mx-auto px-4 py-20 text-center",
            children: [n.jsx("i", {className: "fas fa-box-open text-6xl text-gray-300 mb-4"}), n.jsx("h2", {
                className: "text-2xl font-black mb-4",
                children: "ТОВАРОВ ПОКА НЕТ"
            }), n.jsx("p", {className: "text-gray-500 mb-8", children: "Добавьте товары через админ-панель"})]
        })
    }) : n.jsx("div", {
        className: "min-h-screen bg-gray-50 pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-4",
            children: [n.jsxs("div", {
                className: "flex justify-between items-center mb-4",
                children: [n.jsx("h1", {
                    className: "text-2xl font-black",
                    children: "Каталог"
                }), n.jsxs("button", {
                    onClick: () => f(!0),
                    className: "md:hidden bg-black text-white px-4 py-2 rounded-full text-sm flex items-center gap-2",
                    children: [n.jsx("i", {className: "fas fa-filter"}), " Фильтр"]
                })]
            }), n.jsxs("p", {
                className: "text-gray-500 text-sm mb-4",
                children: ["Найдено ", l.length, " товаров"]
            }), n.jsxs("div", {
                className: "hidden md:flex gap-8 mb-8 flex-wrap", children: [n.jsxs("div", {
                    className: "w-80",
                    ref: H,
                    children: [n.jsx("h3", {className: "font-bold mb-3", children: "ПОИСК"}), n.jsxs("div", {
                        className: "relative",
                        children: [n.jsxs("div", {
                            className: "relative",
                            children: [n.jsx("input", {
                                type: "text",
                                placeholder: "Поиск товаров...",
                                value: v,
                                onChange: O => w(O.target.value),
                                onFocus: () => v.length > 1 && R(!0),
                                className: "w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                            }), n.jsx("div", {
                                className: "absolute right-3 top-1/2 -translate-y-1/2",
                                children: z ? n.jsx("div", {className: "w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"}) : n.jsx("i", {className: "fas fa-search text-gray-400"})
                            })]
                        }), E && N.length > 0 && n.jsx("div", {
                            className: "absolute z-50 mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto",
                            children: N.map(O => {
                                var V;
                                return n.jsxs("button", {
                                    onClick: () => oe(O),
                                    className: "w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition border-b last:border-b-0 text-left",
                                    children: [n.jsx("img", {
                                        src: ((V = O.images) == null ? void 0 : V[0]) || O.image || "https://placehold.co/40x40/eeeeee/cccccc?text=No+Image",
                                        alt: O.name,
                                        className: "w-10 h-10 object-cover rounded"
                                    }), n.jsxs("div", {
                                        className: "flex-1",
                                        children: [n.jsx("p", {
                                            className: "font-medium text-sm",
                                            children: O.name
                                        }), n.jsxs("p", {
                                            className: "text-xs text-gray-500",
                                            children: [O.price.toLocaleString(), " ₽"]
                                        }), n.jsx("p", {
                                            className: "text-xs text-gray-400",
                                            children: O.stockType === "in_stock" ? "✅ В наличии" : "📦 Предзаказ"
                                        })]
                                    }), n.jsx("i", {className: "fas fa-arrow-right text-gray-400 text-xs"})]
                                }, O.id)
                            })
                        })]
                    })]
                }), n.jsxs("div", {
                    className: "w-48",
                    children: [n.jsx("h3", {
                        className: "font-bold mb-3",
                        children: "Категории"
                    }), n.jsx("div", {
                        className: "space-y-1",
                        children: te.map(O => n.jsx("button", {
                            onClick: () => y(O.id),
                            className: `block w-full text-left px-3 py-2 rounded-lg text-sm transition ${m === O.id ? "bg-black text-white" : "hover:bg-gray-100"}`,
                            children: O.name
                        }, O.id))
                    })]
                }), n.jsxs("div", {
                    className: "w-48",
                    children: [n.jsx("h3", {
                        className: "font-bold mb-3",
                        children: "Бренды"
                    }), n.jsx("div", {
                        className: "space-y-1 max-h-48 overflow-y-auto",
                        children: A.map(O => n.jsx("button", {
                            onClick: () => p(O.id),
                            className: `block w-full text-left px-3 py-2 rounded-lg text-sm transition ${b === O.id ? "bg-black text-white" : "hover:bg-gray-100"}`,
                            children: O.name
                        }, O.id))
                    })]
                }), n.jsxs("div", {
                    children: [n.jsx("h3", {
                        className: "font-bold mb-3",
                        children: "Цена до"
                    }), n.jsx("input", {
                        type: "range",
                        min: "0",
                        max: "50000",
                        step: "1000",
                        value: d[1],
                        onChange: O => x([d[0], Number(O.target.value)]),
                        className: "w-48 accent-black"
                    }), n.jsxs("p", {className: "text-sm mt-2", children: [d[1].toLocaleString(), " ₽"]})]
                }), n.jsxs("div", {
                    children: [n.jsx("h3", {
                        className: "font-bold mb-3",
                        children: "Сортировка"
                    }), n.jsxs("select", {
                        value: h,
                        onChange: O => g(O.target.value),
                        className: "px-3 py-2 border rounded-lg text-sm",
                        children: [n.jsx("option", {
                            value: "popular",
                            children: "По популярности"
                        }), n.jsx("option", {
                            value: "price-asc",
                            children: "Цена: по возрастанию"
                        }), n.jsx("option", {
                            value: "price-desc",
                            children: "Цена: по убыванию"
                        }), n.jsx("option", {value: "rating", children: "По рейтингу"})]
                    })]
                }), n.jsx("button", {
                    onClick: fe,
                    className: "self-end px-4 py-2 border rounded-lg text-sm hover:bg-gray-100",
                    children: "Сбросить"
                })]
            }), n.jsx("div", {
                className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6", children: l.map(O => {
                    var V;
                    return n.jsxs("div", {
                        className: "bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition group",
                        children: [n.jsx(D, {
                            to: `/product/${O.id}`,
                            children: n.jsxs("div", {
                                className: "relative bg-gray-100 aspect-square overflow-hidden",
                                children: [n.jsx("img", {
                                    src: ((V = O.images) == null ? void 0 : V[0]) || O.image || "https://placehold.co/400x400/eeeeee/cccccc?text=No+Image",
                                    alt: O.name,
                                    className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                                    onError: T => {
                                        T.target.src = "https://placehold.co/400x400/eeeeee/cccccc?text=No+Image"
                                    }
                                }), O.is_new && n.jsx("span", {
                                    className: "absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full",
                                    children: "NEW"
                                }), O.is_sale && O.old_price && n.jsx("span", {
                                    className: "absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full",
                                    children: "SALE"
                                }), n.jsx("button", {
                                    onClick: T => B(O.id, T),
                                    className: "absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition",
                                    children: n.jsx("i", {className: `${t.includes(O.id) ? "fas fa-heart text-red-500" : "far fa-heart"} text-xs`})
                                })]
                            })
                        }), n.jsxs("div", {
                            className: "p-2 md:p-3",
                            children: [n.jsx(D, {
                                to: `/product/${O.id}`,
                                children: n.jsx("h3", {
                                    className: "font-bold text-xs md:text-sm line-clamp-1",
                                    children: O.name
                                })
                            }), n.jsxs("p", {
                                className: "font-bold text-sm md:text-base mt-1",
                                children: [O.price.toLocaleString(), " ₽"]
                            }), n.jsx("div", {
                                className: "mt-1",
                                children: O.stockType === "in_stock" ? n.jsx("span", {
                                    className: "text-[10px] text-green-600",
                                    children: "✅ В наличии (РФ)"
                                }) : n.jsxs("span", {
                                    className: "text-[10px] text-orange-600",
                                    children: ["📦 Предзаказ • ~", O.preorderDays || 30, " дней"]
                                })
                            }), n.jsx("button", {
                                onClick: () => M(O),
                                className: "w-full mt-2 bg-black text-white py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold",
                                children: "В корзину"
                            })]
                        })]
                    }, O.id)
                })
            }), X > 1 && n.jsxs("div", {
                className: "flex justify-center gap-2 mt-8 flex-wrap",
                children: [n.jsx("button", {
                    onClick: () => G(1),
                    disabled: L === 1,
                    className: "px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100",
                    children: "«"
                }), n.jsx("button", {
                    onClick: () => G(O => Math.max(1, O - 1)),
                    disabled: L === 1,
                    className: "px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100",
                    children: "‹"
                }), [...Array(Math.min(X, 5))].map((O, V) => {
                    let T;
                    return X <= 5 || L <= 3 ? T = V + 1 : L >= X - 2 ? T = X - 4 + V : T = L - 2 + V, n.jsx("button", {
                        onClick: () => G(T),
                        className: `w-8 h-8 rounded-full text-sm transition ${L === T ? "bg-black text-white" : "hover:bg-gray-200"}`,
                        children: T
                    }, T)
                }), n.jsx("button", {
                    onClick: () => G(O => Math.min(X, O + 1)),
                    disabled: L === X,
                    className: "px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100",
                    children: "›"
                }), n.jsx("button", {
                    onClick: () => G(X),
                    disabled: L === X,
                    className: "px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100",
                    children: "»"
                })]
            }), u && n.jsxs("div", {
                className: "fixed inset-0 z-50",
                children: [n.jsx("div", {
                    className: "absolute inset-0 bg-black/50",
                    onClick: () => f(!1)
                }), n.jsxs("div", {
                    className: "absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto animate-slideInUp",
                    children: [n.jsxs("div", {
                        className: "sticky top-0 bg-white p-4 border-b flex justify-between items-center",
                        children: [n.jsx("h3", {
                            className: "font-bold text-lg",
                            children: "Фильтры"
                        }), n.jsx("button", {
                            onClick: () => f(!1),
                            className: "w-10 h-10 flex items-center justify-center rounded-full bg-gray-100",
                            children: "✕"
                        })]
                    }), n.jsxs("div", {
                        className: "p-4 space-y-5",
                        children: [n.jsxs("div", {
                            children: [n.jsx("h4", {
                                className: "font-bold mb-2",
                                children: "Поиск"
                            }), n.jsx("input", {
                                type: "text",
                                placeholder: "Поиск товаров...",
                                value: v,
                                onChange: O => w(O.target.value),
                                className: "w-full px-3 py-2 border rounded-lg text-sm"
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("h4", {
                                className: "font-bold mb-2",
                                children: "Категории"
                            }), n.jsx("div", {
                                className: "flex flex-wrap gap-2",
                                children: te.map(O => n.jsx("button", {
                                    onClick: () => {
                                        y(O.id), f(!1)
                                    },
                                    className: `px-4 py-2 rounded-full text-sm ${m === O.id ? "bg-black text-white" : "bg-gray-100"}`,
                                    children: O.name
                                }, O.id))
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("h4", {
                                className: "font-bold mb-2",
                                children: "Бренды"
                            }), n.jsx("div", {
                                className: "flex flex-wrap gap-2",
                                children: A.map(O => n.jsx("button", {
                                    onClick: () => {
                                        p(O.id), f(!1)
                                    },
                                    className: `px-4 py-2 rounded-full text-sm ${b === O.id ? "bg-black text-white" : "bg-gray-100"}`,
                                    children: O.name
                                }, O.id))
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("h4", {
                                className: "font-bold mb-2",
                                children: "Цена до"
                            }), n.jsx("input", {
                                type: "range",
                                min: "0",
                                max: "50000",
                                step: "1000",
                                value: d[1],
                                onChange: O => x([d[0], Number(O.target.value)]),
                                className: "w-full accent-black"
                            }), n.jsxs("p", {
                                className: "text-center text-sm mt-2 font-bold",
                                children: [d[1].toLocaleString(), " ₽"]
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("h4", {
                                className: "font-bold mb-2",
                                children: "Сортировка"
                            }), n.jsxs("select", {
                                value: h,
                                onChange: O => g(O.target.value),
                                className: "w-full px-3 py-2 border rounded-lg text-sm",
                                children: [n.jsx("option", {
                                    value: "popular",
                                    children: "По популярности"
                                }), n.jsx("option", {
                                    value: "price-asc",
                                    children: "Цена: по возрастанию"
                                }), n.jsx("option", {
                                    value: "price-desc",
                                    children: "Цена: по убыванию"
                                }), n.jsx("option", {value: "rating", children: "По рейтингу"})]
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "sticky bottom-0 bg-white p-4 border-t flex gap-3",
                        children: [n.jsx("button", {
                            onClick: fe,
                            className: "flex-1 py-3 border-2 border-black rounded-xl font-bold text-sm",
                            children: "Сбросить всё"
                        }), n.jsx("button", {
                            onClick: () => f(!1),
                            className: "flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm",
                            children: "Применить"
                        })]
                    })]
                })]
            })]
        })
    })
}, ew = () => {
    const {id: e} = Oj(), t = Qt(), r = Ws(), {user: s, isAuthenticated: a} = Vr(T => T.auth),
        l = Vr(T => T.favorites.items), [i, o] = j.useState(null), [c, u] = j.useState([]), [f, m] = j.useState(!0), [y, b] = j.useState(""), [p, d] = j.useState(1), [x, h] = j.useState("description"), [g, v] = j.useState([]), [w, N] = j.useState({
            rating: 5,
            comment: ""
        }), [k, E] = j.useState(!1), [R, z] = j.useState(!1), [$, L] = j.useState([]), [G, X] = j.useState(!1), [P, W] = j.useState(0),
        H = T => {
            if (!T) return [];
            if (Array.isArray(T)) return T;
            if (typeof T == "string") try {
                return JSON.parse(T)
            } catch {
                return []
            }
            return []
        };
    j.useEffect(() => {
        (async () => {
            try {
                m(!0);
                const Q = (await Pt.getById(Number(e))).data;
                Q.sizes = H(Q.sizes), Q.colors = H(Q.colors), Q.images = H(Q.images), (!Q.images || Q.images.length === 0) && Q.image && (Q.images = [Q.image]), o(Q), W(0);
                const ce = JSON.parse(localStorage.getItem("misat_reviews") || "[]").filter(ye => ye.productId === Number(e));
                v(ce), a && s && z(ce.some(ye => ye.userId === s.id));
                const Kt = (await Pt.getAll()).data.filter(ye => ye.category === Q.category && ye.id !== Q.id).map(ye => ({
                    ...ye,
                    sizes: H(ye.sizes),
                    colors: H(ye.colors),
                    images: H(ye.images)
                })).slice(0, 4);
                u(Kt)
            } catch (J) {
                console.error("Ошибка загрузки товара:", J), _.error("Товар не найден"), t("/catalog")
            } finally {
                m(!1)
            }
        })()
    }, [e, a, s, t]);
    const te = l.includes(Number(e)), A = () => {
        if (!a) {
            _.error("Войдите в аккаунт");
            return
        }
        r($s(Number(e)))
    }, U = () => {
        var T, J;
        if (!y) {
            _.error("Выберите размер");
            return
        }
        i && (r(Pn({
            productId: i.id,
            quantity: p,
            size: y,
            product: {
                id: i.id,
                name: i.name,
                price: i.price,
                image: ((T = i.images) == null ? void 0 : T[P]) || ((J = i.images) == null ? void 0 : J[0]) || i.image,
                sizes: i.sizes,
                stockType: i.stockType,
                preorderDays: i.preorderDays
            }
        })), _.success(`${i.name} добавлен в корзину`))
    }, S = () => {
        var T, J;
        if (!y) {
            _.error("Выберите размер");
            return
        }
        if (!a) {
            _.error("Войдите в аккаунт"), t("/profile");
            return
        }
        r(Pn({
            productId: i.id,
            quantity: p,
            size: y,
            product: {
                id: i.id,
                name: i.name,
                price: i.price,
                image: ((T = i.images) == null ? void 0 : T[P]) || ((J = i.images) == null ? void 0 : J[0]) || i.image,
                sizes: i.sizes,
                stockType: i.stockType,
                preorderDays: i.preorderDays
            }
        })), _.success("Переход к оформлению..."), setTimeout(() => t("/checkout"), 500)
    }, M = T => new Promise((J, Q) => {
        const Ce = new FileReader;
        Ce.readAsDataURL(T), Ce.onload = ce => {
            var Kt;
            const be = new Image;
            be.src = (Kt = ce.target) == null ? void 0 : Kt.result, be.onload = () => {
                const ye = document.createElement("canvas");
                let lt = be.width, Gt = be.height;
                const Kr = 400;
                lt > Gt ? lt > Kr && (Gt = Gt * Kr / lt, lt = Kr) : Gt > Kr && (lt = lt * Kr / Gt, Gt = Kr), ye.width = lt, ye.height = Gt;
                const Zl = ye.getContext("2d");
                Zl == null || Zl.drawImage(be, 0, 0, lt, Gt), J(ye.toDataURL("image/jpeg", .7))
            }, be.onerror = Q
        }, Ce.onerror = Q
    }), B = async T => {
        var Q;
        const J = (Q = T.target.files) == null ? void 0 : Q[0];
        if (J) {
            X(!0);
            try {
                const Ce = await M(J);
                L([...$, Ce])
            } catch {
                _.error("Ошибка загрузки фото")
            } finally {
                X(!1)
            }
        }
    }, oe = T => {
        L($.filter((J, Q) => Q !== T))
    }, fe = () => {
        var Q;
        if (!a) {
            _.error("Войдите в аккаунт");
            return
        }
        if (R) {
            _.error("Вы уже оставляли отзыв");
            return
        }
        if (!w.comment.trim()) {
            _.error("Напишите отзыв");
            return
        }
        E(!0);
        const T = {
            id: Date.now(),
            productId: Number(e),
            userId: s.id,
            userName: s.first_name || ((Q = s.email) == null ? void 0 : Q.split("@")[0]) || "Пользователь",
            rating: w.rating,
            comment: w.comment,
            photos: $,
            date: new Date().toISOString()
        }, J = JSON.parse(localStorage.getItem("misat_reviews") || "[]");
        J.push(T), localStorage.setItem("misat_reviews", JSON.stringify(J)), v([T, ...g]), z(!0), N({
            rating: 5,
            comment: ""
        }), L([]), E(!1), _.success("Спасибо за отзыв!")
    };
    if (f) return n.jsx("div", {
        className: "min-h-screen bg-white pt-20 flex items-center justify-center",
        children: n.jsxs("div", {
            className: "text-center",
            children: [n.jsx("div", {className: "w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-3"}), n.jsx("p", {
                className: "text-gray-500 text-sm",
                children: "Загрузка..."
            })]
        })
    });
    if (!i) return n.jsx("div", {
        className: "min-h-screen bg-white pt-20 flex items-center justify-center",
        children: n.jsxs("div", {
            className: "text-center",
            children: [n.jsx("i", {className: "fas fa-box-open text-5xl text-gray-300 mb-4"}), n.jsx("h2", {
                className: "text-2xl font-black mb-4",
                children: "ТОВАР НЕ НАЙДЕН"
            }), n.jsx(D, {
                to: "/catalog",
                className: "bg-black text-white px-6 py-2 rounded-full",
                children: "В КАТАЛОГ"
            })]
        })
    });
    const O = g.length > 0 ? (g.reduce((T, J) => T + J.rating, 0) / g.length).toFixed(1) : "0.0",
        V = i.images && i.images.length > 0 ? i.images[P] : i.image || "https://placehold.co/600x600/eeeeee/cccccc?text=No+Image";
    return n.jsxs("div", {
        className: "min-h-screen bg-white pt-20 pb-24 md:pb-0", children: [n.jsxs("div", {
            className: "container mx-auto px-4 py-4 md:py-8",
            children: [n.jsxs("div", {
                className: "flex items-center gap-2 text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap pb-1",
                children: [n.jsx(D, {
                    to: "/",
                    className: "hover:text-black",
                    children: "Главная"
                }), n.jsx("i", {className: "fas fa-chevron-right text-[10px]"}), n.jsx(D, {
                    to: "/catalog",
                    className: "hover:text-black",
                    children: "Каталог"
                }), n.jsx("i", {className: "fas fa-chevron-right text-[10px]"}), n.jsx("span", {
                    className: "text-black truncate",
                    children: i.name
                })]
            }), n.jsxs("div", {
                className: "grid md:grid-cols-2 gap-6 md:gap-12",
                children: [n.jsxs("div", {
                    className: "relative md:sticky md:top-24",
                    children: [n.jsx("div", {
                        className: "bg-gray-100 rounded-2xl overflow-hidden mb-3",
                        children: n.jsx("img", {src: V, alt: i.name, className: "w-full h-auto object-cover"})
                    }), i.images && i.images.length > 1 && n.jsx("div", {
                        className: "flex gap-2 overflow-x-auto pb-2",
                        children: i.images.map((T, J) => n.jsx("button", {
                            onClick: () => W(J),
                            className: `w-16 h-16 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${P === J ? "border-black" : "border-gray-200 hover:border-black"}`,
                            children: n.jsx("img", {
                                src: T,
                                alt: `Фото ${J + 1}`,
                                className: "w-full h-full object-cover"
                            })
                        }, J))
                    }), n.jsx("button", {
                        onClick: A,
                        className: "absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition",
                        children: n.jsx("i", {className: `${te ? "fas fa-heart text-red-500" : "far fa-heart"} text-lg`})
                    })]
                }), n.jsxs("div", {
                    children: [n.jsx("h1", {
                        className: "text-2xl md:text-3xl font-black mb-2",
                        children: i.name
                    }), n.jsxs("div", {
                        className: "flex items-center gap-2 mb-3",
                        children: [n.jsx("div", {
                            className: "flex text-yellow-500 text-sm",
                            children: [...Array(5)].map((T, J) => n.jsx("i", {className: `fas fa-star ${J < Math.floor(Number(O)) ? "text-yellow-500" : "text-gray-300"}`}, J))
                        }), n.jsxs("span", {className: "text-xs text-gray-500", children: [O, " (", g.length, ")"]})]
                    }), n.jsxs("p", {
                        className: "text-2xl md:text-3xl font-black mb-4",
                        children: [i.price.toLocaleString(), " ₽"]
                    }), n.jsx("div", {
                        className: "mb-4 p-3 bg-gray-50 rounded-xl",
                        children: i.stockType === "in_stock" ? n.jsxs(n.Fragment, {
                            children: [n.jsxs("div", {
                                className: "flex items-center gap-2 text-green-700",
                                children: [n.jsx("i", {className: "fas fa-check-circle"}), n.jsx("span", {
                                    className: "font-bold",
                                    children: "В наличии в России"
                                })]
                            }), n.jsxs("p", {
                                className: "text-sm text-gray-600 mt-1",
                                children: ["• Доставка по РФ: 2-5 дней", n.jsx("br", {}), "• Отправка из Москвы"]
                            })]
                        }) : n.jsxs(n.Fragment, {
                            children: [n.jsxs("div", {
                                className: "flex items-center gap-2 text-orange-600",
                                children: [n.jsx("i", {className: "fas fa-ship"}), n.jsx("span", {
                                    className: "font-bold",
                                    children: "Предзаказ из Китая"
                                })]
                            }), n.jsxs("p", {
                                className: "text-sm text-gray-600 mt-1",
                                children: ["• Срок доставки: ~", i.preorderDays || 30, " дней", n.jsx("br", {}), "• Трекинг-номер будет предоставлен"]
                            })]
                        })
                    }), n.jsxs("div", {
                        className: "mb-4",
                        children: [n.jsx("h3", {
                            className: "font-bold text-sm mb-2",
                            children: "РАЗМЕР"
                        }), n.jsx("div", {
                            className: "flex gap-2 flex-wrap",
                            children: i.sizes && Array.isArray(i.sizes) && i.sizes.length > 0 ? i.sizes.map(T => n.jsx("button", {
                                onClick: () => b(T),
                                className: `w-10 h-10 border-2 text-sm font-bold rounded-lg transition ${y === T ? "border-black bg-black text-white" : "border-gray-300 hover:border-black"}`,
                                children: T
                            }, T)) : n.jsx("p", {className: "text-gray-500 text-sm", children: "Размеры не указаны"})
                        })]
                    }), n.jsxs("div", {
                        className: "mb-6",
                        children: [n.jsx("h3", {
                            className: "font-bold text-sm mb-2",
                            children: "КОЛИЧЕСТВО"
                        }), n.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [n.jsx("button", {
                                onClick: () => d(Math.max(1, p - 1)),
                                className: "w-9 h-9 border-2 rounded-lg hover:border-black transition",
                                children: "-"
                            }), n.jsx("span", {
                                className: "w-10 text-center font-bold",
                                children: p
                            }), n.jsx("button", {
                                onClick: () => d(p + 1),
                                className: "w-9 h-9 border-2 rounded-lg hover:border-black transition",
                                children: "+"
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "hidden md:flex gap-4 mb-6",
                        children: [n.jsx("button", {
                            onClick: U,
                            className: "flex-1 bg-gray-100 border-2 border-black py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition",
                            children: "В КОРЗИНУ"
                        }), n.jsx("button", {
                            onClick: S,
                            className: "flex-1 bg-black text-white py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition",
                            children: "КУПИТЬ СЕЙЧАС"
                        })]
                    }), n.jsxs("div", {
                        className: "border-t-2 border-black pt-4",
                        children: [n.jsxs("div", {
                            className: "flex gap-4 mb-4 overflow-x-auto",
                            children: [n.jsx("button", {
                                onClick: () => h("description"),
                                className: `font-bold pb-1 text-sm whitespace-nowrap ${x === "description" ? "border-b-2 border-black" : "text-gray-400"}`,
                                children: "ОПИСАНИЕ"
                            }), n.jsx("button", {
                                onClick: () => h("details"),
                                className: `font-bold pb-1 text-sm whitespace-nowrap ${x === "details" ? "border-b-2 border-black" : "text-gray-400"}`,
                                children: "ХАРАКТЕРИСТИКИ"
                            }), n.jsxs("button", {
                                onClick: () => h("reviews"),
                                className: `font-bold pb-1 text-sm whitespace-nowrap ${x === "reviews" ? "border-b-2 border-black" : "text-gray-400"}`,
                                children: ["ОТЗЫВЫ (", g.length, ")"]
                            })]
                        }), n.jsxs("div", {
                            className: "text-gray-600 text-sm",
                            children: [x === "description" && n.jsx("p", {children: i.description || "Описание товара отсутствует"}), x === "details" && n.jsxs("div", {
                                className: "space-y-1",
                                children: [n.jsxs("p", {children: ["• Категория: ", i.category || "Не указана"]}), n.jsxs("p", {children: ["• Размеры: ", i.sizes && Array.isArray(i.sizes) && i.sizes.length > 0 ? i.sizes.join(", ") : "Не указаны"]}), n.jsxs("p", {children: ["• Артикул: #", i.id]}), i.colors && Array.isArray(i.colors) && i.colors.length > 0 && n.jsxs("p", {children: ["• Цвета: ", i.colors.join(", ")]}), i.stock !== void 0 && n.jsxs("p", {children: ["• Наличие: ", i.stock > 0 ? `${i.stock} шт.` : "Нет в наличии"]})]
                            }), x === "reviews" && n.jsxs("div", {
                                children: [a && !R && n.jsxs("div", {
                                    className: "mb-6 p-3 bg-gray-50 rounded-xl",
                                    children: [n.jsx("h4", {
                                        className: "font-bold mb-2 text-sm",
                                        children: "Оставить отзыв"
                                    }), n.jsx("div", {
                                        className: "flex gap-1 mb-2",
                                        children: [1, 2, 3, 4, 5].map(T => n.jsx("button", {
                                            onClick: () => N({
                                                ...w,
                                                rating: T
                                            }),
                                            className: "text-xl",
                                            children: n.jsx("i", {className: `fas fa-star ${T <= w.rating ? "text-yellow-500" : "text-gray-300"}`})
                                        }, T))
                                    }), n.jsxs("div", {
                                        className: "mb-2 flex flex-wrap gap-2",
                                        children: [$.map((T, J) => n.jsxs("div", {
                                            className: "relative w-16 h-16",
                                            children: [n.jsx("img", {
                                                src: T,
                                                alt: "Фото",
                                                className: "w-full h-full object-cover rounded-lg"
                                            }), n.jsx("button", {
                                                onClick: () => oe(J),
                                                className: "absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs",
                                                children: "×"
                                            })]
                                        }, J)), n.jsxs("label", {
                                            className: "cursor-pointer bg-gray-200 px-3 py-2 rounded-lg text-sm inline-block",
                                            children: [G ? "Загрузка..." : "📷 Фото", n.jsx("input", {
                                                type: "file",
                                                accept: "image/*",
                                                onChange: B,
                                                className: "hidden",
                                                disabled: G
                                            })]
                                        })]
                                    }), n.jsx("textarea", {
                                        value: w.comment,
                                        onChange: T => N({...w, comment: T.target.value}),
                                        rows: 2,
                                        placeholder: "Ваш отзыв...",
                                        className: "w-full px-3 py-2 border rounded-lg text-sm resize-none mb-2"
                                    }), n.jsx("button", {
                                        onClick: fe,
                                        disabled: k,
                                        className: "bg-black text-white px-4 py-2 rounded-lg text-sm font-bold",
                                        children: "Отправить"
                                    })]
                                }), g.length === 0 ? n.jsx("p", {
                                    className: "text-gray-500 text-center py-4 text-sm",
                                    children: "Нет отзывов"
                                }) : n.jsx("div", {
                                    className: "space-y-3 max-h-80 overflow-y-auto pr-1",
                                    children: g.map(T => n.jsxs("div", {
                                        className: "border-b pb-3",
                                        children: [n.jsxs("div", {
                                            className: "flex justify-between",
                                            children: [n.jsx("p", {
                                                className: "font-bold text-sm",
                                                children: T.userName
                                            }), n.jsx("p", {
                                                className: "text-xs text-gray-400",
                                                children: new Date(T.date).toLocaleDateString()
                                            })]
                                        }), n.jsx("div", {
                                            className: "flex text-yellow-500 text-xs mt-1",
                                            children: [...Array(5)].map((J, Q) => n.jsx("i", {className: `fas fa-star ${Q < T.rating ? "text-yellow-500" : "text-gray-300"}`}, Q))
                                        }), n.jsx("p", {
                                            className: "text-gray-600 text-sm mt-1",
                                            children: T.comment
                                        }), T.photos && T.photos.length > 0 && n.jsx("div", {
                                            className: "flex gap-2 mt-2",
                                            children: T.photos.map((J, Q) => n.jsx("img", {
                                                src: J,
                                                alt: "Фото",
                                                className: "w-12 h-12 object-cover rounded"
                                            }, Q))
                                        })]
                                    }, T.id))
                                })]
                            })]
                        })]
                    })]
                })]
            }), c.length > 0 && n.jsxs("div", {
                className: "mt-12 pt-8 border-t-2 border-black",
                children: [n.jsx("h2", {
                    className: "text-xl md:text-2xl font-black mb-6",
                    children: "ПОХОЖИЕ ТОВАРЫ"
                }), n.jsx("div", {
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: c.map(T => {
                        var J;
                        return n.jsxs(D, {
                            to: `/product/${T.id}`,
                            className: "group",
                            children: [n.jsx("div", {
                                className: "bg-gray-100 rounded-xl aspect-square overflow-hidden",
                                children: n.jsx("img", {
                                    src: ((J = T.images) == null ? void 0 : J[0]) || T.image || "https://placehold.co/400x400/eeeeee/cccccc?text=No+Image",
                                    alt: T.name,
                                    className: "w-full h-full object-cover group-hover:scale-110 transition"
                                })
                            }), n.jsx("p", {
                                className: "font-black mt-2 text-sm line-clamp-1",
                                children: T.name
                            }), n.jsxs("p", {
                                className: "font-bold text-sm md:text-lg",
                                children: [T.price.toLocaleString(), " ₽"]
                            }), n.jsx("p", {
                                className: "text-xs text-gray-500 mt-0.5",
                                children: T.stockType === "in_stock" ? "✅ В наличии" : "📦 Предзаказ"
                            })]
                        }, T.id)
                    })
                })]
            })]
        }), n.jsxs("div", {
            className: "fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-3 z-30 md:hidden",
            children: [n.jsx("button", {
                onClick: U,
                className: "flex-1 bg-gray-100 border-2 border-black py-3 rounded-full font-bold text-sm",
                children: "В корзину"
            }), n.jsx("button", {
                onClick: S,
                className: "flex-1 bg-black text-white py-3 rounded-full font-bold text-sm",
                children: "Купить"
            })]
        })]
    })
}, tw = () => {
    const e = Qt(), t = Jr(),
        r = Ze(k => k.cart.items), {isAuthenticated: s} = Ze(k => k.auth), [a, l] = j.useState(!1), [i, o] = j.useState(!1), [c, u] = j.useState(!0);
    j.useEffect(() => {
        const k = () => {
            l(window.innerWidth < 768)
        };
        return k(), window.addEventListener("resize", k), (async () => {
            s && await t(su()), u(!1)
        })(), () => window.removeEventListener("resize", k)
    }, [t, s]);
    const f = r.reduce((k, E) => {
        const R = (E == null ? void 0 : E.price) || 0, z = (E == null ? void 0 : E.quantity) || 0;
        return k + R * z
    }, 0), m = k => {
        let E = !1, R = !1, z = 0;
        return k.forEach($ => {
            $.stockType === "in_stock" && (E = !0), $.stockType === "preorder" && (R = !0, z = $.preorderDays || 30)
        }), E && R ? {price: 800, text: "Смешанная доставка (РФ + Китай)", days: "разные сроки"} : R ? {
            price: 500,
            text: "Доставка из Китая",
            days: `~${z} дней`
        } : {price: 300, text: "Доставка по РФ", days: "2-5 дней"}
    }, y = k => {
        let E = 0;
        return k.forEach(R => {
            const z = R.price * R.quantity, $ = R.prepaymentPercent || (R.stockType === "preorder" ? 100 : 70);
            E += z * $ / 100
        }), E
    }, b = m(r), p = b.price, d = f + p, x = y(r), h = d - x, g = async (k, E) => {
        E < 1 || await t(ah({itemId: k, quantity: E}))
    }, v = async k => {
        await t(lh(k)), _.error("Товар удалён из корзины")
    }, w = async () => {
        await t(au()), o(!1), _.success("Корзина очищена", {
            icon: "🗑️",
            duration: 3e3,
            style: {background: "#000", color: "#fff"}
        })
    }, N = () => {
        if (!s) {
            _.error("Войдите в аккаунт, чтобы оформить заказ"), e("/profile");
            return
        }
        e("/checkout")
    };
    return c ? n.jsx("div", {
        className: "min-h-screen bg-white pt-20 flex items-center justify-center",
        children: n.jsxs("div", {
            className: "text-center",
            children: [n.jsx("div", {className: "w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-3"}), n.jsx("p", {
                className: "text-gray-500 text-sm",
                children: "Загрузка корзины..."
            })]
        })
    }) : !r || r.length === 0 ? n.jsx("div", {
        className: "min-h-screen bg-white pt-20",
        children: n.jsxs("div", {
            className: "container mx-auto px-4 py-20 text-center",
            children: [n.jsx("i", {className: "fas fa-shopping-cart text-6xl text-gray-300 mb-4"}), n.jsx("h2", {
                className: "text-2xl font-black mb-4",
                children: "КОРЗИНА ПУСТА"
            }), n.jsx("p", {
                className: "text-gray-500 mb-8",
                children: "Добавьте товары в корзину, чтобы продолжить"
            }), n.jsx(D, {
                to: "/catalog",
                className: "inline-block bg-black text-white px-8 py-3 font-black tracking-wider hover:bg-gray-800 transition",
                children: "ПЕРЕЙТИ В КАТАЛОГ"
            })]
        })
    }) : n.jsxs("div", {
        className: "min-h-screen bg-white pt-20", children: [n.jsxs("div", {
            className: "container mx-auto px-4 py-8",
            children: [n.jsxs("div", {
                className: "flex justify-between items-center mb-8",
                children: [n.jsx("h1", {
                    className: "text-3xl md:text-4xl font-black tracking-tighter",
                    children: "КОРЗИНА"
                }), n.jsxs("button", {
                    onClick: () => o(!0),
                    className: "text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1",
                    children: [n.jsx("i", {className: "fas fa-trash-alt"}), " Очистить корзину"]
                })]
            }), n.jsxs("div", {
                className: "flex flex-col lg:flex-row gap-8", children: [n.jsx("div", {
                    className: "flex-1", children: a ? n.jsx("div", {
                        className: "space-y-4", children: r.map(k => {
                            var E;
                            return n.jsx("div", {
                                className: "bg-white rounded-2xl p-4 shadow-sm border", children: n.jsxs("div", {
                                    className: "flex gap-3",
                                    children: [n.jsx("img", {
                                        src: k.image || "https://placehold.co/100x100/eeeeee/cccccc?text=No+Image",
                                        alt: k.name || "Товар",
                                        className: "w-20 h-20 object-cover rounded-lg",
                                        onError: R => {
                                            R.target.src = "https://placehold.co/100x100/eeeeee/cccccc?text=No+Image"
                                        }
                                    }), n.jsxs("div", {
                                        className: "flex-1",
                                        children: [n.jsx("h3", {
                                            className: "font-black text-base",
                                            children: k.name || "Товар"
                                        }), n.jsxs("p", {
                                            className: "text-sm text-gray-500",
                                            children: ["Размер: ", k.size || "Не указан"]
                                        }), n.jsx("p", {
                                            className: "text-xs text-gray-500",
                                            children: k.stockType === "in_stock" ? "✅ В наличии (РФ)" : `📦 Предзаказ ~${k.preorderDays || 30} дней`
                                        }), n.jsxs("p", {
                                            className: "font-bold text-base mt-1",
                                            children: [((E = k == null ? void 0 : k.price) == null ? void 0 : E.toLocaleString()) || 0, " ₽"]
                                        }), n.jsxs("div", {
                                            className: "flex items-center gap-3 mt-2",
                                            children: [n.jsx("button", {
                                                onClick: () => g(k.id, (k.quantity || 1) - 1),
                                                className: "w-8 h-8 border-2 border-gray-300 rounded-lg flex items-center justify-center",
                                                children: "-"
                                            }), n.jsx("span", {
                                                className: "w-8 text-center font-black",
                                                children: k.quantity || 1
                                            }), n.jsx("button", {
                                                onClick: () => g(k.id, (k.quantity || 1) + 1),
                                                className: "w-8 h-8 border-2 border-gray-300 rounded-lg flex items-center justify-center",
                                                children: "+"
                                            }), n.jsx("button", {
                                                onClick: () => v(k.id),
                                                className: "text-red-500 ml-2",
                                                children: n.jsx("i", {className: "fas fa-trash"})
                                            })]
                                        })]
                                    }), n.jsx("div", {
                                        className: "text-right",
                                        children: n.jsxs("p", {
                                            className: "font-black",
                                            children: [(((k == null ? void 0 : k.price) || 0) * ((k == null ? void 0 : k.quantity) || 1)).toLocaleString(), " ₽"]
                                        })
                                    })]
                                })
                            }, k.id)
                        })
                    }) : n.jsx("div", {
                        className: "overflow-x-auto", children: n.jsxs("table", {
                            className: "w-full",
                            children: [n.jsx("thead", {
                                className: "border-b-2 border-black",
                                children: n.jsxs("tr", {
                                    className: "text-left",
                                    children: [n.jsx("th", {
                                        className: "pb-3 text-sm font-black",
                                        children: "Товар"
                                    }), n.jsx("th", {
                                        className: "pb-3 text-sm font-black",
                                        children: "Название"
                                    }), n.jsx("th", {
                                        className: "pb-3 text-sm font-black",
                                        children: "Цена"
                                    }), n.jsx("th", {
                                        className: "pb-3 text-sm font-black",
                                        children: "Количество"
                                    }), n.jsx("th", {
                                        className: "pb-3 text-sm font-black",
                                        children: "Итого"
                                    }), n.jsx("th", {className: "pb-3 text-sm font-black"})]
                                })
                            }), n.jsx("tbody", {
                                children: r.map(k => {
                                    var E;
                                    return n.jsxs("tr", {
                                        className: "border-b",
                                        children: [n.jsx("td", {
                                            className: "py-4 pr-4",
                                            children: n.jsx("img", {
                                                src: k.image || "https://placehold.co/100x100/eeeeee/cccccc?text=No+Image",
                                                alt: k.name || "Товар",
                                                className: "w-16 h-16 object-cover rounded",
                                                onError: R => {
                                                    R.target.src = "https://placehold.co/100x100/eeeeee/cccccc?text=No+Image"
                                                }
                                            })
                                        }), n.jsxs("td", {
                                            className: "py-4",
                                            children: [n.jsx("p", {
                                                className: "font-black",
                                                children: k.name || "Товар"
                                            }), n.jsxs("p", {
                                                className: "text-sm text-gray-500",
                                                children: ["Размер: ", k.size || "Не указан"]
                                            }), n.jsx("p", {
                                                className: "text-xs text-gray-500",
                                                children: k.stockType === "in_stock" ? "✅ В наличии (РФ)" : `📦 Предзаказ ~${k.preorderDays || 30} дней`
                                            })]
                                        }), n.jsxs("td", {
                                            className: "py-4 font-bold",
                                            children: [((E = k == null ? void 0 : k.price) == null ? void 0 : E.toLocaleString()) || 0, " ₽"]
                                        }), n.jsx("td", {
                                            className: "py-4",
                                            children: n.jsxs("div", {
                                                className: "flex items-center gap-2",
                                                children: [n.jsx("button", {
                                                    onClick: () => g(k.id, (k.quantity || 1) - 1),
                                                    className: "w-8 h-8 border rounded-lg",
                                                    children: "-"
                                                }), n.jsx("span", {
                                                    className: "w-8 text-center font-black",
                                                    children: k.quantity || 1
                                                }), n.jsx("button", {
                                                    onClick: () => g(k.id, (k.quantity || 1) + 1),
                                                    className: "w-8 h-8 border rounded-lg",
                                                    children: "+"
                                                })]
                                            })
                                        }), n.jsxs("td", {
                                            className: "py-4 font-bold",
                                            children: [(((k == null ? void 0 : k.price) || 0) * ((k == null ? void 0 : k.quantity) || 1)).toLocaleString(), " ₽"]
                                        }), n.jsx("td", {
                                            className: "py-4",
                                            children: n.jsx("button", {
                                                onClick: () => v(k.id),
                                                className: "text-red-500",
                                                children: n.jsx("i", {className: "fas fa-trash"})
                                            })
                                        })]
                                    }, k.id)
                                })
                            })]
                        })
                    })
                }), n.jsx("div", {
                    className: "lg:w-96", children: n.jsxs("div", {
                        className: "border-2 border-black p-6 sticky top-24",
                        children: [n.jsx("h3", {
                            className: "font-black text-xl mb-4",
                            children: "ИТОГО"
                        }), n.jsxs("div", {
                            className: "space-y-2 mb-4",
                            children: [n.jsxs("div", {
                                className: "flex justify-between",
                                children: [n.jsxs("span", {
                                    className: "text-gray-500",
                                    children: ["Товары (", r.length, ")"]
                                }), n.jsxs("span", {children: [f.toLocaleString(), " ₽"]})]
                            }), n.jsxs("div", {
                                className: "flex justify-between",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "Доставка"
                                }), n.jsx("span", {children: p === 0 ? "Бесплатно" : `${p.toLocaleString()} ₽`})]
                            }), b.days && b.days !== "разные сроки" && n.jsxs("div", {
                                className: "flex justify-between",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "Срок доставки"
                                }), n.jsx("span", {className: "text-sm", children: b.days})]
                            }), n.jsxs("div", {
                                className: "border-t-2 border-black pt-2 mt-2",
                                children: [n.jsxs("div", {
                                    className: "flex justify-between font-black text-lg",
                                    children: [n.jsx("span", {children: "Всего:"}), n.jsxs("span", {children: [d.toLocaleString(), " ₽"]})]
                                }), n.jsxs("div", {
                                    className: "flex justify-between mt-2",
                                    children: [n.jsx("span", {
                                        className: "text-gray-500",
                                        children: "Предоплата:"
                                    }), n.jsxs("span", {
                                        className: "font-bold text-orange-600",
                                        children: [x.toLocaleString(), " ₽"]
                                    })]
                                }), h > 0 && n.jsxs("div", {
                                    className: "flex justify-between text-sm",
                                    children: [n.jsx("span", {
                                        className: "text-gray-500",
                                        children: "К оплате при получении:"
                                    }), n.jsxs("span", {children: [h.toLocaleString(), " ₽"]})]
                                })]
                            })]
                        }), n.jsx("button", {
                            onClick: N,
                            className: "w-full bg-black text-white py-3 font-black tracking-wider hover:bg-gray-800 transition",
                            children: "ОФОРМИТЬ ЗАКАЗ"
                        }), n.jsx("p", {
                            className: "text-xs text-gray-400 text-center mt-3",
                            children: b.text
                        }), n.jsx("p", {
                            className: "text-xs text-orange-600 text-center mt-2",
                            children: "⚠️ При отказе от заказа предоплата не возвращается"
                        })]
                    })
                })]
            })]
        }), i && n.jsxs(n.Fragment, {
            children: [n.jsx("div", {className: "fixed inset-0 bg-black/50 z-40", onClick: () => o(!1)}), n.jsx("div", {
                className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden",
                children: n.jsxs("div", {
                    className: "p-6 text-center",
                    children: [n.jsx("div", {
                        className: "w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4",
                        children: n.jsx("i", {className: "fas fa-trash-alt text-2xl text-red-500"})
                    }), n.jsx("h3", {
                        className: "text-xl font-black mb-2",
                        children: "Очистить корзину?"
                    }), n.jsx("p", {
                        className: "text-gray-500 mb-4",
                        children: "Вы действительно хотите удалить все товары из корзины?"
                    }), n.jsxs("div", {
                        className: "bg-gray-50 p-3 rounded-xl mb-6",
                        children: [n.jsxs("div", {
                            className: "flex justify-between text-sm mb-1",
                            children: [n.jsx("span", {
                                className: "text-gray-500",
                                children: "Товаров:"
                            }), n.jsxs("span", {className: "font-black", children: [r.length, " шт."]})]
                        }), n.jsxs("div", {
                            className: "flex justify-between text-sm",
                            children: [n.jsx("span", {
                                className: "text-gray-500",
                                children: "На сумму:"
                            }), n.jsxs("span", {
                                className: "font-black text-red-500",
                                children: [f.toLocaleString(), " ₽"]
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "flex gap-3",
                        children: [n.jsx("button", {
                            onClick: () => o(!1),
                            className: "flex-1 py-3 border-2 border-gray-200 rounded-xl font-black hover:bg-gray-50 transition",
                            children: "Отмена"
                        }), n.jsx("button", {
                            onClick: w,
                            className: "flex-1 bg-red-500 text-white py-3 rounded-xl font-black hover:bg-red-600 transition",
                            children: "Да, очистить"
                        })]
                    })]
                })
            })]
        })]
    })
}, rw = () => {
    const e = Ws(),
        t = Vr(m => m.favorites.items), [r, s] = j.useState([]), [a, l] = j.useState(!1), [i, o] = j.useState(!0),
        c = m => {
            if (!m) return [];
            if (Array.isArray(m)) return m;
            if (typeof m == "string") try {
                return JSON.parse(m)
            } catch {
                return []
            }
            return []
        };
    j.useEffect(() => {
        const m = () => {
            l(window.innerWidth < 768)
        };
        return m(), window.addEventListener("resize", m), () => window.removeEventListener("resize", m)
    }, []), j.useEffect(() => {
        (async () => {
            try {
                o(!0);
                const p = (await Pt.getAll()).data.map(d => ({
                    ...d,
                    sizes: c(d.sizes),
                    colors: c(d.colors),
                    images: c(d.images)
                })).filter(d => t.includes(d.id));
                s(p)
            } catch (y) {
                console.error("Ошибка загрузки избранного:", y), _.error("Ошибка загрузки")
            } finally {
                o(!1)
            }
        })()
    }, [t]);
    const u = m => {
        e($s(m)), _.success("Удалено из избранного")
    }, f = m => {
        var y;
        e(Pn({
            productId: m.id,
            quantity: 1,
            size: ((y = m.sizes) == null ? void 0 : y[0]) || "M"
        })), _.success(`${m.name} добавлен в корзину`)
    };
    return i ? n.jsx("div", {
        className: "min-h-screen bg-white pt-20 flex items-center justify-center",
        children: n.jsxs("div", {
            className: "text-center",
            children: [n.jsx("div", {className: "w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-3"}), n.jsx("p", {
                className: "text-gray-500 text-sm",
                children: "Загрузка..."
            })]
        })
    }) : r.length === 0 ? n.jsx("div", {
        className: "min-h-screen bg-white pt-20",
        children: n.jsxs("div", {
            className: "container mx-auto px-4 py-20 text-center",
            children: [n.jsx("i", {className: "far fa-heart text-6xl text-gray-300 mb-4"}), n.jsx("h2", {
                className: "text-2xl font-black mb-4",
                children: "ИЗБРАННОЕ ПУСТО"
            }), n.jsx("p", {
                className: "text-gray-500 mb-8",
                children: "Добавляйте товары в избранное, чтобы не потерять их"
            }), n.jsx(D, {
                to: "/catalog",
                className: "inline-block bg-black text-white px-8 py-3 font-black tracking-wider hover:bg-gray-800 transition",
                children: "ПЕРЕЙТИ В КАТАЛОГ"
            })]
        })
    }) : n.jsx("div", {
        className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-8",
            children: [n.jsxs("div", {
                className: "flex justify-between items-center mb-8",
                children: [n.jsx("h1", {
                    className: "text-3xl md:text-4xl font-black tracking-tighter",
                    children: "ИЗБРАННОЕ"
                }), n.jsxs("span", {
                    className: "bg-gray-100 px-3 py-1 rounded-full text-sm font-black",
                    children: [r.length, " товаров"]
                })]
            }), a ? n.jsx("div", {
                className: "space-y-4", children: r.map(m => {
                    var y;
                    return n.jsx("div", {
                        className: "bg-white rounded-2xl p-4 shadow-sm border", children: n.jsxs("div", {
                            className: "flex gap-3",
                            children: [n.jsx(D, {
                                to: `/product/${m.id}`,
                                className: "flex-shrink-0",
                                children: n.jsx("img", {
                                    src: ((y = m.images) == null ? void 0 : y[0]) || m.image || "https://placehold.co/100x100/eeeeee/cccccc?text=No+Image",
                                    alt: m.name,
                                    className: "w-20 h-20 object-cover rounded-lg",
                                    onError: b => {
                                        b.target.src = "https://placehold.co/100x100/eeeeee/cccccc?text=No+Image"
                                    }
                                })
                            }), n.jsxs("div", {
                                className: "flex-1",
                                children: [n.jsx(D, {
                                    to: `/product/${m.id}`,
                                    children: n.jsx("h3", {className: "font-black text-base", children: m.name})
                                }), n.jsx("p", {
                                    className: "text-sm text-gray-500 line-clamp-2",
                                    children: m.description
                                }), n.jsxs("div", {
                                    className: "flex justify-between items-center mt-2",
                                    children: [n.jsxs("div", {
                                        children: [n.jsxs("p", {
                                            className: "font-black text-base",
                                            children: [m.price.toLocaleString(), " ₽"]
                                        }), m.old_price && n.jsxs("p", {
                                            className: "text-xs text-gray-400 line-through",
                                            children: [m.old_price.toLocaleString(), " ₽"]
                                        })]
                                    }), n.jsx("button", {
                                        onClick: () => f(m),
                                        className: "bg-black text-white px-3 py-1.5 rounded-full text-xs font-black",
                                        children: "В КОРЗИНУ"
                                    })]
                                }), n.jsx("button", {
                                    onClick: () => u(m.id),
                                    className: "w-full mt-2 border border-red-500 text-red-500 py-1.5 rounded-full text-xs font-black hover:bg-red-500 hover:text-white transition",
                                    children: "УДАЛИТЬ"
                                })]
                            })]
                        })
                    }, m.id)
                })
            }) : n.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: r.map(m => {
                    var y;
                    return n.jsxs("div", {
                        className: "group border-2 border-black hover:shadow-lg transition bg-white",
                        children: [n.jsx(D, {
                            to: `/product/${m.id}`,
                            children: n.jsxs("div", {
                                className: "relative bg-gray-100 aspect-square overflow-hidden",
                                children: [n.jsx("img", {
                                    src: ((y = m.images) == null ? void 0 : y[0]) || m.image || "https://placehold.co/400x400/eeeeee/cccccc?text=No+Image",
                                    alt: m.name,
                                    className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                                    onError: b => {
                                        b.target.src = "https://placehold.co/400x400/eeeeee/cccccc?text=No+Image"
                                    }
                                }), m.is_new && n.jsx("span", {
                                    className: "absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full",
                                    children: "NEW"
                                }), m.is_sale && m.old_price && n.jsx("span", {
                                    className: "absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full",
                                    children: "SALE"
                                })]
                            })
                        }), n.jsxs("div", {
                            className: "p-4",
                            children: [n.jsx(D, {
                                to: `/product/${m.id}`,
                                children: n.jsx("h3", {
                                    className: "font-black text-lg mb-1 hover:opacity-70 transition line-clamp-1",
                                    children: m.name
                                })
                            }), n.jsx("p", {
                                className: "text-gray-500 text-sm mb-2 line-clamp-2",
                                children: m.description
                            }), n.jsxs("div", {
                                className: "flex justify-between items-center mt-3",
                                children: [n.jsxs("div", {
                                    children: [n.jsxs("p", {
                                        className: "font-black text-xl",
                                        children: [m.price.toLocaleString(), " ₽"]
                                    }), m.old_price && n.jsxs("p", {
                                        className: "text-sm text-gray-400 line-through",
                                        children: [m.old_price.toLocaleString(), " ₽"]
                                    })]
                                }), n.jsx("button", {
                                    onClick: () => f(m),
                                    className: "bg-black text-white px-3 py-2 rounded-full text-sm font-black hover:bg-gray-800 transition",
                                    children: "В КОРЗИНУ"
                                })]
                            }), n.jsx("button", {
                                onClick: () => u(m.id),
                                className: "w-full mt-3 border-2 border-red-500 text-red-500 py-2 rounded-full text-sm font-black hover:bg-red-500 hover:text-white transition",
                                children: "УДАЛИТЬ"
                            })]
                        })]
                    }, m.id)
                })
            })]
        })
    })
}, nw = () => {
    var L, G, X;
    const e = Qt(), t = Jr(), {
        user: r,
        isAuthenticated: s,
        loading: a
    } = Ze(P => P.auth), [l, i] = j.useState("profile"), [o, c] = j.useState(!0), [u, f] = j.useState([]), [m, y] = j.useState(0), [b, p] = j.useState(!1), [d, x] = j.useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    }), [h, g] = j.useState(""), [v, w] = j.useState({
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        phone: ""
    });
    j.useEffect(() => {
        r && y(r.balance || 0);
        const P = () => {
            const W = JSON.parse(localStorage.getItem("misat_current_user") || "{}");
            y(W.balance || 0)
        };
        return window.addEventListener("balanceUpdated", P), () => window.removeEventListener("balanceUpdated", P)
    }, [r]);
    const N = P => P.length < 8 ? {
        isValid: !1,
        message: "Пароль должен содержать минимум 8 символов"
    } : /[A-Z]/.test(P) ? /[a-z]/.test(P) ? /[0-9]/.test(P) ? {isValid: !0, message: ""} : {
        isValid: !1,
        message: "Пароль должен содержать хотя бы одну цифру"
    } : {isValid: !1, message: "Пароль должен содержать хотя бы одну строчную букву"} : {
        isValid: !1,
        message: "Пароль должен содержать хотя бы одну заглавную букву"
    };
    j.useEffect(() => {
        if (s && r) {
            const P = sh(r.id);
            f(P)
        }
    }, [s, r]);
    const k = async P => {
        var W, H, te, A;
        if (P.preventDefault(), !v.email || !v.password) {
            _.error("Заполните email и пароль");
            return
        }
        if (!o) {
            if (!v.first_name || !v.last_name) {
                _.error("Заполните имя и фамилию");
                return
            }
            const U = N(v.password);
            if (!U.isValid) {
                _.error(U.message);
                return
            }
            if (v.password !== v.confirmPassword) {
                _.error("Пароли не совпадают");
                return
            }
        }
        if (o) {
            const U = await t(Sa({email: v.email, password: v.password}));
            (W = U.payload) != null && W.user ? (_.success(`Добро пожаловать, ${U.payload.user.first_name || U.payload.user.email}!`), w({
                email: "",
                password: "",
                confirmPassword: "",
                first_name: "",
                last_name: "",
                phone: ""
            })) : _.error(((H = U.error) == null ? void 0 : H.message) || "Неверный email или пароль")
        } else {
            const U = await t(Ca({
                email: v.email,
                password: v.password,
                first_name: v.first_name,
                last_name: v.last_name,
                phone: v.phone
            }));
            (te = U.payload) != null && te.user ? (_.success("Регистрация успешна!"), c(!0), w({
                email: "",
                password: "",
                confirmPassword: "",
                first_name: "",
                last_name: "",
                phone: ""
            })) : _.error(((A = U.error) == null ? void 0 : A.message) || "Ошибка регистрации")
        }
    }, E = async () => {
        if (g(""), !d.newPassword || !d.confirmPassword) {
            g("Заполните поля нового пароля");
            return
        }
        const P = N(d.newPassword);
        if (!P.isValid) {
            g(P.message);
            return
        }
        if (d.newPassword !== d.confirmPassword) {
            g("Новые пароли не совпадают");
            return
        }
        _.success("Пароль успешно изменён!"), p(!1), x({oldPassword: "", newPassword: "", confirmPassword: ""})
    }, R = () => {
        t(du()), _.success("Вы вышли из аккаунта"), e("/")
    }, z = P => {
        switch (P) {
            case"delivered":
                return "Доставлен";
            case"processing":
                return "В обработке";
            case"shipped":
                return "Отправлен";
            case"pending":
                return "Ожидает";
            default:
                return P
        }
    }, $ = P => {
        switch (P) {
            case"delivered":
                return "bg-green-100 text-green-700";
            case"processing":
                return "bg-yellow-100 text-yellow-700";
            case"shipped":
                return "bg-blue-100 text-blue-700";
            case"pending":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700"
        }
    };
    return s ? n.jsx("div", {
        className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-8",
            children: [n.jsxs("div", {
                className: "mb-8",
                children: [n.jsxs("h1", {
                    className: "text-3xl md:text-4xl font-black tracking-tighter",
                    children: ["ПРИВЕТ, ", ((L = r == null ? void 0 : r.first_name) == null ? void 0 : L.toUpperCase()) || ((X = (G = r == null ? void 0 : r.email) == null ? void 0 : G.split("@")[0]) == null ? void 0 : X.toUpperCase()), "!"]
                }), n.jsx("p", {className: "text-gray-500 mt-2", children: "Добро пожаловать в личный кабинет MISAT"})]
            }), n.jsxs("div", {
                className: "flex border-b-2 border-black mb-8",
                children: [n.jsx("button", {
                    onClick: () => i("profile"),
                    className: `px-6 py-3 font-black tracking-wider transition ${l === "profile" ? "bg-black text-white" : "hover:bg-gray-100"}`,
                    children: "ПРОФИЛЬ"
                }), n.jsxs("button", {
                    onClick: () => i("orders"),
                    className: `px-6 py-3 font-black tracking-wider transition ${l === "orders" ? "bg-black text-white" : "hover:bg-gray-100"}`,
                    children: ["ЗАКАЗЫ (", u.length, ")"]
                }), n.jsx("button", {
                    onClick: () => i("settings"),
                    className: `px-6 py-3 font-black tracking-wider transition ${l === "settings" ? "bg-black text-white" : "hover:bg-gray-100"}`,
                    children: "НАСТРОЙКИ"
                })]
            }), l === "profile" && n.jsxs("div", {
                className: "grid md:grid-cols-2 gap-8", children: [n.jsxs("div", {
                    className: "border-2 border-black p-6",
                    children: [n.jsx("h2", {
                        className: "text-xl font-black mb-4",
                        children: "ИНФОРМАЦИЯ О ПРОФИЛЕ"
                    }), n.jsxs("div", {
                        className: "space-y-3",
                        children: [n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-xs text-gray-500 font-black",
                                children: "EMAIL"
                            }), n.jsx("p", {className: "text-lg", children: r == null ? void 0 : r.email})]
                        }), n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-xs text-gray-500 font-black",
                                children: "ИМЯ"
                            }), n.jsx("p", {
                                className: "text-lg",
                                children: (r == null ? void 0 : r.first_name) || "Не указано"
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-xs text-gray-500 font-black",
                                children: "ФАМИЛИЯ"
                            }), n.jsx("p", {
                                className: "text-lg",
                                children: (r == null ? void 0 : r.last_name) || "Не указано"
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-xs text-gray-500 font-black",
                                children: "ТЕЛЕФОН"
                            }), n.jsx("p", {
                                className: "text-lg",
                                children: (r == null ? void 0 : r.phone) || "Не указан"
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-xs text-gray-500 font-black",
                                children: "РОЛЬ"
                            }), n.jsx("p", {
                                className: "text-lg capitalize",
                                children: (r == null ? void 0 : r.role) || "Пользователь"
                            })]
                        }), n.jsx("div", {
                            className: "bg-green-50 p-3 rounded-xl mt-4",
                            children: n.jsxs("div", {
                                className: "flex justify-between items-center",
                                children: [n.jsxs("div", {
                                    children: [n.jsx("p", {
                                        className: "text-xs text-gray-500 font-black",
                                        children: "БАЛАНС"
                                    }), n.jsxs("p", {
                                        className: "text-2xl font-black text-green-600",
                                        children: [m.toLocaleString(), " ₽"]
                                    })]
                                }), n.jsx(D, {
                                    to: "/balance-topup",
                                    className: "bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition",
                                    children: "ПОПОЛНИТЬ"
                                })]
                            })
                        })]
                    }), n.jsxs("div", {
                        className: "mt-6 pt-4 border-t",
                        children: [n.jsxs("button", {
                            onClick: () => p(!b),
                            className: "text-sm text-gray-500 hover:text-black transition flex items-center gap-2",
                            children: [n.jsx("i", {className: "fas fa-key"}), b ? "Отмена" : "Сменить пароль"]
                        }), b && n.jsxs("div", {
                            className: "mt-4 space-y-3",
                            children: [n.jsx("input", {
                                type: "password",
                                placeholder: "Новый пароль",
                                value: d.newPassword,
                                onChange: P => x({...d, newPassword: P.target.value}),
                                className: "w-full px-3 py-2 border rounded-lg text-sm"
                            }), n.jsx("input", {
                                type: "password",
                                placeholder: "Подтвердите новый пароль",
                                value: d.confirmPassword,
                                onChange: P => x({...d, confirmPassword: P.target.value}),
                                className: "w-full px-3 py-2 border rounded-lg text-sm"
                            }), h && n.jsx("p", {
                                className: "text-red-500 text-xs",
                                children: h
                            }), n.jsx("p", {
                                className: "text-xs text-gray-400",
                                children: "Пароль: минимум 8 символов, заглавная и строчная буква, цифра"
                            }), n.jsx("button", {
                                onClick: E,
                                className: "bg-black text-white px-4 py-2 rounded-lg text-sm font-bold",
                                children: "Сохранить пароль"
                            })]
                        })]
                    })]
                }), n.jsxs("div", {
                    className: "border-2 border-black p-6",
                    children: [n.jsx("h2", {
                        className: "text-xl font-black mb-4",
                        children: "СТАТИСТИКА"
                    }), n.jsxs("div", {
                        className: "space-y-4",
                        children: [n.jsxs("div", {
                            className: "flex justify-between items-center border-b pb-2",
                            children: [n.jsx("span", {children: "Всего заказов:"}), n.jsx("span", {
                                className: "font-black text-xl",
                                children: u.length
                            })]
                        }), n.jsxs("div", {
                            className: "flex justify-between items-center border-b pb-2",
                            children: [n.jsx("span", {children: "Общая сумма:"}), n.jsxs("span", {
                                className: "font-black text-xl",
                                children: [u.reduce((P, W) => P + W.total, 0).toLocaleString(), " ₽"]
                            })]
                        })]
                    })]
                })]
            }), l === "orders" && n.jsx("div", {
                className: "border-2 border-black overflow-hidden",
                children: u.length === 0 ? n.jsxs("div", {
                    className: "text-center py-12",
                    children: [n.jsx("i", {className: "fas fa-box-open text-5xl text-gray-300 mb-4"}), n.jsx("p", {
                        className: "text-gray-500 mb-4",
                        children: "У вас пока нет заказов"
                    }), n.jsx(D, {
                        to: "/catalog",
                        className: "inline-block bg-black text-white px-6 py-2 text-sm font-black tracking-wider hover:bg-gray-800 transition",
                        children: "ПЕРЕЙТИ В КАТАЛОГ"
                    })]
                }) : n.jsx("div", {
                    className: "overflow-x-auto", children: n.jsxs("table", {
                        className: "w-full",
                        children: [n.jsx("thead", {
                            className: "bg-gray-50 border-b",
                            children: n.jsxs("tr", {
                                className: "text-left",
                                children: [n.jsx("th", {
                                    className: "px-6 py-4 text-sm font-black",
                                    children: "НОМЕР"
                                }), n.jsx("th", {
                                    className: "px-6 py-4 text-sm font-black",
                                    children: "ДАТА"
                                }), n.jsx("th", {
                                    className: "px-6 py-4 text-sm font-black",
                                    children: "СУММА"
                                }), n.jsx("th", {
                                    className: "px-6 py-4 text-sm font-black",
                                    children: "СТАТУС"
                                }), n.jsx("th", {className: "px-6 py-4 text-sm font-black", children: "АДРЕС"})]
                            })
                        }), n.jsx("tbody", {
                            children: u.map(P => n.jsxs("tr", {
                                className: "border-b hover:bg-gray-50",
                                children: [n.jsx("td", {
                                    className: "px-6 py-4 font-mono text-sm",
                                    children: P.id
                                }), n.jsx("td", {
                                    className: "px-6 py-4 text-sm",
                                    children: new Date(P.created_at).toLocaleDateString()
                                }), n.jsxs("td", {
                                    className: "px-6 py-4 font-black",
                                    children: [P.total.toLocaleString(), " ₽"]
                                }), n.jsx("td", {
                                    className: "px-6 py-4",
                                    children: n.jsx("span", {
                                        className: `px-2 py-1 rounded-full text-xs font-black ${$(P.status)}`,
                                        children: z(P.status)
                                    })
                                }), n.jsx("td", {
                                    className: "px-6 py-4 text-sm max-w-xs truncate",
                                    children: P.address
                                })]
                            }, P.id))
                        })]
                    })
                })
            }), l === "settings" && n.jsxs("div", {
                className: "border-2 border-black p-6",
                children: [n.jsx("h2", {className: "text-xl font-black mb-4", children: "НАСТРОЙКИ"}), n.jsxs("div", {
                    className: "space-y-4",
                    children: [n.jsxs("div", {
                        className: "flex items-center justify-between py-3 border-b",
                        children: [n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "font-black",
                                children: "Email рассылка"
                            }), n.jsx("p", {
                                className: "text-sm text-gray-500",
                                children: "Получать новости о скидках и новинках"
                            })]
                        }), n.jsxs("label", {
                            className: "relative inline-flex items-center cursor-pointer",
                            children: [n.jsx("input", {
                                type: "checkbox",
                                className: "sr-only peer",
                                defaultChecked: !0
                            }), n.jsx("div", {className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"})]
                        })]
                    }), n.jsxs("div", {
                        className: "flex items-center justify-between py-3 border-b",
                        children: [n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "font-black",
                                children: "СМС уведомления"
                            }), n.jsx("p", {
                                className: "text-sm text-gray-500",
                                children: "Получать статус заказа по SMS"
                            })]
                        }), n.jsxs("label", {
                            className: "relative inline-flex items-center cursor-pointer",
                            children: [n.jsx("input", {
                                type: "checkbox",
                                className: "sr-only peer"
                            }), n.jsx("div", {className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"})]
                        })]
                    }), n.jsx("button", {
                        className: "w-full mt-6 bg-black text-white py-3 font-black tracking-wider hover:bg-gray-800 transition",
                        children: "СОХРАНИТЬ НАСТРОЙКИ"
                    })]
                })]
            }), n.jsx("div", {
                className: "mt-8 text-center",
                children: n.jsxs("button", {
                    onClick: R,
                    className: "inline-flex items-center gap-2 text-gray-500 hover:text-red-500 transition",
                    children: [n.jsx("i", {className: "fas fa-sign-out-alt"}), " ВЫЙТИ ИЗ АККАУНТА"]
                })
            })]
        })
    }) : n.jsx("div", {
        className: "min-h-screen bg-white pt-20", children: n.jsx("div", {
            className: "container mx-auto px-4 py-12", children: n.jsxs("div", {
                className: "max-w-md mx-auto",
                children: [n.jsxs("div", {
                    className: "text-center mb-8",
                    children: [n.jsx("i", {className: "fas fa-user-circle text-6xl text-gray-400 mb-4"}), n.jsx("h1", {
                        className: "text-3xl font-black tracking-tighter",
                        children: o ? "ВХОД" : "РЕГИСТРАЦИЯ"
                    }), n.jsx("div", {className: "w-16 h-0.5 bg-black mx-auto mt-4"})]
                }), n.jsxs("form", {
                    onSubmit: k,
                    className: "bg-white border-2 border-black p-8",
                    children: [!o && n.jsxs(n.Fragment, {
                        children: [n.jsxs("div", {
                            className: "mb-4",
                            children: [n.jsx("label", {
                                className: "block text-sm font-black mb-2",
                                children: "ИМЯ *"
                            }), n.jsx("input", {
                                type: "text",
                                value: v.first_name,
                                onChange: P => w({...v, first_name: P.target.value}),
                                className: "w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition",
                                required: !0
                            })]
                        }), n.jsxs("div", {
                            className: "mb-4",
                            children: [n.jsx("label", {
                                className: "block text-sm font-black mb-2",
                                children: "ФАМИЛИЯ *"
                            }), n.jsx("input", {
                                type: "text",
                                value: v.last_name,
                                onChange: P => w({...v, last_name: P.target.value}),
                                className: "w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition",
                                required: !0
                            })]
                        }), n.jsxs("div", {
                            className: "mb-4",
                            children: [n.jsx("label", {
                                className: "block text-sm font-black mb-2",
                                children: "ТЕЛЕФОН"
                            }), n.jsx("input", {
                                type: "tel",
                                value: v.phone,
                                onChange: P => w({...v, phone: P.target.value}),
                                className: "w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition"
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "mb-4",
                        children: [n.jsx("label", {
                            className: "block text-sm font-black mb-2",
                            children: "EMAIL *"
                        }), n.jsx("input", {
                            type: "email",
                            value: v.email,
                            onChange: P => w({...v, email: P.target.value}),
                            className: "w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition",
                            required: !0
                        })]
                    }), n.jsxs("div", {
                        className: "mb-4",
                        children: [n.jsx("label", {
                            className: "block text-sm font-black mb-2",
                            children: "ПАРОЛЬ *"
                        }), n.jsx("input", {
                            type: "password",
                            value: v.password,
                            onChange: P => w({...v, password: P.target.value}),
                            className: "w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition",
                            required: !0
                        }), !o && n.jsx("p", {
                            className: "text-xs text-gray-500 mt-1",
                            children: "Пароль: минимум 8 символов, заглавная и строчная буква, цифра"
                        })]
                    }), !o && n.jsxs("div", {
                        className: "mb-6",
                        children: [n.jsx("label", {
                            className: "block text-sm font-black mb-2",
                            children: "ПОДТВЕРДИТЕ ПАРОЛЬ *"
                        }), n.jsx("input", {
                            type: "password",
                            value: v.confirmPassword,
                            onChange: P => w({...v, confirmPassword: P.target.value}),
                            className: "w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition",
                            required: !0
                        })]
                    }), n.jsx("button", {
                        type: "submit",
                        disabled: a,
                        className: "w-full bg-black text-white py-3 font-black tracking-wider hover:bg-gray-800 transition disabled:opacity-50",
                        children: a ? "ЗАГРУЗКА..." : o ? "ВОЙТИ" : "ЗАРЕГИСТРИРОВАТЬСЯ"
                    })]
                }), n.jsx("div", {
                    className: "text-center mt-6",
                    children: n.jsx("button", {
                        onClick: () => c(!o),
                        className: "text-sm text-gray-500 hover:text-black transition",
                        children: o ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"
                    })
                })]
            })
        })
    })
}, sw = () => {
    const [e, t] = j.useState({name: "", email: "", message: ""}), r = s => {
        s.preventDefault(), alert("Сообщение отправлено! Мы ответим в ближайшее время."), t({
            name: "",
            email: "",
            message: ""
        })
    };
    return n.jsx("div", {
        className: "min-h-screen bg-white", children: n.jsx("div", {
            className: "container mx-auto px-6 py-12", children: n.jsxs("div", {
                className: "max-w-4xl mx-auto",
                children: [n.jsxs("h1", {
                    className: "text-3xl font-light mb-4 text-center",
                    children: ["Служба ", n.jsx("span", {className: "font-bold", children: "поддержки"})]
                }), n.jsx("p", {
                    className: "text-gray-500 text-center mb-12",
                    children: "Мы здесь, чтобы помочь вам с любыми вопросами"
                }), n.jsxs("div", {
                    className: "grid md:grid-cols-2 gap-12",
                    children: [n.jsxs("div", {
                        className: "space-y-6",
                        children: [n.jsxs("div", {
                            className: "bg-gray-50 p-6 rounded-2xl",
                            children: [n.jsx("i", {className: "fas fa-envelope text-3xl mb-3"}), n.jsx("h3", {
                                className: "font-semibold mb-2",
                                children: "Email"
                            }), n.jsx("p", {className: "text-gray-500", children: "support@misat.com"})]
                        }), n.jsxs("div", {
                            className: "bg-gray-50 p-6 rounded-2xl",
                            children: [n.jsx("i", {className: "fas fa-phone text-3xl mb-3"}), n.jsx("h3", {
                                className: "font-semibold mb-2",
                                children: "Телефон"
                            }), n.jsx("p", {
                                className: "text-gray-500",
                                children: "+7 (800) 123-45-67"
                            }), n.jsx("p", {className: "text-sm text-gray-400", children: "Пн-Пт: 10:00 - 20:00"})]
                        }), n.jsxs("div", {
                            className: "bg-gray-50 p-6 rounded-2xl",
                            children: [n.jsx("i", {className: "fab fa-telegram text-3xl mb-3"}), n.jsx("h3", {
                                className: "font-semibold mb-2",
                                children: "Telegram"
                            }), n.jsx("p", {className: "text-gray-500", children: "@misat_support"})]
                        })]
                    }), n.jsxs("form", {
                        onSubmit: r,
                        className: "space-y-4",
                        children: [n.jsx("input", {
                            type: "text",
                            placeholder: "Ваше имя",
                            value: e.name,
                            onChange: s => t({...e, name: s.target.value}),
                            className: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black",
                            required: !0
                        }), n.jsx("input", {
                            type: "email",
                            placeholder: "Email",
                            value: e.email,
                            onChange: s => t({...e, email: s.target.value}),
                            className: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black",
                            required: !0
                        }), n.jsx("textarea", {
                            placeholder: "Сообщение",
                            value: e.message,
                            onChange: s => t({...e, message: s.target.value}),
                            className: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black resize-none",
                            rows: 5,
                            required: !0
                        }), n.jsx("button", {
                            type: "submit",
                            className: "w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition",
                            children: "Отправить сообщение"
                        })]
                    })]
                })]
            })
        })
    })
}, aw = () => {
    const e = Qt(), t = Ws(),
        r = Vr(P => P.cart.items), {user: s} = Vr(P => P.auth), [a, l] = j.useState(!1), [i, o] = j.useState(""), [c, u] = j.useState(null), [f, m] = j.useState(0), [y, b] = j.useState(!1), [p, d] = j.useState(0), [x, h] = j.useState({
            lastName: "",
            firstName: "",
            middleName: "",
            phone: "",
            email: (s == null ? void 0 : s.email) || "",
            city: "",
            deliveryAddress: "",
            deliveryPoint: "",
            comment: ""
        });
    j.useEffect(() => {
        s && d(s.balance || 0)
    }, [s]);
    const g = r.reduce((P, W) => P + W.price * W.quantity, 0), v = P => {
            let W = !1, H = !1, te = 0;
            return P.forEach(A => {
                A.stockType === "in_stock" && (W = !0), A.stockType === "preorder" && (H = !0, te = A.preorderDays || 30)
            }), W && H ? {price: 800, text: "Смешанная доставка (РФ + Китай)", days: "разные сроки"} : H ? {
                price: 500,
                text: "Доставка из Китая",
                days: `~${te} дней`
            } : {price: 300, text: "Доставка по РФ", days: "2-5 дней"}
        }, w = P => {
            let W = 0;
            return P.forEach(H => {
                const te = H.price * H.quantity, A = H.prepaymentPercent || (H.stockType === "preorder" ? 100 : 70);
                W += te * A / 100
            }), W
        }, N = v(r), k = N.price, E = g + k - f, R = w(r), z = y ? Math.min(p, E) : 0, $ = E - z, L = Math.max(0, R - z),
        G = () => {
            if (!i.trim()) {
                _.error("Введите промокод");
                return
            }
            const W = JSON.parse(localStorage.getItem("misat_promocodes") || "[]").find(te => te.code === i.toUpperCase() && te.isActive);
            if (!W) {
                _.error("Промокод не найден");
                return
            }
            if (W.expiresAt && new Date(W.expiresAt) < new Date) {
                _.error("Срок действия промокода истёк");
                return
            }
            if (g < W.minAmount) {
                _.error(`Минимальная сумма заказа: ${W.minAmount.toLocaleString()} ₽`);
                return
            }
            if (W.usageLimit > 0 && W.usedCount >= W.usageLimit) {
                _.error("Лимит использований промокода исчерпан");
                return
            }
            let H = W.type === "percentage" ? g * W.discount / 100 : W.discount;
            W.maxDiscount && H > W.maxDiscount && (H = W.maxDiscount), u(W), m(H), _.success(`Промокод применён! Скидка: ${H.toLocaleString()} ₽`)
        }, X = P => {
            if (P.preventDefault(), !x.lastName) {
                _.error("Введите фамилию");
                return
            }
            if (!x.firstName) {
                _.error("Введите имя");
                return
            }
            if (!x.phone) {
                _.error("Введите телефон");
                return
            }
            if (!x.city) {
                _.error("Введите город");
                return
            }
            if (!x.deliveryPoint) {
                _.error("Введите адрес ПВЗ СДЭК");
                return
            }
            l(!0), setTimeout(() => {
                const W = at();
                if (W) {
                    if (c) {
                        const U = JSON.parse(localStorage.getItem("misat_promocodes") || "[]").map(S => S.id === c.id ? {
                            ...S,
                            usedCount: S.usedCount + 1
                        } : S);
                        localStorage.setItem("misat_promocodes", JSON.stringify(U))
                    }
                    z > 0 && av(W.id, z);
                    const H = `Город: ${x.city}, ПВЗ СДЭК: ${x.deliveryPoint}, Адрес: ${x.deliveryAddress || "Не указан"}`,
                        te = `${x.lastName} ${x.firstName} ${x.middleName}`.trim();
                    cv(W.id, r.map(A => ({...A, userId: W.id})), E, L, Math.max(0, $ - L), H, x.phone, `ФИО: ${te}
Email: ${x.email}
Скидка: ${f} ₽
Промокод: ${(c == null ? void 0 : c.code) || "Нет"}
Тип доставки: ${N.text}
Списано с баланса: ${z} ₽
${x.comment ? `Комментарий: ${x.comment}` : ""}`), t(au()), _.success(`Заказ успешно оформлен! ${z > 0 ? `С баланса списано ${z.toLocaleString()} ₽. ` : ""}${L > 0 ? `Сумма предоплаты: ${L.toLocaleString()} ₽` : "Заказ полностью оплачен!"}`), e("/orders")
                }
                l(!1)
            }, 1e3)
        };
    return r.length === 0 ? (e("/cart"), null) : n.jsx("div", {
        className: "min-h-screen bg-gray-50 pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-8",
            children: [n.jsx("h1", {
                className: "text-3xl md:text-4xl font-black tracking-tighter mb-8",
                children: "ОФОРМЛЕНИЕ ЗАКАЗА"
            }), n.jsxs("div", {
                className: "flex flex-col lg:flex-row gap-8", children: [n.jsxs("form", {
                    onSubmit: X, className: "flex-1 space-y-6", children: [n.jsxs("div", {
                        className: "bg-white rounded-2xl p-6 shadow-sm",
                        children: [n.jsxs("h2", {
                            className: "text-xl font-black mb-4",
                            children: [n.jsx("i", {className: "fas fa-user mr-2"}), " КТО ПОЛУЧАЕТ"]
                        }), n.jsxs("div", {
                            className: "grid md:grid-cols-3 gap-4",
                            children: [n.jsxs("div", {
                                children: [n.jsx("label", {
                                    className: "block text-sm font-bold mb-1",
                                    children: "Фамилия *"
                                }), n.jsx("input", {
                                    type: "text",
                                    value: x.lastName,
                                    onChange: P => h({...x, lastName: P.target.value}),
                                    className: "w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black",
                                    required: !0
                                })]
                            }), n.jsxs("div", {
                                children: [n.jsx("label", {
                                    className: "block text-sm font-bold mb-1",
                                    children: "Имя *"
                                }), n.jsx("input", {
                                    type: "text",
                                    value: x.firstName,
                                    onChange: P => h({...x, firstName: P.target.value}),
                                    className: "w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black",
                                    required: !0
                                })]
                            }), n.jsxs("div", {
                                children: [n.jsx("label", {
                                    className: "block text-sm font-bold mb-1",
                                    children: "Отчество"
                                }), n.jsx("input", {
                                    type: "text",
                                    value: x.middleName,
                                    onChange: P => h({...x, middleName: P.target.value}),
                                    className: "w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black"
                                })]
                            })]
                        }), n.jsxs("div", {
                            className: "grid md:grid-cols-2 gap-4 mt-4",
                            children: [n.jsxs("div", {
                                children: [n.jsx("label", {
                                    className: "block text-sm font-bold mb-1",
                                    children: "Телефон *"
                                }), n.jsx("input", {
                                    type: "tel",
                                    value: x.phone,
                                    onChange: P => h({...x, phone: P.target.value}),
                                    placeholder: "+7 (___) ___-__-__",
                                    className: "w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black",
                                    required: !0
                                })]
                            }), n.jsxs("div", {
                                children: [n.jsx("label", {
                                    className: "block text-sm font-bold mb-1",
                                    children: "Email"
                                }), n.jsx("input", {
                                    type: "email",
                                    value: x.email,
                                    readOnly: !0,
                                    className: "w-full px-4 py-2 border-2 border-gray-200 rounded-xl bg-gray-50"
                                })]
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "bg-white rounded-2xl p-6 shadow-sm",
                        children: [n.jsxs("h2", {
                            className: "text-xl font-black mb-4",
                            children: [n.jsx("i", {className: "fas fa-map-marker-alt mr-2"}), " ГДЕ ПОЛУЧИТЬ"]
                        }), n.jsxs("div", {
                            className: "mb-4",
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-1",
                                children: "Город *"
                            }), n.jsx("input", {
                                type: "text",
                                value: x.city,
                                onChange: P => h({...x, city: P.target.value}),
                                placeholder: "Например: Москва",
                                className: "w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black",
                                required: !0
                            })]
                        }), n.jsxs("div", {
                            className: "mb-4",
                            children: [n.jsxs("label", {
                                className: "block text-sm font-bold mb-1",
                                children: ["Адрес ПВЗ СДЭК *", n.jsx("span", {
                                    className: "text-xs text-gray-500 ml-2",
                                    children: "(можно найти на сайте cdek.ru)"
                                })]
                            }), n.jsx("input", {
                                type: "text",
                                value: x.deliveryPoint,
                                onChange: P => h({...x, deliveryPoint: P.target.value}),
                                placeholder: "г. Москва, ул. Тверская, д. 25, ПВЗ №123",
                                className: "w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black",
                                required: !0
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-1",
                                children: "Детали адреса (дом, квартира, офис)"
                            }), n.jsx("input", {
                                type: "text",
                                value: x.deliveryAddress,
                                onChange: P => h({...x, deliveryAddress: P.target.value}),
                                placeholder: "Квартира/офис/домофон",
                                className: "w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black"
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "bg-white rounded-2xl p-6 shadow-sm",
                        children: [n.jsxs("h2", {
                            className: "text-xl font-black mb-4",
                            children: [n.jsx("i", {className: "fas fa-comment mr-2"}), " КОММЕНТАРИЙ"]
                        }), n.jsx("textarea", {
                            value: x.comment,
                            onChange: P => h({...x, comment: P.target.value}),
                            rows: 3,
                            placeholder: "Дополнительная информация к заказу...",
                            className: "w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black resize-none"
                        })]
                    }), n.jsxs("div", {
                        className: "bg-white rounded-2xl p-6 shadow-sm",
                        children: [n.jsxs("h2", {
                            className: "text-xl font-black mb-4",
                            children: [n.jsx("i", {className: "fas fa-credit-card mr-2"}), " ОПЛАТА"]
                        }), p > 0 && n.jsxs("div", {
                            className: "mb-4 p-3 bg-green-50 rounded-xl border border-green-200",
                            children: [n.jsxs("label", {
                                className: "flex items-center justify-between cursor-pointer",
                                children: [n.jsxs("div", {
                                    children: [n.jsx("p", {
                                        className: "font-bold text-green-700",
                                        children: "Использовать баланс"
                                    }), n.jsxs("p", {
                                        className: "text-sm text-gray-600",
                                        children: ["Доступно: ", p.toLocaleString(), " ₽"]
                                    })]
                                }), n.jsx("input", {
                                    type: "checkbox",
                                    checked: y,
                                    onChange: P => b(P.target.checked),
                                    className: "w-5 h-5 accent-green-600"
                                })]
                            }), y && p >= E && n.jsx("p", {
                                className: "text-sm text-green-600 mt-2",
                                children: "✓ Заказ будет полностью оплачен с баланса"
                            })]
                        }), y && p < E && n.jsx("div", {
                            className: "mb-4 p-3 bg-orange-50 rounded-xl",
                            children: n.jsxs("p", {
                                className: "text-sm",
                                children: ["К оплате после списания баланса: ", n.jsxs("strong", {children: [$.toLocaleString(), " ₽"]})]
                            })
                        }), n.jsxs("div", {
                            className: "bg-orange-50 p-3 rounded-xl border border-orange-200 mb-4",
                            children: [n.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [n.jsx("i", {className: "fas fa-info-circle text-orange-600"}), n.jsx("span", {
                                    className: "font-bold text-sm",
                                    children: "Правила предоплаты:"
                                })]
                            }), n.jsx("p", {
                                className: "text-xs text-gray-600 mt-1",
                                children: "• При отказе от заказа предоплата не возвращается"
                            })]
                        }), n.jsxs("div", {
                            className: "space-y-3",
                            children: [n.jsx("div", {
                                className: "border rounded-xl p-3",
                                children: n.jsxs("label", {
                                    className: "flex items-center gap-3",
                                    children: [n.jsx("input", {
                                        type: "radio",
                                        name: "paymentMethod",
                                        value: "card",
                                        defaultChecked: !0,
                                        className: "w-4 h-4"
                                    }), n.jsxs("div", {
                                        children: [n.jsx("p", {
                                            className: "font-bold text-sm",
                                            children: "Банковская карта"
                                        }), n.jsx("p", {
                                            className: "text-xs text-gray-500",
                                            children: "Visa, Mastercard, МИР"
                                        })]
                                    })]
                                })
                            }), n.jsx("div", {
                                className: "border rounded-xl p-3",
                                children: n.jsxs("label", {
                                    className: "flex items-center gap-3",
                                    children: [n.jsx("input", {
                                        type: "radio",
                                        name: "paymentMethod",
                                        value: "sbp",
                                        className: "w-4 h-4"
                                    }), n.jsxs("div", {
                                        children: [n.jsx("p", {
                                            className: "font-bold text-sm",
                                            children: "СБП (Система быстрых платежей)"
                                        }), n.jsx("p", {
                                            className: "text-xs text-gray-500",
                                            children: "Оплата по QR-коду"
                                        })]
                                    })]
                                })
                            })]
                        }), n.jsxs("div", {
                            className: "mt-4 p-3 bg-gray-50 rounded-xl",
                            children: [n.jsxs("div", {
                                className: "flex justify-between mb-1",
                                children: [n.jsx("span", {
                                    className: "text-sm",
                                    children: "Сумма предоплаты:"
                                }), n.jsxs("span", {
                                    className: "font-bold text-orange-600",
                                    children: [L.toLocaleString(), " ₽"]
                                })]
                            }), $ - L > 0 && n.jsxs("div", {
                                className: "flex justify-between text-sm",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "К оплате при получении:"
                                }), n.jsxs("span", {children: [($ - L).toLocaleString(), " ₽"]})]
                            })]
                        })]
                    }), n.jsx("button", {
                        type: "submit",
                        disabled: a,
                        className: "w-full bg-black text-white py-4 rounded-xl font-black tracking-wider hover:bg-gray-800 transition disabled:opacity-50",
                        children: a ? "ОФОРМЛЕНИЕ..." : `ОПЛАТИТЬ ${L.toLocaleString()} ₽`
                    })]
                }), n.jsx("div", {
                    className: "lg:w-96", children: n.jsxs("div", {
                        className: "bg-white rounded-2xl p-6 shadow-sm sticky top-24",
                        children: [n.jsx("h3", {
                            className: "text-xl font-black mb-4",
                            children: "ВАШ ЗАКАЗ"
                        }), n.jsx("div", {
                            className: "space-y-2 max-h-64 overflow-y-auto mb-4",
                            children: r.map(P => n.jsxs("div", {
                                className: "flex justify-between text-sm border-b pb-2",
                                children: [n.jsxs("div", {
                                    children: [n.jsx("span", {
                                        className: "font-medium",
                                        children: P.name
                                    }), n.jsxs("span", {
                                        className: "text-gray-500 ml-2",
                                        children: ["x", P.quantity]
                                    }), n.jsxs("div", {
                                        className: "text-xs text-gray-400",
                                        children: ["Размер: ", P.size]
                                    }), n.jsx("div", {
                                        className: "text-xs text-gray-400",
                                        children: P.stockType === "in_stock" ? "✅ В наличии (РФ)" : `📦 Предзаказ ~${P.preorderDays || 30} дней`
                                    })]
                                }), n.jsxs("span", {
                                    className: "font-bold",
                                    children: [(P.price * P.quantity).toLocaleString(), " ₽"]
                                })]
                            }, P.id))
                        }), n.jsxs("div", {
                            className: "mb-4",
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-1",
                                children: "ПРОМОКОД"
                            }), n.jsxs("div", {
                                className: "flex gap-2",
                                children: [n.jsx("input", {
                                    type: "text",
                                    value: i,
                                    onChange: P => o(P.target.value.toUpperCase()),
                                    placeholder: "Введите код",
                                    className: "flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm uppercase"
                                }), n.jsx("button", {
                                    type: "button",
                                    onClick: G,
                                    className: "bg-black text-white px-4 py-2 rounded-xl text-sm font-black",
                                    children: "ПРИМЕНИТЬ"
                                })]
                            }), c && n.jsxs("p", {
                                className: "text-xs text-green-600 mt-1",
                                children: ["Промокод ", c.code, " применён!"]
                            })]
                        }), n.jsxs("div", {
                            className: "border-t-2 border-black pt-3 space-y-2",
                            children: [n.jsxs("div", {
                                className: "flex justify-between",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "Товары"
                                }), n.jsxs("span", {children: [g.toLocaleString(), " ₽"]})]
                            }), n.jsxs("div", {
                                className: "flex justify-between",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "Доставка"
                                }), n.jsx("span", {children: k === 0 ? "Бесплатно" : `${k.toLocaleString()} ₽`})]
                            }), n.jsxs("div", {
                                className: "flex justify-between",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "Тип доставки"
                                }), n.jsx("span", {className: "text-sm", children: N.text})]
                            }), N.days && N.days !== "разные сроки" && n.jsxs("div", {
                                className: "flex justify-between",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "Срок доставки"
                                }), n.jsx("span", {className: "text-sm", children: N.days})]
                            }), f > 0 && n.jsxs("div", {
                                className: "flex justify-between",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "Скидка"
                                }), n.jsxs("span", {
                                    className: "text-green-600",
                                    children: ["-", f.toLocaleString(), " ₽"]
                                })]
                            }), n.jsxs("div", {
                                className: "flex justify-between font-black text-lg pt-2 border-t-2 border-black",
                                children: [n.jsx("span", {children: "Итого:"}), n.jsxs("span", {children: [E.toLocaleString(), " ₽"]})]
                            }), y && z > 0 && n.jsxs("div", {
                                className: "flex justify-between",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "Оплачено с баланса:"
                                }), n.jsxs("span", {
                                    className: "text-green-600",
                                    children: ["-", z.toLocaleString(), " ₽"]
                                })]
                            }), n.jsxs("div", {
                                className: "flex justify-between",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "Предоплата:"
                                }), n.jsxs("span", {
                                    className: "font-bold text-orange-600",
                                    children: [L.toLocaleString(), " ₽"]
                                })]
                            }), $ - L > 0 && n.jsxs("div", {
                                className: "flex justify-between text-sm",
                                children: [n.jsx("span", {
                                    className: "text-gray-500",
                                    children: "К оплате при получении:"
                                }), n.jsxs("span", {children: [($ - L).toLocaleString(), " ₽"]})]
                            })]
                        }), n.jsx("p", {
                            className: "text-xs text-orange-600 text-center mt-4",
                            children: "⚠️ При отказе от заказа предоплата не возвращается"
                        })]
                    })
                })]
            })]
        })
    })
}, lw = () => {
    const {isAuthenticated: e} = Ze(l => l.auth), [t, r] = j.useState([]);
    j.useEffect(() => {
        if (e) {
            const l = at();
            if (l) {
                const i = sh(l.id);
                r(i)
            }
        }
    }, [e]);
    const s = l => ({
        pending: "Ожидает",
        processing: "В обработке",
        shipped: "Отправлен",
        delivered: "Доставлен",
        cancelled: "Отменён"
    })[l] || l, a = l => ({
        pending: "bg-yellow-100 text-yellow-700",
        processing: "bg-blue-100 text-blue-700",
        shipped: "bg-purple-100 text-purple-700",
        delivered: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700"
    })[l] || "bg-gray-100 text-gray-700";
    return e ? t.length === 0 ? n.jsx("div", {
        className: "min-h-screen bg-white pt-20",
        children: n.jsxs("div", {
            className: "container mx-auto px-4 py-20 text-center",
            children: [n.jsx("i", {className: "fas fa-box-open text-6xl text-gray-300 mb-4"}), n.jsx("h2", {
                className: "text-2xl font-black mb-4",
                children: "У ВАС ПОКА НЕТ ЗАКАЗОВ"
            }), n.jsx("p", {
                className: "text-gray-500 mb-8",
                children: "Перейдите в каталог, чтобы сделать первый заказ"
            }), n.jsx(D, {
                to: "/catalog",
                className: "inline-block bg-black text-white px-8 py-3 font-black tracking-wider hover:bg-gray-800 transition",
                children: "ПЕРЕЙТИ В КАТАЛОГ"
            })]
        })
    }) : n.jsx("div", {
        className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-8",
            children: [n.jsx("h1", {
                className: "text-3xl md:text-4xl font-black tracking-tighter mb-8",
                children: "МОИ ЗАКАЗЫ"
            }), n.jsx("div", {
                className: "space-y-4", children: t.map(l => n.jsxs("div", {
                    className: "border-2 border-black overflow-hidden",
                    children: [n.jsxs("div", {
                        className: "bg-gray-50 p-4 flex flex-wrap justify-between items-center border-b-2 border-black",
                        children: [n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-xs text-gray-500",
                                children: "ЗАКАЗ №"
                            }), n.jsx("p", {className: "font-black", children: l.id})]
                        }), n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-xs text-gray-500",
                                children: "ДАТА"
                            }), n.jsx("p", {
                                className: "text-sm",
                                children: new Date(l.created_at).toLocaleDateString()
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-xs text-gray-500",
                                children: "СУММА"
                            }), n.jsxs("p", {className: "font-black", children: [l.total.toLocaleString(), " ₽"]})]
                        }), n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-xs text-gray-500",
                                children: "СТАТУС"
                            }), n.jsx("span", {
                                className: `inline-block px-3 py-1 rounded-full text-xs font-black ${a(l.status)}`,
                                children: s(l.status)
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "p-4",
                        children: [n.jsx("p", {
                            className: "text-sm font-black mb-2",
                            children: "ТОВАРЫ:"
                        }), n.jsx("div", {
                            className: "space-y-1 mb-3",
                            children: l.items.map((i, o) => n.jsxs("div", {
                                className: "flex justify-between text-sm",
                                children: [n.jsxs("span", {children: [i.name, " x", i.quantity, " (Размер: ", i.size, ")"]}), n.jsxs("span", {
                                    className: "font-black",
                                    children: [(i.price * i.quantity).toLocaleString(), " ₽"]
                                })]
                            }, o))
                        }), n.jsxs("div", {
                            className: "border-t border-gray-200 pt-2",
                            children: [n.jsxs("p", {
                                className: "text-sm",
                                children: [n.jsx("span", {className: "font-black", children: "Адрес:"}), " ", l.address]
                            }), l.comment && n.jsxs("p", {
                                className: "text-sm mt-1",
                                children: [n.jsx("span", {
                                    className: "font-black",
                                    children: "Комментарий:"
                                }), " ", l.comment]
                            })]
                        })]
                    })]
                }, l.id))
            })]
        })
    }) : n.jsx("div", {
        className: "min-h-screen bg-white pt-20",
        children: n.jsxs("div", {
            className: "container mx-auto px-4 py-20 text-center",
            children: [n.jsx("i", {className: "fas fa-lock text-6xl text-gray-300 mb-4"}), n.jsx("h2", {
                className: "text-2xl font-black mb-4",
                children: "ТРЕБУЕТСЯ АВТОРИЗАЦИЯ"
            }), n.jsx("p", {
                className: "text-gray-500 mb-8",
                children: "Войдите в аккаунт, чтобы просмотреть заказы"
            }), n.jsx(D, {
                to: "/profile",
                className: "inline-block bg-black text-white px-8 py-3 font-black tracking-wider hover:bg-gray-800 transition",
                children: "ВОЙТИ"
            })]
        })
    })
}, iw = () => {
    var w;
    const e = Qt(), t = Jr(), {
            isAuthenticated: r,
            user: s
        } = Ze(N => N.auth), [a, l] = j.useState(1e3), [i, o] = j.useState("card"), [c, u] = j.useState(!1), [f, m] = j.useState(""), [y, b] = j.useState(""), [p, d] = j.useState(""),
        x = [500, 1e3, 2e3, 3e3, 5e3, 1e4];
    if (!r || !s) return n.jsx("div", {
        className: "min-h-screen bg-white pt-20",
        children: n.jsxs("div", {
            className: "container mx-auto px-4 py-20 text-center",
            children: [n.jsx("i", {className: "fas fa-lock text-6xl text-gray-300 mb-4"}), n.jsx("h2", {
                className: "text-2xl font-black mb-4",
                children: "ТРЕБУЕТСЯ АВТОРИЗАЦИЯ"
            }), n.jsx("p", {
                className: "text-gray-500 mb-8",
                children: "Войдите в аккаунт, чтобы пополнить баланс"
            }), n.jsx(D, {
                to: "/profile",
                className: "inline-block bg-black text-white px-8 py-3 font-black tracking-wider hover:bg-gray-800 transition",
                children: "ВОЙТИ"
            })]
        })
    });
    const h = async () => {
        if (a < 100) {
            _.error("Минимальная сумма пополнения 100 ₽");
            return
        }
        u(!0), setTimeout(() => {
            rh(s.id, a) ? (t(Gb(s.balance + a)), _.success(`Баланс пополнен на ${a.toLocaleString()} ₽!`), window.dispatchEvent(new Event("balanceUpdated")), setTimeout(() => e("/profile"), 1500)) : _.error("Ошибка пополнения баланса"), u(!1)
        }, 1500)
    }, g = N => {
        const E = N.replace(/\s+/g, "").replace(/[^0-9]/gi, "").match(/\d{4,16}/g), R = E && E[0] || "", z = [];
        for (let $ = 0; $ < R.length; $ += 4) z.push(R.substring($, $ + 4));
        return z.length ? z.join(" ") : N
    }, v = N => {
        const k = N.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        return k.length >= 2 ? k.substring(0, 2) + (k.length > 2 ? "/" + k.substring(2, 4) : "") : k
    };
    return n.jsx("div", {
        className: "min-h-screen bg-gray-50 pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-8",
            children: [n.jsxs("div", {
                className: "flex items-center gap-2 text-sm text-gray-500 mb-6",
                children: [n.jsx(D, {
                    to: "/",
                    className: "hover:text-black",
                    children: "Главная"
                }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx(D, {
                    to: "/profile",
                    className: "hover:text-black",
                    children: "Профиль"
                }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                    className: "text-black",
                    children: "Пополнение баланса"
                })]
            }), n.jsxs("div", {
                className: "max-w-2xl mx-auto",
                children: [n.jsxs("div", {
                    className: "text-center mb-8",
                    children: [n.jsx("h1", {
                        className: "text-3xl md:text-4xl font-black tracking-tighter",
                        children: "ПОПОЛНЕНИЕ БАЛАНСА"
                    }), n.jsx("div", {className: "w-16 h-0.5 bg-black mx-auto mt-3"}), n.jsxs("p", {
                        className: "text-gray-500 mt-3",
                        children: ["Текущий баланс: ", n.jsxs("span", {
                            className: "font-bold text-green-600",
                            children: [((w = s == null ? void 0 : s.balance) == null ? void 0 : w.toLocaleString()) || 0, " ₽"]
                        })]
                    })]
                }), n.jsxs("div", {
                    className: "bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden",
                    children: [n.jsxs("div", {
                        className: "p-6 border-b",
                        children: [n.jsx("h2", {
                            className: "text-xl font-black mb-4",
                            children: "ВЫБЕРИТЕ СУММУ"
                        }), n.jsx("div", {
                            className: "grid grid-cols-3 gap-3",
                            children: x.map(N => n.jsxs("button", {
                                onClick: () => l(N),
                                className: `py-3 text-center border-2 font-bold rounded-xl transition ${a === N ? "border-black bg-black text-white" : "border-gray-200 hover:border-black"}`,
                                children: [N.toLocaleString(), " ₽"]
                            }, N))
                        }), n.jsxs("div", {
                            className: "mt-4",
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-2",
                                children: "Другая сумма"
                            }), n.jsx("input", {
                                type: "number",
                                placeholder: "Введите сумму",
                                value: a,
                                onChange: N => l(Number(N.target.value)),
                                className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none",
                                min: 100,
                                step: 100
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "p-6 border-b",
                        children: [n.jsx("h2", {
                            className: "text-xl font-black mb-4",
                            children: "СПОСОБ ОПЛАТЫ"
                        }), n.jsxs("div", {
                            className: "space-y-3",
                            children: [n.jsx("div", {
                                onClick: () => o("card"),
                                className: `border-2 rounded-xl p-4 cursor-pointer transition ${i === "card" ? "border-black bg-gray-50" : "border-gray-200"}`,
                                children: n.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [n.jsx("div", {
                                        className: "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                                        children: i === "card" && n.jsx("div", {className: "w-3 h-3 rounded-full bg-black"})
                                    }), n.jsx("i", {className: "fab fa-cc-visa text-2xl text-gray-600"}), n.jsx("i", {className: "fab fa-cc-mastercard text-2xl text-gray-600"}), n.jsx("i", {className: "fab fa-cc-mir text-2xl text-gray-600"}), n.jsx("span", {
                                        className: "font-bold ml-2",
                                        children: "Банковская карта"
                                    })]
                                })
                            }), n.jsx("div", {
                                onClick: () => o("sbp"),
                                className: `border-2 rounded-xl p-4 cursor-pointer transition ${i === "sbp" ? "border-black bg-gray-50" : "border-gray-200"}`,
                                children: n.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [n.jsx("div", {
                                        className: "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                                        children: i === "sbp" && n.jsx("div", {className: "w-3 h-3 rounded-full bg-black"})
                                    }), n.jsx("i", {className: "fas fa-qrcode text-2xl text-gray-600"}), n.jsx("span", {
                                        className: "font-bold",
                                        children: "СБП (Система быстрых платежей)"
                                    })]
                                })
                            })]
                        })]
                    }), i === "card" && n.jsxs("div", {
                        className: "p-6 border-b",
                        children: [n.jsx("h2", {
                            className: "text-xl font-black mb-4",
                            children: "ДАННЫЕ КАРТЫ"
                        }), n.jsxs("div", {
                            className: "space-y-4",
                            children: [n.jsxs("div", {
                                children: [n.jsx("label", {
                                    className: "block text-sm font-bold mb-2",
                                    children: "Номер карты"
                                }), n.jsx("input", {
                                    type: "text",
                                    placeholder: "0000 0000 0000 0000",
                                    value: f,
                                    onChange: N => m(g(N.target.value)),
                                    maxLength: 19,
                                    className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                                })]
                            }), n.jsxs("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [n.jsxs("div", {
                                    children: [n.jsx("label", {
                                        className: "block text-sm font-bold mb-2",
                                        children: "MM/YY"
                                    }), n.jsx("input", {
                                        type: "text",
                                        placeholder: "MM/YY",
                                        value: y,
                                        onChange: N => b(v(N.target.value)),
                                        maxLength: 5,
                                        className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                                    })]
                                }), n.jsxs("div", {
                                    children: [n.jsx("label", {
                                        className: "block text-sm font-bold mb-2",
                                        children: "CVC"
                                    }), n.jsx("input", {
                                        type: "text",
                                        placeholder: "123",
                                        value: p,
                                        onChange: N => d(N.target.value.replace(/[^0-9]/g, "")),
                                        maxLength: 3,
                                        className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                                    })]
                                })]
                            })]
                        })]
                    }), i === "sbp" && n.jsx("div", {
                        className: "p-6 border-b text-center",
                        children: n.jsxs("div", {
                            className: "bg-gray-100 p-8 rounded-xl",
                            children: [n.jsx("i", {className: "fas fa-qrcode text-6xl text-gray-600 mb-3"}), n.jsx("p", {
                                className: "text-gray-500 mb-2",
                                children: "Отсканируйте QR-код в приложении банка"
                            }), n.jsx("div", {
                                className: "w-48 h-48 bg-white mx-auto rounded-xl flex items-center justify-center border-2 border-gray-200",
                                children: n.jsxs("p", {
                                    className: "text-xs text-gray-400 text-center",
                                    children: ["Здесь будет QR-код", n.jsx("br", {}), "для оплаты через СБП"]
                                })
                            })]
                        })
                    }), n.jsxs("div", {
                        className: "p-6 bg-gray-50",
                        children: [n.jsxs("div", {
                            className: "flex justify-between items-center mb-4",
                            children: [n.jsx("span", {
                                className: "text-gray-500",
                                children: "Сумма пополнения:"
                            }), n.jsxs("span", {
                                className: "text-2xl font-black",
                                children: [a.toLocaleString(), " ₽"]
                            })]
                        }), n.jsxs("div", {
                            className: "flex justify-between items-center mb-4",
                            children: [n.jsx("span", {
                                className: "text-gray-500",
                                children: "Комиссия:"
                            }), n.jsx("span", {className: "text-green-600", children: "0 ₽"})]
                        }), n.jsxs("div", {
                            className: "border-t-2 border-black pt-3 flex justify-between items-center",
                            children: [n.jsx("span", {
                                className: "font-black text-lg",
                                children: "Итого к оплате:"
                            }), n.jsxs("span", {
                                className: "text-2xl font-black",
                                children: [a.toLocaleString(), " ₽"]
                            })]
                        }), n.jsx("button", {
                            onClick: h,
                            disabled: c,
                            className: "w-full mt-6 bg-black text-white py-4 rounded-xl font-black tracking-wider hover:bg-gray-800 transition disabled:opacity-50",
                            children: c ? "ОБРАБОТКА..." : `ОПЛАТИТЬ ${a.toLocaleString()} ₽`
                        }), n.jsx("p", {
                            className: "text-xs text-gray-400 text-center mt-4",
                            children: "Платёж защищён. Данные карты не хранятся на нашем сайте."
                        })]
                    })]
                }), n.jsxs("div", {
                    className: "mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200",
                    children: [n.jsxs("div", {
                        className: "flex items-center gap-2 mb-2",
                        children: [n.jsx("i", {className: "fas fa-info-circle text-blue-600"}), n.jsx("p", {
                            className: "font-bold text-blue-700",
                            children: "Информация"
                        })]
                    }), n.jsxs("ul", {
                        className: "text-sm text-gray-600 space-y-1",
                        children: [n.jsx("li", {children: "• Минимальная сумма пополнения — 100 ₽"}), n.jsx("li", {children: "• Средства зачисляются на баланс мгновенно"}), n.jsx("li", {children: "• Балансом можно оплатить до 100% стоимости заказа"}), n.jsx("li", {children: "• При отказе от заказа предоплата не возвращается"})]
                    })]
                })]
            })]
        })
    })
}, ow = () => n.jsx("div", {
    className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
        className: "container mx-auto px-4 py-12",
        children: [n.jsxs("div", {
            className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
            children: [n.jsx(D, {
                to: "/",
                className: "hover:text-black",
                children: "Главная"
            }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                className: "text-black",
                children: "О нас"
            })]
        }), n.jsxs("div", {
            className: "text-center mb-12",
            children: [n.jsx("h1", {
                className: "text-5xl font-black tracking-tighter mb-4",
                children: "О НАС"
            }), n.jsx("div", {className: "w-20 h-0.5 bg-black mx-auto"}), n.jsx("p", {
                className: "text-gray-500 mt-4 max-w-2xl mx-auto",
                children: "MISAT — ваш надёжный партнёр в мире стильной и качественной одежды"
            })]
        }), n.jsx("div", {
            className: "max-w-4xl mx-auto", children: n.jsxs("div", {
                className: "prose max-w-none",
                children: [n.jsx("h2", {
                    className: "text-2xl font-black mb-4",
                    children: "Кто мы"
                }), n.jsx("p", {
                    className: "text-gray-600 mb-6 leading-relaxed",
                    children: "MISAT — это современный интернет-магазин одежды, основанный в 2024 году. Мы объединили минималистичный дизайн, высокое качество и доступные цены."
                }), n.jsx("h2", {
                    className: "text-2xl font-black mb-4 mt-8",
                    children: "Наша миссия"
                }), n.jsx("p", {
                    className: "text-gray-600 mb-6 leading-relaxed",
                    children: "Сделать качественную и стильную одежду доступной для каждого."
                }), n.jsx("h2", {
                    className: "text-2xl font-black mb-4 mt-8",
                    children: "Почему выбирают нас"
                }), n.jsxs("div", {
                    className: "grid md:grid-cols-3 gap-6 mb-8",
                    children: [n.jsxs("div", {
                        className: "bg-gray-50 p-6 rounded-2xl text-center",
                        children: [n.jsx("i", {className: "fas fa-truck-fast text-3xl text-black mb-3"}), n.jsx("h3", {
                            className: "font-bold text-lg mb-2",
                            children: "Быстрая доставка"
                        }), n.jsx("p", {
                            className: "text-gray-500 text-sm",
                            children: "Доставка по всей России от 2 до 5 дней"
                        })]
                    }), n.jsxs("div", {
                        className: "bg-gray-50 p-6 rounded-2xl text-center",
                        children: [n.jsx("i", {className: "fas fa-arrows-spin text-3xl text-black mb-3"}), n.jsx("h3", {
                            className: "font-bold text-lg mb-2",
                            children: "Лёгкий возврат"
                        }), n.jsx("p", {
                            className: "text-gray-500 text-sm",
                            children: "Возврат товара в течение 30 дней"
                        })]
                    }), n.jsxs("div", {
                        className: "bg-gray-50 p-6 rounded-2xl text-center",
                        children: [n.jsx("i", {className: "fas fa-shield-alt text-3xl text-black mb-3"}), n.jsx("h3", {
                            className: "font-bold text-lg mb-2",
                            children: "Гарантия качества"
                        }), n.jsx("p", {className: "text-gray-500 text-sm", children: "Оригинальная продукция"})]
                    })]
                }), n.jsx("h2", {
                    className: "text-2xl font-black mb-4 mt-8",
                    children: "Реквизиты"
                }), n.jsx("div", {
                    className: "bg-gray-50 p-6 rounded-2xl mb-8",
                    children: n.jsxs("div", {
                        className: "space-y-2 text-sm",
                        children: [n.jsx("p", {
                            children: n.jsx("span", {
                                className: "font-bold",
                                children: "ИП MISAT"
                            })
                        }), n.jsx("p", {children: "ИНН: 1234567890"}), n.jsx("p", {children: "ОГРНИП: 323456789012345"})]
                    })
                }), n.jsx("h2", {
                    className: "text-2xl font-black mb-4",
                    children: "Наши соцсети"
                }), n.jsxs("div", {
                    className: "flex gap-4 text-3xl mb-8",
                    children: [n.jsx("a", {
                        href: "https://t.me/misatshop",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "hover:text-gray-500 transition",
                        children: n.jsx("i", {className: "fab fa-telegram"})
                    }), n.jsx("a", {
                        href: "https://vk.ru/mokidorastore",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "hover:text-gray-500 transition",
                        children: n.jsx("i", {className: "fab fa-vk"})
                    }), n.jsx("a", {
                        href: "https://www.tiktok.com/@misatchina",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "hover:text-gray-500 transition",
                        children: n.jsx("i", {className: "fab fa-tiktok"})
                    })]
                })]
            })
        })]
    })
}), cw = () => n.jsx("div", {
    className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
        className: "container mx-auto px-4 py-12",
        children: [n.jsxs("div", {
            className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
            children: [n.jsx(D, {
                to: "/",
                className: "hover:text-black",
                children: "Главная"
            }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                className: "text-black",
                children: "Доставка и оплата"
            })]
        }), n.jsxs("div", {
            className: "text-center mb-12",
            children: [n.jsx("h1", {
                className: "text-5xl font-black tracking-tighter mb-4",
                children: "ДОСТАВКА И ОПЛАТА"
            }), n.jsx("div", {className: "w-20 h-0.5 bg-black mx-auto"})]
        }), n.jsxs("div", {
            className: "max-w-4xl mx-auto",
            children: [n.jsxs("div", {
                className: "bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6",
                children: [n.jsx("p", {
                    className: "font-bold text-blue-700",
                    children: "📍 Отправка из Смоленска"
                }), n.jsx("p", {
                    className: "text-sm text-gray-600 mt-1",
                    children: "Все заказы отправляются из нашего склада в Смоленске"
                })]
            }), n.jsxs("div", {
                className: "grid md:grid-cols-2 gap-6 mb-12",
                children: [n.jsxs("div", {
                    className: "bg-gray-50 p-6 rounded-2xl border-l-4 border-green-500",
                    children: [n.jsx("i", {className: "fas fa-box text-2xl text-green-600 mb-2"}), n.jsx("h3", {
                        className: "font-bold text-lg",
                        children: "В наличии (РФ)"
                    }), n.jsx("p", {
                        className: "text-sm text-gray-500 mt-1",
                        children: "Товары со склада в Смоленске"
                    }), n.jsxs("ul", {
                        className: "mt-3 space-y-1 text-sm",
                        children: [n.jsx("li", {children: "• Доставка по РФ: 2-5 дней"}), n.jsx("li", {children: "• Стоимость: 300 ₽"}), n.jsx("li", {children: "• Бесплатно от 5000 ₽"})]
                    })]
                }), n.jsxs("div", {
                    className: "bg-gray-50 p-6 rounded-2xl border-l-4 border-orange-500",
                    children: [n.jsx("i", {className: "fas fa-ship text-2xl text-orange-600 mb-2"}), n.jsx("h3", {
                        className: "font-bold text-lg",
                        children: "Предзаказ (Китай)"
                    }), n.jsx("p", {
                        className: "text-sm text-gray-500 mt-1",
                        children: "Товары под заказ из Китая"
                    }), n.jsxs("ul", {
                        className: "mt-3 space-y-1 text-sm",
                        children: [n.jsx("li", {children: "• Срок доставки: 20-35 дней"}), n.jsx("li", {children: "• Стоимость: 500 ₽"}), n.jsx("li", {children: "• Трекинг-номер предоставляется"})]
                    })]
                })]
            }), n.jsxs("div", {
                className: "mb-12",
                children: [n.jsxs("h2", {
                    className: "text-2xl font-black mb-4 flex items-center gap-2",
                    children: [n.jsx("i", {className: "fas fa-credit-card"}), " Способы оплаты"]
                }), n.jsxs("div", {
                    className: "grid md:grid-cols-3 gap-4",
                    children: [n.jsxs("div", {
                        className: "bg-gray-50 p-4 rounded-xl text-center",
                        children: [n.jsx("i", {className: "fab fa-cc-visa text-3xl mb-2"}), n.jsx("p", {
                            className: "font-bold text-sm",
                            children: "Банковская карта"
                        }), n.jsx("p", {className: "text-xs text-gray-500", children: "Visa, Mastercard, МИР"})]
                    }), n.jsxs("div", {
                        className: "bg-gray-50 p-4 rounded-xl text-center",
                        children: [n.jsx("i", {className: "fas fa-qrcode text-3xl mb-2"}), n.jsx("p", {
                            className: "font-bold text-sm",
                            children: "СБП"
                        }), n.jsx("p", {className: "text-xs text-gray-500", children: "Система быстрых платежей"})]
                    }), n.jsxs("div", {
                        className: "bg-gray-50 p-4 rounded-xl text-center",
                        children: [n.jsx("i", {className: "fas fa-wallet text-3xl mb-2"}), n.jsx("p", {
                            className: "font-bold text-sm",
                            children: "Наличные"
                        }), n.jsx("p", {className: "text-xs text-gray-500", children: "При получении"})]
                    })]
                })]
            }), n.jsxs("div", {
                className: "bg-orange-50 p-6 rounded-2xl border border-orange-200",
                children: [n.jsxs("h3", {
                    className: "font-bold text-orange-700 mb-2 flex items-center gap-2",
                    children: [n.jsx("i", {className: "fas fa-info-circle"}), "Правила предоплаты"]
                }), n.jsxs("ul", {
                    className: "text-sm text-gray-600 space-y-1",
                    children: [n.jsx("li", {children: "• Предоплата 100% — для товаров под заказ из Китая"}), n.jsx("li", {children: "• Предоплата 70% — для товаров в наличии (30% при получении)"}), n.jsx("li", {children: "• При отказе от заказа предоплата не возвращается"})]
                })]
            })]
        })]
    })
}), uw = () => {
    const [e, t] = j.useState({orderNumber: "", productName: "", reason: "", comment: ""}), r = s => {
        if (s.preventDefault(), !e.orderNumber || !e.reason) {
            _.error("Заполните обязательные поля");
            return
        }
        _.success("Заявка на возврат отправлена! Мы свяжемся с вами."), t({
            orderNumber: "",
            productName: "",
            reason: "",
            comment: ""
        })
    };
    return n.jsx("div", {
        className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-12",
            children: [n.jsxs("div", {
                className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
                children: [n.jsx(D, {
                    to: "/",
                    className: "hover:text-black",
                    children: "Главная"
                }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                    className: "text-black",
                    children: "Возврат товара"
                })]
            }), n.jsxs("div", {
                className: "text-center mb-12",
                children: [n.jsx("h1", {
                    className: "text-5xl font-black tracking-tighter mb-4",
                    children: "ВОЗВРАТ ТОВАРА"
                }), n.jsx("div", {className: "w-20 h-0.5 bg-black mx-auto"})]
            }), n.jsxs("div", {
                className: "max-w-4xl mx-auto",
                children: [n.jsx("div", {
                    className: "bg-green-50 p-4 rounded-xl border border-green-200 mb-8",
                    children: n.jsxs("p", {
                        className: "text-green-700 text-sm",
                        children: [n.jsx("i", {className: "fas fa-check-circle mr-2"}), "Вы можете вернуть товар в течение 30 дней после получения"]
                    })
                }), n.jsxs("div", {
                    className: "grid md:grid-cols-2 gap-8 mb-12",
                    children: [n.jsxs("div", {
                        className: "bg-gray-50 p-6 rounded-2xl",
                        children: [n.jsx("h3", {
                            className: "font-black mb-3",
                            children: "Условия возврата"
                        }), n.jsxs("ul", {
                            className: "space-y-2 text-sm text-gray-600",
                            children: [n.jsxs("li", {
                                className: "flex items-start gap-2",
                                children: [n.jsx("i", {className: "fas fa-check text-green-500 mt-0.5"}), " Товар не был в использовании"]
                            }), n.jsxs("li", {
                                className: "flex items-start gap-2",
                                children: [n.jsx("i", {className: "fas fa-check text-green-500 mt-0.5"}), " Сохранены фабричные ярлыки"]
                            }), n.jsxs("li", {
                                className: "flex items-start gap-2",
                                children: [n.jsx("i", {className: "fas fa-check text-green-500 mt-0.5"}), " Оригинальная упаковка"]
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "bg-gray-50 p-6 rounded-2xl",
                        children: [n.jsx("h3", {
                            className: "font-black mb-3",
                            children: "Возврат не принимается"
                        }), n.jsxs("ul", {
                            className: "space-y-2 text-sm text-gray-600",
                            children: [n.jsxs("li", {
                                className: "flex items-start gap-2",
                                children: [n.jsx("i", {className: "fas fa-times text-red-500 mt-0.5"}), " Нижнее бельё и купальники"]
                            }), n.jsxs("li", {
                                className: "flex items-start gap-2",
                                children: [n.jsx("i", {className: "fas fa-times text-red-500 mt-0.5"}), " Носки и чулочно-носочные изделия"]
                            }), n.jsxs("li", {
                                className: "flex items-start gap-2",
                                children: [n.jsx("i", {className: "fas fa-times text-red-500 mt-0.5"}), " Товары со следами использования"]
                            })]
                        })]
                    })]
                }), n.jsxs("div", {
                    className: "bg-white border-2 border-black p-6 rounded-2xl",
                    children: [n.jsx("h2", {
                        className: "text-xl font-black mb-4",
                        children: "Оформить возврат"
                    }), n.jsxs("form", {
                        onSubmit: r,
                        className: "space-y-4",
                        children: [n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-1",
                                children: "Номер заказа *"
                            }), n.jsx("input", {
                                type: "text",
                                value: e.orderNumber,
                                onChange: s => t({...e, orderNumber: s.target.value}),
                                placeholder: "Например: MISAT-1234567890",
                                className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none",
                                required: !0
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-1",
                                children: "Название товара"
                            }), n.jsx("input", {
                                type: "text",
                                value: e.productName,
                                onChange: s => t({...e, productName: s.target.value}),
                                placeholder: "Например: Худи Oversized",
                                className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-1",
                                children: "Причина возврата *"
                            }), n.jsxs("select", {
                                value: e.reason,
                                onChange: s => t({...e, reason: s.target.value}),
                                className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none",
                                required: !0,
                                children: [n.jsx("option", {
                                    value: "",
                                    children: "Выберите причину"
                                }), n.jsx("option", {
                                    value: "Не подошёл размер",
                                    children: "Не подошёл размер"
                                }), n.jsx("option", {
                                    value: "Не понравился цвет/модель",
                                    children: "Не понравился цвет/модель"
                                }), n.jsx("option", {
                                    value: "Брак/дефект",
                                    children: "Брак/дефект"
                                }), n.jsx("option", {value: "Другое", children: "Другое"})]
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-1",
                                children: "Комментарий"
                            }), n.jsx("textarea", {
                                value: e.comment,
                                onChange: s => t({...e, comment: s.target.value}),
                                rows: 3,
                                className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none resize-none",
                                placeholder: "Опишите подробнее..."
                            })]
                        }), n.jsx("button", {
                            type: "submit",
                            className: "w-full bg-black text-white py-3 rounded-xl font-black hover:bg-gray-800 transition",
                            children: "ОТПРАВИТЬ ЗАЯВКУ"
                        })]
                    })]
                })]
            })]
        })
    })
}, dw = () => {
    const [e, t] = j.useState({name: "", email: "", message: ""}), [r, s] = j.useState(!1), a = async l => {
        if (l.preventDefault(), !e.name || !e.email || !e.message) {
            _.error("Заполните все поля");
            return
        }
        s(!0);
        try {
            const i = await fetch("/api/forms/contact", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(e)
            }), o = await i.json();
            i.ok ? (_.success("Сообщение отправлено! Мы ответим в ближайшее время."), t({
                name: "",
                email: "",
                message: ""
            })) : _.error(o.error || "Ошибка отправки")
        } catch (i) {
            console.error("Error:", i), _.error("Ошибка отправки. Попробуйте позже.")
        } finally {
            s(!1)
        }
    };
    return n.jsx("div", {
        className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-12",
            children: [n.jsxs("div", {
                className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
                children: [n.jsx(D, {
                    to: "/",
                    className: "hover:text-black",
                    children: "Главная"
                }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                    className: "text-black",
                    children: "Контакты"
                })]
            }), n.jsxs("div", {
                className: "text-center mb-12",
                children: [n.jsx("h1", {
                    className: "text-5xl font-black tracking-tighter mb-4",
                    children: "КОНТАКТЫ"
                }), n.jsx("div", {className: "w-20 h-0.5 bg-black mx-auto"}), n.jsx("p", {
                    className: "text-gray-500 mt-4",
                    children: "Мы всегда на связи и готовы помочь"
                })]
            }), n.jsxs("div", {
                className: "grid md:grid-cols-2 gap-12 max-w-5xl mx-auto", children: [n.jsxs("div", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-6",
                        children: "Свяжитесь с нами"
                    }), n.jsxs("div", {
                        className: "space-y-6",
                        children: [n.jsxs("div", {
                            className: "flex items-start gap-4",
                            children: [n.jsx("i", {className: "fas fa-map-marker-alt text-2xl text-gray-600 mt-1"}), n.jsxs("div", {
                                children: [n.jsx("p", {
                                    className: "font-bold",
                                    children: "Адрес"
                                })]
                            })]
                        }), n.jsxs("div", {
                            className: "flex items-start gap-4",
                            children: [n.jsx("i", {className: "fas fa-phone text-2xl text-gray-600 mt-1"}), n.jsxs("div", {
                                children: [n.jsx("p", {
                                    className: "font-bold",
                                    children: "Телефон"
                                }), n.jsx("p", {className: "text-gray-500", children: "+7 (993) 884-37-66"})]
                            })]
                        }), n.jsxs("div", {
                            className: "flex items-start gap-4",
                            children: [n.jsx("i", {className: "fas fa-envelope text-2xl text-gray-600 mt-1"}), n.jsxs("div", {
                                children: [n.jsx("p", {
                                    className: "font-bold",
                                    children: "Email"
                                }), n.jsx("p", {className: "text-gray-500", children: "8888888gorni@gmail.com"})]
                            })]
                        })]
                    })]
                }), n.jsx("div", {
                    children: n.jsxs("form", {
                        onSubmit: a,
                        className: "space-y-4",
                        children: [n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-1",
                                children: "Ваше имя *"
                            }), n.jsx("input", {
                                type: "text",
                                value: e.name,
                                onChange: l => t({...e, name: l.target.value}),
                                className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none",
                                required: !0
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-1",
                                children: "Email *"
                            }), n.jsx("input", {
                                type: "email",
                                value: e.email,
                                onChange: l => t({...e, email: l.target.value}),
                                className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none",
                                required: !0
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-1",
                                children: "Сообщение *"
                            }), n.jsx("textarea", {
                                value: e.message,
                                onChange: l => t({...e, message: l.target.value}),
                                rows: 5,
                                className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none resize-none",
                                required: !0
                            })]
                        }), n.jsx("button", {
                            type: "submit",
                            disabled: r,
                            className: "w-full bg-black text-white py-3 rounded-xl font-black hover:bg-gray-800 transition disabled:opacity-50",
                            children: r ? "ОТПРАВКА..." : "ОТПРАВИТЬ"
                        })]
                    })
                })]
            })]
        })
    })
}, fw = () => {
    const [e, t] = j.useState(null), [r, s] = j.useState({name: "", email: "", question: ""}), a = [{
        q: "Как оформить заказ?",
        a: "Выберите товар в каталоге, добавьте в корзину и перейдите к оформлению."
    }, {
        q: "Сколько дней обрабатывается заказ?",
        a: "Заказ обрабатывается в течение 1-2 рабочих дней."
    }, {
        q: "Как отследить заказ?",
        a: "После отправки вы получите трек-номер для отслеживания."
    }, {q: "Можно ли вернуть товар?", a: "Да, возврат возможен в течение 30 дней."}, {
        q: "Откуда отправляются заказы?",
        a: "Все заказы отправляются из Смоленска."
    }], l = i => {
        if (i.preventDefault(), !r.name || !r.email || !r.question) {
            _.error("Заполните все поля");
            return
        }
        _.success("Ваш вопрос отправлен!"), s({name: "", email: "", question: ""})
    };
    return n.jsx("div", {
        className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-12",
            children: [n.jsxs("div", {
                className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
                children: [n.jsx(D, {
                    to: "/",
                    className: "hover:text-black",
                    children: "Главная"
                }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                    className: "text-black",
                    children: "Вопросы и ответы"
                })]
            }), n.jsxs("div", {
                className: "text-center mb-12",
                children: [n.jsx("h1", {
                    className: "text-5xl font-black tracking-tighter mb-4",
                    children: "FAQ"
                }), n.jsx("div", {className: "w-20 h-0.5 bg-black mx-auto"})]
            }), n.jsxs("div", {
                className: "max-w-3xl mx-auto",
                children: [n.jsx("div", {
                    className: "mb-12 space-y-4",
                    children: a.map((i, o) => n.jsxs("div", {
                        className: "border-2 border-black",
                        children: [n.jsxs("button", {
                            onClick: () => t(e === o ? null : o),
                            className: "w-full flex justify-between items-center p-5 text-left font-black",
                            children: [n.jsx("span", {children: i.q}), n.jsx("i", {className: `fas fa-chevron-${e === o ? "up" : "down"}`})]
                        }), e === o && n.jsx("div", {
                            className: "p-5 border-t-2 border-black bg-gray-50",
                            children: n.jsx("p", {className: "text-gray-600", children: i.a})
                        })]
                    }, o))
                }), n.jsxs("div", {
                    className: "bg-gray-50 p-8 rounded-2xl border-2 border-black",
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-4 text-center",
                        children: "Задать вопрос"
                    }), n.jsxs("form", {
                        onSubmit: l,
                        className: "space-y-4",
                        children: [n.jsx("input", {
                            type: "text",
                            placeholder: "Ваше имя",
                            value: r.name,
                            onChange: i => s({...r, name: i.target.value}),
                            className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl",
                            required: !0
                        }), n.jsx("input", {
                            type: "email",
                            placeholder: "Email",
                            value: r.email,
                            onChange: i => s({...r, email: i.target.value}),
                            className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl",
                            required: !0
                        }), n.jsx("textarea", {
                            placeholder: "Ваш вопрос",
                            value: r.question,
                            onChange: i => s({...r, question: i.target.value}),
                            rows: 4,
                            className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none",
                            required: !0
                        }), n.jsx("button", {
                            type: "submit",
                            className: "w-full bg-black text-white py-3 rounded-xl font-black",
                            children: "ОТПРАВИТЬ"
                        })]
                    })]
                })]
            })]
        })
    })
}, mw = () => {
    const [e] = j.useState([{
        id: 1,
        title: "Новая коллекция осень-зима 2025",
        date: "2025-01-15",
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600",
        excerpt: "Представляем новую коллекцию.",
        category: "Новости"
    }, {
        id: 2,
        title: "Как ухаживать за одеждой",
        date: "2025-01-10",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600",
        excerpt: "Советы по уходу за одеждой.",
        category: "Советы"
    }, {
        id: 3,
        title: "Скидка 20% на первый заказ",
        date: "2025-01-05",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
        excerpt: "Промокод: WELCOME20",
        category: "Акции"
    }]), [t, r] = j.useState(null);
    return n.jsx("div", {
        className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-12",
            children: [n.jsxs("div", {
                className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
                children: [n.jsx(D, {
                    to: "/",
                    className: "hover:text-black",
                    children: "Главная"
                }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                    className: "text-black",
                    children: "Блог"
                })]
            }), n.jsxs("div", {
                className: "text-center mb-12",
                children: [n.jsx("h1", {
                    className: "text-5xl font-black tracking-tighter mb-4",
                    children: "БЛОГ"
                }), n.jsx("div", {className: "w-20 h-0.5 bg-black mx-auto"})]
            }), t ? n.jsxs("div", {
                className: "max-w-3xl mx-auto",
                children: [n.jsx("button", {
                    onClick: () => r(null),
                    className: "flex items-center gap-2 text-gray-500 hover:text-black mb-6",
                    children: "← Назад"
                }), n.jsxs("article", {
                    className: "border-2 border-black p-8",
                    children: [n.jsx("img", {
                        src: t.image,
                        alt: t.title,
                        className: "w-full h-96 object-cover mb-6"
                    }), n.jsx("h1", {
                        className: "text-3xl font-black mb-4",
                        children: t.title
                    }), n.jsx("p", {className: "text-gray-600", children: t.excerpt})]
                })]
            }) : n.jsx("div", {
                className: "grid md:grid-cols-3 gap-8",
                children: e.map(s => n.jsxs("article", {
                    className: "border-2 border-black cursor-pointer",
                    onClick: () => r(s),
                    children: [n.jsx("img", {
                        src: s.image,
                        alt: s.title,
                        className: "w-full h-64 object-cover"
                    }), n.jsxs("div", {
                        className: "p-5",
                        children: [n.jsxs("div", {
                            className: "flex items-center gap-3 text-sm text-gray-500 mb-3",
                            children: [n.jsx("span", {
                                className: "bg-gray-100 px-2 py-1 rounded",
                                children: s.category
                            }), n.jsx("span", {children: s.date})]
                        }), n.jsx("h2", {
                            className: "text-xl font-black mb-3",
                            children: s.title
                        }), n.jsx("p", {className: "text-gray-600", children: s.excerpt})]
                    })]
                }, s.id))
            })]
        })
    })
}, pw = () => {
    const [e, t] = j.useState(""), [r, s] = j.useState(null), [a, l] = j.useState(!1), i = () => {
        if (!e.trim()) {
            _.error("Введите номер заказа");
            return
        }
        l(!0), setTimeout(() => {
            const f = Is().find(m => m.id === e);
            s(f || null), l(!1), f || _.error("Заказ не найден")
        }, 500)
    }, o = u => ({
        pending: "Ожидает обработки",
        processing: "В обработке",
        shipped: "Отправлен",
        delivered: "Доставлен",
        cancelled: "Отменён"
    })[u] || u, c = u => ({
        pending: "bg-yellow-100 text-yellow-700",
        processing: "bg-blue-100 text-blue-700",
        shipped: "bg-purple-100 text-purple-700",
        delivered: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700"
    })[u] || "bg-gray-100 text-gray-700";
    return n.jsx("div", {
        className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-12",
            children: [n.jsxs("div", {
                className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
                children: [n.jsx(D, {
                    to: "/",
                    className: "hover:text-black",
                    children: "Главная"
                }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                    className: "text-black",
                    children: "Отследить заказ"
                })]
            }), n.jsxs("div", {
                className: "text-center mb-12",
                children: [n.jsx("h1", {
                    className: "text-5xl font-black tracking-tighter mb-4",
                    children: "ОТСЛЕДИТЬ ЗАКАЗ"
                }), n.jsx("div", {className: "w-20 h-0.5 bg-black mx-auto"})]
            }), n.jsxs("div", {
                className: "max-w-2xl mx-auto",
                children: [n.jsx("div", {
                    className: "bg-gray-50 p-8 rounded-2xl mb-8",
                    children: n.jsxs("div", {
                        className: "flex gap-3",
                        children: [n.jsx("input", {
                            type: "text",
                            value: e,
                            onChange: u => t(u.target.value),
                            placeholder: "Номер заказа",
                            className: "flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl"
                        }), n.jsx("button", {
                            onClick: i,
                            disabled: a,
                            className: "bg-black text-white px-6 py-3 rounded-xl font-black",
                            children: "ОТСЛЕДИТЬ"
                        })]
                    })
                }), r && n.jsxs("div", {
                    className: "bg-white border-2 border-black p-6 rounded-2xl",
                    children: [n.jsxs("div", {
                        className: "flex justify-between mb-4",
                        children: [n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-sm text-gray-500",
                                children: "Номер заказа"
                            }), n.jsx("p", {className: "font-mono font-black", children: r.id})]
                        }), n.jsxs("div", {
                            children: [n.jsx("p", {
                                className: "text-sm text-gray-500",
                                children: "Сумма"
                            }), n.jsxs("p", {className: "font-black", children: [r.total.toLocaleString(), " ₽"]})]
                        })]
                    }), n.jsx("div", {
                        className: "border-t pt-4",
                        children: n.jsx("span", {
                            className: `inline-block px-4 py-2 rounded-full text-sm font-black ${c(r.status)}`,
                            children: o(r.status)
                        })
                    }), n.jsxs("div", {
                        className: "border-t mt-4 pt-4",
                        children: [n.jsx("p", {
                            className: "text-sm text-gray-500",
                            children: "Адрес доставки"
                        }), n.jsx("p", {children: r.address})]
                    })]
                })]
            })]
        })
    })
}, hw = () => {
    const {
            isAuthenticated: e,
            user: t
        } = Ze(N => N.auth), [r, s] = j.useState(1e3), [a, l] = j.useState(""), [i, o] = j.useState(""), [c, u] = j.useState(""), [f, m] = j.useState(""), [y, b] = j.useState("buy"), [p, d] = j.useState([]), [x, h] = j.useState(!1),
        g = [500, 1e3, 2e3, 3e3, 5e3, 1e4];
    j.useEffect(() => {
        if (e && t) {
            const k = JSON.parse(localStorage.getItem("misat_gift_cards") || "[]").filter(E => E.createdBy === t.email);
            d(k)
        }
    }, [e, t]);
    const v = async () => {
        var R;
        if (!e || !t) {
            _.error("Войдите в аккаунт для покупки сертификата");
            return
        }
        if (!a) {
            _.error("Введите email получателя");
            return
        }
        h(!0);
        const N = "GIFT-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
            k = JSON.parse(localStorage.getItem("misat_gift_cards") || "[]"), E = {
                code: N,
                amount: r,
                recipientEmail: a,
                recipientName: i,
                message: c,
                isUsed: !1,
                createdBy: t == null ? void 0 : t.email,
                createdAt: new Date().toISOString()
            };
        k.push(E), localStorage.setItem("misat_gift_cards", JSON.stringify(k));
        try {
            (await fetch("/api/forms/send-gift-card", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    recipientEmail: a,
                    recipientName: i,
                    code: N,
                    amount: r,
                    message: c,
                    senderName: (t == null ? void 0 : t.first_name) || ((R = t == null ? void 0 : t.email) == null ? void 0 : R.split("@")[0])
                })
            })).ok ? _.success(`Сертификат на ${r} ₽ отправлен на почту ${a}!`) : _.error(`Сертификат создан, но письмо не отправлено. Код: ${N}`)
        } catch {
            _.error(`Сертификат создан! Код: ${N}`)
        }
        l(""), o(""), u(""), d(k.filter(z => z.createdBy === (t == null ? void 0 : t.email))), h(!1)
    }, w = () => {
        if (!f) {
            _.error("Введите код сертификата");
            return
        }
        if (!e || !t) {
            _.error("Войдите в аккаунт для активации");
            return
        }
        const N = JSON.parse(localStorage.getItem("misat_gift_cards") || "[]"),
            k = N.find(R => R.code === f && !R.isUsed);
        if (!k) {
            _.error("Неверный или уже использованный код");
            return
        }
        rh(t.id, k.amount) ? (_.success(`Сертификат активирован! ${k.amount} ₽ зачислены на баланс!`), k.isUsed = !0, k.activatedBy = t.email, k.activatedAt = new Date().toISOString(), localStorage.setItem("misat_gift_cards", JSON.stringify(N)), m(""), window.dispatchEvent(new Event("balanceUpdated"))) : _.error("Ошибка активации")
    };
    return n.jsx("div", {
        className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
            className: "container mx-auto px-4 py-12",
            children: [n.jsxs("div", {
                className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
                children: [n.jsx(D, {
                    to: "/",
                    className: "hover:text-black",
                    children: "Главная"
                }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                    className: "text-black",
                    children: "Подарочные сертификаты"
                })]
            }), n.jsxs("div", {
                className: "text-center mb-12",
                children: [n.jsx("h1", {
                    className: "text-5xl font-black tracking-tighter mb-4",
                    children: "ПОДАРОЧНЫЕ СЕРТИФИКАТЫ"
                }), n.jsx("div", {className: "w-20 h-0.5 bg-black mx-auto"})]
            }), n.jsxs("div", {
                className: "flex justify-center gap-4 mb-8",
                children: [n.jsx("button", {
                    onClick: () => b("buy"),
                    className: `px-8 py-3 font-black tracking-wider transition ${y === "buy" ? "bg-black text-white" : "border-2 border-black"}`,
                    children: "КУПИТЬ"
                }), n.jsx("button", {
                    onClick: () => b("activate"),
                    className: `px-8 py-3 font-black tracking-wider transition ${y === "activate" ? "bg-black text-white" : "border-2 border-black"}`,
                    children: "АКТИВИРОВАТЬ"
                }), n.jsx("button", {
                    onClick: () => b("my"),
                    className: `px-8 py-3 font-black tracking-wider transition ${y === "my" ? "bg-black text-white" : "border-2 border-black"}`,
                    children: "МОИ"
                })]
            }), y === "buy" && n.jsxs("div", {
                className: "max-w-2xl mx-auto bg-white border-2 border-black p-8",
                children: [n.jsx("h2", {
                    className: "text-2xl font-black mb-6 text-center",
                    children: "ВЫБЕРИТЕ НОМИНАЛ"
                }), n.jsx("div", {
                    className: "grid grid-cols-3 gap-4 mb-8",
                    children: g.map(N => n.jsxs("button", {
                        onClick: () => s(N),
                        className: `py-4 text-center border-2 font-black transition ${r === N ? "border-black bg-black text-white" : "border-gray-200"}`,
                        children: [N.toLocaleString(), " ₽"]
                    }, N))
                }), n.jsxs("div", {
                    className: "space-y-4",
                    children: [n.jsx("input", {
                        type: "email",
                        placeholder: "Email получателя *",
                        value: a,
                        onChange: N => l(N.target.value),
                        className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                    }), n.jsx("input", {
                        type: "text",
                        placeholder: "Имя получателя",
                        value: i,
                        onChange: N => o(N.target.value),
                        className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                    }), n.jsx("textarea", {
                        placeholder: "Поздравление",
                        value: c,
                        onChange: N => u(N.target.value),
                        rows: 3,
                        className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none"
                    }), n.jsxs("div", {
                        className: "bg-gray-50 p-4 rounded-xl",
                        children: [n.jsxs("div", {
                            className: "flex justify-between mb-2",
                            children: [n.jsx("span", {children: "Номинал:"}), n.jsxs("span", {
                                className: "font-bold",
                                children: [r.toLocaleString(), " ₽"]
                            })]
                        }), n.jsxs("div", {
                            className: "flex justify-between border-t pt-2",
                            children: [n.jsx("span", {
                                className: "font-black",
                                children: "Итого:"
                            }), n.jsxs("span", {className: "font-black text-xl", children: [r.toLocaleString(), " ₽"]})]
                        })]
                    }), n.jsx("button", {
                        onClick: v,
                        disabled: x,
                        className: "w-full bg-black text-white py-4 rounded-xl font-black hover:bg-gray-800 transition disabled:opacity-50",
                        children: x ? "ОТПРАВКА..." : `ОПЛАТИТЬ ${r.toLocaleString()} ₽`
                    })]
                })]
            }), y === "activate" && n.jsxs("div", {
                className: "max-w-md mx-auto bg-white border-2 border-black p-8 text-center",
                children: [n.jsx("i", {className: "fas fa-gift text-6xl text-gray-400 mb-4"}), n.jsx("h2", {
                    className: "text-2xl font-black mb-4",
                    children: "АКТИВАЦИЯ"
                }), n.jsx("p", {
                    className: "text-sm text-gray-500 mb-4",
                    children: "После активации деньги поступят на ваш баланс"
                }), n.jsx("input", {
                    type: "text",
                    placeholder: "Код сертификата",
                    value: f,
                    onChange: N => m(N.target.value.toUpperCase()),
                    className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 text-center uppercase"
                }), n.jsx("button", {
                    onClick: w,
                    className: "w-full bg-black text-white py-3 rounded-xl font-black",
                    children: "АКТИВИРОВАТЬ"
                })]
            }), y === "my" && n.jsx("div", {
                className: "max-w-2xl mx-auto",
                children: p.length === 0 ? n.jsxs("div", {
                    className: "text-center py-12 border-2 border-gray-200",
                    children: [n.jsx("i", {className: "fas fa-gift text-5xl text-gray-300 mb-4"}), n.jsx("p", {children: "У вас пока нет сертификатов"}), n.jsx("button", {
                        onClick: () => b("buy"),
                        className: "mt-4 text-black underline",
                        children: "Купить сертификат"
                    })]
                }) : n.jsx("div", {
                    className: "space-y-4", children: p.map((N, k) => n.jsxs("div", {
                        className: "border-2 border-black p-6",
                        children: [n.jsxs("div", {
                            className: "flex justify-between mb-4",
                            children: [n.jsxs("div", {
                                children: [n.jsx("p", {
                                    className: "text-sm text-gray-500",
                                    children: "Код"
                                }), n.jsx("p", {className: "font-mono font-black", children: N.code})]
                            }), n.jsxs("div", {
                                className: "text-right",
                                children: [n.jsx("p", {
                                    className: "text-sm text-gray-500",
                                    children: "Номинал"
                                }), n.jsxs("p", {
                                    className: "font-black text-2xl text-green-600",
                                    children: [N.amount.toLocaleString(), " ₽"]
                                })]
                            })]
                        }), n.jsxs("div", {
                            className: "border-t pt-4",
                            children: [n.jsx("p", {
                                className: "text-sm text-gray-500",
                                children: "Получатель"
                            }), n.jsxs("p", {children: [N.recipientName || "Не указан", " (", N.recipientEmail, ")"]}), N.message && n.jsxs("p", {
                                className: "text-gray-600 italic mt-2",
                                children: ['"', N.message, '"']
                            }), n.jsxs("p", {
                                className: "text-xs text-gray-400 mt-3",
                                children: ["Создан: ", new Date(N.createdAt).toLocaleDateString()]
                            }), n.jsx("p", {
                                className: `text-xs mt-1 ${N.isUsed ? "text-red-500" : "text-green-500"}`,
                                children: N.isUsed ? "Использован" : "Активен"
                            })]
                        })]
                    }, k))
                })
            })]
        })
    })
}, xw = () => n.jsx("div", {
    className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
        className: "container mx-auto px-4 py-12",
        children: [n.jsxs("div", {
            className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
            children: [n.jsx(D, {
                to: "/",
                className: "hover:text-black",
                children: "Главная"
            }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                className: "text-black",
                children: "Публичная оферта"
            })]
        }), n.jsxs("div", {
            className: "max-w-4xl mx-auto",
            children: [n.jsx("h1", {
                className: "text-4xl font-black mb-6",
                children: "ПУБЛИЧНАЯ ОФЕРТА"
            }), n.jsx("p", {
                className: "text-gray-500 mb-8",
                children: 'Интернет-магазин "MISAT" в лице ИП MISAT (ИНН: 673111219228) (далее - Продавец)'
            }), n.jsxs("div", {
                className: "space-y-6",
                children: [n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "1. ОБЩИЕ ПОЛОЖЕНИЯ"
                    }), n.jsx("p", {children: '1.1. Настоящий документ является официальной публичной офертой интернет-магазина "MISAT".'}), n.jsx("p", {children: "1.2. Акцептом настоящей оферты является оформление заказа на сайте misat.ru."}), n.jsx("p", {children: "1.3. Продавец имеет право вносить изменения в оферту без предварительного уведомления."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "2. ТОВАР И ПОРЯДОК ОФОРМЛЕНИЯ ЗАКАЗА"
                    }), n.jsx("p", {children: "2.1. Продавец осуществляет продажу товаров, представленных на сайте."}), n.jsx("p", {children: "2.2. Заказ оформляется через корзину и форму оформления заказа."}), n.jsx("p", {children: "2.3. После оформления заказа покупатель получает подтверждение на email."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "3. ОПЛАТА ТОВАРА"
                    }), n.jsx("p", {children: "3.1. Цены на товары указаны на сайте в российских рублях."}), n.jsx("p", {children: "3.2. Оплата производится банковской картой, СБП или наличными при получении."}), n.jsx("p", {children: "3.3. Продавец не хранит данные банковских карт."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "4. ПРЕДОПЛАТА"
                    }), n.jsx("p", {children: "4.1. Для товаров в наличии (РФ): предоплата 70%, остаток 30% при получении."}), n.jsx("p", {children: "4.2. Для товаров под заказ из Китая: предоплата 100%."}), n.jsx("p", {children: "4.3. При отказе от заказа предоплата не возвращается."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "5. ДОСТАВКА ТОВАРА"
                    }), n.jsx("p", {children: "5.1. Доставка осуществляется по всей России через СДЭК."}), n.jsx("p", {children: "5.2. Отправка всех заказов производится из Смоленска."}), n.jsx("p", {children: "5.3. Срок доставки товаров в наличии: 2-5 дней."}), n.jsx("p", {children: "5.4. Срок доставки предзаказа из Китая: 20-35 дней."}), n.jsx("p", {children: "5.5. Бесплатная доставка при заказе от 5000 ₽."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "6. ВОЗВРАТ ТОВАРА"
                    }), n.jsx("p", {children: "6.1. Возврат товара надлежащего качества возможен в течение 30 дней."}), n.jsx("p", {children: "6.2. Товар должен быть не использован и сохранены фабричные ярлыки."}), n.jsx("p", {children: "6.3. Возврат денежных средств осуществляется в течение 10 рабочих дней."}), n.jsx("p", {children: "6.4. Обратная доставка оплачивается покупателем."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "7. СРОКИ ОБРАБОТКИ ЗАКАЗА"
                    }), n.jsx("p", {children: "7.1. Заказ обрабатывается в течение 1-2 рабочих дней."}), n.jsx("p", {children: "7.2. В случае предзаказа товар отправляется после поступления на склад в Смоленске."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "8. РЕКВИЗИТЫ ПРОДАВЦА"
                    }), n.jsx("p", {children: n.jsx("strong", {children: "ИП MISAT"})}), n.jsx("p", {children: "ИНН: 673111219228"}), n.jsx("p", {children: "Телефон: +7 (993) 884-37-66"}), n.jsx("p", {children: "Email: misatsupport@gmail.com"})]
                })]
            })]
        })]
    })
}), gw = () => n.jsx("div", {
    className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
        className: "container mx-auto px-4 py-12",
        children: [n.jsxs("div", {
            className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
            children: [n.jsx(D, {
                to: "/",
                className: "hover:text-black",
                children: "Главная"
            }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                className: "text-black",
                children: "Политика конфиденциальности"
            })]
        }), n.jsxs("div", {
            className: "max-w-4xl mx-auto",
            children: [n.jsx("h1", {
                className: "text-4xl font-black mb-6",
                children: "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ"
            }), n.jsx("p", {
                className: "text-gray-500 mb-8",
                children: 'Интернет-магазин "MISAT" (далее - Продавец)'
            }), n.jsxs("div", {
                className: "space-y-6",
                children: [n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "1. ОБЩИЕ ПОЛОЖЕНИЯ"
                    }), n.jsx("p", {children: '1.1. Настоящая Политика конфиденциальности является официальным документом интернет-магазина "MISAT".'}), n.jsx("p", {children: "1.2. Политика определяет порядок обработки и защиты персональных данных пользователей."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "2. КАКИЕ ДАННЫЕ МЫ СОБИРАЕМ"
                    }), n.jsx("p", {children: "2.1. При оформлении заказа мы собираем следующие данные:"}), n.jsxs("ul", {
                        className: "list-disc pl-6 mt-2 space-y-1",
                        children: [n.jsx("li", {children: "Фамилия, имя, отчество"}), n.jsx("li", {children: "Адрес электронной почты"}), n.jsx("li", {children: "Номер телефона"}), n.jsx("li", {children: "Адрес доставки"})]
                    }), n.jsx("p", {
                        className: "mt-2",
                        children: "2.2. Данные банковских карт не хранятся на нашем сайте, оплата производится через защищённые платёжные системы."
                    })]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "3. ЦЕЛИ СБОРА ДАННЫХ"
                    }), n.jsx("p", {children: "3.1. Ваши данные используются для:"}), n.jsxs("ul", {
                        className: "list-disc pl-6 mt-2 space-y-1",
                        children: [n.jsx("li", {children: "Обработки и доставки заказов"}), n.jsx("li", {children: "Связи с вами по вопросам заказа"}), n.jsx("li", {children: "Информирования о статусе заказа"}), n.jsx("li", {children: "Улучшения работы сайта"})]
                    })]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "4. ПЕРЕДАЧА ДАННЫХ ТРЕТЬИМ ЛИЦАМ"
                    }), n.jsx("p", {children: "4.1. Мы передаём ваши данные только:"}), n.jsxs("ul", {
                        className: "list-disc pl-6 mt-2 space-y-1",
                        children: [n.jsx("li", {children: "Службам доставки (для отправки заказа)"}), n.jsx("li", {children: "Платёжным системам (для обработки оплаты)"})]
                    }), n.jsx("p", {children: "4.2. Мы не продаём и не передаём ваши данные третьим лицам в иных целях."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "5. ХРАНЕНИЕ И ЗАЩИТА ДАННЫХ"
                    }), n.jsx("p", {children: "5.1. Ваши данные хранятся в зашифрованном виде и защищены от несанкционированного доступа."}), n.jsx("p", {children: "5.2. Мы принимаем все необходимые меры для защиты ваших персональных данных."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "6. УДАЛЕНИЕ ДАННЫХ"
                    }), n.jsxs("p", {children: ["6.1. Вы можете удалить свои данные, отправив запрос на электронную почту: ", n.jsx("strong", {children: "support@misat.ru"})]}), n.jsx("p", {children: "6.2. Также вы можете удалить аккаунт самостоятельно в личном кабинете."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "7. КОНТАКТНАЯ ИНФОРМАЦИЯ"
                    }), n.jsx("p", {children: n.jsx("strong", {children: "ИП MISAT"})}), n.jsx("p", {children: "ИНН: 673111219228"}), n.jsx("p", {children: "Телефон: +7 (993) 884-37-66"}), n.jsx("p", {children: "Email: misatsupport@gmail.com"})]
                })]
            })]
        })]
    })
}), yw = () => n.jsx("div", {
    className: "min-h-screen bg-white pt-20", children: n.jsxs("div", {
        className: "container mx-auto px-4 py-12",
        children: [n.jsxs("div", {
            className: "flex items-center gap-2 text-sm text-gray-500 mb-8",
            children: [n.jsx(D, {
                to: "/",
                className: "hover:text-black",
                children: "Главная"
            }), n.jsx("i", {className: "fas fa-chevron-right text-xs"}), n.jsx("span", {
                className: "text-black",
                children: "Пользовательское соглашение"
            })]
        }), n.jsxs("div", {
            className: "max-w-4xl mx-auto",
            children: [n.jsx("h1", {
                className: "text-4xl font-black mb-6",
                children: "ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ"
            }), n.jsx("p", {
                className: "text-gray-500 mb-8",
                children: 'Интернет-магазин "MISAT" (ИП MISAT) (далее - Продавец)'
            }), n.jsxs("div", {
                className: "space-y-6",
                children: [n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "1. ОБЩИЕ ПОЛОЖЕНИЯ"
                    }), n.jsx("p", {children: "1.1. Использование сайта misat.ru означает полное согласие с условиями настоящего Соглашения."}), n.jsx("p", {children: "1.2. Продавец оставляет за собой право изменять условия Соглашения без предварительного уведомления."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "2. ПРАВА И ОБЯЗАННОСТИ СТОРОН"
                    }), n.jsx("p", {children: "2.1. Продавец обязуется:"}), n.jsxs("ul", {
                        className: "list-disc pl-6 mt-2 space-y-1",
                        children: [n.jsx("li", {children: "Предоставлять достоверную информацию о товарах"}), n.jsx("li", {children: "Обрабатывать заказы в установленные сроки"}), n.jsx("li", {children: "Обеспечивать конфиденциальность персональных данных"})]
                    }), n.jsx("p", {
                        className: "mt-2",
                        children: "2.2. Покупатель обязуется:"
                    }), n.jsxs("ul", {
                        className: "list-disc pl-6 mt-2 space-y-1",
                        children: [n.jsx("li", {children: "Предоставлять достоверные данные при оформлении заказа"}), n.jsx("li", {children: "Своевременно оплачивать заказы"}), n.jsx("li", {children: "Соблюдать условия возврата товара"})]
                    })]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "3. ОФОРМЛЕНИЕ ЗАКАЗА"
                    }), n.jsx("p", {children: "3.1. Заказ считается оформленным после заполнения формы и подтверждения."}), n.jsx("p", {children: "3.2. После оформления заказа покупатель получает подтверждение на email."}), n.jsx("p", {children: "3.3. Продавец имеет право отменить заказ при отсутствии товара на складе."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "4. ОПЛАТА ТОВАРА"
                    }), n.jsx("p", {children: "4.1. Цены на товары указаны на сайте и могут изменяться."}), n.jsx("p", {children: "4.2. Оплата производится в российских рублях."}), n.jsx("p", {children: "4.3. Способы оплаты: банковская карта, СБП, наличные при получении."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "5. ДОСТАВКА"
                    }), n.jsx("p", {children: "5.1. Доставка осуществляется по всей России."}), n.jsx("p", {children: "5.2. Отправка заказов производится из Смоленска."}), n.jsx("p", {children: "5.3. Срок доставки товаров в наличии: 2-5 дней."}), n.jsx("p", {children: "5.4. Срок доставки предзаказа из Китая: 20-35 дней."}), n.jsx("p", {children: "5.5. Бесплатная доставка при заказе от 5000 ₽."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "6. ВОЗВРАТ ТОВАРА"
                    }), n.jsx("p", {children: "6.1. Возврат товара надлежащего качества возможен в течение 30 дней."}), n.jsx("p", {children: "6.2. Товар должен быть не использован, с сохранёнными ярлыками и упаковкой."}), n.jsx("p", {children: "6.3. Обратная доставка оплачивается покупателем."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "7. ПРЕДОПЛАТА"
                    }), n.jsx("p", {children: "7.1. Для товаров в наличии РФ: предоплата 70%."}), n.jsx("p", {children: "7.2. Для товаров под заказ из Китая: предоплата 100%."}), n.jsx("p", {children: "7.3. При отказе от заказа предоплата не возвращается."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "8. ОТВЕТСТВЕННОСТЬ"
                    }), n.jsx("p", {children: "8.1. Продавец не несёт ответственности за задержки доставки по вине транспортных компаний."}), n.jsx("p", {children: "8.2. Продавец не несёт ответственности за несоответствие ожиданиям покупателя."})]
                }), n.jsxs("section", {
                    children: [n.jsx("h2", {
                        className: "text-2xl font-black mb-3",
                        children: "9. РЕКВИЗИТЫ ПРОДАВЦА"
                    }), n.jsx("p", {children: n.jsx("strong", {children: "ИП MISAT"})}), n.jsx("p", {children: "ИНН: 673111219228"}), n.jsx("p", {children: "Телефон: +7 (993) 884-37-66"}), n.jsx("p", {children: "Email: misatsupport@gmail.com"})]
                })]
            })]
        })]
    })
}), vw = () => {
    const e = Qr(), t = Qt(), r = Jr(), {user: s} = Ze(u => u.auth), [a, l] = j.useState(!1), [i, o] = j.useState(!1),
        c = [{
            path: "/admin",
            label: "Дашборд",
            icon: "fa-chart-line",
            color: "text-blue-500"
        }, {path: "/admin/products", label: "Товары", icon: "fa-box", color: "text-green-500"}, {
            path: "/admin/orders",
            label: "Заказы",
            icon: "fa-truck",
            color: "text-orange-500"
        }, {
            path: "/admin/categories",
            label: "Категории",
            icon: "fa-tags",
            color: "text-purple-500"
        }, {
            path: "/admin/users",
            label: "Пользователи",
            icon: "fa-users",
            color: "text-indigo-500"
        }, {
            path: "/admin/promocodes",
            label: "Промокоды",
            icon: "fa-tag",
            color: "text-yellow-500"
        }, {path: "/admin/chat", label: "Чат", icon: "fa-comments", color: "text-pink-500"}];
    return j.useEffect(() => {
        const u = () => {
            o(window.innerWidth < 768), window.innerWidth >= 768 ? l(!0) : l(!1)
        };
        return u(), window.addEventListener("resize", u), () => window.removeEventListener("resize", u)
    }, []), j.useEffect(() => {
        const u = setInterval(() => {
            const f = Is(), m = localStorage.getItem("last_order_check"),
                y = f.filter(b => !m || new Date(b.created_at) > new Date(m));
            y.length > 0 && y.some(b => b.status === "pending") && (new Audio("/notification.mp3").play().catch(p => console.log("Audio play failed")), "Notification" in window && Notification.permission === "granted" && new Notification("Новый заказ!", {
                body: `Поступил новый заказ на сумму ${y[0].total.toLocaleString()} ₽`,
                icon: "/logo192.png"
            }), _("📦 Новый заказ!", {duration: 5e3}), localStorage.setItem("last_order_check", new Date().toISOString()))
        }, 3e4);
        return () => clearInterval(u)
    }, []), j.useEffect(() => {
        "Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted" && Notification.requestPermission()
    }, []), !s || s.role !== "admin" ? (t("/"), _.error("У вас нет доступа к админ-панели"), null) : n.jsxs("div", {
        className: "min-h-screen bg-gray-100",
        children: [n.jsx("button", {
            onClick: () => l(!a),
            className: "fixed bottom-6 left-6 z-50 bg-black text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center lg:hidden",
            children: n.jsx("i", {className: `fas fa-${a ? "times" : "bars"} text-xl`})
        }), i && a && n.jsx("div", {
            className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
            onClick: () => l(!1)
        }), n.jsx("aside", {
            className: `fixed left-0 top-20 h-full bg-black text-white transition-all duration-300 z-40 ${a ? "w-64" : "w-0"} overflow-hidden shadow-xl`,
            children: n.jsxs("div", {
                className: "p-4",
                children: [n.jsxs("div", {
                    className: "flex items-center gap-3 mb-6",
                    children: [n.jsx("div", {
                        className: "w-10 h-10 bg-white rounded-xl flex items-center justify-center",
                        children: n.jsx("i", {className: "fas fa-crown text-black text-xl"})
                    }), a && n.jsxs("div", {
                        children: [n.jsx("h2", {
                            className: "font-black text-lg",
                            children: "MISAT ADMIN"
                        }), n.jsx("p", {
                            className: "text-xs text-gray-400 truncate w-40",
                            children: s == null ? void 0 : s.email
                        })]
                    })]
                }), n.jsx("nav", {
                    className: "space-y-1", children: c.map(u => {
                        const f = e.pathname === u.path;
                        return n.jsxs(D, {
                            to: u.path,
                            onClick: () => i && l(!1),
                            className: `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${f ? "bg-white text-black" : "hover:bg-white/10"}`,
                            children: [n.jsx("i", {className: `fas ${u.icon} w-5 ${f ? u.color : "text-gray-400"}`}), a && n.jsx("span", {
                                className: `text-sm font-medium ${f ? "text-black" : "text-white"}`,
                                children: u.label
                            })]
                        }, u.path)
                    })
                }), n.jsxs("div", {
                    className: "absolute bottom-6 left-0 right-0 px-4",
                    children: [n.jsx("hr", {className: "border-gray-800 my-4"}), n.jsxs("button", {
                        onClick: () => {
                            r(du()), t("/"), _.success("Вы вышли из админ-панели")
                        },
                        className: "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 transition",
                        children: [n.jsx("i", {className: "fas fa-sign-out-alt w-5 text-gray-400"}), a && n.jsx("span", {
                            className: "text-sm text-white",
                            children: "Выйти"
                        })]
                    })]
                })]
            })
        }), n.jsx("main", {
            className: `transition-all duration-300 ${a && !i ? "lg:ml-64" : ""}`,
            children: n.jsx("div", {className: "p-4 md:p-6", children: n.jsx(Hj, {})})
        })]
    })
}, bw = () => {
    const [e, t] = j.useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        lowStock: 0
    }), [r, s] = j.useState([]), [a, l] = j.useState([]), [i, o] = j.useState("month"), [c, u] = j.useState([]);
    j.useEffect(() => {
        f()
    }, [i]);
    const f = () => {
        try {
            const p = nu(), d = Is(), x = En(), h = dv();
            t({
                totalProducts: p.length,
                totalOrders: d.length,
                totalUsers: x.length,
                totalRevenue: d.reduce((w, N) => w + N.total, 0),
                pendingOrders: d.filter(w => w.status === "pending").length,
                lowStock: p.filter(w => w.stock < 10).length
            }), s(d.slice(-5).reverse());
            const g = new Map;
            d.forEach(w => {
                w.items && Array.isArray(w.items) && w.items.forEach(N => {
                    const k = g.get(N.productId) || {name: N.name, quantity: 0, revenue: 0};
                    k.quantity += N.quantity, k.revenue += N.price * N.quantity, g.set(N.productId, k)
                })
            });
            const v = Array.from(g.entries()).map(([w, N]) => ({id: w, ...N})).sort((w, N) => N.quantity - w.quantity).slice(0, 5);
            l(v), m(d)
        } catch (p) {
            console.error("Ошибка загрузки данных:", p)
        }
    }, m = p => {
        const d = new Date, x = [];
        if (i === "week") for (let h = 6; h >= 0; h--) {
            const g = new Date(d);
            g.setDate(d.getDate() - h);
            const v = g.toLocaleDateString("ru-RU", {day: "2-digit", month: "2-digit"}),
                N = p.filter(k => new Date(k.created_at).toDateString() === g.toDateString()).reduce((k, E) => k + E.total, 0);
            x.push({date: v, amount: N})
        } else if (i === "month") for (let h = 29; h >= 0; h--) {
            const g = new Date(d);
            g.setDate(d.getDate() - h);
            const v = g.toLocaleDateString("ru-RU", {day: "2-digit", month: "2-digit"}),
                N = p.filter(k => new Date(k.created_at).toDateString() === g.toDateString()).reduce((k, E) => k + E.total, 0);
            x.push({date: v, amount: N})
        } else for (let h = 11; h >= 0; h--) {
            const g = new Date(d);
            g.setMonth(d.getMonth() - h);
            const v = g.toLocaleDateString("ru-RU", {month: "short"}), N = p.filter(k => {
                const E = new Date(k.created_at);
                return E.getMonth() === g.getMonth() && E.getFullYear() === g.getFullYear()
            }).reduce((k, E) => k + E.total, 0);
            x.push({date: v, amount: N})
        }
        u(x)
    }, y = Math.max(...c.map(p => p.amount), 1), b = at();
    return !b || b.role !== "admin" ? n.jsxs("div", {
        className: "text-center py-12",
        children: [n.jsx("h2", {
            className: "text-2xl font-bold text-red-600",
            children: "Доступ запрещен"
        }), n.jsx("p", {className: "text-gray-600 mt-2", children: "У вас нет прав для просмотра этой страницы"})]
    }) : n.jsxs("div", {
        children: [n.jsx("h1", {className: "text-3xl font-light mb-8", children: "Дашборд"}), n.jsxs("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8",
            children: [n.jsxs("div", {
                className: "bg-white rounded-2xl p-4 shadow-sm border-l-4 border-blue-500",
                children: [n.jsx("p", {
                    className: "text-sm text-gray-500",
                    children: "Товары"
                }), n.jsx("p", {className: "text-2xl font-bold", children: e.totalProducts})]
            }), n.jsxs("div", {
                className: "bg-white rounded-2xl p-4 shadow-sm border-l-4 border-green-500",
                children: [n.jsx("p", {
                    className: "text-sm text-gray-500",
                    children: "Заказы"
                }), n.jsx("p", {className: "text-2xl font-bold", children: e.totalOrders})]
            }), n.jsxs("div", {
                className: "bg-white rounded-2xl p-4 shadow-sm border-l-4 border-purple-500",
                children: [n.jsx("p", {
                    className: "text-sm text-gray-500",
                    children: "Пользователи"
                }), n.jsx("p", {className: "text-2xl font-bold", children: e.totalUsers})]
            }), n.jsxs("div", {
                className: "bg-white rounded-2xl p-4 shadow-sm border-l-4 border-yellow-500",
                children: [n.jsx("p", {
                    className: "text-sm text-gray-500",
                    children: "Выручка"
                }), n.jsxs("p", {className: "text-2xl font-bold", children: [e.totalRevenue.toLocaleString(), " ₽"]})]
            }), n.jsxs("div", {
                className: "bg-white rounded-2xl p-4 shadow-sm border-l-4 border-orange-500",
                children: [n.jsx("p", {
                    className: "text-sm text-gray-500",
                    children: "В обработке"
                }), n.jsx("p", {className: "text-2xl font-bold", children: e.pendingOrders})]
            }), n.jsxs("div", {
                className: "bg-white rounded-2xl p-4 shadow-sm border-l-4 border-red-500",
                children: [n.jsx("p", {
                    className: "text-sm text-gray-500",
                    children: "Низкий запас"
                }), n.jsx("p", {className: "text-2xl font-bold", children: e.lowStock})]
            })]
        }), n.jsxs("div", {
            className: "bg-white rounded-2xl p-6 shadow-sm mb-8",
            children: [n.jsxs("div", {
                className: "flex justify-between items-center mb-4 flex-wrap gap-2",
                children: [n.jsx("h2", {
                    className: "text-xl font-black",
                    children: "График продаж"
                }), n.jsxs("div", {
                    className: "flex gap-2",
                    children: [n.jsx("button", {
                        onClick: () => o("week"),
                        className: `px-4 py-1 rounded-full text-sm transition ${i === "week" ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"}`,
                        children: "Неделя"
                    }), n.jsx("button", {
                        onClick: () => o("month"),
                        className: `px-4 py-1 rounded-full text-sm transition ${i === "month" ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"}`,
                        children: "Месяц"
                    }), n.jsx("button", {
                        onClick: () => o("year"),
                        className: `px-4 py-1 rounded-full text-sm transition ${i === "year" ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"}`,
                        children: "Год"
                    })]
                })]
            }), c.length === 0 ? n.jsx("div", {
                className: "h-64 flex items-center justify-center text-gray-400",
                children: "Нет данных для отображения"
            }) : n.jsx("div", {
                className: "h-64 flex items-end gap-1 overflow-x-auto pb-4",
                children: c.map((p, d) => n.jsxs("div", {
                    className: "flex-1 flex flex-col items-center min-w-[40px]",
                    children: [n.jsx("div", {
                        className: "w-full bg-gradient-to-t from-black to-gray-700 rounded-t transition-all duration-500 hover:from-gray-700 hover:to-gray-600",
                        style: {height: `${Math.max(p.amount / y * 180, 4)}px`}
                    }), n.jsx("p", {
                        className: "text-xs text-gray-500 mt-2 transform -rotate-45 origin-left whitespace-nowrap",
                        children: p.date
                    }), n.jsxs("p", {className: "text-xs font-bold mt-1", children: [p.amount.toLocaleString(), " ₽"]})]
                }, d))
            })]
        }), n.jsxs("div", {
            className: "grid md:grid-cols-2 gap-8",
            children: [n.jsxs("div", {
                className: "bg-white rounded-2xl p-6 shadow-sm",
                children: [n.jsx("h2", {
                    className: "text-xl font-black mb-4",
                    children: "Популярные товары"
                }), a.length === 0 ? n.jsx("p", {
                    className: "text-gray-500 text-center py-8",
                    children: "Нет данных о продажах"
                }) : n.jsx("div", {
                    className: "space-y-3 max-h-96 overflow-y-auto",
                    children: a.map((p, d) => n.jsxs("div", {
                        className: "flex justify-between items-center border-b pb-3",
                        children: [n.jsxs("div", {
                            className: "flex-1",
                            children: [n.jsxs("span", {
                                className: "font-bold text-lg mr-2",
                                children: [d + 1, "."]
                            }), n.jsx("span", {className: "text-sm", children: p.name})]
                        }), n.jsxs("div", {
                            className: "text-right",
                            children: [n.jsxs("p", {
                                className: "font-bold text-sm",
                                children: [p.quantity, " шт."]
                            }), n.jsxs("p", {
                                className: "text-xs text-gray-500",
                                children: [p.revenue.toLocaleString(), " ₽"]
                            })]
                        })]
                    }, p.id))
                })]
            }), n.jsxs("div", {
                className: "bg-white rounded-2xl p-6 shadow-sm",
                children: [n.jsx("h2", {
                    className: "text-xl font-black mb-4",
                    children: "Последние заказы"
                }), r.length === 0 ? n.jsx("p", {
                    className: "text-gray-500 text-center py-8",
                    children: "Нет заказов"
                }) : n.jsx("div", {
                    className: "space-y-3 max-h-96 overflow-y-auto", children: r.map(p => {
                        var h;
                        const x = En().find(g => g.id === p.userId);
                        return n.jsxs(D, {
                            to: "/admin/orders",
                            className: "flex justify-between items-center border-b pb-3 hover:bg-gray-50 p-2 rounded transition",
                            children: [n.jsxs("div", {
                                className: "flex-1",
                                children: [n.jsx("p", {
                                    className: "font-mono text-xs font-bold",
                                    children: p.id
                                }), n.jsxs("p", {
                                    className: "text-xs text-gray-600 mt-1",
                                    children: [x == null ? void 0 : x.first_name, " ", (x == null ? void 0 : x.last_name) || (x == null ? void 0 : x.email) || "Пользователь"]
                                }), n.jsxs("p", {
                                    className: "text-xs text-gray-400",
                                    children: [((h = p.items) == null ? void 0 : h.length) || 0, " товаров"]
                                })]
                            }), n.jsxs("div", {
                                className: "text-right",
                                children: [n.jsxs("p", {
                                    className: "font-bold text-sm",
                                    children: [p.total.toLocaleString(), " ₽"]
                                }), n.jsx("p", {
                                    className: `text-xs px-2 py-0.5 rounded-full mt-1 ${p.status === "pending" ? "bg-yellow-100 text-yellow-800" : p.status === "processing" ? "bg-blue-100 text-blue-800" : p.status === "delivered" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`,
                                    children: p.status === "pending" ? "В обработке" : p.status === "processing" ? "Готовится" : p.status === "delivered" ? "Доставлен" : p.status
                                }), n.jsx("p", {
                                    className: "text-xs text-gray-400 mt-1",
                                    children: new Date(p.created_at).toLocaleDateString()
                                })]
                            })]
                        }, p.id)
                    })
                })]
            })]
        })]
    })
}, jw = () => {
    const [e, t] = j.useState([]), [r, s] = j.useState(!1), [a, l] = j.useState(null), [i, o] = j.useState([]), [c, u] = j.useState(!1), [f, m] = j.useState(!1), [y, b] = j.useState([]), [p, d] = j.useState({
            name: "",
            price: "",
            oldPrice: "",
            description: "",
            category: "clothes",
            sizes: [],
            colors: [],
            stock: "",
            isNew: !1,
            isSale: !1
        }), x = [{id: "clothes", name: "Одежда"}, {id: "shoes", name: "Обувь"}, {
            id: "accessories",
            name: "Аксессуары"
        }, {id: "sport", name: "Спорт"}], h = ["XS", "S", "M", "L", "XL", "XXL"],
        g = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"], v = ["One size"],
        w = ["XS", "S", "M", "L", "XL", "XXL"], N = S => {
            switch (S) {
                case"shoes":
                    return g;
                case"accessories":
                    return v;
                case"sport":
                    return w;
                default:
                    return h
            }
        }, k = S => {
            const M = x.find(B => B.id === S);
            return M ? M.name : S
        }, E = S => {
            if (!S) return [];
            if (Array.isArray(S)) return S;
            if (typeof S == "string") try {
                return JSON.parse(S)
            } catch {
                return []
            }
            return []
        };
    j.useEffect(() => {
        b(N(p.category)), d(S => ({...S, sizes: []}))
    }, [p.category]);
    const R = [{name: "Чёрный", value: "#000000", code: "black"}, {
        name: "Белый",
        value: "#FFFFFF",
        code: "white"
    }, {name: "Серый", value: "#808080", code: "gray"}, {
        name: "Синий",
        value: "#0000FF",
        code: "blue"
    }, {name: "Красный", value: "#FF0000", code: "red"}, {name: "Зелёный", value: "#00FF00", code: "green"}];
    j.useEffect(() => {
        const S = () => {
            u(window.innerWidth < 768)
        };
        return S(), window.addEventListener("resize", S), () => window.removeEventListener("resize", S)
    }, []);
    const z = async () => {
        try {
            const M = (await Pt.getAll()).data.map(B => ({
                ...B,
                sizes: E(B.sizes),
                colors: E(B.colors),
                images: E(B.images)
            }));
            t(M)
        } catch (S) {
            console.error("Ошибка загрузки:", S), _.error("Ошибка загрузки товаров")
        }
    };
    j.useEffect(() => {
        z()
    }, []);
    const $ = (S, M = .5) => new Promise((B, oe) => {
        const fe = new FileReader;
        fe.readAsDataURL(S), fe.onload = O => {
            var T;
            const V = new Image;
            V.src = (T = O.target) == null ? void 0 : T.result, V.onload = () => {
                const J = document.createElement("canvas");
                let Q = V.width, Ce = V.height;
                const ce = 500, be = 500;
                Q > Ce ? Q > ce && (Ce = Ce * ce / Q, Q = ce) : Ce > be && (Q = Q * be / Ce, Ce = be), J.width = Q, J.height = Ce;
                const Kt = J.getContext("2d");
                Kt == null || Kt.drawImage(V, 0, 0, Q, Ce);
                let ye = .5, lt = J.toDataURL("image/jpeg", ye);
                for (; lt.length > M * 1024 * 1024 && ye > .3;) ye -= .1, lt = J.toDataURL("image/jpeg", ye);
                B(lt)
            }, V.onerror = oe
        }, fe.onerror = oe
    }), L = async S => {
        const M = Array.from(S.target.files || []);
        if (M.length !== 0) {
            if (i.length + M.length > 5) {
                _.error("Максимум 5 фото на товар");
                return
            }
            m(!0), _.loading("Обработка изображений...", {id: "upload"});
            try {
                const B = [];
                for (const oe of M) {
                    if (oe.size > 5 * 1024 * 1024) {
                        _.error(`Файл ${oe.name} слишком большой. Максимум 5MB`);
                        continue
                    }
                    const fe = await $(oe, .5);
                    B.push(fe)
                }
                o([...i, ...B]), _.success(`Загружено ${B.length} фото!`, {id: "upload"})
            } catch {
                _.error("Ошибка загрузки изображений", {id: "upload"})
            } finally {
                m(!1)
            }
        }
    }, G = S => {
        o(i.filter((M, B) => B !== S))
    }, X = async () => {
        var S, M;
        if (!p.name) {
            _.error("Введите название");
            return
        }
        if (!p.price) {
            _.error("Введите цену");
            return
        }
        if (i.length === 0 && !a) {
            _.error("Загрузите хотя бы одно изображение");
            return
        }
        try {
            const B = {
                name: p.name,
                price: Number(p.price),
                old_price: p.oldPrice ? Number(p.oldPrice) : null,
                image: i[0] || "",
                images: JSON.stringify(i),
                description: p.description,
                category: p.category,
                sizes: JSON.stringify(p.sizes),
                colors: JSON.stringify(p.colors),
                stock: Number(p.stock) || 0,
                is_new: p.isNew ? 1 : 0,
                is_sale: p.isSale ? 1 : 0
            };
            console.log("📦 Отправка товара:", B), await Pt.create(B), _.success("Товар добавлен!"), te(), s(!1), z()
        } catch (B) {
            console.error("Ошибка:", B), _.error(((M = (S = B.response) == null ? void 0 : S.data) == null ? void 0 : M.error) || "Ошибка добавления товара")
        }
    }, P = async () => {
        var S, M, B;
        if (a) {
            if (!p.name) {
                _.error("Введите название");
                return
            }
            if (!p.price) {
                _.error("Введите цену");
                return
            }
            try {
                const oe = {
                    name: p.name,
                    price: Number(p.price),
                    old_price: p.oldPrice ? Number(p.oldPrice) : null,
                    image: i.length > 0 ? i[0] : ((S = a.images) == null ? void 0 : S[0]) || "",
                    images: JSON.stringify(i.length > 0 ? i : a.images),
                    description: p.description,
                    category: p.category,
                    sizes: JSON.stringify(p.sizes),
                    colors: JSON.stringify(p.colors),
                    stock: Number(p.stock) || a.stock,
                    is_new: p.isNew ? 1 : 0,
                    is_sale: p.isSale ? 1 : 0
                };
                await Pt.update(a.id, oe), _.success("Товар обновлён!"), te(), s(!1), z()
            } catch (oe) {
                console.error("Ошибка:", oe), _.error(((B = (M = oe.response) == null ? void 0 : M.data) == null ? void 0 : B.error) || "Ошибка обновления товара")
            }
        }
    }, W = async S => {
        if (confirm("Удалить товар?")) try {
            await Pt.delete(S), _.success("Товар удалён"), z()
        } catch {
            _.error("Ошибка удаления товара")
        }
    }, H = S => {
        var M;
        l(S), o(S.images || []), b(N(S.category)), d({
            name: S.name,
            price: S.price.toString(),
            oldPrice: ((M = S.oldPrice) == null ? void 0 : M.toString()) || "",
            description: S.description,
            category: S.category,
            sizes: S.sizes,
            colors: S.colors,
            stock: S.stock.toString(),
            isNew: S.isNew || !1,
            isSale: S.isSale || !1
        }), s(!0)
    }, te = () => {
        b(N("clothes")), d({
            name: "",
            price: "",
            oldPrice: "",
            description: "",
            category: "clothes",
            sizes: [],
            colors: [],
            stock: "",
            isNew: !1,
            isSale: !1
        }), o([]), l(null)
    }, A = S => {
        d(M => ({...M, sizes: M.sizes.includes(S) ? M.sizes.filter(B => B !== S) : [...M.sizes, S]}))
    }, U = S => {
        d(M => ({...M, colors: M.colors.includes(S) ? M.colors.filter(B => B !== S) : [...M.colors, S]}))
    };
    return n.jsxs("div", {
        className: "p-4 md:p-6",
        children: [n.jsxs("div", {
            className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6",
            children: [n.jsxs("div", {
                children: [n.jsx("h1", {
                    className: "text-2xl md:text-3xl font-black tracking-tighter",
                    children: "Управление товарами"
                }), n.jsxs("p", {className: "text-gray-500 text-sm mt-1", children: ["Всего товаров: ", e.length]})]
            }), n.jsx("button", {
                onClick: () => {
                    te(), s(!0)
                },
                className: "bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto",
                children: "+ Добавить товар"
            })]
        }), e.length === 0 ? n.jsxs("div", {
            className: "bg-white rounded-2xl p-12 text-center",
            children: [n.jsx("i", {className: "fas fa-box-open text-5xl text-gray-300 mb-4"}), n.jsx("p", {
                className: "text-gray-500",
                children: "Товаров пока нет"
            }), n.jsx("button", {
                onClick: () => {
                    te(), s(!0)
                }, className: "mt-4 text-black underline", children: "Добавить первый товар"
            })]
        }) : c ? n.jsx("div", {
            className: "space-y-4", children: e.map(S => {
                var M;
                return n.jsx("div", {
                    className: "bg-white rounded-2xl p-4 shadow-sm border",
                    children: n.jsxs("div", {
                        className: "flex gap-3",
                        children: [n.jsx("img", {
                            src: ((M = S.images) == null ? void 0 : M[0]) || "https://placehold.co/100x100/eeeeee/cccccc?text=No+Image",
                            alt: S.name,
                            className: "w-20 h-20 object-cover rounded-lg"
                        }), n.jsxs("div", {
                            className: "flex-1",
                            children: [n.jsx("h3", {
                                className: "font-black text-base",
                                children: S.name
                            }), n.jsxs("p", {
                                className: "text-sm text-gray-500",
                                children: [S.price.toLocaleString(), " ₽"]
                            }), n.jsxs("p", {
                                className: "text-xs text-gray-400",
                                children: ["Размеры: ", Array.isArray(S.sizes) ? S.sizes.join(", ") : ""]
                            }), n.jsxs("div", {
                                className: "flex gap-2 mt-2",
                                children: [n.jsxs("button", {
                                    onClick: () => H(S),
                                    className: "text-blue-500 text-sm px-2 py-1",
                                    children: [n.jsx("i", {className: "fas fa-edit"}), " Изменить"]
                                }), n.jsxs("button", {
                                    onClick: () => W(S.id),
                                    className: "text-red-500 text-sm px-2 py-1",
                                    children: [n.jsx("i", {className: "fas fa-trash"}), " Удалить"]
                                })]
                            })]
                        })]
                    })
                }, S.id)
            })
        }) : n.jsx("div", {
            className: "bg-white rounded-2xl overflow-hidden shadow-sm", children: n.jsx("div", {
                className: "overflow-x-auto", children: n.jsxs("table", {
                    className: "w-full",
                    children: [n.jsx("thead", {
                        className: "bg-gray-50 border-b",
                        children: n.jsxs("tr", {
                            className: "text-left",
                            children: [n.jsx("th", {
                                className: "px-4 py-3 text-sm font-black",
                                children: "Фото"
                            }), n.jsx("th", {
                                className: "px-4 py-3 text-sm font-black",
                                children: "Название"
                            }), n.jsx("th", {
                                className: "px-4 py-3 text-sm font-black",
                                children: "Цена"
                            }), n.jsx("th", {
                                className: "px-4 py-3 text-sm font-black",
                                children: "Категория"
                            }), n.jsx("th", {
                                className: "px-4 py-3 text-sm font-black",
                                children: "Размеры"
                            }), n.jsx("th", {
                                className: "px-4 py-3 text-sm font-black",
                                children: "Остаток"
                            }), n.jsx("th", {className: "px-4 py-3 text-sm font-black", children: "Действия"})]
                        })
                    }), n.jsx("tbody", {
                        children: e.map(S => {
                            var M;
                            return n.jsxs("tr", {
                                className: "border-b hover:bg-gray-50",
                                children: [n.jsx("td", {
                                    className: "px-4 py-3",
                                    children: n.jsx("img", {
                                        src: ((M = S.images) == null ? void 0 : M[0]) || "https://placehold.co/100x100/eeeeee/cccccc?text=No+Image",
                                        alt: S.name,
                                        className: "w-10 h-10 object-cover rounded"
                                    })
                                }), n.jsx("td", {
                                    className: "px-4 py-3 font-medium",
                                    children: S.name
                                }), n.jsxs("td", {
                                    className: "px-4 py-3",
                                    children: [S.price.toLocaleString(), " ₽"]
                                }), n.jsx("td", {
                                    className: "px-4 py-3",
                                    children: k(S.category)
                                }), n.jsx("td", {
                                    className: "px-4 py-3 text-sm",
                                    children: Array.isArray(S.sizes) ? S.sizes.join(", ") : ""
                                }), n.jsx("td", {
                                    className: "px-4 py-3",
                                    children: S.stock
                                }), n.jsxs("td", {
                                    className: "px-4 py-3",
                                    children: [n.jsx("button", {
                                        onClick: () => H(S),
                                        className: "text-blue-500 mr-3",
                                        children: n.jsx("i", {className: "fas fa-edit"})
                                    }), n.jsx("button", {
                                        onClick: () => W(S.id),
                                        className: "text-red-500",
                                        children: n.jsx("i", {className: "fas fa-trash"})
                                    })]
                                })]
                            }, S.id)
                        })
                    })]
                })
            })
        }), r && n.jsx("div", {
            className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: n.jsxs("div", {
                className: "bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto",
                children: [n.jsxs("div", {
                    className: "sticky top-0 bg-white p-4 border-b flex justify-between items-center",
                    children: [n.jsxs("h2", {
                        className: "text-xl font-black",
                        children: [a ? "Редактировать" : "Добавить", " товар"]
                    }), n.jsx("button", {
                        onClick: () => s(!1),
                        className: "text-2xl w-8 h-8 flex items-center justify-center",
                        children: "×"
                    })]
                }), n.jsxs("div", {
                    className: "p-4 md:p-6", children: [n.jsxs("div", {
                        className: "mb-4",
                        children: [n.jsx("label", {
                            className: "block text-sm font-bold mb-2",
                            children: "Фото товара *"
                        }), n.jsxs("div", {
                            className: "flex flex-wrap gap-3 mb-3",
                            children: [i.map((S, M) => n.jsxs("div", {
                                className: "relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200",
                                children: [n.jsx("img", {
                                    src: S,
                                    alt: `Preview ${M + 1}`,
                                    className: "w-full h-full object-cover"
                                }), n.jsx("button", {
                                    onClick: () => G(M),
                                    className: "absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition",
                                    children: "×"
                                })]
                            }, M)), n.jsxs("label", {
                                className: "cursor-pointer w-24 h-24 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-200 transition border-2 border-dashed border-gray-300",
                                children: [f ? n.jsx("div", {className: "w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"}) : n.jsxs(n.Fragment, {
                                    children: [n.jsx("i", {className: "fas fa-plus text-2xl text-gray-400"}), n.jsx("span", {
                                        className: "text-xs text-gray-500",
                                        children: "Добавить"
                                    })]
                                }), n.jsx("input", {
                                    type: "file",
                                    accept: "image/*",
                                    multiple: !0,
                                    onChange: L,
                                    className: "hidden",
                                    disabled: f
                                })]
                            })]
                        }), n.jsx("p", {
                            className: "text-xs text-gray-400 mt-2",
                            children: "Можно выбрать несколько фото (макс. 5). Первое фото будет основным. Максимум 5MB на файл."
                        }), i.length === 0 && !a && n.jsx("p", {
                            className: "text-xs text-red-500 mt-1",
                            children: "Загрузите хотя бы одно фото"
                        })]
                    }), n.jsxs("div", {
                        className: "mb-4",
                        children: [n.jsx("label", {
                            className: "block text-sm font-bold mb-2",
                            children: "Название *"
                        }), n.jsx("input", {
                            type: "text",
                            value: p.name,
                            onChange: S => d({...p, name: S.target.value}),
                            className: "w-full px-3 py-2 border rounded-lg",
                            placeholder: "Введите название товара"
                        })]
                    }), n.jsxs("div", {
                        className: "grid grid-cols-2 gap-4 mb-4",
                        children: [n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-2",
                                children: "Цена *"
                            }), n.jsx("input", {
                                type: "number",
                                value: p.price,
                                onChange: S => d({...p, price: S.target.value}),
                                className: "w-full px-3 py-2 border rounded-lg",
                                placeholder: "0"
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-2",
                                children: "Старая цена (скидка)"
                            }), n.jsx("input", {
                                type: "number",
                                value: p.oldPrice,
                                onChange: S => d({...p, oldPrice: S.target.value}),
                                className: "w-full px-3 py-2 border rounded-lg",
                                placeholder: "0"
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "grid grid-cols-2 gap-4 mb-4",
                        children: [n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-2",
                                children: "Категория"
                            }), n.jsx("select", {
                                value: p.category,
                                onChange: S => d({...p, category: S.target.value}),
                                className: "w-full px-3 py-2 border rounded-lg",
                                children: x.map(S => n.jsx("option", {value: S.id, children: S.name}, S.id))
                            }), n.jsxs("p", {
                                className: "text-xs text-gray-400 mt-1",
                                children: [p.category === "shoes" && "Размеры обуви: 35-46", p.category === "clothes" && "Размеры одежды: XS-XXL", p.category === "accessories" && "One size"]
                            })]
                        }), n.jsxs("div", {
                            children: [n.jsx("label", {
                                className: "block text-sm font-bold mb-2",
                                children: "Количество на складе"
                            }), n.jsx("input", {
                                type: "number",
                                value: p.stock,
                                onChange: S => d({...p, stock: S.target.value}),
                                className: "w-full px-3 py-2 border rounded-lg",
                                placeholder: "0"
                            })]
                        })]
                    }), n.jsxs("div", {
                        className: "mb-4",
                        children: [n.jsx("label", {
                            className: "block text-sm font-bold mb-2",
                            children: "Описание"
                        }), n.jsx("textarea", {
                            value: p.description,
                            onChange: S => d({...p, description: S.target.value}),
                            rows: 3,
                            className: "w-full px-3 py-2 border rounded-lg resize-none",
                            placeholder: "Описание товара"
                        })]
                    }), n.jsxs("div", {
                        className: "mb-4",
                        children: [n.jsx("label", {
                            className: "block text-sm font-bold mb-2",
                            children: "Размеры *"
                        }), n.jsx("div", {
                            className: "flex flex-wrap gap-2",
                            children: y.map(S => n.jsx("button", {
                                type: "button",
                                onClick: () => A(S),
                                className: `w-14 h-14 rounded-lg border-2 text-sm font-bold ${p.sizes.includes(S) ? "border-black bg-black text-white" : "border-gray-300 hover:border-black"}`,
                                children: S
                            }, S))
                        }), p.sizes.length === 0 && n.jsx("p", {
                            className: "text-xs text-red-500 mt-1",
                            children: "Выберите хотя бы один размер"
                        })]
                    }), n.jsxs("div", {
                        className: "mb-4",
                        children: [n.jsx("label", {
                            className: "block text-sm font-bold mb-2",
                            children: "Цвета"
                        }), n.jsx("div", {
                            className: "flex flex-wrap gap-2",
                            children: R.map(S => n.jsx("button", {
                                type: "button",
                                onClick: () => U(S.code),
                                className: `w-8 h-8 rounded-full border-2 ${p.colors.includes(S.code) ? "ring-2 ring-black ring-offset-2" : ""}`,
                                style: {backgroundColor: S.value},
                                title: S.name
                            }, S.code))
                        })]
                    }), n.jsxs("div", {
                        className: "flex flex-wrap gap-4 mb-6",
                        children: [n.jsxs("label", {
                            className: "flex items-center gap-2",
                            children: [n.jsx("input", {
                                type: "checkbox",
                                checked: p.isNew,
                                onChange: S => d({...p, isNew: S.target.checked})
                            }), n.jsx("span", {children: "Новинка (NEW)"})]
                        }), n.jsxs("label", {
                            className: "flex items-center gap-2",
                            children: [n.jsx("input", {
                                type: "checkbox",
                                checked: p.isSale,
                                onChange: S => d({...p, isSale: S.target.checked})
                            }), n.jsx("span", {children: "Распродажа (SALE)"})]
                        })]
                    }), n.jsxs("div", {
                        className: "flex flex-col sm:flex-row gap-3",
                        children: [n.jsx("button", {
                            onClick: a ? P : X,
                            disabled: f,
                            className: "flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50",
                            children: a ? "Сохранить" : "Добавить"
                        }), n.jsx("button", {
                            onClick: () => s(!1),
                            className: "px-6 py-2 border rounded-lg hover:bg-gray-100",
                            children: "Отмена"
                        })]
                    })]
                })]
            })
        })]
    })
}, Nw = () => {
    const [e, t] = j.useState([]), [r, s] = j.useState("all"), [a, l] = j.useState(null), [i, o] = j.useState(!1),
        c = [{value: "pending", label: "Ожидает", color: "bg-yellow-100 text-yellow-700"}, {
            value: "processing",
            label: "В обработке",
            color: "bg-blue-100 text-blue-700"
        }, {value: "shipped", label: "Отправлен", color: "bg-purple-100 text-purple-700"}, {
            value: "delivered",
            label: "Доставлен",
            color: "bg-green-100 text-green-700"
        }, {value: "cancelled", label: "Отменён", color: "bg-red-100 text-red-700"}];
    j.useEffect(() => {
        const d = () => {
            o(window.innerWidth < 768)
        };
        return d(), window.addEventListener("resize", d), () => window.removeEventListener("resize", d)
    }, []), j.useEffect(() => {
        u()
    }, []);
    const u = () => {
        const d = Is();
        t(d)
    }, f = (d, x) => {
        uv(d, x), u(), _.success(`Статус заказа ${d} изменён`)
    }, m = r === "all" ? e : e.filter(d => d.status === r), y = {
        total: e.length,
        pending: e.filter(d => d.status === "pending").length,
        processing: e.filter(d => d.status === "processing").length,
        shipped: e.filter(d => d.status === "shipped").length,
        delivered: e.filter(d => d.status === "delivered").length,
        totalRevenue: e.reduce((d, x) => d + x.total, 0)
    }, b = d => {
        const x = c.find(h => h.value === d);
        return x ? x.label : d
    }, p = d => {
        const x = c.find(h => h.value === d);
        return x ? x.color : "bg-gray-100 text-gray-700"
    };
    return e.length === 0 ? n.jsxs("div", {
        children: [n.jsxs("h1", {
            className: "text-2xl md:text-3xl font-light mb-6",
            children: ["Управление ", n.jsx("span", {className: "font-bold", children: "заказами"})]
        }), n.jsxs("div", {
            className: "bg-white rounded-2xl p-12 text-center",
            children: [n.jsx("i", {className: "fas fa-box-open text-5xl text-gray-300 mb-4"}), n.jsx("h3", {
                className: "text-xl font-black mb-2",
                children: "ЗАКАЗОВ ПОКА НЕТ"
            }), n.jsx("p", {className: "text-gray-500", children: "Заказы появятся после оформления покупок"})]
        })]
    }) : n.jsxs("div", {
        children: [n.jsxs("h1", {
            className: "text-2xl md:text-3xl font-light mb-6",
            children: ["Управление ", n.jsx("span", {className: "font-bold", children: "заказами"})]
        }), n.jsxs("div", {
            className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6",
            children: [n.jsxs("div", {
                className: "bg-white rounded-xl p-3 shadow-sm border-l-4 border-black",
                children: [n.jsx("p", {
                    className: "text-xl font-bold",
                    children: y.total
                }), n.jsx("p", {className: "text-xs text-gray-500", children: "Всего"})]
            }), n.jsxs("div", {
                className: "bg-white rounded-xl p-3 shadow-sm border-l-4 border-yellow-500",
                children: [n.jsx("p", {
                    className: "text-xl font-bold",
                    children: y.pending
                }), n.jsx("p", {className: "text-xs text-gray-500", children: "Ожидают"})]
            }), n.jsxs("div", {
                className: "bg-white rounded-xl p-3 shadow-sm border-l-4 border-blue-500",
                children: [n.jsx("p", {
                    className: "text-xl font-bold",
                    children: y.processing
                }), n.jsx("p", {className: "text-xs text-gray-500", children: "В обработке"})]
            }), n.jsxs("div", {
                className: "bg-white rounded-xl p-3 shadow-sm border-l-4 border-purple-500",
                children: [n.jsx("p", {
                    className: "text-xl font-bold",
                    children: y.shipped
                }), n.jsx("p", {className: "text-xs text-gray-500", children: "Отправлены"})]
            }), n.jsxs("div", {
                className: "bg-white rounded-xl p-3 shadow-sm border-l-4 border-green-500",
                children: [n.jsx("p", {
                    className: "text-xl font-bold",
                    children: y.delivered
                }), n.jsx("p", {className: "text-xs text-gray-500", children: "Доставлены"})]
            }), n.jsxs("div", {
                className: "bg-white rounded-xl p-3 shadow-sm border-l-4 border-black",
                children: [n.jsxs("p", {
                    className: "text-xl font-bold",
                    children: [y.totalRevenue.toLocaleString(), " ₽"]
                }), n.jsx("p", {className: "text-xs text-gray-500", children: "Выручка"})]
            })]
        }), n.jsxs("div", {
            className: "flex gap-2 mb-6 flex-wrap",
            children: [n.jsx("button", {
                onClick: () => s("all"),
                className: `px-3 py-1.5 rounded-full text-sm font-medium transition ${r === "all" ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"}`,
                children: "Все"
            }), c.map(d => n.jsx("button", {
                onClick: () => s(d.value),
                className: `px-3 py-1.5 rounded-full text-sm font-medium transition ${r === d.value ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"}`,
                children: d.label
            }, d.value))]
        }), i ? n.jsx("div", {
            className: "space-y-4", children: m.map(d => {
                const x = JSON.parse(localStorage.getItem("misat_users") || "[]").find(h => h.id === d.userId);
                return n.jsxs("div", {
                    className: "bg-white rounded-2xl p-4 shadow-sm border",
                    children: [n.jsxs("div", {
                        className: "flex justify-between items-start mb-2",
                        children: [n.jsx("span", {
                            className: "font-mono text-sm font-black",
                            children: d.id
                        }), n.jsx("span", {
                            className: `px-2 py-1 rounded-full text-xs font-black ${p(d.status)}`,
                            children: b(d.status)
                        })]
                    }), n.jsxs("p", {
                        className: "font-medium",
                        children: [x == null ? void 0 : x.first_name, " ", x == null ? void 0 : x.last_name]
                    }), n.jsxs("p", {
                        className: "text-sm text-gray-500",
                        children: [d.total.toLocaleString(), " ₽"]
                    }), n.jsx("p", {
                        className: "text-xs text-gray-400",
                        children: new Date(d.created_at).toLocaleDateString()
                    }), n.jsxs("div", {
                        className: "mt-3 flex gap-2",
                        children: [n.jsx("select", {
                            value: d.status,
                            onChange: h => f(d.id, h.target.value),
                            className: "flex-1 px-2 py-1.5 border rounded-lg text-sm",
                            children: c.map(h => n.jsx("option", {value: h.value, children: h.label}, h.value))
                        }), n.jsx("button", {
                            onClick: () => l(d),
                            className: "bg-black text-white px-3 py-1.5 rounded-lg text-sm",
                            children: "Детали"
                        })]
                    })]
                }, d.id)
            })
        }) : n.jsx("div", {
            className: "bg-white rounded-2xl overflow-hidden shadow-sm", children: n.jsx("div", {
                className: "overflow-x-auto", children: n.jsxs("table", {
                    className: "w-full",
                    children: [n.jsx("thead", {
                        className: "bg-gray-50 border-b",
                        children: n.jsxs("tr", {
                            className: "text-left",
                            children: [n.jsx("th", {
                                className: "px-4 py-3 text-sm font-medium text-gray-500",
                                children: "Номер"
                            }), n.jsx("th", {
                                className: "px-4 py-3 text-sm font-medium text-gray-500",
                                children: "Покупатель"
                            }), n.jsx("th", {
                                className: "px-4 py-3 text-sm font-medium text-gray-500",
                                children: "Сумма"
                            }), n.jsx("th", {
                                className: "px-4 py-3 text-sm font-medium text-gray-500",
                                children: "Статус"
                            }), n.jsx("th", {
                                className: "px-4 py-3 text-sm font-medium text-gray-500",
                                children: "Дата"
                            }), n.jsx("th", {
                                className: "px-4 py-3 text-sm font-medium text-gray-500",
                                children: "Действия"
                            })]
                        })
                    }), n.jsx("tbody", {
                        children: m.map(d => {
                            const x = JSON.parse(localStorage.getItem("misat_users") || "[]").find(h => h.id === d.userId);
                            return n.jsxs("tr", {
                                className: "border-b hover:bg-gray-50 transition",
                                children: [n.jsx("td", {
                                    className: "px-4 py-3 font-mono text-sm font-medium",
                                    children: d.id
                                }), n.jsx("td", {
                                    className: "px-4 py-3",
                                    children: n.jsxs("div", {
                                        children: [n.jsxs("p", {
                                            className: "font-medium",
                                            children: [x == null ? void 0 : x.first_name, " ", x == null ? void 0 : x.last_name]
                                        }), n.jsx("p", {
                                            className: "text-xs text-gray-500",
                                            children: x == null ? void 0 : x.email
                                        })]
                                    })
                                }), n.jsxs("td", {
                                    className: "px-4 py-3 font-bold",
                                    children: [d.total.toLocaleString(), " ₽"]
                                }), n.jsx("td", {
                                    className: "px-4 py-3",
                                    children: n.jsx("select", {
                                        value: d.status,
                                        onChange: h => f(d.id, h.target.value),
                                        className: `px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-1 focus:ring-black ${p(d.status)}`,
                                        children: c.map(h => n.jsx("option", {
                                            value: h.value,
                                            children: h.label
                                        }, h.value))
                                    })
                                }), n.jsx("td", {
                                    className: "px-4 py-3 text-sm text-gray-500",
                                    children: new Date(d.created_at).toLocaleDateString()
                                }), n.jsx("td", {
                                    className: "px-4 py-3",
                                    children: n.jsx("button", {
                                        onClick: () => l(d),
                                        className: "text-gray-500 hover:text-black transition",
                                        children: n.jsx("i", {className: "fas fa-eye"})
                                    })
                                })]
                            }, d.id)
                        })
                    })]
                })
            })
        }), a && n.jsxs(n.Fragment, {
            children: [n.jsx("div", {
                className: "fixed inset-0 bg-black/50 z-50",
                onClick: () => l(null)
            }), n.jsxs("div", {
                className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl p-4 md:p-6 z-50 max-h-[85vh] overflow-y-auto",
                children: [n.jsxs("div", {
                    className: "flex justify-between items-center mb-4",
                    children: [n.jsxs("h2", {
                        className: "text-xl font-bold",
                        children: ["Детали заказа ", a.id]
                    }), n.jsx("button", {
                        onClick: () => l(null),
                        className: "text-2xl w-8 h-8 flex items-center justify-center",
                        children: "×"
                    })]
                }), n.jsxs("div", {
                    className: "border-t pt-4 space-y-4",
                    children: [n.jsxs("div", {
                        children: [n.jsx("h3", {
                            className: "font-black text-md mb-2 border-b pb-1",
                            children: "Информация о получателе"
                        }), n.jsx("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm", children: (() => {
                                const d = a.comment.match(/ФИО: (.*?)\\n/), x = a.comment.match(/Email: (.*?)(\\n|$)/);
                                return n.jsxs(n.Fragment, {
                                    children: [n.jsxs("div", {
                                        children: [n.jsx("p", {
                                            className: "text-gray-500",
                                            children: "ФИО"
                                        }), n.jsx("p", {className: "font-semibold", children: d ? d[1] : "Не указано"})]
                                    }), n.jsxs("div", {
                                        children: [n.jsx("p", {
                                            className: "text-gray-500",
                                            children: "Телефон"
                                        }), n.jsx("p", {className: "font-semibold", children: a.phone})]
                                    }), n.jsxs("div", {
                                        children: [n.jsx("p", {
                                            className: "text-gray-500",
                                            children: "Email"
                                        }), n.jsx("p", {className: "font-semibold", children: x ? x[1] : "Не указан"})]
                                    })]
                                })
                            })()
                        })]
                    }), n.jsxs("div", {
                        children: [n.jsx("h3", {
                            className: "font-black text-md mb-2 border-b pb-1",
                            children: "Адрес доставки"
                        }), n.jsx("p", {className: "text-sm whitespace-pre-line", children: a.address})]
                    }), n.jsxs("div", {
                        children: [n.jsx("h3", {
                            className: "font-black text-md mb-2 border-b pb-1",
                            children: "Состав заказа"
                        }), n.jsx("div", {
                            className: "space-y-2 max-h-48 overflow-y-auto",
                            children: a.items.map((d, x) => n.jsxs("div", {
                                className: "flex justify-between text-sm border-b pb-2",
                                children: [n.jsxs("div", {
                                    children: [n.jsx("span", {
                                        className: "font-medium",
                                        children: d.name
                                    }), n.jsxs("span", {
                                        className: "text-gray-500 ml-2",
                                        children: ["x", d.quantity]
                                    }), n.jsxs("div", {
                                        className: "text-xs text-gray-400",
                                        children: ["Размер: ", d.size]
                                    })]
                                }), n.jsxs("span", {
                                    className: "font-bold",
                                    children: [(d.price * d.quantity).toLocaleString(), " ₽"]
                                })]
                            }, x))
                        }), n.jsxs("div", {
                            className: "flex justify-between font-bold text-md pt-2",
                            children: [n.jsx("span", {children: "Итого:"}), n.jsxs("span", {children: [a.total.toLocaleString(), " ₽"]})]
                        })]
                    }), (() => {
                        const d = a.comment.replace(/ФИО: .*?\\n/, "").replace(/Email: .*?\\n/, "").trim();
                        return d && d !== "" ? n.jsxs("div", {
                            children: [n.jsx("h3", {
                                className: "font-black text-md mb-2 border-b pb-1",
                                children: "Комментарий"
                            }), n.jsx("p", {className: "text-sm text-gray-600", children: d})]
                        }) : null
                    })(), n.jsxs("div", {
                        className: "pt-2",
                        children: [n.jsx("label", {
                            className: "block text-sm font-bold mb-2",
                            children: "Изменить статус"
                        }), n.jsx("select", {
                            value: a.status,
                            onChange: d => {
                                f(a.id, d.target.value), l({...a, status: d.target.value})
                            },
                            className: "w-full px-3 py-2 border rounded-xl text-sm",
                            children: c.map(d => n.jsx("option", {value: d.value, children: d.label}, d.value))
                        })]
                    })]
                })]
            })]
        })]
    })
}, ww = () => {
    const [e, t] = j.useState([]), [r, s] = j.useState(""), [a, l] = j.useState(!1), [i, o] = j.useState(null), [c, u] = j.useState("");
    j.useEffect(() => {
        f()
    }, []);
    const f = async () => {
        l(!0);
        try {
            const x = await Wn.getAll();
            t(x.data)
        } catch (x) {
            console.error("Ошибка загрузки категорий:", x), _.error("Ошибка загрузки категорий")
        } finally {
            l(!1)
        }
    }, m = async () => {
        var h, g;
        if (!r.trim()) {
            _.error("Введите название категории");
            return
        }
        const x = r.toLowerCase().replace(/[^а-яёa-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
        try {
            await Wn.create({name: r, slug: x, is_active: !0}), _.success("Категория добавлена"), s(""), f()
        } catch (v) {
            console.error("Ошибка добавления:", v), _.error(((g = (h = v.response) == null ? void 0 : h.data) == null ? void 0 : g.error) || "Ошибка добавления категории")
        }
    }, y = async x => {
        var h, g;
        if (confirm("Удалить категорию? Все товары в этой категории останутся без категории.")) try {
            await Wn.delete(x), _.success("Категория удалена"), f()
        } catch (v) {
            console.error("Ошибка удаления:", v), _.error(((g = (h = v.response) == null ? void 0 : h.data) == null ? void 0 : g.error) || "Ошибка удаления категории")
        }
    }, b = x => {
        o(x), u(x.name)
    }, p = async () => {
        var h, g;
        if (!i) return;
        if (!c.trim()) {
            _.error("Введите название категории");
            return
        }
        const x = c.toLowerCase().replace(/[^а-яёa-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
        try {
            await Wn.update(i.id, {name: c, slug: x}), _.success("Категория обновлена"), o(null), u(""), f()
        } catch (v) {
            console.error("Ошибка обновления:", v), _.error(((g = (h = v.response) == null ? void 0 : h.data) == null ? void 0 : g.error) || "Ошибка обновления категории")
        }
    }, d = async x => {
        try {
            await Wn.update(x.id, {is_active: !x.is_active}), _.success(`Категория ${x.is_active ? "деактивирована" : "активирована"}`), f()
        } catch (h) {
            console.error("Ошибка изменения статуса:", h), _.error("Ошибка изменения статуса")
        }
    };
    return a && e.length === 0 ? n.jsx("div", {
        className: "flex justify-center items-center h-64",
        children: n.jsxs("div", {
            className: "text-center",
            children: [n.jsx("div", {className: "w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"}), n.jsx("p", {
                className: "text-gray-500",
                children: "Загрузка категорий..."
            })]
        })
    }) : n.jsxs("div", {
        children: [n.jsx("div", {
            className: "flex justify-between items-center mb-8",
            children: n.jsxs("div", {
                children: [n.jsxs("h1", {
                    className: "text-3xl font-light",
                    children: ["Управление ", n.jsx("span", {className: "font-bold", children: "категориями"})]
                }), n.jsxs("p", {className: "text-gray-500 text-sm mt-1", children: ["Всего категорий: ", e.length]})]
            })
        }), i && n.jsx("div", {
            className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
            children: n.jsxs("div", {
                className: "bg-white rounded-2xl p-6 w-full max-w-md",
                children: [n.jsx("h2", {
                    className: "text-xl font-bold mb-4",
                    children: "Редактировать категорию"
                }), n.jsx("input", {
                    type: "text",
                    value: c,
                    onChange: x => u(x.target.value),
                    className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none mb-4",
                    placeholder: "Название категории",
                    autoFocus: !0
                }), n.jsxs("div", {
                    className: "flex gap-3",
                    children: [n.jsx("button", {
                        onClick: p,
                        className: "flex-1 bg-black text-white py-2 rounded-xl hover:bg-gray-800",
                        children: "Сохранить"
                    }), n.jsx("button", {
                        onClick: () => {
                            o(null), u("")
                        },
                        className: "flex-1 border-2 border-gray-200 py-2 rounded-xl hover:bg-gray-50",
                        children: "Отмена"
                    })]
                })]
            })
        }), e.length === 0 ? n.jsxs("div", {
            className: "bg-white rounded-2xl p-12 text-center mb-8",
            children: [n.jsx("i", {className: "fas fa-tags text-5xl text-gray-300 mb-4"}), n.jsx("p", {
                className: "text-gray-500",
                children: "Категорий пока нет"
            }), n.jsx("p", {
                className: "text-sm text-gray-400 mt-2",
                children: "Добавьте первую категорию через форму ниже"
            })]
        }) : n.jsx("div", {
            className: "bg-white rounded-2xl overflow-hidden shadow-sm mb-8", children: n.jsx("div", {
                className: "overflow-x-auto", children: n.jsxs("table", {
                    className: "w-full",
                    children: [n.jsx("thead", {
                        className: "bg-gray-50 border-b",
                        children: n.jsxs("tr", {
                            className: "text-left",
                            children: [n.jsx("th", {
                                className: "px-6 py-4 text-sm font-medium text-gray-500",
                                children: "ID"
                            }), n.jsx("th", {
                                className: "px-6 py-4 text-sm font-medium text-gray-500",
                                children: "Название"
                            }), n.jsx("th", {
                                className: "px-6 py-4 text-sm font-medium text-gray-500",
                                children: "Slug"
                            }), n.jsx("th", {
                                className: "px-6 py-4 text-sm font-medium text-gray-500",
                                children: "Статус"
                            }), n.jsx("th", {
                                className: "px-6 py-4 text-sm font-medium text-gray-500",
                                children: "Действия"
                            })]
                        })
                    }), n.jsx("tbody", {
                        children: e.map(x => n.jsxs("tr", {
                            className: "border-b hover:bg-gray-50 transition",
                            children: [n.jsx("td", {
                                className: "px-6 py-4 text-sm",
                                children: x.id
                            }), n.jsx("td", {
                                className: "px-6 py-4 font-medium",
                                children: x.name
                            }), n.jsx("td", {
                                className: "px-6 py-4 text-sm text-gray-500",
                                children: x.slug
                            }), n.jsx("td", {
                                className: "px-6 py-4",
                                children: n.jsx("button", {
                                    onClick: () => d(x),
                                    className: `px-3 py-1 rounded-full text-xs font-medium ${x.is_active !== !1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`,
                                    children: x.is_active !== !1 ? "Активна" : "Неактивна"
                                })
                            }), n.jsxs("td", {
                                className: "px-6 py-4",
                                children: [n.jsx("button", {
                                    onClick: () => b(x),
                                    className: "text-blue-500 hover:text-blue-700 mr-3 transition",
                                    children: n.jsx("i", {className: "fas fa-edit"})
                                }), n.jsx("button", {
                                    onClick: () => y(x.id),
                                    className: "text-gray-400 hover:text-red-500 transition",
                                    children: n.jsx("i", {className: "fas fa-trash"})
                                })]
                            })]
                        }, x.id))
                    })]
                })
            })
        }), n.jsxs("div", {
            className: "bg-white rounded-2xl p-6 shadow-sm border border-gray-100",
            children: [n.jsx("h2", {
                className: "text-xl font-semibold mb-4",
                children: "Добавить категорию"
            }), n.jsxs("div", {
                className: "flex flex-col sm:flex-row gap-4",
                children: [n.jsx("input", {
                    type: "text",
                    value: r,
                    onChange: x => s(x.target.value),
                    onKeyPress: x => x.key === "Enter" && m(),
                    placeholder: "Название категории",
                    className: "flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                }), n.jsx("button", {
                    onClick: m,
                    disabled: !r.trim(),
                    className: "bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed",
                    children: "Добавить"
                })]
            }), n.jsx("p", {
                className: "text-xs text-gray-400 mt-3",
                children: "Slug будет сгенерирован автоматически из названия"
            })]
        })]
    })
}, kw = () => {
    const [e, t] = j.useState([]), [r, s] = j.useState("");
    j.useEffect(() => {
        a()
    }, []);
    const a = () => {
        t(En())
    }, l = (c, u) => {
        const f = e.map(m => m.id === c ? {...m, role: u} : m);
        nl(f), t(f), _.success("Роль пользователя обновлена")
    }, i = c => {
        if (c === 1) {
            _.error("Нельзя удалить главного администратора");
            return
        }
        if (confirm("Удалить пользователя?")) {
            const u = e.filter(f => f.id !== c);
            nl(u), t(u), _.success("Пользователь удалён")
        }
    }, o = e.filter(c => {
        var u, f;
        return c.email.toLowerCase().includes(r.toLowerCase()) || ((u = c.first_name) == null ? void 0 : u.toLowerCase().includes(r.toLowerCase())) || ((f = c.last_name) == null ? void 0 : f.toLowerCase().includes(r.toLowerCase()))
    });
    return n.jsxs("div", {
        children: [n.jsxs("div", {
            className: "mb-8",
            children: [n.jsx("h1", {
                className: "text-3xl font-black tracking-tighter",
                children: "УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ"
            }), n.jsxs("p", {className: "text-gray-500 mt-1", children: ["Всего пользователей: ", e.length]})]
        }), n.jsx("div", {
            className: "mb-6",
            children: n.jsxs("div", {
                className: "relative max-w-md",
                children: [n.jsx("input", {
                    type: "text",
                    placeholder: "Поиск по email или имени...",
                    value: r,
                    onChange: c => s(c.target.value),
                    className: "w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                }), n.jsx("i", {className: "fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"})]
            })
        }), n.jsx("div", {
            className: "bg-white rounded-2xl overflow-hidden shadow-sm", children: n.jsx("div", {
                className: "overflow-x-auto", children: n.jsxs("table", {
                    className: "w-full",
                    children: [n.jsx("thead", {
                        className: "bg-gray-50 border-b",
                        children: n.jsxs("tr", {
                            className: "text-left",
                            children: [n.jsx("th", {
                                className: "px-6 py-4 text-sm font-black",
                                children: "ID"
                            }), n.jsx("th", {
                                className: "px-6 py-4 text-sm font-black",
                                children: "Пользователь"
                            }), n.jsx("th", {
                                className: "px-6 py-4 text-sm font-black",
                                children: "Email"
                            }), n.jsx("th", {
                                className: "px-6 py-4 text-sm font-black",
                                children: "Телефон"
                            }), n.jsx("th", {
                                className: "px-6 py-4 text-sm font-black",
                                children: "Роль"
                            }), n.jsx("th", {
                                className: "px-6 py-4 text-sm font-black",
                                children: "Дата регистрации"
                            }), n.jsx("th", {className: "px-6 py-4 text-sm font-black", children: "Действия"})]
                        })
                    }), n.jsx("tbody", {
                        children: o.map(c => n.jsxs("tr", {
                            className: "border-b hover:bg-gray-50 transition",
                            children: [n.jsx("td", {
                                className: "px-6 py-4 text-sm",
                                children: c.id
                            }), n.jsx("td", {
                                className: "px-6 py-4",
                                children: n.jsxs("div", {
                                    children: [n.jsxs("p", {
                                        className: "font-black",
                                        children: [c.first_name, " ", c.last_name]
                                    }), c.id === 1 && n.jsx("span", {
                                        className: "text-xs text-blue-600",
                                        children: "Главный админ"
                                    })]
                                })
                            }), n.jsx("td", {
                                className: "px-6 py-4 text-sm",
                                children: c.email
                            }), n.jsx("td", {
                                className: "px-6 py-4 text-sm",
                                children: c.phone || "—"
                            }), n.jsx("td", {
                                className: "px-6 py-4",
                                children: n.jsxs("select", {
                                    value: c.role,
                                    onChange: u => l(c.id, u.target.value),
                                    className: `px-3 py-1 rounded-full text-xs font-bold border-0 ${c.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`,
                                    children: [n.jsx("option", {
                                        value: "user",
                                        children: "Пользователь"
                                    }), n.jsx("option", {value: "admin", children: "Администратор"})]
                                })
                            }), n.jsx("td", {
                                className: "px-6 py-4 text-sm text-gray-500",
                                children: new Date(c.created_at).toLocaleDateString()
                            }), n.jsx("td", {
                                className: "px-6 py-4",
                                children: n.jsx("button", {
                                    onClick: () => i(c.id),
                                    disabled: c.id === 1,
                                    className: "text-red-500 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: n.jsx("i", {className: "fas fa-trash"})
                                })
                            })]
                        }, c.id))
                    })]
                })
            })
        })]
    })
}, Sw = () => {
    const [e, t] = j.useState([]), [r, s] = j.useState(!1), [a, l] = j.useState(null), [i, o] = j.useState({
        code: "",
        discount: "",
        type: "percentage",
        minAmount: "",
        maxDiscount: "",
        expiresAt: "",
        usageLimit: "",
        isActive: !0
    });
    j.useEffect(() => {
        c()
    }, []);
    const c = () => {
        const d = localStorage.getItem("misat_promocodes");
        d && t(JSON.parse(d))
    }, u = d => {
        localStorage.setItem("misat_promocodes", JSON.stringify(d)), t(d)
    }, f = () => {
        if (!i.code.trim()) {
            _.error("Введите код промокода");
            return
        }
        if (!i.discount || Number(i.discount) <= 0) {
            _.error("Введите корректную скидку");
            return
        }
        if (a) {
            const d = e.map(x => x.id === a.id ? {
                ...x,
                code: i.code.toUpperCase(),
                discount: Number(i.discount),
                type: i.type,
                minAmount: Number(i.minAmount) || 0,
                maxDiscount: i.maxDiscount ? Number(i.maxDiscount) : void 0,
                expiresAt: i.expiresAt,
                usageLimit: Number(i.usageLimit) || 0,
                isActive: i.isActive
            } : x);
            u(d), _.success("Промокод обновлён")
        } else {
            const d = {
                id: Date.now(),
                code: i.code.toUpperCase(),
                discount: Number(i.discount),
                type: i.type,
                minAmount: Number(i.minAmount) || 0,
                maxDiscount: i.maxDiscount ? Number(i.maxDiscount) : void 0,
                expiresAt: i.expiresAt,
                usageLimit: Number(i.usageLimit) || 0,
                usedCount: 0,
                isActive: !0
            };
            u([...e, d]), _.success("Промокод добавлен")
        }
        b(), s(!1)
    }, m = d => {
        confirm("Удалить промокод?") && (u(e.filter(x => x.id !== d)), _.success("Промокод удалён"))
    }, y = d => {
        const x = e.map(h => h.id === d ? {...h, isActive: !h.isActive} : h);
        u(x), _.success("Статус изменён")
    }, b = () => {
        o({
            code: "",
            discount: "",
            type: "percentage",
            minAmount: "",
            maxDiscount: "",
            expiresAt: "",
            usageLimit: "",
            isActive: !0
        }), l(null)
    }, p = d => {
        var x;
        l(d), o({
            code: d.code,
            discount: d.discount.toString(),
            type: d.type,
            minAmount: d.minAmount.toString(),
            maxDiscount: ((x = d.maxDiscount) == null ? void 0 : x.toString()) || "",
            expiresAt: d.expiresAt,
            usageLimit: d.usageLimit.toString(),
            isActive: d.isActive
        }), s(!0)
    };
    return n.jsxs("div", {
        children: [n.jsxs("div", {
            className: "flex justify-between items-center mb-6",
            children: [n.jsx("h1", {
                className: "text-2xl font-black",
                children: "Управление промокодами"
            }), n.jsx("button", {
                onClick: () => {
                    b(), s(!0)
                },
                className: "bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800",
                children: "+ Добавить промокод"
            })]
        }), e.length === 0 ? n.jsxs("div", {
            className: "bg-white rounded-2xl p-12 text-center",
            children: [n.jsx("i", {className: "fas fa-tag text-6xl text-gray-300 mb-4"}), n.jsx("p", {
                className: "text-gray-500",
                children: "Промокодов пока нет"
            })]
        }) : n.jsx("div", {
            className: "bg-white rounded-2xl overflow-hidden shadow-sm", children: n.jsxs("table", {
                className: "w-full",
                children: [n.jsx("thead", {
                    className: "bg-gray-50 border-b",
                    children: n.jsxs("tr", {
                        className: "text-left",
                        children: [n.jsx("th", {
                            className: "px-6 py-4 text-sm font-black",
                            children: "Код"
                        }), n.jsx("th", {
                            className: "px-6 py-4 text-sm font-black",
                            children: "Скидка"
                        }), n.jsx("th", {
                            className: "px-6 py-4 text-sm font-black",
                            children: "Мин. сумма"
                        }), n.jsx("th", {
                            className: "px-6 py-4 text-sm font-black",
                            children: "Лимит"
                        }), n.jsx("th", {
                            className: "px-6 py-4 text-sm font-black",
                            children: "Использовано"
                        }), n.jsx("th", {
                            className: "px-6 py-4 text-sm font-black",
                            children: "Статус"
                        }), n.jsx("th", {className: "px-6 py-4 text-sm font-black", children: "Действия"})]
                    })
                }), n.jsx("tbody", {
                    children: e.map(d => n.jsxs("tr", {
                        className: "border-b hover:bg-gray-50",
                        children: [n.jsx("td", {
                            className: "px-6 py-4 font-mono font-black",
                            children: d.code
                        }), n.jsxs("td", {
                            className: "px-6 py-4",
                            children: [d.discount, d.type === "percentage" ? "%" : " ₽"]
                        }), n.jsxs("td", {
                            className: "px-6 py-4",
                            children: [d.minAmount.toLocaleString(), " ₽"]
                        }), n.jsx("td", {
                            className: "px-6 py-4",
                            children: d.usageLimit || "∞"
                        }), n.jsx("td", {
                            className: "px-6 py-4",
                            children: d.usedCount
                        }), n.jsx("td", {
                            className: "px-6 py-4",
                            children: n.jsx("button", {
                                onClick: () => y(d.id),
                                className: `px-3 py-1 rounded-full text-xs font-black ${d.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`,
                                children: d.isActive ? "Активен" : "Неактивен"
                            })
                        }), n.jsxs("td", {
                            className: "px-6 py-4",
                            children: [n.jsx("button", {
                                onClick: () => p(d),
                                className: "text-blue-500 mr-3",
                                children: n.jsx("i", {className: "fas fa-edit"})
                            }), n.jsx("button", {
                                onClick: () => m(d.id),
                                className: "text-red-500",
                                children: n.jsx("i", {className: "fas fa-trash"})
                            })]
                        })]
                    }, d.id))
                })]
            })
        }), r && n.jsx("div", {
            className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: n.jsxs("div", {
                className: "bg-white rounded-2xl w-full max-w-md p-6",
                children: [n.jsxs("h2", {
                    className: "text-xl font-black mb-4",
                    children: [a ? "Редактировать" : "Добавить", " промокод"]
                }), n.jsxs("div", {
                    className: "space-y-4",
                    children: [n.jsx("input", {
                        type: "text",
                        placeholder: "Код промокода",
                        value: i.code,
                        onChange: d => o({...i, code: d.target.value.toUpperCase()}),
                        className: "w-full px-4 py-2 border rounded-lg uppercase"
                    }), n.jsxs("div", {
                        className: "flex gap-4",
                        children: [n.jsx("input", {
                            type: "number",
                            placeholder: "Скидка",
                            value: i.discount,
                            onChange: d => o({...i, discount: d.target.value}),
                            className: "flex-1 px-4 py-2 border rounded-lg"
                        }), n.jsxs("select", {
                            value: i.type,
                            onChange: d => o({...i, type: d.target.value}),
                            className: "px-4 py-2 border rounded-lg",
                            children: [n.jsx("option", {
                                value: "percentage",
                                children: "%"
                            }), n.jsx("option", {value: "fixed", children: "₽"})]
                        })]
                    }), n.jsx("input", {
                        type: "number",
                        placeholder: "Минимальная сумма заказа",
                        value: i.minAmount,
                        onChange: d => o({...i, minAmount: d.target.value}),
                        className: "w-full px-4 py-2 border rounded-lg"
                    }), n.jsx("input", {
                        type: "number",
                        placeholder: "Максимальная скидка (для %)",
                        value: i.maxDiscount,
                        onChange: d => o({...i, maxDiscount: d.target.value}),
                        className: "w-full px-4 py-2 border rounded-lg"
                    }), n.jsx("input", {
                        type: "datetime-local",
                        value: i.expiresAt,
                        onChange: d => o({...i, expiresAt: d.target.value}),
                        className: "w-full px-4 py-2 border rounded-lg"
                    }), n.jsx("input", {
                        type: "number",
                        placeholder: "Лимит использований",
                        value: i.usageLimit,
                        onChange: d => o({...i, usageLimit: d.target.value}),
                        className: "w-full px-4 py-2 border rounded-lg"
                    }), n.jsx("button", {
                        onClick: f,
                        className: "w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800",
                        children: a ? "Сохранить" : "Добавить"
                    })]
                })]
            })
        })]
    })
}, Cw = () => {
    const {user: e} = Ze(d => d.auth), [t, r] = j.useState([]), [s, a] = j.useState(null), [l, i] = j.useState(""), [o, c] = j.useState(""),
        u = j.useRef(null);
    j.useEffect(() => {
        f()
    }, []), j.useEffect(() => {
        var d;
        (d = u.current) == null || d.scrollIntoView({behavior: "smooth"})
    }, [s == null ? void 0 : s.messages]);
    const f = () => {
            const d = JSON.parse(localStorage.getItem("misat_chat_messages") || "[]"),
                x = JSON.parse(localStorage.getItem("misat_users") || "[]"), h = new Map;
            d.forEach(v => {
                var N;
                if (!h.has(v.userId)) {
                    const k = x.find(E => E.id === v.userId);
                    h.set(v.userId, {
                        userId: v.userId,
                        userName: (k == null ? void 0 : k.first_name) || ((N = k == null ? void 0 : k.email) == null ? void 0 : N.split("@")[0]) || "Пользователь",
                        email: (k == null ? void 0 : k.email) || "",
                        lastMessage: v.message,
                        lastMessageTime: v.timestamp,
                        unreadCount: 0,
                        messages: []
                    })
                }
                const w = h.get(v.userId);
                w.messages.push(v), w.lastMessage = v.message, w.lastMessageTime = v.timestamp, !v.isAdmin && !v.isRead && w.unreadCount++
            });
            const g = Array.from(h.values()).sort((v, w) => new Date(w.lastMessageTime).getTime() - new Date(v.lastMessageTime).getTime());
            r(g)
        }, m = () => {
            if (!s || !l.trim()) return;
            const d = {
                id: Date.now(),
                userId: s.userId,
                userName: "Admin",
                message: l,
                isAdmin: !0,
                timestamp: new Date().toISOString(),
                isRead: !0
            }, x = JSON.parse(localStorage.getItem("misat_chat_messages") || "[]");
            x.push(d), localStorage.setItem("misat_chat_messages", JSON.stringify(x));
            const h = [...s.messages, d];
            a({...s, messages: h, lastMessage: l, lastMessageTime: d.timestamp});
            const g = t.map(v => v.userId === s.userId ? {
                ...v,
                lastMessage: l,
                lastMessageTime: d.timestamp,
                unreadCount: 0
            } : v);
            r(g), i(""), _.success("Сообщение отправлено")
        }, y = d => {
            const h = JSON.parse(localStorage.getItem("misat_chat_messages") || "[]").map(v => v.userId === d.userId && !v.isAdmin && !v.isRead ? {
                ...v,
                isRead: !0
            } : v);
            localStorage.setItem("misat_chat_messages", JSON.stringify(h));
            const g = t.map(v => v.userId === d.userId ? {...v, unreadCount: 0} : v);
            r(g), a({...d, unreadCount: 0})
        },
        b = t.filter(d => d.userName.toLowerCase().includes(o.toLowerCase()) || d.email.toLowerCase().includes(o.toLowerCase())),
        p = d => {
            const x = new Date(d);
            return new Date().getTime() - x.getTime() < 24 * 60 * 60 * 1e3 ? x.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit"
            }) : x.toLocaleDateString("ru-RU", {day: "2-digit", month: "2-digit"})
        };
    return n.jsxs("div", {
        children: [n.jsxs("h1", {
            className: "text-3xl font-light mb-6",
            children: ["Чат с ", n.jsx("span", {className: "font-bold", children: "клиентами"})]
        }), n.jsxs("div", {
            className: "flex h-[calc(100vh-200px)] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200",
            children: [n.jsxs("div", {
                className: "w-80 border-r border-gray-200 flex flex-col",
                children: [n.jsx("div", {
                    className: "p-4 border-b",
                    children: n.jsx("input", {
                        type: "text",
                        placeholder: "Поиск клиента...",
                        value: o,
                        onChange: d => c(d.target.value),
                        className: "w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    })
                }), n.jsx("div", {
                    className: "flex-1 overflow-y-auto",
                    children: b.length === 0 ? n.jsxs("div", {
                        className: "text-center text-gray-500 py-10",
                        children: [n.jsx("i", {className: "fas fa-comments text-4xl mb-2"}), n.jsx("p", {children: "Нет активных чатов"}), n.jsx("p", {
                            className: "text-sm mt-2",
                            children: "Когда клиенты напишут, они появятся здесь"
                        })]
                    }) : b.map(d => n.jsx("button", {
                        onClick: () => y(d),
                        className: `w-full p-4 text-left border-b hover:bg-gray-50 transition ${(s == null ? void 0 : s.userId) === d.userId ? "bg-gray-100" : ""}`,
                        children: n.jsxs("div", {
                            className: "flex justify-between items-start",
                            children: [n.jsxs("div", {
                                children: [n.jsx("p", {
                                    className: "font-black",
                                    children: d.userName
                                }), n.jsx("p", {
                                    className: "text-xs text-gray-500",
                                    children: d.email
                                }), n.jsx("p", {
                                    className: "text-sm text-gray-500 truncate mt-1",
                                    children: d.lastMessage
                                })]
                            }), n.jsxs("div", {
                                className: "text-right",
                                children: [n.jsx("p", {
                                    className: "text-xs text-gray-400",
                                    children: p(d.lastMessageTime)
                                }), d.unreadCount > 0 && n.jsx("span", {
                                    className: "inline-block mt-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse",
                                    children: d.unreadCount
                                })]
                            })]
                        })
                    }, d.userId))
                })]
            }), n.jsx("div", {
                className: "flex-1 flex flex-col", children: s ? n.jsxs(n.Fragment, {
                    children: [n.jsx("div", {
                        className: "p-4 border-b bg-gray-50",
                        children: n.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [n.jsx("div", {
                                className: "w-10 h-10 bg-black rounded-full flex items-center justify-center text-white",
                                children: n.jsx("i", {className: "fas fa-user"})
                            }), n.jsxs("div", {
                                children: [n.jsx("p", {
                                    className: "font-black",
                                    children: s.userName
                                }), n.jsx("p", {className: "text-xs text-gray-500", children: s.email})]
                            })]
                        })
                    }), n.jsxs("div", {
                        className: "flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3",
                        children: [s.messages.length === 0 ? n.jsxs("div", {
                            className: "text-center text-gray-500 py-10",
                            children: [n.jsx("i", {className: "fas fa-comment-dots text-4xl mb-2"}), n.jsx("p", {children: "Нет сообщений"}), n.jsx("p", {
                                className: "text-sm",
                                children: "Напишите первое сообщение клиенту"
                            })]
                        }) : s.messages.map(d => n.jsx("div", {
                            className: `flex ${d.isAdmin ? "justify-end" : "justify-start"}`,
                            children: n.jsxs("div", {
                                className: `max-w-[70%] p-3 rounded-2xl ${d.isAdmin ? "bg-black text-white" : "bg-white border border-gray-200"}`,
                                children: [!d.isAdmin && n.jsx("p", {
                                    className: "text-xs font-bold text-gray-500 mb-1",
                                    children: s.userName
                                }), n.jsx("p", {
                                    className: "text-sm break-words",
                                    children: d.message
                                }), n.jsx("p", {
                                    className: `text-xs mt-1 ${d.isAdmin, "text-gray-400"}`,
                                    children: p(d.timestamp)
                                })]
                            })
                        }, d.id)), n.jsx("div", {ref: u})]
                    }), n.jsxs("div", {
                        className: "p-4 border-t flex gap-2 bg-white",
                        children: [n.jsx("input", {
                            type: "text",
                            placeholder: "Введите сообщение...",
                            value: l,
                            onChange: d => i(d.target.value),
                            onKeyPress: d => d.key === "Enter" && m(),
                            className: "flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black"
                        }), n.jsx("button", {
                            onClick: m,
                            className: "bg-black text-white w-10 h-10 rounded-full hover:bg-gray-800 transition flex items-center justify-center",
                            children: n.jsx("i", {className: "fas fa-paper-plane"})
                        })]
                    })]
                }) : n.jsx("div", {
                    className: "flex-1 flex items-center justify-center text-gray-400",
                    children: n.jsxs("div", {
                        className: "text-center",
                        children: [n.jsx("i", {className: "fas fa-comments text-5xl mb-4"}), n.jsx("p", {children: "Выберите чат для начала общения"}), n.jsx("p", {
                            className: "text-sm mt-2",
                            children: "Когда клиенты напишут, они появятся в списке слева"
                        })]
                    })
                })
            })]
        })]
    })
}, Ew = () => {
    const {
            user: e,
            isAuthenticated: t
        } = Ze(d => d.auth), [r, s] = j.useState(!1), [a, l] = j.useState([]), [i, o] = j.useState(""), [c, u] = j.useState(0), [f, m] = j.useState(!1),
        y = j.useRef(null);
    j.useEffect(() => {
        const d = () => {
            m(window.innerWidth < 768)
        };
        return d(), window.addEventListener("resize", d), () => window.removeEventListener("resize", d)
    }, []), j.useEffect(() => {
        if (t && e) {
            const x = JSON.parse(localStorage.getItem("misat_chat_messages") || "[]").filter(g => g.userId === e.id || g.isAdmin);
            l(x);
            const h = x.filter(g => g.isAdmin && !g.isRead);
            u(h.length)
        }
    }, [t, e, r]), j.useEffect(() => {
        y.current && y.current.scrollIntoView({behavior: "smooth"})
    }, [a]), j.useEffect(() => {
        if (r && t && e) {
            const x = JSON.parse(localStorage.getItem("misat_chat_messages") || "[]").map(g => g.userId === e.id && g.isAdmin && !g.isRead ? {
                ...g,
                isRead: !0
            } : g);
            localStorage.setItem("misat_chat_messages", JSON.stringify(x)), u(0);
            const h = x.filter(g => g.userId === e.id || g.isAdmin);
            l(h)
        }
    }, [r, t, e]);
    const b = () => {
        var h;
        if (!t) {
            _.error("Войдите в аккаунт");
            return
        }
        if (!i.trim()) return;
        const d = {
            id: Date.now(),
            userId: e.id,
            userName: e.first_name || ((h = e.email) == null ? void 0 : h.split("@")[0]) || "Пользователь",
            message: i,
            isAdmin: !1,
            timestamp: new Date().toISOString(),
            isRead: !1
        }, x = JSON.parse(localStorage.getItem("misat_chat_messages") || "[]");
        x.push(d), localStorage.setItem("misat_chat_messages", JSON.stringify(x)), l([...a, d]), o(""), _.success("Сообщение отправлено")
    }, p = d => new Date(d).toLocaleTimeString("ru-RU", {hour: "2-digit", minute: "2-digit"});
    return n.jsxs(n.Fragment, {
        children: [n.jsxs("button", {
            onClick: () => s(!0),
            className: "fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-110 z-50 flex items-center justify-center",
            children: [n.jsx("i", {className: "fas fa-comment-dots text-2xl"}), c > 0 && n.jsx("span", {
                className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse",
                children: c
            })]
        }), r && n.jsxs(n.Fragment, {
            children: [!f && n.jsx("div", {
                className: "fixed inset-0 bg-black/50 z-40",
                onClick: () => s(!1)
            }), n.jsxs("div", {
                className: `fixed bg-white shadow-2xl overflow-hidden flex flex-col z-50 ${f ? "inset-0 rounded-none" : "bottom-24 right-6 w-96 rounded-2xl"}`,
                style: {height: f ? "auto" : "500px"},
                children: [n.jsxs("div", {
                    className: "bg-black text-white p-4 flex justify-between items-center shrink-0",
                    children: [n.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [n.jsx("i", {className: "fas fa-headset"}), n.jsx("h3", {
                            className: "font-black",
                            children: "Поддержка MISAT"
                        }), n.jsx("span", {
                            className: "text-xs bg-green-500 px-2 py-0.5 rounded-full ml-2",
                            children: "Online"
                        })]
                    }), n.jsx("button", {
                        onClick: () => s(!1),
                        className: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition",
                        children: n.jsx("i", {className: "fas fa-times"})
                    })]
                }), n.jsxs("div", {
                    className: "overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3 flex-1",
                    children: [a.length === 0 ? n.jsxs("div", {
                        className: "text-center text-gray-500 py-10",
                        children: [n.jsx("i", {className: "fas fa-comment-dots text-4xl mb-2"}), n.jsx("p", {children: "Нет сообщений"}), n.jsx("p", {
                            className: "text-sm",
                            children: "Напишите нам, мы ответим!"
                        })]
                    }) : a.map(d => n.jsx("div", {
                        className: `flex ${d.isAdmin ? "justify-start" : "justify-end"}`,
                        children: n.jsxs("div", {
                            className: `max-w-[80%] p-3 rounded-2xl ${d.isAdmin ? "bg-white border border-gray-200" : "bg-black text-white"}`,
                            children: [d.isAdmin && n.jsx("p", {
                                className: "text-xs font-bold text-gray-500 mb-1",
                                children: "Администратор"
                            }), n.jsx("p", {
                                className: "text-sm break-words",
                                children: d.message
                            }), n.jsx("p", {
                                className: `text-xs mt-1 ${d.isAdmin ? "text-gray-400" : "text-gray-300"}`,
                                children: p(d.timestamp)
                            })]
                        })
                    }, d.id)), n.jsx("div", {ref: y})]
                }), n.jsxs("div", {
                    className: "border-t p-3 flex gap-2 bg-white shrink-0",
                    children: [n.jsx("input", {
                        type: "text",
                        placeholder: "Напишите сообщение...",
                        value: i,
                        onChange: d => o(d.target.value),
                        onKeyPress: d => d.key === "Enter" && b(),
                        className: "flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black"
                    }), n.jsx("button", {
                        onClick: b,
                        className: "bg-black text-white w-10 h-10 rounded-full hover:bg-gray-800 transition flex items-center justify-center",
                        children: n.jsx("i", {className: "fas fa-paper-plane"})
                    })]
                })]
            })]
        })]
    })
}, Pw = () => {
    const e = Jr();
    return j.useEffect(() => {
        at() && (e(su()), e(ch()), e(ih()))
    }, [e]), n.jsxs(tN, {
        children: [n.jsx(KN, {}), n.jsx(QN, {
            position: "bottom-center",
            toastOptions: {style: {background: "#000", color: "#fff", borderRadius: "0px"}, duration: 2e3}
        }), n.jsx(GN, {}), n.jsx("main", {
            className: "pt-20 min-h-screen", children: n.jsxs(qj, {
                children: [n.jsx(Z, {path: "/", element: n.jsx(YN, {})}), n.jsx(Z, {
                    path: "/catalog",
                    element: n.jsx(ZN, {})
                }), n.jsx(Z, {path: "/product/:id", element: n.jsx(ew, {})}), n.jsx(Z, {
                    path: "/cart",
                    element: n.jsx(tw, {})
                }), n.jsx(Z, {path: "/checkout", element: n.jsx(aw, {})}), n.jsx(Z, {
                    path: "/favorites",
                    element: n.jsx(rw, {})
                }), n.jsx(Z, {path: "/profile", element: n.jsx(nw, {})}), n.jsx(Z, {
                    path: "/orders",
                    element: n.jsx(lw, {})
                }), n.jsx(Z, {path: "/support", element: n.jsx(sw, {})}), n.jsx(Z, {
                    path: "/balance-topup",
                    element: n.jsx(iw, {})
                }), n.jsx(Z, {path: "/about", element: n.jsx(ow, {})}), n.jsx(Z, {
                    path: "/delivery",
                    element: n.jsx(cw, {})
                }), n.jsx(Z, {path: "/returns", element: n.jsx(uw, {})}), n.jsx(Z, {
                    path: "/contacts",
                    element: n.jsx(dw, {})
                }), n.jsx(Z, {path: "/faq", element: n.jsx(fw, {})}), n.jsx(Z, {
                    path: "/blog",
                    element: n.jsx(mw, {})
                }), n.jsx(Z, {path: "/tracking", element: n.jsx(pw, {})}), n.jsx(Z, {
                    path: "/gift-card",
                    element: n.jsx(hw, {})
                }), n.jsx(Z, {path: "/offer", element: n.jsx(xw, {})}), n.jsx(Z, {
                    path: "/privacy",
                    element: n.jsx(gw, {})
                }), n.jsx(Z, {path: "/terms", element: n.jsx(yw, {})}), n.jsxs(Z, {
                    path: "/admin",
                    element: n.jsx(vw, {}),
                    children: [n.jsx(Z, {index: !0, element: n.jsx(bw, {})}), n.jsx(Z, {
                        path: "products",
                        element: n.jsx(jw, {})
                    }), n.jsx(Z, {path: "orders", element: n.jsx(Nw, {})}), n.jsx(Z, {
                        path: "categories",
                        element: n.jsx(ww, {})
                    }), n.jsx(Z, {path: "users", element: n.jsx(kw, {})}), n.jsx(Z, {
                        path: "promocodes",
                        element: n.jsx(Sw, {})
                    }), n.jsx(Z, {path: "chat", element: n.jsx(Cw, {})})]
                })]
            })
        }), n.jsx(XN, {}), n.jsx(Ew, {})]
    })
}, _w = () => n.jsx(Vp, {store: lN, children: n.jsx(Pw, {})});
zi.createRoot(document.getElementById("root")).render(n.jsx(Ef.StrictMode, {
    children: n.jsx(Vp, {
        store: Xb,
        children: n.jsx(_w, {})
    })
}));
"serviceWorker" in navigator && window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(e => console.log("SW registered:", e)).catch(e => console.log("SW error:", e))
});
