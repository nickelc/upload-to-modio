#!/usr/bin/env bash

set -euo pipefail

bail() {
    echo "::error::$*"
    exit 1
}

notice() {
    echo "::notice::$*"
}

x() {
    local cmd="$1"
    shift
    (
        set -x
        "${cmd}" "$@"
    )
}

# required inputs
token="${INPUT_TOKEN:-}"
[[ -n "${token}" ]] || bail "input \"token\" is not set or empty"

game_id="${INPUT_GAME:-}"
[[ -n "${game_id}" ]] || bail "input \"game\" is not set or empty"
[[ ${game_id} =~ ^[0-9]+$ ]] || bail "input \"game\" is not an integer"

mod_id="${INPUT_MOD:-}"
[[ -n "${mod_id}" ]] || bail "input \"mod\" is not set or empty"
[[ ${mod_id} =~ ^[0-9]+$ ]] || bail "input \"mod\" is not an integer"

modfile="${INPUT_PATH:-}"
[[ -n "${modfile}" ]] || bail "input \"path\" is not set or empty"
[[ -f "${modfile}" ]] || bail "input \"path\" is not a file"

# optional inputs
version="${INPUT_VERSION:-}"
changelog="${INPUT_CHANGELOG:-}"
active="${INPUT_ACTIVE:-}"
filehash="${INPUT_FILEHASH:-}"
metadata="${INPUT_METADATA:-}"
platforms="${INPUT_PLATFORMS:-}"

tempdir="${RUNNER_TEMP:-/tmp}"

# construct form fields
fields=()
fields+=("filedata=@${modfile}")

if [[ -n "${version}" ]]; then
    file=$(mktemp "${tempdir}/version.XXXX.in")
    echo -n "${version}" >"${file}"
    fields+=("version=<${file}")
fi

if [[ -f "${changelog}" ]]; then
    fields+=("changelog=<${changelog}")
elif [[ -n "${changelog}" ]]; then
    file=$(mktemp "${tempdir}/changelog.XXXX.in")
    echo -n "${changelog}" >"${file}"
    fields+=("changelog=<${file}")
fi

if [[ "${active}" == "true" ]]; then
    fields+=("active=true")
elif [[ "${active}" == "false" ]]; then
    fields+=("active=false")
fi

if [[ -n "${filehash}" ]]; then
    file=$(mktemp "${tempdir}/filehash.XXXX.in")
    echo -n "${filehash}" >"${file}"
    fields+=("filehash=<${file}")
fi

if [[ -f "${metadata}" ]]; then
    fields+=("metadata_blob=<${metadata}")
elif [[ -n "${metadata}" ]]; then
    file=$(mktemp "${tempdir}/metadata.XXXX.in")
    echo -n "${metadata}" >"${file}"
    fields+=("metadata_blob=<${file}")
fi

if [[ -n "${platforms}" ]]; then
    for platform in ${platforms//,/ }; do
        file=$(mktemp "${tempdir}/platform.XXXX.in")
        echo -n "${platform}" >"${file}"
        fields+=("platforms[]=<${file}")
    done
fi

# check curl version for `Linux` runners
cmd="curl"
if [[ "${RUNNER_OS}" == "Linux" ]]; then
    # Ubuntu 20.04's curl is too old.
    curl_version=$(curl -V | head -1 | cut -d' ' -f2)
    if dpkg --compare-versions "${curl_version}" lt "7.76.0"; then
        notice "curl 7.76+ is required. Installing curl from snap."
        sudo snap install curl
        cmd="/snap/bin/curl"
    fi
fi

# construct curl arguments
args=(-H "Authorization: Bearer ${token}")
for f in "${fields[@]}"; do
    args+=(-F "${f}")
done

# construct modio endpoint url
base_url="https://g-${game_id}.modapi.io/v1"
if [[ "${INPUT_TEST_URL}" == "true" ]]; then
    base_url="https://g-${game_id}.test.mod.io/v1"
fi
url="${base_url}/games/${game_id}/mods/${mod_id}/files"
url="${MODIO_DEBUG_OVERRIDE_URL:-${url}}"

output="$(mktemp "${tempdir}/response.XXXX.json")"
echo "response=${output}" >>"${GITHUB_OUTPUT}"

# upload to mod.io
x "${cmd}" --fail-with-body "${url}" "${args[@]}" >"${output}"

# print action output parameters
{
    echo "id=$(jq <"${output}" -r '.id // empty')"
    echo "url=$(jq <"${output}" -r '.download.binary_url // empty')"
    echo "filehash=$(jq <"${output}" -r '.filehash.md5 // empty')"
} >>"${GITHUB_OUTPUT}"
