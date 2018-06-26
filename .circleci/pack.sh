#!/bin/bash

set -e

source .circleci/get-opts.sh

mkdir package
npm pack
mv $PACKAGE_FILE.tgz package/