#!/bin/bash 

#
# Consolidte images into a single dir
#

# We want the script to fail on any error
set -o errexit
set -o nounset

TMP_IMG_DIR=$(mktemp -d)

# extract all img dir names
IMG_DIR_NAMES=$(ls -d */)

# copy all into a single dir
for DIR in ${IMG_DIR_NAMES}; do
    mv -i ${DIR}/* "${TMP_IMG_DIR}"
    rm -r "${DIR}"
done

# move images
mv "${TMP_IMG_DIR}" all

echo "DONE!"

