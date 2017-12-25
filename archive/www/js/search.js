// source https://github.com/bvaughn/js-search
!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.JsSearch = t() : e.JsSearch = t()
}(this, function() {
    return function(e) {
        function t(r) {
            if (n[r])
                return n[r].exports;
            var i = n[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return e[r].call(i.exports, i, i.exports, t), i.l = !0, i.exports
        }
        var n = {};
        return t.m = e, t.c = n, t.i = function(e) {
            return e
        }, t.d = function(e, n, r) {
            t.o(e, n) || Object.defineProperty(e, n, {
                configurable: !1,
                enumerable: !0,
                get: r
            })
        }, t.n = function(e) {
            var n = e && e.__esModule ? function() {
                return e.default
            } : function() {
                return e
            };
            return t.d(n, "a", n), n
        }, t.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, t.p = "", t(t.s = 17)
    }([function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(7);
        Object.defineProperty(t, "AllSubstringsIndexStrategy", {
            enumerable: !0,
            get: function() {
                return r.AllSubstringsIndexStrategy
            }
        });
        var i = n(8);
        Object.defineProperty(t, "ExactWordIndexStrategy", {
            enumerable: !0,
            get: function() {
                return i.ExactWordIndexStrategy
            }
        });
        var o = n(9);
        Object.defineProperty(t, "PrefixIndexStrategy", {
            enumerable: !0,
            get: function() {
                return o.PrefixIndexStrategy
            }
        })
    }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(10);
        Object.defineProperty(t, "CaseSensitiveSanitizer", {
            enumerable: !0,
            get: function() {
                return r.CaseSensitiveSanitizer
            }
        });
        var i = n(11);
        Object.defineProperty(t, "LowerCaseSanitizer", {
            enumerable: !0,
            get: function() {
                return i.LowerCaseSanitizer
            }
        })
    }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(12);
        Object.defineProperty(t, "TfIdfSearchIndex", {
            enumerable: !0,
            get: function() {
                return r.TfIdfSearchIndex
            }
        });
        var i = n(13);
        Object.defineProperty(t, "UnorderedSearchIndex", {
            enumerable: !0,
            get: function() {
                return i.UnorderedSearchIndex
            }
        })
    }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = t.StopWordsMap = {
            a: !0,
            able: !0,
            about: !0,
            across: !0,
            after: !0,
            all: !0,
            almost: !0,
            also: !0,
            am: !0,
            among: !0,
            an: !0,
            and: !0,
            any: !0,
            are: !0,
            as: !0,
            at: !0,
            be: !0,
            because: !0,
            been: !0,
            but: !0,
            by: !0,
            can: !0,
            cannot: !0,
            could: !0,
            dear: !0,
            did: !0,
            do: !0,
            does: !0,
            either: !0,
            else: !0,
            ever: !0,
            every: !0,
            for: !0,
            from: !0,
            get: !0,
            got: !0,
            had: !0,
            has: !0,
            have: !0,
            he: !0,
            her: !0,
            hers: !0,
            him: !0,
            his: !0,
            how: !0,
            however: !0,
            i: !0,
            if: !0,
            in: !0,
            into: !0,
            is: !0,
            it: !0,
            its: !0,
            just: !0,
            least: !0,
            let: !0,
            like: !0,
            likely: !0,
            may: !0,
            me: !0,
            might: !0,
            most: !0,
            must: !0,
            my: !0,
            neither: !0,
            no: !0,
            nor: !0,
            not: !0,
            of: !0,
            off: !0,
            often: !0,
            on: !0,
            only: !0,
            or: !0,
            other: !0,
            our: !0,
            own: !0,
            rather: !0,
            said: !0,
            say: !0,
            says: !0,
            she: !0,
            should: !0,
            since: !0,
            so: !0,
            some: !0,
            than: !0,
            that: !0,
            the: !0,
            their: !0,
            them: !0,
            then: !0,
            there: !0,
            these: !0,
            they: !0,
            this: !0,
            tis: !0,
            to: !0,
            too: !0,
            twas: !0,
            us: !0,
            wants: !0,
            was: !0,
            we: !0,
            were: !0,
            what: !0,
            when: !0,
            where: !0,
            which: !0,
            while: !0,
            who: !0,
            whom: !0,
            why: !0,
            will: !0,
            with: !0,
            would: !0,
            yet: !0,
            you: !0,
            your: !0
        };
        r.constructor = !1, r.hasOwnProperty = !1, r.isPrototypeOf = !1, r.propertyIsEnumerable = !1, r.toLocaleString = !1, r.toString = !1, r.valueOf = !1
    }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(14);
        Object.defineProperty(t, "SimpleTokenizer", {
            enumerable: !0,
            get: function() {
                return r.SimpleTokenizer
            }
        });
        var i = n(15);
        Object.defineProperty(t, "StemmingTokenizer", {
            enumerable: !0,
            get: function() {
                return i.StemmingTokenizer
            }
        });
        var o = n(16);
        Object.defineProperty(t, "StopWordsTokenizer", {
            enumerable: !0,
            get: function() {
                return o.StopWordsTokenizer
            }
        })
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        function i(e, t) {
            t = t || [], e = e || {};
            for (var n = e, r = 0; r < t.length; r++)
                if (n = n[t[r]], null == n)
                    return null;
            return n
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.Search = void 0;
        var o = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function(t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            a = n(0),
            u = n(1),
            c = n(2),
            f = n(4);
        t.Search = function() {
            function e(t) {
                r(this, e), this._uidFieldName = t, this._indexStrategy = new a.PrefixIndexStrategy, this._searchIndex = new c.TfIdfSearchIndex(t), this._sanitizer = new u.LowerCaseSanitizer, this._tokenizer = new f.SimpleTokenizer, this._documents = [], this._searchableFields = []
            }
            return o(e, [{
                key: "addDocument",
                value: function(e) {
                    this.addDocuments([e])
                }
            }, {
                key: "addDocuments",
                value: function(e) {
                    this._documents = this._documents.concat(e), this.indexDocuments_(e, this._searchableFields)
                }
            }, {
                key: "addIndex",
                value: function(e) {
                    this._searchableFields.push(e), this.indexDocuments_(this._documents, [e])
                }
            }, {
                key: "search",
                value: function(e) {
                    var t = this._tokenizer.tokenize(this._sanitizer.sanitize(e));
                    return this._searchIndex.search(t, this._documents)
                }
            }, {
                key: "indexDocuments_",
                value: function(e, t) {
                    this._initialized = !0;
                    for (var n = this._indexStrategy, r = this._sanitizer, o = this._searchIndex, a = this._tokenizer, u = this._uidFieldName, c = 0, f = e.length; c < f; c++)
                        for (var s = e[c], l = s[u], d = 0, h = t.length; d < h; d++) {
                            var y,
                                p = t[d];
                            if (y = p instanceof Array ? i(s, p) : s[p], null != y && "string" != typeof y && y.toString && (y = y.toString()), "string" == typeof y)
                                for (var b = a.tokenize(r.sanitize(y)), v = 0, m = b.length; v < m; v++)
                                    for (var g = b[v], _ = n.expandToken(g), k = 0, S = _.length; k < S; k++) {
                                        var w = _[k];
                                        o.indexDocument(w, l, s)
                                    }
                        }
                }
            }, {
                key: "indexStrategy",
                set: function(e) {
                    if (this._initialized)
                        throw Error("IIndexStrategy cannot be set after initialization");
                    this._indexStrategy = e
                },
                get: function() {
                    return this._indexStrategy
                }
            }, {
                key: "sanitizer",
                set: function(e) {
                    if (this._initialized)
                        throw Error("ISanitizer cannot be set after initialization");
                    this._sanitizer = e
                },
                get: function() {
                    return this._sanitizer
                }
            }, {
                key: "searchIndex",
                set: function(e) {
                    if (this._initialized)
                        throw Error("ISearchIndex cannot be set after initialization");
                    this._searchIndex = e
                },
                get: function() {
                    return this._searchIndex
                }
            }, {
                key: "tokenizer",
                set: function(e) {
                    if (this._initialized)
                        throw Error("ITokenizer cannot be set after initialization");
                    this._tokenizer = e
                },
                get: function() {
                    return this._tokenizer
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.TokenHighlighter = void 0;
        var i = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function(t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = n(0),
            a = n(1);
        t.TokenHighlighter = function() {
            function e(t, n, i) {
                r(this, e), this._indexStrategy = t || new o.PrefixIndexStrategy, this._sanitizer = n || new a.LowerCaseSanitizer, this._wrapperTagName = i || "mark"
            }
            return i(e, [{
                key: "highlight",
                value: function(e, t) {
                    for (var n = this._wrapText("").length, r = {}, i = 0, o = t.length; i < o; i++)
                        for (var a = this._sanitizer.sanitize(t[i]), u = this._indexStrategy.expandToken(a), c = 0, f = u.length; c < f; c++) {
                            var s = u[c];
                            r[s] ? r[s].push(a) : r[s] = [a]
                        }
                    for (var l = "", d = "", h = 0, i = 0, y = e.length; i < y; i++) {
                        var p = e.charAt(i);
                        " " === p ? (l = "", d = "", h = i + 1) : (l += p, d += this._sanitizer.sanitize(p)), r[d] && r[d].indexOf(d) >= 0 && (l = this._wrapText(l), e = e.substring(0, h) + l + e.substring(i + 1), i += n, y += n)
                    }
                    return e
                }
            }, {
                key: "_wrapText",
                value: function(e) {
                    var t = this._wrapperTagName;
                    return "<" + t + ">" + e + "</" + t + ">"
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }();
        t.AllSubstringsIndexStrategy = function() {
            function e() {
                r(this, e)
            }
            return i(e, [{
                key: "expandToken",
                value: function(e) {
                    for (var t, n = [], r = 0, i = e.length; r < i; ++r) {
                        t = "";
                        for (var o = r; o < i; ++o)
                            t += e.charAt(o), n.push(t)
                    }
                    return n
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }();
        t.ExactWordIndexStrategy = function() {
            function e() {
                r(this, e)
            }
            return i(e, [{
                key: "expandToken",
                value: function(e) {
                    return e ? [e] : []
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }();
        t.PrefixIndexStrategy = function() {
            function e() {
                r(this, e)
            }
            return i(e, [{
                key: "expandToken",
                value: function(e) {
                    for (var t = [], n = "", r = 0, i = e.length; r < i; ++r)
                        n += e.charAt(r), t.push(n);
                    return t
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }();
        t.CaseSensitiveSanitizer = function() {
            function e() {
                r(this, e)
            }
            return i(e, [{
                key: "sanitize",
                value: function(e) {
                    return e ? e.trim() : ""
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }();
        t.LowerCaseSanitizer = function() {
            function e() {
                r(this, e)
            }
            return i(e, [{
                key: "sanitize",
                value: function(e) {
                    return e ? e.toLocaleLowerCase().trim() : ""
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            o = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function(t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }();
        t.TfIdfSearchIndex = function() {
            function e(t) {
                r(this, e), this._uidFieldName = t, this._tokenToIdfCache = {}, this._tokenMap = {}
            }
            return o(e, [{
                key: "indexDocument",
                value: function(e, t, n) {
                    this._tokenToIdfCache = {};
                    var r,
                        o = this._tokenMap;
                    "object" !== i(o[e]) ? o[e] = r = {
                        $numDocumentOccurrences: 0,
                        $totalNumOccurrences: 1,
                        $uidMap: {}
                    } : (r = o[e], r.$totalNumOccurrences++);
                    var a = r.$uidMap;
                    "object" !== i(a[t]) ? (r.$numDocumentOccurrences++, a[t] = {
                        $document: n,
                        $numTokenOccurrences: 1
                    }) : a[t].$numTokenOccurrences++
                }
            }, {
                key: "search",
                value: function(e, t) {
                    for (var n = {}, r = 0, o = e.length; r < o; r++) {
                        var a = e[r],
                            u = this._tokenMap[a];
                        if (!u)
                            return [];
                        if (0 === r)
                            for (var c = Object.keys(u.$uidMap), f = 0, s = c.length; f < s; f++) {
                                var l = c[f];
                                n[l] = u.$uidMap[l].$document
                            }
                        else
                            for (var c = Object.keys(n), f = 0, s = c.length; f < s; f++) {
                                var l = c[f];
                                "object" !== i(u.$uidMap[l]) && delete n[l]
                            }
                    }
                    var d = [];
                    for (var l in n)
                        d.push(n[l]);
                    var h = (this._tokenMap, this._tokenToIdfCache, this._uidFieldName, this._createCalculateTfIdf());
                    return d.sort(function(n, r) {
                        return h(e, r, t) - h(e, n, t)
                    })
                }
            }, {
                key: "_createCalculateIdf",
                value: function() {
                    var e = this._tokenMap,
                        t = this._tokenToIdfCache;
                    return function(n, r) {
                        if (!t[n]) {
                            var i = "undefined" != typeof e[n] ? e[n].$numDocumentOccurrences : 0;
                            t[n] = 1 + Math.log(r.length / (1 + i))
                        }
                        return t[n]
                    }
                }
            }, {
                key: "_createCalculateTfIdf",
                value: function() {
                    var e = this._tokenMap,
                        t = this._uidFieldName,
                        n = this._createCalculateIdf();
                    return function(r, i, o) {
                        for (var a = 0, u = 0, c = r.length; u < c; ++u) {
                            var f = r[u],
                                s = n(f, o);
                            s === 1 / 0 && (s = 0);
                            var l = i && i[t],
                                d = "undefined" != typeof e[f] && "undefined" != typeof e[f].$uidMap[l] ? e[f].$uidMap[l].$numTokenOccurrences : 0;
                            a += d * s
                        }
                        return a
                    }
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            o = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function(t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }();
        t.UnorderedSearchIndex = function() {
            function e() {
                r(this, e), this._tokenToUidToDocumentMap = {}
            }
            return o(e, [{
                key: "indexDocument",
                value: function(e, t, n) {
                    "object" !== i(this._tokenToUidToDocumentMap[e]) && (this._tokenToUidToDocumentMap[e] = {}), this._tokenToUidToDocumentMap[e][t] = n
                }
            }, {
                key: "search",
                value: function(e, t) {
                    for (var n = {}, r = this._tokenToUidToDocumentMap, o = 0, a = e.length; o < a; o++) {
                        var u = e[o],
                            c = r[u];
                        if (!c)
                            return [];
                        if (0 === o)
                            for (var f = Object.keys(c), s = 0, l = f.length; s < l; s++) {
                                var d = f[s];
                                n[d] = c[d]
                            }
                        else
                            for (var f = Object.keys(n), s = 0, l = f.length; s < l; s++) {
                                var d = f[s];
                                "object" !== i(c[d]) && delete n[d]
                            }
                    }
                    for (var f = Object.keys(n), h = [], o = 0, l = f.length; o < l; o++) {
                        var d = f[o];
                        h.push(n[d])
                    }
                    return h
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function(t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = /[^a-zа-яё0-9\-']+/i;
        t.SimpleTokenizer = function() {
            function e() {
                r(this, e)
            }
            return i(e, [{
                key: "tokenize",
                value: function(e) {
                    return e.split(o).filter(function(e) {
                        return e
                    })
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }
            return function(t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }();
        t.StemmingTokenizer = function() {
            function e(t, n) {
                r(this, e), this._stemmingFunction = t, this._tokenizer = n
            }
            return i(e, [{
                key: "tokenize",
                value: function(e) {
                    return this._tokenizer.tokenize(e).map(this._stemmingFunction)
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        function r(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.StopWordsTokenizer = void 0;
        var i = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function(t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            o = n(3);
        t.StopWordsTokenizer = function() {
            function e(t) {
                r(this, e), this._tokenizer = t
            }
            return i(e, [{
                key: "tokenize",
                value: function(e) {
                    return this._tokenizer.tokenize(e).filter(function(e) {
                        return !o.StopWordsMap[e]
                    })
                }
            }]), e
        }()
    }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = n(0);
        Object.defineProperty(t, "AllSubstringsIndexStrategy", {
            enumerable: !0,
            get: function() {
                return r.AllSubstringsIndexStrategy
            }
        }), Object.defineProperty(t, "ExactWordIndexStrategy", {
            enumerable: !0,
            get: function() {
                return r.ExactWordIndexStrategy
            }
        }), Object.defineProperty(t, "PrefixIndexStrategy", {
            enumerable: !0,
            get: function() {
                return r.PrefixIndexStrategy
            }
        });
        var i = n(1);
        Object.defineProperty(t, "CaseSensitiveSanitizer", {
            enumerable: !0,
            get: function() {
                return i.CaseSensitiveSanitizer
            }
        }), Object.defineProperty(t, "LowerCaseSanitizer", {
            enumerable: !0,
            get: function() {
                return i.LowerCaseSanitizer
            }
        });
        var o = n(2);
        Object.defineProperty(t, "TfIdfSearchIndex", {
            enumerable: !0,
            get: function() {
                return o.TfIdfSearchIndex
            }
        }), Object.defineProperty(t, "UnorderedSearchIndex", {
            enumerable: !0,
            get: function() {
                return o.UnorderedSearchIndex
            }
        });
        var a = n(4);
        Object.defineProperty(t, "SimpleTokenizer", {
            enumerable: !0,
            get: function() {
                return a.SimpleTokenizer
            }
        }), Object.defineProperty(t, "StemmingTokenizer", {
            enumerable: !0,
            get: function() {
                return a.StemmingTokenizer
            }
        }), Object.defineProperty(t, "StopWordsTokenizer", {
            enumerable: !0,
            get: function() {
                return a.StopWordsTokenizer
            }
        });
        var u = n(5);
        Object.defineProperty(t, "Search", {
            enumerable: !0,
            get: function() {
                return u.Search
            }
        });
        var c = n(3);
        Object.defineProperty(t, "StopWordsMap", {
            enumerable: !0,
            get: function() {
                return c.StopWordsMap
            }
        });
        var f = n(6);
        Object.defineProperty(t, "TokenHighlighter", {
            enumerable: !0,
            get: function() {
                return f.TokenHighlighter
            }
        })
    }])
});
//# sourceMappingURL=dist/umd/js-search.min.js.map
