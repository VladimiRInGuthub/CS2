PS C:\Users\VladimiR\Documents\GitHub\CS2> node server.js
[dotenv@17.2.0] injecting env (0) from .env (tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit)
node:internal/modules/cjs/loader:1078
  throw err;
  ^

Error: Cannot find module './routes/rooms'
Require stack:
- C:\Users\VladimiR\Documents\GitHub\CS2\server.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1075:15)
    at Module._load (node:internal/modules/cjs/loader:920:27)
    at Module.require (node:internal/modules/cjs/loader:1141:19)
    at require (node:internal/modules/cjs/helpers:110:18)
    at Object.<anonymous> (C:\Users\VladimiR\Documents\GitHub\CS2\server.js:18:23)
    at Module._compile (node:internal/modules/cjs/loader:1254:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1308:10)
    at Module.load (node:internal/modules/cjs/loader:1117:32)
    at Module._load (node:internal/modules/cjs/loader:958:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ 'C:\\Users\\VladimiR\\Documents\\GitHub\\CS2\\server.js' ]
}

Node.js v18.16.0
PS C:\Users\VladimiR\Documents\GitHub\CS2> node server.js                                                         
[dotenv@17.2.0] injecting env (0) from .env (tip: ⚙️  suppress all logs with { quiet: true })
node:internal/modules/cjs/loader:1078
  throw err;
  ^

Error: Cannot find module './routes/rooms'
Require stack:
- C:\Users\VladimiR\Documents\GitHub\CS2\server.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1075:15)
    at Module._load (node:internal/modules/cjs/loader:920:27)
    at Module.require (node:internal/modules/cjs/loader:1141:19)
    at require (node:internal/modules/cjs/helpers:110:18)
    at Object.<anonymous> (C:\Users\VladimiR\Documents\GitHub\CS2\server.js:18:23)
    at Module._compile (node:internal/modules/cjs/loader:1254:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1308:10)
    at Module.load (node:internal/modules/cjs/loader:1117:32)
    at Module._load (node:internal/modules/cjs/loader:958:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ 'C:\\Users\\VladimiR\\Documents\\GitHub\\CS2\\server.js' ]
}

Node.js v18.16.0