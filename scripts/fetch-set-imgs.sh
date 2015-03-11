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

BASE_SET_IMG_URL="http://rebrickable.com/img/sets-b/"

mkdir -p sets
pushd sets

while read l; do
    S_ID_P=$( echo "${l}" | grep -o '^[^,]*,')
    S_ID=${S_ID_P::-1}
    DL_URL="${BASE_SET_IMG_URL}${S_ID}.jpg"
    echo "Attempting download from = $DL_URL"
    wget "${DL_URL}" || true
done < "${SETS_FILE}"

popd

echo "DONE!"

