#! /bin/bash -eu

rm -rf node_modules
npm install .
./node_modules/.bin/mocha test