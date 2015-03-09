#!/bin/bash

#
# Script to fetch and extract all data
#

# We want the script to fail on any error
set -o errexit
set -o nounset

SDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

source "${SDIR}/utils.sh"

declare -a DOWNLOAD_URLS=(\
"http://rebrickable.com/files/sets.csv.gz"          \
"http://rebrickable.com/files/set_pieces.csv.gz"    \
"http://rebrickable.com/files/pieces.csv.gz"        \
"http://rebrickable.com/files/colors.csv.gz"        \
)

declare -a DOWNLOAD_NAMES=(\
"sets.csv.gz"          \
"set_pieces.csv.gz"    \
"pieces.csv.gz"        \
"colors.csv.gz"        \
)

declare -a FILE_NAMES=(\
"sets.csv"          \
"set_pieces.csv"    \
"pieces.csv"        \
"colors.csv"        \
)

COUNT=0
for URL in "${DOWNLOAD_URLS[@]}"; do
    downloadFromURL "${DOWNLOAD_URLS[$COUNT]}" "${DOWNLOAD_NAMES[$COUNT]}"
    extractGZToFile "${DOWNLOAD_NAMES[$COUNT]}" "${FILE_NAMES[$COUNT]}"
    COUNT=$((COUNT+1))
done

echo "DONE!"

