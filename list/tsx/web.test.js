"use strict";
function require( path ){ return $node[ path ] };
"use strict";
var $;
(function ($_1) {
    function $mol_test(set) {
        for (let name in set) {
            const code = set[name];
            const test = (typeof code === 'string') ? new Function('', code) : code;
            $_1.$mol_test_all.push(test);
        }
        $mol_test_schedule();
    }
    $_1.$mol_test = $mol_test;
    $_1.$mol_test_mocks = [];
    $_1.$mol_test_all = [];
    async function $mol_test_run() {
        for (var test of $_1.$mol_test_all) {
            let context = Object.create($$);
            for (let mock of $_1.$mol_test_mocks)
                await mock(context);
            const res = test(context);
            if (res instanceof Promise) {
                await new Promise((done, fail) => {
                    res.then(done, fail);
                    setTimeout(() => fail(new Error('Test timeout: ' + test.name)), 1000);
                });
            }
        }
        $$.$mol_log3_done({
            place: '$mol_test',
            message: 'All tests passed',
            count: $_1.$mol_test_all.length,
        });
    }
    $_1.$mol_test_run = $mol_test_run;
    let scheduled = false;
    function $mol_test_schedule() {
        if (scheduled)
            return;
        scheduled = true;
        setTimeout(async () => {
            scheduled = false;
            try {
                await $mol_test_run();
            }
            finally {
                $$.$mol_test_complete();
            }
        }, 0);
    }
    $_1.$mol_test_schedule = $mol_test_schedule;
    $_1.$mol_test_mocks.push(context => {
        let seed = 0;
        context.Math = Object.create(Math);
        context.Math.random = () => Math.sin(seed++);
        const forbidden = ['XMLHttpRequest', 'fetch'];
        for (let api of forbidden) {
            context[api] = new Proxy(function () { }, {
                get() {
                    $mol_fail_hidden(new Error(`${api} is forbidden in tests`));
                },
                apply() {
                    $mol_fail_hidden(new Error(`${api} is forbidden in tests`));
                },
            });
        }
    });
    $mol_test({
        'mocked Math.random'($) {
            console.assert($.Math.random() === 0);
            console.assert($.Math.random() === Math.sin(1));
        },
        'forbidden XMLHttpRequest'($) {
            try {
                console.assert(void new $.XMLHttpRequest);
            }
            catch (error) {
                console.assert(error.message === 'XMLHttpRequest is forbidden in tests');
            }
        },
        'forbidden fetch'($) {
            try {
                console.assert(void $.fetch(''));
            }
            catch (error) {
                console.assert(error.message === 'fetch is forbidden in tests');
            }
        },
    });
})($ || ($ = {}));
//mol/test/test.test.ts
;
"use strict";
var $;
(function ($) {
    function $mol_test_complete() {
    }
    $.$mol_test_complete = $mol_test_complete;
})($ || ($ = {}));
//mol/test/test.web.test.ts
;
"use strict";
var $;
(function ($) {
    function $mol_dom_serialize(node) {
        const serializer = new $mol_dom_context.XMLSerializer;
        return serializer.serializeToString(node);
    }
    $.$mol_dom_serialize = $mol_dom_serialize;
})($ || ($ = {}));
//mol/dom/serialize/serialize.ts
;
"use strict";
var $;
(function ($) {
    $mol_test({
        'must be false'() {
            $mol_assert_not(0);
        },
        'must be true'() {
            $mol_assert_ok(1);
        },
        'two must be equal'() {
            $mol_assert_equal(2, 2);
        },
        'three must be equal'() {
            $mol_assert_equal(2, 2, 2);
        },
        'two must be unique'() {
            $mol_assert_unique([3], [3]);
        },
        'three must be unique'() {
            $mol_assert_unique([3], [3], [3]);
        },
        'two must be alike'() {
            $mol_assert_like([3], [3]);
        },
        'three must be alike'() {
            $mol_assert_like([3], [3], [3]);
        },
    });
})($ || ($ = {}));
//mol/assert/assert.test.ts
;
"use strict";
var $;
(function ($) {
    function $mol_assert_ok(value) {
        if (value)
            return;
        $mol_fail(new Error(`${value} ≠ true`));
    }
    $.$mol_assert_ok = $mol_assert_ok;
    function $mol_assert_not(value) {
        if (!value)
            return;
        $mol_fail(new Error(`${value} ≠ false`));
    }
    $.$mol_assert_not = $mol_assert_not;
    function $mol_assert_fail(handler, ErrorRight) {
        const fail = $.$mol_fail;
        try {
            $.$mol_fail = $.$mol_fail_hidden;
            handler();
        }
        catch (error) {
            if (!ErrorRight)
                return error;
            $.$mol_fail = fail;
            if (typeof ErrorRight === 'string') {
                $mol_assert_equal(error.message, ErrorRight);
            }
            else {
                $mol_assert_ok(error instanceof ErrorRight);
            }
            return error;
        }
        finally {
            $.$mol_fail = fail;
        }
        $mol_fail(new Error('Not failed'));
    }
    $.$mol_assert_fail = $mol_assert_fail;
    function $mol_assert_equal(...args) {
        for (let i = 0; i < args.length; ++i) {
            for (let j = 0; j < args.length; ++j) {
                if (i === j)
                    continue;
                if (Number.isNaN(args[i]) && Number.isNaN(args[j]))
                    continue;
                if (args[i] !== args[j])
                    $mol_fail(new Error(`Not equal (${i + 1}:${j + 1})\n${args[i]}\n${args[j]}`));
            }
        }
    }
    $.$mol_assert_equal = $mol_assert_equal;
    function $mol_assert_unique(...args) {
        for (let i = 0; i < args.length; ++i) {
            for (let j = 0; j < args.length; ++j) {
                if (i === j)
                    continue;
                if (args[i] === args[j] || (Number.isNaN(args[i]) && Number.isNaN(args[j]))) {
                    $mol_fail(new Error(`args[${i}] = args[${j}] = ${args[i]}`));
                }
            }
        }
    }
    $.$mol_assert_unique = $mol_assert_unique;
    function $mol_assert_like(head, ...tail) {
        for (let [index, value] of Object.entries(tail)) {
            if (!$mol_compare_deep(value, head)) {
                const print = (val) => {
                    if (!val)
                        return val;
                    if (typeof val !== 'object')
                        return val;
                    if ('outerHTML' in val)
                        return val.outerHTML;
                    try {
                        return JSON.stringify(val);
                    }
                    catch (error) {
                        console.error(error);
                        return val;
                    }
                };
                return $mol_fail(new Error(`Not like (1:${+index + 2})\n${print(head)}\n---\n${print(value)}`));
            }
        }
    }
    $.$mol_assert_like = $mol_assert_like;
    function $mol_assert_dom(left, right) {
        $mol_assert_equal($mol_dom_serialize(left), $mol_dom_serialize(right));
    }
    $.$mol_assert_dom = $mol_assert_dom;
})($ || ($ = {}));
//mol/assert/assert.ts
;
"use strict";
//mol/type/error/error.ts
;
"use strict";
//mol/type/assert/assert.test.ts
;
"use strict";
//mol/type/assert/assert.ts
;
"use strict";
//mol/type/partial/deep/deep.test.ts
;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Make empty div'() {
            $mol_assert_equal(($mol_jsx("div", null)).outerHTML, '<div></div>');
        },
        'Define native field'() {
            const dom = $mol_jsx("input", { value: '123' });
            $mol_assert_equal(dom.outerHTML, '<input value="123">');
            $mol_assert_equal(dom.value, '123');
        },
        'Define classes'() {
            const dom = $mol_jsx("div", { class: 'foo bar' });
            $mol_assert_equal(dom.outerHTML, '<div class="foo bar"></div>');
        },
        'Define styles'() {
            const dom = $mol_jsx("div", { style: { color: 'red' } });
            $mol_assert_equal(dom.outerHTML, '<div style="color: red;"></div>');
        },
        'Define dataset'() {
            const dom = $mol_jsx("div", { dataset: { foo: 'bar' } });
            $mol_assert_equal(dom.outerHTML, '<div data-foo="bar"></div>');
        },
        'Define attributes'() {
            const dom = $mol_jsx("div", { lang: "ru", hidden: true });
            $mol_assert_equal(dom.outerHTML, '<div lang="ru" hidden=""></div>');
        },
        'Define child nodes'() {
            const dom = $mol_jsx("div", null,
                "hello",
                $mol_jsx("strong", null, "world"),
                "!");
            $mol_assert_equal(dom.outerHTML, '<div>hello<strong>world</strong>!</div>');
        },
        'Function as component'() {
            const Button = ({ hint }, target) => {
                return $mol_jsx("button", { title: hint }, target());
            };
            const dom = $mol_jsx(Button, { id: "/foo", hint: "click me" }, () => 'hey!');
            $mol_assert_equal(dom.outerHTML, '<button title="click me" id="/foo">hey!</button>');
        },
        'Nested guid generation'() {
            const Foo = () => {
                return $mol_jsx("div", null,
                    $mol_jsx(Bar, { id: "/bar" },
                        $mol_jsx("img", { id: "/icon" })));
            };
            const Bar = (props, icon) => {
                return $mol_jsx("span", null, icon);
            };
            const dom = $mol_jsx(Foo, { id: "/foo" });
            $mol_assert_equal(dom.outerHTML, '<div id="/foo"><span id="/foo/bar"><img id="/foo/icon"></span></div>');
        },
        'Fail on non unique ids'() {
            const App = () => {
                return $mol_jsx("div", null,
                    $mol_jsx("span", { id: "/bar" }),
                    $mol_jsx("span", { id: "/bar" }));
            };
            $mol_assert_fail(() => $mol_jsx(App, { id: "/foo" }), 'JSX already has tag with id "/bar"');
        },
    });
})($ || ($ = {}));
//mol/jsx/jsx.test.tsx
;
"use strict";
var $;
(function ($) {
    function $mol_dom_parse(text, type = 'application/xhtml+xml') {
        const parser = new $mol_dom_context.DOMParser();
        const doc = parser.parseFromString(text, type);
        const error = doc.getElementsByTagName('parsererror');
        if (error.length)
            throw new Error(error[0].textContent);
        return doc;
    }
    $.$mol_dom_parse = $mol_dom_parse;
})($ || ($ = {}));
//mol/dom/parse/parse.ts
;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Attach to document'() {
            const doc = $mol_dom_parse('<html><body id="/foo"></body></html>');
            $mol_jsx_attach(doc, () => $mol_jsx("body", { id: "/foo" }, "bar"));
            $mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">bar</body></html>');
        },
    });
})($ || ($ = {}));
//mol/jsx/attach/attach.test.tsx
;
"use strict";
var $;
(function ($) {
    $mol_test({
        'get'() {
            const proxy = $mol_delegate({}, () => ({ foo: 777 }));
            $mol_assert_equal(proxy.foo, 777);
        },
        'has'() {
            const proxy = $mol_delegate({}, () => ({ foo: 777 }));
            $mol_assert_equal('foo' in proxy, true);
        },
        'set'() {
            const target = { foo: 777 };
            const proxy = $mol_delegate({}, () => target);
            proxy.foo = 123;
            $mol_assert_equal(target.foo, 123);
        },
        'getOwnPropertyDescriptor'() {
            const proxy = $mol_delegate({}, () => ({ foo: 777 }));
            $mol_assert_like(Object.getOwnPropertyDescriptor(proxy, 'foo'), {
                value: 777,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        },
        'ownKeys'() {
            const proxy = $mol_delegate({}, () => ({ foo: 777, [Symbol.toStringTag]: 'bar' }));
            $mol_assert_like(Reflect.ownKeys(proxy), ['foo', Symbol.toStringTag]);
        },
        'getPrototypeOf'() {
            class Foo {
            }
            const proxy = $mol_delegate({}, () => new Foo);
            $mol_assert_equal(Object.getPrototypeOf(proxy), Foo.prototype);
        },
        'setPrototypeOf'() {
            class Foo {
            }
            const target = {};
            const proxy = $mol_delegate({}, () => target);
            Object.setPrototypeOf(proxy, Foo.prototype);
            $mol_assert_equal(Object.getPrototypeOf(target), Foo.prototype);
        },
        'instanceof'() {
            class Foo {
            }
            const proxy = $mol_delegate({}, () => new Foo);
            $mol_assert_ok(proxy instanceof Foo);
            $mol_assert_ok(proxy instanceof $mol_delegate);
        },
        'autobind'() {
            class Foo {
            }
            const proxy = $mol_delegate({}, () => new Foo);
            $mol_assert_ok(proxy instanceof Foo);
            $mol_assert_ok(proxy instanceof $mol_delegate);
        },
    });
})($ || ($ = {}));
//mol/delegate/delegate.test.ts
;
"use strict";
//mol/type/writable/writable.test.ts
;
"use strict";
var $;
(function ($) {
    let $mol_wire_cursor;
    (function ($mol_wire_cursor) {
        $mol_wire_cursor[$mol_wire_cursor["stale"] = new (class stale extends Number {
        })(-1)] = "stale";
        $mol_wire_cursor[$mol_wire_cursor["doubt"] = new (class doubt extends Number {
        })(-2)] = "doubt";
        $mol_wire_cursor[$mol_wire_cursor["fresh"] = new (class fresh extends Number {
        })(-3)] = "fresh";
        $mol_wire_cursor[$mol_wire_cursor["final"] = new (class solid extends Number {
        })(-4)] = "final";
    })($mol_wire_cursor = $.$mol_wire_cursor || ($.$mol_wire_cursor = {}));
})($ || ($ = {}));
//mol/wire/cursor/cursor.ts
;
"use strict";
var $;
(function ($) {
    class $mol_wire_pub extends Array {
        static get [Symbol.species]() {
            return Array;
        }
        sub_from = 0;
        get sub_list() {
            const res = [];
            for (let i = this.sub_from; i < this.length; i += 2) {
                res.push(this[i]);
            }
            return res;
        }
        get sub_empty() {
            return this.sub_from === this.length;
        }
        sub_on(sub, pub_pos) {
            const pos = this.length;
            this.push(sub, pub_pos);
            return pos;
        }
        sub_off(sub_pos) {
            if (!(sub_pos < this.length)) {
                $mol_fail(new Error(`Wrong pos ${sub_pos}`));
            }
            const end = this.length - 2;
            if (sub_pos !== end) {
                this.peer_move(end, sub_pos);
            }
            this.pop();
            this.pop();
            if (this.length === this.sub_from)
                this.reap();
        }
        reap() { }
        track_promote() {
            $mol_wire_auto?.track_next(this);
        }
        up() { }
        down() { }
        emit() {
            for (let i = this.sub_from; i < this.length; i += 2) {
                ;
                this[i].stale();
            }
        }
        stale() {
            if (!this.affect($mol_wire_cursor.stale))
                return false;
            while ($mol_wire_affected.length) {
                const next = $mol_wire_affected.pop();
                next.affect($mol_wire_cursor.doubt);
            }
            return true;
        }
        affect(quant) {
            for (let i = this.sub_from; i < this.length; i += 2) {
                const sub = this[i];
                $mol_wire_affected.push(sub);
            }
            return true;
        }
        peer_move(from_pos, to_pos) {
            const peer = this[from_pos];
            const self_pos = this[from_pos + 1];
            this[to_pos] = peer;
            this[to_pos + 1] = self_pos;
            peer.peer_repos(self_pos, to_pos);
        }
        peer_repos(peer_pos, self_pos) {
            this[peer_pos + 1] = self_pos;
        }
    }
    $.$mol_wire_pub = $mol_wire_pub;
})($ || ($ = {}));
//mol/wire/pub/pub.ts
;
"use strict";
//mol/wire/sub/sub.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_wire_auto = null;
    $.$mol_wire_affected = [];
})($ || ($ = {}));
//mol/wire/wire.ts
;
"use strict";
var $;
(function ($) {
    function $mol_wire_method(host, field, descr) {
        if (!descr)
            descr = Reflect.getOwnPropertyDescriptor(host, field);
        const orig = descr?.value ?? host[field];
        const sup = Reflect.getPrototypeOf(host);
        if (typeof sup[field] === 'function') {
            Object.defineProperty(orig, 'name', { value: sup[field].name });
        }
        const value = function (...args) {
            const fiber = $mol_wire_fiber.temp(this ?? null, orig, ...args);
            return fiber.sync();
        };
        Object.defineProperty(value, 'name', { value: orig.name + ' ' });
        Object.assign(value, { orig });
        const descr2 = { ...descr, value };
        Reflect.defineProperty(host, field, descr2);
        return descr2;
    }
    $.$mol_wire_method = $mol_wire_method;
})($ || ($ = {}));
//mol/wire/method/method.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_after_mock_queue = [];
    function $mol_after_mock_warp() {
        const queue = $.$mol_after_mock_queue.splice(0);
        for (const task of queue)
            task();
    }
    $.$mol_after_mock_warp = $mol_after_mock_warp;
    class $mol_after_mock_commmon extends $mol_object2 {
        task;
        promise = Promise.resolve();
        cancelled = false;
        id;
        constructor(task) {
            super();
            this.task = task;
            $.$mol_after_mock_queue.push(task);
        }
        destructor() {
            const index = $.$mol_after_mock_queue.indexOf(this.task);
            if (index >= 0)
                $.$mol_after_mock_queue.splice(index, 1);
        }
    }
    $.$mol_after_mock_commmon = $mol_after_mock_commmon;
    class $mol_after_mock_timeout extends $mol_after_mock_commmon {
        delay;
        constructor(delay, task) {
            super(task);
            this.delay = delay;
        }
    }
    $.$mol_after_mock_timeout = $mol_after_mock_timeout;
})($ || ($ = {}));
//mol/after/mock/mock.test.ts
;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        async 'Latest Calls Wins on Concurrency'($) {
            class NameLogger extends $mol_object2 {
                static $ = $;
                static first = [];
                static last = [];
                static send(next) {
                    $mol_wire_sync(this.first).push(next);
                    this.$.$mol_wait_timeout(0);
                    this.last.push(next);
                }
            }
            const name = $mol_wire_async(NameLogger).send;
            name('john');
            const promise = name('jin');
            $.$mol_after_mock_warp();
            await promise;
            $mol_assert_like(NameLogger.first, ['john', 'jin']);
            $mol_assert_like(NameLogger.last, ['jin']);
        },
    });
})($ || ($ = {}));
//mol/wire/async/async.test.ts
;
"use strict";
var $;
(function ($) {
    function $mol_wire_async(obj) {
        return new Proxy(obj, {
            get(obj, field) {
                const val = obj[field];
                if (typeof val !== 'function')
                    return val;
                let fiber;
                return function $mol_wire_async(...args) {
                    fiber?.destructor();
                    fiber = $mol_wire_fiber.temp(obj, val, ...args);
                    return fiber.async();
                };
            }
        });
    }
    $.$mol_wire_async = $mol_wire_async;
})($ || ($ = {}));
//mol/wire/async/async.ts
;
"use strict";
var $;
(function ($) {
    $['devtoolsFormatters'] = $['devtoolsFormatters'] || [];
    function $mol_dev_format_register(config) {
        $['devtoolsFormatters'].push(config);
    }
    $.$mol_dev_format_register = $mol_dev_format_register;
    $.$mol_dev_format_head = Symbol('$mol_dev_format_head');
    $.$mol_dev_format_body = Symbol('$mol_dev_format_body');
    $mol_dev_format_register({
        header: (val, config = false) => {
            if (config)
                return null;
            if (!val)
                return null;
            if ($.$mol_dev_format_head in val) {
                return val[$.$mol_dev_format_head]();
            }
            if (typeof val === 'function') {
                return $mol_dev_format_native(val);
            }
            return null;
        },
        hasBody: val => val[$.$mol_dev_format_body],
        body: val => val[$.$mol_dev_format_body](),
    });
    function $mol_dev_format_native(obj) {
        if (typeof obj === 'undefined')
            return $.$mol_dev_format_shade('undefined');
        if (typeof obj !== 'object' && typeof obj !== 'function')
            return obj;
        return [
            'object',
            {
                object: obj,
                config: true,
            },
        ];
    }
    $.$mol_dev_format_native = $mol_dev_format_native;
    function $mol_dev_format_auto(obj) {
        if (obj == null)
            return $.$mol_dev_format_shade(String(obj));
        if (typeof obj === 'object' && $.$mol_dev_format_head in obj) {
            return obj[$.$mol_dev_format_head]();
        }
        return [
            'object',
            {
                object: obj,
                config: false,
            },
        ];
    }
    $.$mol_dev_format_auto = $mol_dev_format_auto;
    function $mol_dev_format_element(element, style, ...content) {
        const styles = [];
        for (let key in style)
            styles.push(`${key} : ${style[key]}`);
        return [
            element,
            {
                style: styles.join(' ; '),
            },
            ...content,
        ];
    }
    $.$mol_dev_format_element = $mol_dev_format_element;
    function $mol_dev_format_span(style, ...content) {
        return $mol_dev_format_element('span', {
            'vertical-align': '8%',
            ...style,
        }, ...content);
    }
    $.$mol_dev_format_span = $mol_dev_format_span;
    $.$mol_dev_format_div = $mol_dev_format_element.bind(null, 'div');
    $.$mol_dev_format_ol = $mol_dev_format_element.bind(null, 'ol');
    $.$mol_dev_format_li = $mol_dev_format_element.bind(null, 'li');
    $.$mol_dev_format_table = $mol_dev_format_element.bind(null, 'table');
    $.$mol_dev_format_tr = $mol_dev_format_element.bind(null, 'tr');
    $.$mol_dev_format_td = $mol_dev_format_element.bind(null, 'td');
    $.$mol_dev_format_accent = $mol_dev_format_span.bind(null, {
        'color': 'magenta',
    });
    $.$mol_dev_format_strong = $mol_dev_format_span.bind(null, {
        'font-weight': 'bold',
    });
    $.$mol_dev_format_string = $mol_dev_format_span.bind(null, {
        'color': 'green',
    });
    $.$mol_dev_format_shade = $mol_dev_format_span.bind(null, {
        'color': 'gray',
    });
    $.$mol_dev_format_indent = $.$mol_dev_format_div.bind(null, {
        'margin-left': '13px'
    });
})($ || ($ = {}));
//mol/dev/format/format.ts
;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'Collect deps'() {
            const pub1 = new $mol_wire_pub;
            const pub2 = new $mol_wire_pub;
            const sub = new $mol_wire_pub_sub;
            const bu1 = sub.track_on();
            try {
                pub1.track_promote();
                pub2.track_promote();
                pub2.track_promote();
            }
            finally {
                sub.track_off(bu1);
            }
            pub1.emit();
            pub2.emit();
            $mol_assert_like(sub.pub_list, [pub1, pub2, pub2]);
            const bu2 = sub.track_on();
            try {
                pub1.track_promote();
                pub1.track_promote();
                pub2.track_promote();
            }
            finally {
                sub.track_off(bu2);
            }
            pub1.emit();
            pub2.emit();
            $mol_assert_like(sub.pub_list, [pub1, pub1, pub2]);
        },
        'cyclic detection'($) {
            const sub1 = new $mol_wire_pub_sub;
            const sub2 = new $mol_wire_pub_sub;
            const bu1 = sub1.track_on();
            try {
                const bu2 = sub2.track_on();
                try {
                    $mol_assert_fail(() => sub1.track_promote(), 'Circular subscription');
                }
                finally {
                    sub2.track_off(bu2);
                }
            }
            finally {
                sub1.track_off(bu1);
            }
        },
    });
})($ || ($ = {}));
//mol/wire/pub/sub/sub.test.ts
;
"use strict";
var $;
(function ($) {
    class $mol_wire_pub_sub extends $mol_wire_pub {
        pub_from = 0;
        cursor = $mol_wire_cursor.stale;
        get pub_list() {
            const res = [];
            for (let i = this.pub_from; i < this.sub_from; i += 2) {
                res.push(this[i]);
            }
            return res;
        }
        track_on() {
            this.cursor = this.pub_from;
            const sub = $mol_wire_auto;
            $mol_wire_auto = this;
            return sub;
        }
        track_promote() {
            if (this.cursor >= this.pub_from) {
                $mol_fail(new Error('Circular subscription'));
            }
            super.track_promote();
        }
        track_next(pub) {
            if (this.cursor < 0)
                $mol_fail(new Error('Promo to non begun sub'));
            if (this.cursor < this.sub_from) {
                const next = this[this.cursor];
                if (pub === undefined)
                    return next ?? null;
                if (next === pub) {
                    this.cursor += 2;
                    return next;
                }
                next?.sub_off(this[this.cursor + 1]);
            }
            else {
                if (pub === undefined)
                    return null;
                if (this.sub_from < this.length) {
                    this.peer_move(this.sub_from, this.length);
                }
                this.sub_from += 2;
            }
            this[this.cursor] = pub;
            this[this.cursor + 1] = pub.sub_on(this, this.cursor);
            this.cursor += 2;
            return pub;
        }
        track_off(sub) {
            $mol_wire_auto = sub;
            if (this.cursor < 0)
                $mol_fail(new Error('End of non begun sub'));
            this.forget(this.cursor);
            for (let cursor = this.pub_from; cursor < this.sub_from; cursor += 2) {
                const pub = this[cursor];
                pub.up();
            }
            this.cursor = $mol_wire_cursor.fresh;
        }
        pub_off(sub_pos) {
            this[sub_pos] = undefined;
            this[sub_pos + 1] = undefined;
        }
        destructor() {
            for (let cursor = this.length - 2; cursor >= this.sub_from; cursor -= 2) {
                const sub = this[cursor];
                const pos = this[cursor + 1];
                sub.pub_off(pos);
                this.pop();
                this.pop();
            }
            this.forget();
            this.cursor = $mol_wire_cursor.final;
        }
        forget(from = this.pub_from) {
            let tail = 0;
            for (let cursor = from; cursor < this.sub_from; cursor += 2) {
                const pub = this[cursor];
                pub?.sub_off(this[cursor + 1]);
                if (this.sub_from < this.length) {
                    this.peer_move(this.length - 2, cursor);
                    this.pop();
                    this.pop();
                }
                else {
                    ++tail;
                }
            }
            for (; tail; --tail) {
                this.pop();
                this.pop();
            }
            this.sub_from = from;
        }
        affect(quant) {
            if (this.cursor === $mol_wire_cursor.final)
                return false;
            if (this.cursor >= quant)
                return false;
            this.cursor = quant;
            return super.affect(quant);
        }
        [$mol_dev_format_head]() {
            return $mol_dev_format_native(this);
        }
        get derived() {
            return this.sub_from === this.pub_from;
        }
    }
    $.$mol_wire_pub_sub = $mol_wire_pub_sub;
})($ || ($ = {}));
//mol/wire/pub/sub/sub.ts
;
"use strict";
var $;
(function ($) {
    $mol_test({
        'nulls & undefineds'() {
            $mol_assert_ok($mol_compare_deep(null, null));
            $mol_assert_ok($mol_compare_deep(undefined, undefined));
            $mol_assert_not($mol_compare_deep(undefined, null));
            $mol_assert_not($mol_compare_deep({}, null));
        },
        'number'() {
            $mol_assert_ok($mol_compare_deep(1, 1));
            $mol_assert_ok($mol_compare_deep(Number.NaN, Number.NaN));
            $mol_assert_not($mol_compare_deep(1, 2));
            $mol_assert_ok($mol_compare_deep(Object(1), Object(1)));
            $mol_assert_not($mol_compare_deep(Object(1), Object(2)));
        },
        'POJO'() {
            $mol_assert_ok($mol_compare_deep({}, {}));
            $mol_assert_not($mol_compare_deep({ a: 1 }, { b: 2 }));
            $mol_assert_not($mol_compare_deep({ a: 1 }, { a: 2 }));
            $mol_assert_not($mol_compare_deep({}, { a: undefined }));
            $mol_assert_ok($mol_compare_deep({ a: 1, b: 2 }, { b: 2, a: 1 }));
            $mol_assert_ok($mol_compare_deep({ a: { b: 1 } }, { a: { b: 1 } }));
        },
        'Array'() {
            $mol_assert_ok($mol_compare_deep([], []));
            $mol_assert_ok($mol_compare_deep([1, [2]], [1, [2]]));
            $mol_assert_not($mol_compare_deep([1, 2], [1, 3]));
            $mol_assert_not($mol_compare_deep([1, 2,], [1, 3, undefined]));
        },
        'Non POJO are different'() {
            class Thing extends Object {
            }
            $mol_assert_not($mol_compare_deep(new Thing, new Thing));
            $mol_assert_not($mol_compare_deep(() => 1, () => 1));
            $mol_assert_not($mol_compare_deep(new RangeError('Test error'), new RangeError('Test error')));
        },
        'same POJOs with cyclic reference'() {
            const a = { foo: {} };
            a['self'] = a;
            const b = { foo: {} };
            b['self'] = b;
            $mol_assert_ok($mol_compare_deep(a, b));
        },
        'Date'() {
            $mol_assert_ok($mol_compare_deep(new Date(12345), new Date(12345)));
            $mol_assert_not($mol_compare_deep(new Date(12345), new Date(12346)));
        },
        'RegExp'() {
            $mol_assert_ok($mol_compare_deep(/\x22/mig, /\x22/mig));
            $mol_assert_not($mol_compare_deep(/\x22/mig, /\x21/mig));
            $mol_assert_not($mol_compare_deep(/\x22/mig, /\x22/mg));
        },
        'Map'() {
            $mol_assert_ok($mol_compare_deep(new Map, new Map));
            $mol_assert_ok($mol_compare_deep(new Map([[1, [2]]]), new Map([[1, [2]]])));
            $mol_assert_not($mol_compare_deep(new Map([[1, 2]]), new Map([[1, 3]])));
            $mol_assert_not($mol_compare_deep(new Map([[[1], 2]]), new Map([[[1], 2]])));
        },
        'Set'() {
            $mol_assert_ok($mol_compare_deep(new Set, new Set));
            $mol_assert_ok($mol_compare_deep(new Set([1, [2]]), new Set([1, [2]])));
            $mol_assert_not($mol_compare_deep(new Set([1]), new Set([2])));
        },
        'Uint8Array'() {
            $mol_assert_ok($mol_compare_deep(new Uint8Array, new Uint8Array));
            $mol_assert_ok($mol_compare_deep(new Uint8Array([0]), new Uint8Array([0])));
            $mol_assert_not($mol_compare_deep(new Uint8Array([0]), new Uint8Array([1])));
        },
        'Custom comparator'() {
            class User {
                name;
                rand;
                constructor(name, rand = Math.random()) {
                    this.name = name;
                    this.rand = rand;
                }
                [Symbol.toPrimitive](mode) {
                    return this.name;
                }
            }
            $mol_assert_ok($mol_compare_deep(new User('Jin'), new User('Jin')));
            $mol_assert_not($mol_compare_deep(new User('Jin'), new User('John')));
        },
    });
})($ || ($ = {}));
//mol/compare/deep/deep.test.tsx
;
"use strict";
var $;
(function ($) {
    $.$mol_compare_deep_cache = new WeakMap();
    function $mol_compare_deep(left, right) {
        if (Object.is(left, right))
            return true;
        if (left === null)
            return false;
        if (right === null)
            return false;
        if (typeof left !== 'object')
            return false;
        if (typeof right !== 'object')
            return false;
        const left_proto = Reflect.getPrototypeOf(left);
        const right_proto = Reflect.getPrototypeOf(right);
        if (left_proto !== right_proto)
            return false;
        if (left instanceof Boolean)
            return Object.is(left.valueOf(), right['valueOf']());
        if (left instanceof Number)
            return Object.is(left.valueOf(), right['valueOf']());
        if (left instanceof String)
            return Object.is(left.valueOf(), right['valueOf']());
        if (left instanceof Date)
            return Object.is(left.valueOf(), right['valueOf']());
        if (left instanceof RegExp)
            return left.source === right['source'] && left.flags === right['flags'];
        let left_cache = $.$mol_compare_deep_cache.get(left);
        if (left_cache) {
            const right_cache = left_cache.get(right);
            if (typeof right_cache === 'boolean')
                return right_cache;
        }
        else {
            left_cache = new WeakMap([[right, true]]);
            $.$mol_compare_deep_cache.set(left, left_cache);
        }
        let result;
        try {
            if (left_proto && !Reflect.getPrototypeOf(left_proto))
                result = compare_pojo(left, right);
            else if (Array.isArray(left))
                result = compare_array(left, right);
            else if (left instanceof Set)
                result = compare_set(left, right);
            else if (left instanceof Map)
                result = compare_map(left, right);
            else if (ArrayBuffer.isView(left))
                result = compare_buffer(left, right);
            else if (Symbol.toPrimitive in left)
                result = compare_primitive(left, right);
            else
                result = false;
        }
        finally {
            left_cache.set(right, result);
        }
        return result;
    }
    $.$mol_compare_deep = $mol_compare_deep;
    function compare_array(left, right) {
        const len = left.length;
        if (len !== right.length)
            return false;
        for (let i = 0; i < len; ++i) {
            if (!$mol_compare_deep(left[i], right[i]))
                return false;
        }
        return true;
    }
    function compare_buffer(left, right) {
        const len = left.byteLength;
        if (len !== right.byteLength)
            return false;
        for (let i = 0; i < len; ++i) {
            if (left[i] !== right[i])
                return false;
        }
        return true;
    }
    function compare_iterator(left, right, compare) {
        while (true) {
            const left_next = left.next();
            const right_next = right.next();
            if (left_next.done !== right_next.done)
                return false;
            if (left_next.done)
                break;
            if (!compare(left_next.value, right_next.value))
                return false;
        }
        return true;
    }
    function compare_set(left, right) {
        if (left.size !== right.size)
            return false;
        return compare_iterator(left.values(), right.values(), $mol_compare_deep);
    }
    function compare_map(left, right) {
        if (left.size !== right.size)
            return false;
        return compare_iterator(left.keys(), right.keys(), Object.is)
            && compare_iterator(left.values(), right.values(), $mol_compare_deep);
    }
    function compare_pojo(left, right) {
        const left_keys = Object.getOwnPropertyNames(left);
        const right_keys = Object.getOwnPropertyNames(right);
        if (left_keys.length !== right_keys.length)
            return false;
        for (let key of left_keys) {
            if (!$mol_compare_deep(left[key], Reflect.get(right, key)))
                return false;
        }
        return true;
    }
    function compare_primitive(left, right) {
        return Object.is(left[Symbol.toPrimitive]('default'), right[Symbol.toPrimitive]('default'));
    }
})($ || ($ = {}));
//mol/compare/deep/deep.ts
;
"use strict";
var $;
(function ($) {
    function $mol_guid(length = 8, exists = () => false) {
        for (;;) {
            let id = Math.random().toString(36).substring(2, length + 2).toUpperCase();
            if (exists(id))
                continue;
            return id;
        }
    }
    $.$mol_guid = $mol_guid;
})($ || ($ = {}));
//mol/guid/guid.ts
;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Primitives'() {
            $mol_assert_equal($mol_key(null), 'null');
            $mol_assert_equal($mol_key(false), 'false');
            $mol_assert_equal($mol_key(true), 'true');
            $mol_assert_equal($mol_key(0), '0');
            $mol_assert_equal($mol_key(''), '""');
        },
        'Array & POJO'() {
            $mol_assert_equal($mol_key([null]), '[null]');
            $mol_assert_equal($mol_key({ foo: 0 }), '{"foo":0}');
            $mol_assert_equal($mol_key({ foo: [false] }), '{"foo":[false]}');
        },
        'Function'() {
            const func = () => { };
            $mol_assert_equal($mol_key(func), $mol_key(func));
            $mol_assert_unique($mol_key(func), $mol_key(() => { }));
        },
        'Objects'() {
            class User {
            }
            const jin = new User();
            $mol_assert_equal($mol_key(jin), $mol_key(jin));
            $mol_assert_unique($mol_key(jin), $mol_key(new User()));
        },
        'Elements'() {
            const foo = $mol_jsx("div", null, "bar");
            $mol_assert_equal($mol_key(foo), $mol_key(foo));
            $mol_assert_unique($mol_key(foo), $mol_key($mol_jsx("div", null, "bar")));
        },
        'Custom JSON representation'() {
            class User {
                name;
                age;
                constructor(name, age) {
                    this.name = name;
                    this.age = age;
                }
                toJSON() { return { name: this.name }; }
            }
            $mol_assert_equal($mol_key(new User('jin', 18)), '{"name":"jin"}');
        },
        'Special native classes'() {
            $mol_assert_equal($mol_key(new Date('xyz')), 'null');
            $mol_assert_equal($mol_key(new Date('2001-01-02T03:04:05.678Z')), '"2001-01-02T03:04:05.678Z"');
            $mol_assert_equal($mol_key(/./), '"/./"');
            $mol_assert_equal($mol_key(/\./gimsu), '"/\\\\./gimsu"');
        },
    });
})($ || ($ = {}));
//mol/key/key.test.tsx
;
"use strict";
var $;
(function ($) {
    $.$mol_key_store = new WeakMap();
    function $mol_key(value) {
        if (!value)
            return JSON.stringify(value);
        if (typeof value !== 'object' && typeof value !== 'function')
            return JSON.stringify(value);
        return JSON.stringify(value, (field, value) => {
            if (!value)
                return value;
            if (typeof value !== 'object' && typeof value !== 'function')
                return value;
            if (Array.isArray(value))
                return value;
            const proto = Reflect.getPrototypeOf(value);
            if (!proto)
                return value;
            if (Reflect.getPrototypeOf(proto) === null)
                return value;
            if ('toJSON' in value)
                return value;
            if (value instanceof RegExp)
                return value.toString();
            let key = $.$mol_key_store.get(value);
            if (key)
                return key;
            key = $mol_guid();
            $.$mol_key_store.set(value, key);
            return key;
        });
    }
    $.$mol_key = $mol_key;
})($ || ($ = {}));
//mol/key/key.ts
;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        $.$mol_after_frame = $mol_after_mock_commmon;
    });
})($ || ($ = {}));
//mol/after/frame/frame.test.ts
;
"use strict";
var $;
(function ($) {
    class $mol_after_frame extends $mol_object2 {
        task;
        static _promise = null;
        static get promise() {
            if (this._promise)
                return this._promise;
            return this._promise = new Promise(done => {
                requestAnimationFrame(() => {
                    this._promise = null;
                    done();
                });
                setTimeout(() => {
                    this._promise = null;
                    done();
                }, 100);
            });
        }
        cancelled = false;
        promise;
        constructor(task) {
            super();
            this.task = task;
            this.promise = $mol_after_frame.promise.then(() => {
                if (this.cancelled)
                    return;
                task();
            });
        }
        destructor() {
            this.cancelled = true;
        }
    }
    $.$mol_after_frame = $mol_after_frame;
})($ || ($ = {}));
//mol/after/frame/frame.web.ts
;
"use strict";
var $;
(function ($) {
    $mol_test({
        'Sync execution'() {
            class Sync extends $mol_object2 {
                static calc(a, b) {
                    return a + b;
                }
            }
            __decorate([
                $mol_wire_method
            ], Sync, "calc", null);
            $mol_assert_equal(Sync.calc(1, 2), 3);
        },
        async 'async <=> sync'() {
            class SyncAsync extends $mol_object2 {
                static async val(a) {
                    return a;
                }
                static sum(a, b) {
                    const syn = $mol_wire_sync(this);
                    return syn.val(a) + syn.val(b);
                }
                static async calc(a, b) {
                    return 5 + await $mol_wire_async(this).sum(a, b);
                }
            }
            $mol_assert_equal(await SyncAsync.calc(1, 2), 8);
        },
        async 'Idempotence control'() {
            class Idempotence extends $mol_object2 {
                static logs_idemp = 0;
                static logs_unidemp = 0;
                static log_idemp() {
                    this.logs_idemp += 1;
                }
                static log_unidemp() {
                    this.logs_unidemp += 1;
                }
                static async val(a) {
                    return a;
                }
                static sum(a, b) {
                    this.log_idemp();
                    this.log_unidemp();
                    const syn = $mol_wire_sync(this);
                    return syn.val(a) + syn.val(b);
                }
                static async calc(a, b) {
                    return 5 + await $mol_wire_async(this).sum(a, b);
                }
            }
            __decorate([
                $mol_wire_method
            ], Idempotence, "log_idemp", null);
            $mol_assert_equal(await Idempotence.calc(1, 2), 8);
            $mol_assert_equal(Idempotence.logs_idemp, 1);
            $mol_assert_equal(Idempotence.logs_unidemp, 3);
        },
        async 'Error handling'() {
            class Handle extends $mol_object2 {
                static async sum(a, b) {
                    $mol_fail(new Error('test error ' + (a + b)));
                }
                static check() {
                    try {
                        return $mol_wire_sync(Handle).sum(1, 2);
                    }
                    catch (error) {
                        if (error instanceof Promise)
                            $mol_fail_hidden(error);
                        $mol_assert_equal(error.message, 'test error 3');
                    }
                }
            }
            await $mol_wire_async(Handle).check();
        },
    });
})($ || ($ = {}));
//mol/wire/fiber/fiber.test.ts
;
"use strict";
var $;
(function ($) {
    const handled = new WeakSet();
    class $mol_wire_fiber extends $mol_wire_pub_sub {
        host;
        task;
        static temp(host, task, ...args) {
            const existen = $mol_wire_auto?.track_next();
            reuse: if (existen) {
                if (!(existen instanceof $mol_wire_fiber))
                    break reuse;
                if (existen.host !== host)
                    break reuse;
                if (existen.task !== task)
                    break reuse;
                if (!$mol_compare_deep(existen.args, args))
                    break reuse;
                return existen;
            }
            return new this(host, task, host + '.' + task.name + '(#)', ...args);
        }
        static persist(host, task, ...args) {
            const field = task.name + '()';
            let dict, key, existen, fiber;
            if (args.length) {
                key = `${host}.${task.name}(${args.map(v => $mol_key(v)).join(',')})`;
                dict = Object.getOwnPropertyDescriptor(host, field)?.value;
                if (dict)
                    existen = dict.get(key);
                else
                    dict = host[field] = new Map();
            }
            else {
                key = `${host}.${field}`;
                existen = Object.getOwnPropertyDescriptor(host, field)?.value;
            }
            reuse: if (existen) {
                if (!(existen instanceof $mol_wire_fiber))
                    break reuse;
                if (existen.host !== host)
                    break reuse;
                if (existen.task !== task)
                    break reuse;
                return existen;
            }
            fiber = new this(host, task, key, ...args);
            if (args.length)
                dict.set(key, fiber);
            else
                host[field] = fiber;
            return fiber;
        }
        static warm = true;
        static planning = [];
        static reaping = [];
        static plan_task = null;
        static plan() {
            if (this.plan_task)
                return;
            this.plan_task = new $mol_after_frame(() => {
                try {
                    this.sync();
                }
                finally {
                    $mol_wire_fiber.plan_task = null;
                }
            });
        }
        static sync() {
            while (this.planning.length) {
                const fibers = this.planning.splice(0, this.planning.length);
                for (const fiber of fibers) {
                    fiber.up();
                }
            }
            while (this.reaping.length) {
                const fibers = this.reaping.splice(0, this.reaping.length);
                for (const fiber of fibers) {
                    if (!fiber.sub_empty)
                        continue;
                    fiber.destructor();
                }
            }
        }
        cache = undefined;
        get args() {
            return this.slice(0, this.pub_from);
        }
        get result() {
            if (this.cache instanceof Promise)
                return;
            if (this.cache instanceof Error)
                return;
            return this.cache;
        }
        get persist() {
            const id = this[Symbol.toStringTag];
            return id[id.length - 2] !== '#';
        }
        field() {
            return this.task.name + '()';
        }
        constructor(host, task, id, ...args) {
            super(...args, undefined);
            this.host = host;
            this.task = task;
            this.pop();
            this.pub_from = this.sub_from = args.length;
            this[Symbol.toStringTag] = id;
        }
        destructor() {
            super.destructor();
            const prev = this.cache;
            if ($mol_owning_check(this, prev)) {
                prev.destructor();
            }
            this.cache = undefined;
            if (this.persist) {
                if (this.pub_from === 0) {
                    this.host[this.field()] = null;
                }
                else {
                    this.host[this.field()].delete(this[Symbol.toStringTag]);
                }
            }
        }
        plan() {
            $mol_wire_fiber.planning.push(this);
            $mol_wire_fiber.plan();
        }
        reap() {
            $mol_wire_fiber.reaping.push(this);
            $mol_wire_fiber.plan();
        }
        toString() {
            return this[Symbol.toStringTag];
        }
        [$mol_dev_format_head]() {
            const cursor = this.cursor >= 0
                ? '@' + this.cursor
                : this.cursor?.constructor?.name;
            return $mol_dev_format_div({}, $mol_dev_format_native(this), $mol_dev_format_shade(' ' + cursor + ' = '), $mol_dev_format_auto(this.cache));
        }
        get $() {
            return this.host['$'];
        }
        affect(quant) {
            if (!super.affect(quant))
                return false;
            if (this.sub_from === this.length) {
                this.plan();
            }
            return true;
        }
        down() {
            if (this.persist)
                return;
            this.destructor();
        }
        up() {
            if (this.cursor === $mol_wire_cursor.fresh)
                return;
            check: if (this.cursor === $mol_wire_cursor.doubt) {
                for (let i = this.pub_from; i < this.sub_from; i += 2) {
                    ;
                    this[i]?.up();
                    if (this.cursor !== $mol_wire_cursor.doubt)
                        break check;
                }
                this.cursor = $mol_wire_cursor.fresh;
                return;
            }
            const bu = this.track_on();
            let result;
            try {
                result = this.task.call(this.host, ...this.args);
                if (result instanceof Promise) {
                    const put = (res) => {
                        if (this.cache === result)
                            this.put(res);
                        return res;
                    };
                    result = Object.assign(result.then(put, put), {
                        destructor: result['destructor']
                    });
                    handled.add(result);
                }
            }
            catch (error) {
                result = error;
                if (result instanceof Promise && !handled.has(result)) {
                    result = Object.assign(result.finally(() => {
                        if (this.cache === result)
                            this.stale();
                    }), {
                        destructor: result['destructor']
                    });
                    handled.add(result);
                }
            }
            this.track_off(bu);
            this.put(result);
        }
        put(next) {
            const prev = this.cache;
            if (next !== prev) {
                if ($mol_owning_check(this, prev)) {
                    prev.destructor();
                }
                this.cache = next;
                if (this.persist && $mol_owning_catch(this, next)) {
                    try {
                        next[Symbol.toStringTag] = this[Symbol.toStringTag];
                    }
                    catch { }
                }
                if (this.sub_from < this.length) {
                    if (!$mol_compare_deep(prev, next)) {
                        this.emit();
                    }
                }
            }
            this.cursor = $mol_wire_cursor.fresh;
            if (next instanceof Promise)
                return next;
            if (this.persist) {
                for (let cursor = this.pub_from; cursor < this.sub_from; cursor += 2) {
                    const pub = this[cursor];
                    pub?.down();
                }
            }
            else {
                this.cursor = this.pub_from;
                this.forget();
                this.cursor = $mol_wire_cursor.fresh;
            }
            return next;
        }
        recall(...args) {
            return this.put(this.task.call(this.host, ...args));
        }
        sync() {
            if (!$mol_wire_fiber.warm) {
                return this.result;
            }
            this.track_promote();
            this.up();
            if (this.cache instanceof Error) {
                return $mol_fail_hidden(this.cache);
            }
            if (this.cache instanceof Promise) {
                return $mol_fail_hidden(this.cache);
            }
            return this.cache;
        }
        async async() {
            while (true) {
                this.up();
                if (this.cache instanceof Error) {
                    $mol_fail_hidden(this.cache);
                }
                if (!(this.cache instanceof Promise))
                    return this.cache;
                await this.cache;
                if (this.cursor === $mol_wire_cursor.final) {
                    await new Promise(() => { });
                }
            }
        }
    }
    __decorate([
        $mol_wire_method
    ], $mol_wire_fiber.prototype, "recall", null);
    $.$mol_wire_fiber = $mol_wire_fiber;
})($ || ($ = {}));
//mol/wire/fiber/fiber.ts
;
"use strict";
var $;
(function ($) {
    function $mol_wire_sync(obj) {
        return new Proxy(obj, {
            get(obj, field) {
                const val = obj[field];
                if (typeof val !== 'function')
                    return val;
                return function $mol_wire_sync(...args) {
                    const fiber = $mol_wire_fiber.temp(obj, val, ...args);
                    return fiber.sync();
                };
            }
        });
    }
    $.$mol_wire_sync = $mol_wire_sync;
})($ || ($ = {}));
//mol/wire/sync/sync.ts
;
"use strict";
var $;
(function ($) {
    const cacthed = new WeakMap();
    function $mol_fail_catch(error) {
        if (typeof error !== 'object')
            return false;
        if (cacthed.get(error))
            return false;
        cacthed.set(error, true);
        return true;
    }
    $.$mol_fail_catch = $mol_fail_catch;
})($ || ($ = {}));
//mol/fail/catch/catch.ts
;
"use strict";
var $;
(function ($) {
    function $mol_fail_log(error) {
        if (error instanceof Promise)
            return false;
        if (!$mol_fail_catch(error))
            return false;
        console.error(error);
        return true;
    }
    $.$mol_fail_log = $mol_fail_log;
})($ || ($ = {}));
//mol/fail/log/log.ts
;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'Cached channel'($) {
            class App extends $mol_object2 {
                static $ = $;
                static value(next = 1) {
                    return next + 1;
                }
                static test() {
                    $mol_assert_equal(App.value(), 2);
                    App.value(2);
                    $mol_assert_equal(App.value(), 3);
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "value", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            App.test();
        },
        'Mem overrides mem'($) {
            class Base extends $mol_object2 {
                static $ = $;
                static value(next = 1) {
                    return next + 1;
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], Base, "value", null);
            class Middle extends Base {
                static value(next) {
                    return super.value(next) + 1;
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], Middle, "value", null);
            class App extends Middle {
                static value(next) {
                    return super.value(next) * 3;
                }
                static test() {
                    $mol_assert_equal(this.value(), 9);
                    $mol_assert_equal(this.value(5), 21);
                    $mol_assert_equal(this.value(), 21);
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "value", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            App.test();
        },
        'Auto recalculation of cached values'($) {
            class App extends $mol_object2 {
                static $ = $;
                static xxx(next) {
                    return next || 1;
                }
                static yyy() {
                    return this.xxx() + 1;
                }
                static zzz() {
                    return this.yyy() + 1;
                }
                static test() {
                    $mol_assert_equal(App.yyy(), 2);
                    $mol_assert_equal(App.zzz(), 3);
                    App.xxx(5);
                    $mol_assert_equal(App.zzz(), 7);
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "xxx", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "yyy", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "zzz", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            App.test();
        },
        'Skip recalculation when actually no dependency changes'($) {
            const log = [];
            class App extends $mol_object2 {
                static $ = $;
                static xxx(next) {
                    log.push('xxx');
                    return next || 1;
                }
                static yyy() {
                    log.push('yyy');
                    return [Math.sign(this.xxx())];
                }
                static zzz() {
                    log.push('zzz');
                    return this.yyy()[0] + 1;
                }
                static test() {
                    App.zzz();
                    $mol_assert_like(log, ['zzz', 'yyy', 'xxx']);
                    App.xxx(5);
                    App.zzz();
                    $mol_assert_like(log, ['zzz', 'yyy', 'xxx', 'xxx', 'yyy']);
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "xxx", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "yyy", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "zzz", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            App.test();
        },
        'Flow: Auto'($) {
            class App extends $mol_object2 {
                static get $() { return $; }
                static first(next = 1) { return next; }
                static second(next = 2) { return next; }
                static condition(next = true) { return next; }
                static counter = 0;
                static result() {
                    const res = this.condition() ? this.first() : this.second();
                    return res + this.counter++;
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "first", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "second", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "condition", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "result", null);
            $mol_assert_equal(App.result(), 1);
            $mol_assert_equal(App.counter, 1);
            App.condition(false);
            $mol_assert_equal(App.result(), 3);
            $mol_assert_equal(App.counter, 2);
            App.first(10);
            $mol_assert_equal(App.result(), 3);
            $mol_assert_equal(App.counter, 2);
        },
        'Dupes: Equality'($) {
            let counter = 0;
            class App extends $mol_object2 {
                static $ = $;
                static foo(next) {
                    return next ?? { numbs: [1] };
                }
                static bar() {
                    return { ...this.foo(), count: ++counter };
                }
                static test() {
                    $mol_assert_like(App.bar(), { numbs: [1], count: 1 });
                    App.foo({ numbs: [1] });
                    $mol_assert_like(App.bar(), { numbs: [1], count: 1 });
                    App.foo({ numbs: [2] });
                    $mol_assert_like(App.bar(), { numbs: [2], count: 2 });
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "foo", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "bar", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            App.test();
        },
        'Cycle: Fail'($) {
            class App extends $mol_object2 {
                static $ = $;
                static foo() {
                    return this.bar() + 1;
                }
                static bar() {
                    return this.foo() + 1;
                }
                static test() {
                    $mol_assert_fail(() => App.foo(), 'Circular subscription');
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "foo", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "bar", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            App.test();
        },
        'Different order of pull and push'($) {
            class App extends $mol_object2 {
                static $ = $;
                static store(next = 0) {
                    return next;
                }
                static fast(next) {
                    return this.store(next);
                }
                static slow(next) {
                    return this.store(next);
                }
                static test() {
                    App.fast();
                    $mol_assert_equal(App.slow(666), 666);
                    $mol_assert_equal(App.fast(), App.slow(), 666);
                    App.store(777);
                    $mol_assert_equal(App.fast(), App.slow(), 777);
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "store", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "fast", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "slow", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            App.test();
        },
        'Actions inside invariant'($) {
            class App extends $mol_object2 {
                static $ = $;
                static count(next = 0) {
                    return next;
                }
                static count2() {
                    return this.count();
                }
                static res() {
                    const count = this.count2();
                    if (!count)
                        this.count(count + 1);
                    return count + 1;
                }
                static test() {
                    $mol_assert_like(App.res(), 1);
                    App.count(5);
                    $mol_assert_like(App.res(), 6);
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "count", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "count2", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "res", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            App.test();
        },
        'Restore after error'($) {
            class App extends $mol_object2 {
                static get $() { return $; }
                static condition(next = false) { return next; }
                static broken() {
                    if (this.condition()) {
                        $mol_fail(new Error('test error'));
                    }
                    return 1;
                }
                static result() {
                    return this.broken();
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "condition", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "broken", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "result", null);
            $mol_assert_equal(App.result(), 1);
            App.condition(true);
            $mol_assert_fail(() => App.result());
            App.condition(false);
            $mol_assert_equal(App.result(), 1);
        },
        async 'Wait for data'($) {
            class App extends $mol_object2 {
                static $ = $;
                static async source() {
                    return 'Jin';
                }
                static middle() {
                    return $mol_wire_sync(this).source();
                }
                static target() {
                    return this.middle();
                }
                static test() {
                    $mol_assert_equal(App.target(), 'Jin');
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "middle", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "target", null);
            __decorate([
                $mol_wire_method
            ], App, "test", null);
            await $mol_wire_async(App).test();
        },
        'Auto destroy on long alone'($) {
            let destroyed = false;
            class App extends $mol_object2 {
                static $ = $;
                static showing(next = true) {
                    return next;
                }
                static details() {
                    return {
                        destructor() {
                            destroyed = true;
                        }
                    };
                }
                static render() {
                    return this.showing() ? this.details() : null;
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "showing", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "details", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "render", null);
            const details = App.render();
            $mol_assert_ok(details);
            App.showing(false);
            $mol_assert_not(App.render());
            App.showing(true);
            $mol_assert_equal(App.render(), details);
            $mol_wire_fiber.sync();
            $mol_assert_not(destroyed);
            App.showing(false);
            $mol_wire_fiber.sync();
            $mol_assert_ok(destroyed);
            App.showing(true);
            $mol_assert_unique(App.render(), details);
        },
        'Forget sub fibers on complete'($) {
            class App extends $mol_object2 {
                static get $() { return $; }
                static counter = 0;
                static count() { return this.counter++; }
                static data(next = 1) { return next; }
                static result() {
                    return this.count() + this.data();
                }
            }
            __decorate([
                $mol_wire_method
            ], App, "count", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "data", null);
            __decorate([
                $mol_wire_mem(0)
            ], App, "result", null);
            $mol_assert_equal(App.result(), 1);
            App.data(2);
            $mol_assert_equal(App.result(), 3);
        },
        'Memoize by single simple key'($) {
            class Team extends $mol_object2 {
                static $ = $;
                static user_name(user, next) {
                    return next ?? user;
                }
                static user_names() {
                    return [
                        this.user_name('jin'),
                        this.user_name('john'),
                    ];
                }
                static test() {
                    $mol_assert_like(this.user_names(), ['jin', 'john']);
                    Team.user_name('jin', 'JIN');
                    $mol_assert_like(this.user_names(), ['JIN', 'john']);
                }
            }
            __decorate([
                $mol_wire_mem(1)
            ], Team, "user_name", null);
            __decorate([
                $mol_wire_mem(1)
            ], Team, "user_names", null);
            __decorate([
                $mol_wire_method
            ], Team, "test", null);
            Team.test();
        },
        'Memoize by single complex key'($) {
            class Map extends $mol_object2 {
                static $ = $;
                static tile(pos) {
                    return new String(`/tile=${pos}`);
                }
                static test() {
                    $mol_assert_like(this.tile([0, 1]), new String('/tile=0,1'));
                    $mol_assert_equal(this.tile([0, 1]), this.tile([0, 1]));
                }
            }
            __decorate([
                $mol_wire_mem(1)
            ], Map, "tile", null);
            __decorate([
                $mol_wire_method
            ], Map, "test", null);
            Map.test();
        },
        'Memoize by multiple keys'($) {
            class Map extends $mol_object2 {
                static $ = $;
                static tile(x, y) {
                    return new String(`/tile=${x},${y}`);
                }
                static test() {
                    $mol_assert_like(this.tile(0, 1), new String('/tile=0,1'));
                    $mol_assert_equal(this.tile(0, 1), this.tile(0, 1));
                }
            }
            __decorate([
                $mol_wire_mem(2)
            ], Map, "tile", null);
            __decorate([
                $mol_wire_method
            ], Map, "test", null);
            Map.test();
        },
        'Owned value has js-path name'() {
            class App extends $mol_object2 {
                static title() {
                    return new $mol_object2;
                }
                static like(friend) {
                    return new $mol_object2;
                }
                static relation(friend, props) {
                    return new $mol_object2;
                }
            }
            __decorate([
                $mol_wire_mem(0)
            ], App, "title", null);
            __decorate([
                $mol_wire_mem(1)
            ], App, "like", null);
            __decorate([
                $mol_wire_mem(2)
            ], App, "relation", null);
            $mol_assert_equal(`${App.title()}`, 'App.title()');
            $mol_assert_equal(`${App.like(123)}`, 'App.like(123)');
            $mol_assert_equal(`${App.relation(123, [456])}`, 'App.relation(123,[456])');
        },
        'Deep deps'($) {
            class Fib extends $mol_object2 {
                static $ = $;
                static sums = 0;
                static value(index, next) {
                    if (next)
                        return next;
                    if (index < 2)
                        return 1;
                    ++this.sums;
                    return this.value(index - 1) + this.value(index - 2);
                }
                static test() {
                    $mol_assert_equal(this.value(4), 5);
                    $mol_assert_equal(this.sums, 3);
                    this.value(1, 2);
                    $mol_assert_equal(this.value(4), 8);
                    $mol_assert_equal(this.sums, 6);
                }
            }
            __decorate([
                $mol_wire_mem(1)
            ], Fib, "value", null);
            __decorate([
                $mol_wire_method
            ], Fib, "test", null);
            Fib.test();
        },
        'Unsubscribe from temp pubs on complete'($) {
            class Random extends $mol_object2 {
                static $ = $;
                static seed() {
                    return Math.random();
                }
                static resets(next) {
                    return Math.random();
                }
                static value() {
                    this.resets();
                    return this.seed();
                }
                static test() {
                    const first = this.value();
                    this.resets(null);
                    const second = this.value();
                    $mol_assert_unique(first, second);
                }
            }
            __decorate([
                $mol_wire_method
            ], Random, "seed", null);
            __decorate([
                $mol_wire_mem(0)
            ], Random, "resets", null);
            __decorate([
                $mol_wire_mem(0)
            ], Random, "value", null);
            __decorate([
                $mol_wire_method
            ], Random, "test", null);
            Random.test();
        },
    });
})($ || ($ = {}));
//mol/wire/mem/mem.test.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_wire_mem = (keys) => (host, field, descr) => {
        if (!descr)
            descr = Reflect.getOwnPropertyDescriptor(host, field);
        const orig = descr?.value ?? host[field];
        const sup = Reflect.getPrototypeOf(host);
        if (typeof sup[field] === 'function') {
            Object.defineProperty(orig, 'name', { value: sup[field].name });
        }
        function value(...args) {
            let atom = $mol_wire_fiber.persist(this, orig, ...args.slice(0, keys));
            if (args[keys] === undefined)
                return atom.sync();
            try {
                atom.sync();
            }
            catch (error) {
                $mol_fail_log(error);
            }
            return atom.recall(...args);
        }
        Object.defineProperty(value, 'name', { value: orig.name + ' ' });
        Object.assign(value, { orig });
        const descr2 = { ...descr, value };
        Reflect.defineProperty(host, field, descr2);
        return descr2;
    };
})($ || ($ = {}));
//mol/wire/mem/mem.ts
;
"use strict";
var $;
(function ($) {
    $.$mol_mem = $mol_wire_mem(0);
    $.$mol_mem_key = $mol_wire_mem(1);
    $.$mol_mem_key2 = $mol_wire_mem(2);
    $.$mol_mem_key3 = $mol_wire_mem(3);
})($ || ($ = {}));
//mol/mem/mem.ts
;
"use strict";
var $;
(function ($_1) {
    $mol_test({
        'Class as component'() {
            class Foo extends $mol_jsx_view {
                title = '';
                render() {
                    return $mol_jsx("div", null,
                        this.title,
                        " ",
                        this.childNodes.join('-'));
                }
            }
            const dom = $mol_jsx(Foo, { id: "/foo", title: "bar" },
                "xxx",
                123);
            $mol_assert_equal(dom.outerHTML, '<div id="/foo">bar xxx-123</div>');
        },
        'View by element'() {
            class Br extends $mol_jsx_view {
                render() {
                    view = this;
                    return $mol_jsx("br", { id: "/foo" });
                }
            }
            let view;
            $mol_assert_equal(Br.of($mol_jsx(Br, null)), view);
        },
        'Attached view rerender'() {
            const doc = $mol_dom_parse('<html><body id="/foo"></body></html>');
            class Title extends $mol_jsx_view {
                value = 'foo';
                render() {
                    return $mol_jsx("div", null, this.value);
                }
            }
            const dom = $mol_jsx_attach(doc, () => $mol_jsx(Title, { id: "/foo" }));
            const title = Title.of(dom);
            $mol_assert_equal(title.ownerDocument, doc);
            $mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">foo</body></html>');
            title.value = 'bar';
            title.valueOf();
            $mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">bar</body></html>');
        },
        async 'Reactive attached view'($) {
            class Task extends $mol_object2 {
                title(next) { return next || 'foo'; }
            }
            __decorate([
                $mol_mem
            ], Task.prototype, "title", null);
            class App extends $mol_jsx_view {
                task() { return new Task; }
                render() {
                    return $mol_jsx("div", null, this.task().title());
                }
            }
            __decorate([
                $mol_mem
            ], App.prototype, "task", null);
            $mol_mem(App.prototype, 'valueOf');
            const task = new Task;
            task.$ = $;
            const doc = $mol_dom_parse('<html><body id="/foo"></body></html>');
            $.$mol_jsx_attach(doc, () => $mol_jsx(App, { "$": $, id: "/foo", task: () => task }));
            $mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">foo</body></html>');
            task.title('bar');
            await $mol_wire_fiber.sync();
            $mol_assert_equal(doc.documentElement.outerHTML, '<html><body id="/foo">bar</body></html>');
        },
    });
})($ || ($ = {}));
//mol/jsx/view/view.test.tsx
;
"use strict";
var $;
(function ($) {
    function $mol_log3_area_lazy(event) {
        const self = this;
        const stack = self.$mol_log3_stack;
        const deep = stack.length;
        let logged = false;
        stack.push(() => {
            logged = true;
            self.$mol_log3_area.call(self, event);
        });
        return () => {
            if (logged)
                self.console.groupEnd();
            if (stack.length > deep)
                stack.length = deep;
        };
    }
    $.$mol_log3_area_lazy = $mol_log3_area_lazy;
    $.$mol_log3_stack = [];
})($ || ($ = {}));
//mol/log3/log3.ts
;
"use strict";
//mol/type/keys/extract/extract.test.ts
;
"use strict";
//mol/type/keys/extract/extract.ts
;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        $.$mol_log3_come = () => { };
        $.$mol_log3_done = () => { };
        $.$mol_log3_fail = () => { };
        $.$mol_log3_warn = () => { };
        $.$mol_log3_rise = () => { };
        $.$mol_log3_area = () => () => { };
    });
})($ || ($ = {}));
//mol/log3/log3.test.ts
;
"use strict";
var $;
(function ($) {
    function $mol_log3_web_make(level, color) {
        return function $mol_log3_logger(event) {
            const pending = this.$mol_log3_stack.pop();
            if (pending)
                pending();
            let tpl = '%c';
            const chunks = Object.values(event);
            for (let i = 0; i < chunks.length; ++i) {
                tpl += (typeof chunks[i] === 'string') ? ' ⦙ %s' : ' ⦙ %o';
            }
            const style = `color:${color};font-weight:bolder`;
            this.console[level](tpl, style, ...chunks);
            const self = this;
            return () => self.console.groupEnd();
        };
    }
    $.$mol_log3_web_make = $mol_log3_web_make;
    $.$mol_log3_come = $mol_log3_web_make('info', 'royalblue');
    $.$mol_log3_done = $mol_log3_web_make('info', 'forestgreen');
    $.$mol_log3_fail = $mol_log3_web_make('error', 'orangered');
    $.$mol_log3_warn = $mol_log3_web_make('warn', 'goldenrod');
    $.$mol_log3_rise = $mol_log3_web_make('log', 'magenta');
    $.$mol_log3_area = $mol_log3_web_make('group', 'cyan');
})($ || ($ = {}));
//mol/log3/log3.web.ts
;
"use strict";
//mol/type/equals/equals.test.ts
;
"use strict";
//mol/type/equals/equals.ts
;
"use strict";
var $;
(function ($) {
    function $mol_promise() {
        let done;
        let fail;
        const promise = new Promise((d, f) => {
            done = d;
            fail = f;
        });
        return Object.assign(promise, {
            done,
            fail,
        });
    }
    $.$mol_promise = $mol_promise;
})($ || ($ = {}));
//mol/promise/promise.ts
;
"use strict";
var $;
(function ($_1) {
    $mol_test_mocks.push($ => {
        $.$mol_after_timeout = $mol_after_mock_timeout;
    });
})($ || ($ = {}));
//mol/after/timeout/timeout.test.ts
;
"use strict";
var $;
(function ($) {
    class $mol_after_timeout extends $mol_object2 {
        delay;
        task;
        id;
        constructor(delay, task) {
            super();
            this.delay = delay;
            this.task = task;
            this.id = setTimeout(task, delay);
        }
        destructor() {
            clearTimeout(this.id);
        }
    }
    $.$mol_after_timeout = $mol_after_timeout;
})($ || ($ = {}));
//mol/after/timeout/timeout.ts
;
"use strict";
var $;
(function ($) {
    function $mol_wait_timeout_async(timeout) {
        const promise = $mol_promise();
        const task = new this.$mol_after_timeout(timeout, () => promise.done());
        return Object.assign(promise, {
            destructor: () => task.destructor()
        });
    }
    $.$mol_wait_timeout_async = $mol_wait_timeout_async;
    function $mol_wait_timeout(timeout) {
        return this.$mol_wire_sync(this).$mol_wait_timeout_async(timeout);
    }
    $.$mol_wait_timeout = $mol_wait_timeout;
})($ || ($ = {}));
//mol/wait/timeout/timeout.ts

//# sourceMappingURL=web.test.js.map
