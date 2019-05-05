#!/usr/bin/env bash
set -ex

pushd /srv
  npm install
  npx tsc
  # node build/src/index.js
popd

/usr/bin/supervisord -n
