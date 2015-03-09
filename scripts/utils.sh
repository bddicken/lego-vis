#!/bin/bash 

#
# Utility functions
#

function extractAllStringsFromFileMatchingRegex {
    RETURN_VAR_NAME=$1
    FILE=$2
    REGEX=$3

    MATCHES=$(grep -o "${REGEX}" "${FILE}")
    MATCHES_NL=""
    for MATCH in $MATCHES; do
        MATCHES_NL="${MATCH} ${MATCHES_NL}"
    done

    eval "${RETURN_VAR_NAME}=\"${MATCHES_NL}\""
}

function downloadFromURL {
    URL=$1
    DOWNLOAD_FILE_NAME=$2

    echo "Downloading ${URL} to ${DOWNLOAD_FILE_NAME}"
    wget -O "${DOWNLOAD_FILE_NAME}" "${URL}" &> /dev/null
}

function extractGZToFile {
    GZ_FILE=$1
    OUT_FILE=$2

    echo "Unzipping ${GZ_FILE} into ${OUT_FILE}"
    gunzip -c "${GZ_FILE}" > "${OUT_FILE}"
    
    echo "Removing ${GZ_FILE}"
    rm -r "${GZ_FILE}"
}

function extractZip {
    GZ_FILE=$1

    echo "Unzipping ${GZ_FILE}"
    unzip "${GZ_FILE}"
    
    echo "Removing ${GZ_FILE}"
    rm -r "${GZ_FILE}"
}

