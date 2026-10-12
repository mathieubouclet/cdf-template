#!/usr/bin/env bash
#
# Fabrique le paquet d'installation Joomla du template cassiopeia_cdf.
# Équivalent bash de build.ps1 (WSL, Linux, macOS ou Git Bash).
#
#   ./build.sh            # reconstruit le zip avec la version actuelle
#   ./build.sh 1.0.6      # passe en 1.0.6 (templateDetails.xml) puis construit le zip
#
# Résultat : dist/tpl_cassiopeia_cdf-<version>.zip
#
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source_dir="$root/template/cassiopeia_cdf"
manifest="$source_dir/templateDetails.xml"
dist="$root/dist"

version="${1:-}"

if [[ -n "$version" ]]; then
    if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "Version invalide : « $version » (attendu : 1.2.3)" >&2
        exit 1
    fi
    sed -i \
        -e "s#<version>[^<]*</version>#<version>$version</version>#" \
        -e "s#<creationDate>[^<]*</creationDate>#<creationDate>$(date +%Y-%m)</creationDate>#" \
        "$manifest"
    echo "Version mise à jour : $version"
else
    version="$(sed -n 's#.*<version>\([^<]*\)</version>.*#\1#p' "$manifest" | head -n 1)"
    if [[ -z "$version" ]]; then
        echo "Numéro de version introuvable dans templateDetails.xml" >&2
        exit 1
    fi
fi

mkdir -p "$dist"
zip_path="$dist/tpl_cassiopeia_cdf-$version.zip"
rm -f "$zip_path"

cd "$source_dir"

# Plusieurs outils possibles selon la machine : zip, tar.exe de Windows (Git Bash), Python.
if command -v zip >/dev/null 2>&1; then
    zip -qr -X "$zip_path" templateDetails.xml html media
elif [[ -x /c/Windows/System32/tar.exe ]] && command -v cygpath >/dev/null 2>&1; then
    # Git Bash sous Windows (Python y est souvent un raccourci du Microsoft Store qui bloque)
    /c/Windows/System32/tar.exe -a -c -f "$(cygpath -w "$zip_path")" templateDetails.xml html media
elif py="$(command -v python3 || command -v python)"; then
    "$py" - "$zip_path" templateDetails.xml html media <<'PY'
import os, sys, zipfile
target, *items = sys.argv[1:]
with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as z:
    for item in items:
        if os.path.isfile(item):
            z.write(item, item)
            continue
        for folder, dirs, files in os.walk(item):
            dirs.sort()
            for name in sorted(files):
                path = os.path.join(folder, name)
                z.write(path, path.replace(os.sep, "/"))
PY
elif [[ -x /mnt/c/Windows/System32/tar.exe ]] && command -v wslpath >/dev/null 2>&1; then
    # WSL sans zip ni Python
    /mnt/c/Windows/System32/tar.exe -a -c -f "$(wslpath -w "$zip_path")" templateDetails.xml html media
else
    echo "Aucun outil pour créer le zip : installez « zip » (sudo apt install zip)." >&2
    exit 1
fi

echo "Paquet créé : $zip_path"
