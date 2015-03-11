#!/bin/bash 

#
# Script to fetch and extract all lego images
#

# We want the script to fail on any error
set -o errexit
set -o nounset

# First arg is sets file
SETS_FILE=$(realpath $1)

SDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

source "${SDIR}/utils.sh"

DOWNLOADS_URL="http://rebrickable.com/downloads"
DOWNLOADS_FILE_NAME="downloads.html"
BASE_PART_IMG_URL="http://rebrickable.com/img/pieces/"
REGEX="parts_[0-9][0-9]*.zip"

downloadFromURL "${DOWNLOADS_URL}" "${DOWNLOADS_FILE_NAME}"
extractAllStringsFromFileMatchingRegex "EXTRACTED_DOWNLOAD_URLS" "${DOWNLOADS_FILE_NAME}" "${REGEX}"

mkdir parts
pushd parts

TMP_ZIP="temp.zip"
for DL_FILE in ${EXTRACTED_DOWNLOAD_URLS}; do
    echo "${DL_FILE}"
    DOWNLOAD_URL="${BASE_PART_IMG_URL}${DL_FILE}"

    downloadFromURL "${DOWNLOAD_URL}" "${TMP_ZIP}"
    extractZip "${TMP_ZIP}"
done

popd

echo "DONE!"

