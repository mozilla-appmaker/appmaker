#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
#set -o xtrace

STATUS=`git status --porcelain -z dist/`

if [ "$STATUS" != "" ]; then
  echo 'Error: the compiled source does not match the committed build'
  echo 'You should run `grunt build` and commit the results to clear this error'
  exit 1
fi
