#! /bin/bash -eu

. config/env.sh
mkdir -p $BASE
exec node server.js
