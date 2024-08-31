#!/bin/bash

# Create build directory
mkdir -p build

rsync -av includes/ build/includes/
rsync -av languages/ build/languages/
rsync -av public/ build/public/

cp index.php reisetopia-hotels.php uninstall.php build/

# shellcheck disable=SC2164
cd build

# Create a zip file of the build directory contents
zip -r ../reisetopia-hotels.zip .
