#!/bin/bash
set -e
set -u

# USE ENV FOR THOSE
#PHOTOS_UPLOAD_FOLDER=/shared/data/photos_upload # Folder where zip file is uploaded
#PHOTOS_GALLERIES_FOLDER=/shared/data/photo_galleries # Folder where galleries are stored

echo "###############################"
echo "# GALLERIES EXTRACTION SCRIPT #"
echo "###############################"

echo "===> Checking ${PHOTOS_UPLOAD_FOLDER} <==="

# Create (if not existing) workspace a go into it
mkdir -p workspace
cd workspace

for archive in ${PHOTOS_UPLOAD_FOLDER}/*.zip; do

  echo "Processing ${archive} archive.."

  # Step 1 : copy zip to WS

  cp ${archive} .

  # Step 2 : extract data
  ARCHIVE_NAME=$(basename ${archive})
  GALLERY_NAME=$(basename ${ARCHIVE_NAME} .zip)

  unzip ${ARCHIVE_NAME}
  rm ${ARCHIVE_NAME}

  # Step 3 : resize images

  # TODO

  # Step 4 : copy images to galleries folder (into subdirectory named after zip)

  mkdir -p ${PHOTOS_GALLERIES_FOLDER}/${GALLERY_NAME}
  cp -R * ${PHOTOS_GALLERIES_FOLDER}/${GALLERY_NAME}

  # Step 5 : generate html

  # TODO
  find . -type d

  # Step 6 : Push html to blog

  # TODO

  # Step 7 : remove zip from upload folder

  # TODO

done

echo "===> END OF PROCESS. ALL DONE ! <==="