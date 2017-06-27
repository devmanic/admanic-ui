# admanic-ui

## Installation

To install this library, run:

```bash
$ npm install admanic-ui --save
```

## Development


Af first you have to install all dependencies using `npm install` command.

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

To view component docs
```bash
$ npm run docs:serve
```
## FYI
If you have problems with typings after build, you should resolve this problem manually:
1) Install typings `npm install --save @types/jquery`
2) remove @types from  node_modules folder
