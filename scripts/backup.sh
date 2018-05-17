set -e
set -u

echo "######################"
echo "# BLOG BACKUP SCRIPT #"
echo "######################"

MAX_NUMBER_OF_BACKUPS=5

echo "===> FOLDERS TO BACKUP <==="
echo "${FOLDERS_TO_BACKUP}"
echo "===> /FOLDERS TO BACKUP <==="

if [ -z "${FOLDERS_TO_BACKUP}" ]
then
  echo ">>> No folder to backup. Exitting."
  exit 0
fi

for FOLDER in ${FOLDERS_TO_BACKUP}; do
echo "===> BACKUP ${FOLDER} <==="
cd ${FOLDER}

ZIP_BASENAME="$(basename ${FOLDER})"
DATETIME=$(date "+%Y%m%d_%H%M%S")
ZIP_NAME="${ZIP_BASENAME}_${DATETIME}.zip"
zip --password ${ZIP_PASSWORD} -ry ${BACKUP_FOLDER}/${ZIP_NAME} *

echo "===> START BACKUP ROTATION <==="

NUMBER_OF_BACKUPS=$(echo `ls -1 ${BACKUP_FOLDER}/${ZIP_BASENAME}* | wc -l`)
OLDEST_BACKUP=$(echo -n `ls -1 ${BACKUP_FOLDER}/${ZIP_BASENAME}* | head -1`)

while [ ${NUMBER_OF_BACKUPS} -gt ${MAX_NUMBER_OF_BACKUPS} ]
do
  echo "removing ${OLDEST_BACKUP}"
  rm -rf "${OLDEST_BACKUP}"
  NUMBER_OF_BACKUPS=$(echo `ls -1 ${BACKUP_FOLDER}/${ZIP_BASENAME}* | wc -l`)
  OLDEST_BACKUP=$(echo -n `ls -1 ${BACKUP_FOLDER}/${ZIP_BASENAME}* | head -1`)
done

echo "===> END BACKUP ${FOLDER} <==="
done

echo "===> END OF PROCESS. ALL DONE ! <==="