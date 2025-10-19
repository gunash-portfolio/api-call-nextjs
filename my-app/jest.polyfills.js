// Polyfill Web APIs for Jest tests
const { TextDecoder, TextEncoder } = require('util');

// Set TextEncoder/TextDecoder globals
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Polyfill Web APIs that Next.js needs
// We need a minimal Request/Response implementation for Next.js to work

// Use Node.js 18+ built-in fetch if available, otherwise mock it
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({}),
      text: async () => '',
      status: 200,
    })
  );
}

// Headers must be defined first
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._map = new Map(Object.entries(init));
    }
    get(name) {
      return this._map.get(name);
    }
    set(name, value) {
      this._map.set(name, value);
    }
    has(name) {
      return this._map.has(name);
    }
    delete(name) {
      this._map.delete(name);
    }
    forEach(callback) {
      this._map.forEach((value, key) => callback(value, key));
    }
    entries() {
      return this._map.entries();
    }
    keys() {
      return this._map.keys();
    }
    values() {
      return this._map.values();
    }
    [Symbol.iterator]() {
      return this._map.entries();
    }
  };
}

// Minimal Request implementation for Next.js
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this._url = typeof input === 'string' ? input : input.url;
      this._method = init.method || 'GET';
      this._headers = new global.Headers(init.headers || {});
      this._body = init.body;
    }
    get url() { return this._url; }
    get method() { return this._method; }
    get headers() { 
      return this._headers;
    }
    async json() {
      return JSON.parse(this._body || '{}');
    }
    async text() {
      return this._body || '';
    }
  };
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.ok = this.status >= 200 && this.status < 300;
      this.statusText = init.statusText || 'OK';
      this._headers = new global.Headers(init.headers || {});
    }
    get headers() { 
      return this._headers;
    }
    async json() {
      return JSON.parse(this.body);
    }
    async text() {
      return String(this.body);
    }
    static json(data, init = {}) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init.headers,
        },
      });
    }
  };
}

