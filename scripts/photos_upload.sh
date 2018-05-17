set -e
set -u

# USE ENV FOR THOSE
#PHOTOS_UPLOAD_FOLDER=/shared/data/photos_upload # Folder where zip file is uploaded
#PHOTOS_GALLERIES_FOLDER=/shared/data/photo_galleries # Folder where galleries are stored

echo "###########################"
echo "# GALLERIES UPDATE SCRIPT #"
echo "###########################"

echo "===> Checking ${PHOTOS_UPLOAD_FOLDER} <==="

ls -la ${PHOTOS_UPLOAD_FOLDER}

# Create (if not existing) workspace a go into it
mkdir -p workspace
cd workspace

FOUND_SOMETHING=false

for archive in $(find ${PHOTOS_UPLOAD_FOLDER}/*.zip 2> /dev/null); do
echo "Processing ${archive} archive.."

# copy zip to WS
cp ${archive} .

# extract data. Will be placed in a subfolder named after the zip (all subfolders will be kept)
ARCHIVE_NAME=$(basename ${archive})
GALLERY_NAME=$(basename ${ARCHIVE_NAME} .zip)
unzip ${ARCHIVE_NAME}

# remove zip from ws
rm ${ARCHIVE_NAME}

# resize images
# TODO

# Step 4 : copy images to galleries folder (into subdirectory named after zip)
mkdir -p ${PHOTOS_GALLERIES_FOLDER}/${GALLERY_NAME}
cp -R * ${PHOTOS_GALLERIES_FOLDER}/${GALLERY_NAME}

# remove zip from upload folder
rm ${archive}

if [ "${FOUND_SOMETHING}" = false ]
then
    FOUND_SOMETHING=true
fi

done

echo "===> END OF EXTRACTION. NOW UPDATING CONFIGURATIONS <==="

if [ "${FOUND_SOMETHING}" = false ]
then
    echo "===> No extraction has been made, no need to update configs. <==="
   exit 0
fi


echo "[" > ${PHOTOS_GALLERIES_FOLDER}/common/galleries.json
# Loop though all data in PHOTO_GALLERIES_FOLDER
for GALLERY in $(find ${PHOTOS_GALLERIES_FOLDER} -type d 2> /dev/null); do
  echo ">>> Processing gallery ${GALLERY}"

  PHOTOS=$(find ${GALLERY} -type f -maxdepth 1 -iname "*.png" -o -iname "*.jpg" 2> /dev/null | sort)
    
  if [ -z "${PHOTOS}" ]
  then
      echo "No photo in folder. skipping it"
  else
    echo "PHOTOS FOUND : "
   
   echo '<?xml version="1.0" encoding="UTF-8"?>' > ${GALLERY}/config.xml
   echo '<juiceboxgallery>' >> ${GALLERY}/config.xml
   
   for PHOTO in ${PHOTOS}; do
       photo_path=${PHOTO#"${PHOTOS_GALLERIES_FOLDER}/"}
       echo ${photo_path}
       
       echo "<image imageURL=\"${photo_path}\" thumbURL=\"${photo_path}\" linkURL=\"${photo_path}\" linkTarget=\"_blank\">" >> ${GALLERY}/config.xml
       #echo "<title><![CDATA[$(basename ${photo_path})]]></title>" >> ${GALLERY}/config.xml
       echo "</image>" >> ${GALLERY}/config.xml
   done
   echo '</juiceboxgallery>' >> ${GALLERY}/config.xml

   echo "{ \"name\": \"$(basename ${GALLERY})\"}," >> ${PHOTOS_GALLERIES_FOLDER}/common/galleries.json
  fi
done
# remove tailing comma
sed -i '$ s/.$//'  ${PHOTOS_GALLERIES_FOLDER}/common/galleries.json
echo "]" >> ${PHOTOS_GALLERIES_FOLDER}/common/galleries.json


echo "===> END OF PROCESS. ALL DONE ! <==="