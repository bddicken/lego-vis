#!/bin/bash

#
# Consolidte images into a single dir
#

# We want the script to fail on any error
set -o errexit
set -o nounset

SDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

rm -rf download
rm -rf download/data
rm -rf download/img

mkdir download
mkdir download/data
mkdir download/img

pushd download

pushd data
${SDIR}/fetch-data.sh
popd

pushd img
${SDIR}/fetch-img.sh
#${SDIR}/consolidate-img.sh
popd

popd

echo "SUCESS IN ALL THINGS!"

