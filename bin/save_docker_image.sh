#!/bin/sh

if [[ -z $(which docker) ]]; then
  echo "ERROR: You need to install Docker first: Get Docker from https://docs.docker.com/get-docker/" 1>&2
  exit 1
fi

if [[ -z $(which gzip) ]]; then
  echo "ERROR: You need to install gzip" 1>&2
  exit 1
fi

BINDIR="$(cd $(dirname ${0}) && pwd -P)"
BASEDIR="$(dirname ${BINDIR})"

IMAGE_DIR="${BASEDIR}/container_images"
mkdir -p ${IMAGE_DIR}

ENVFILE="${BASEDIR}/.env"
if [[ ! -e ${ENVFILE} ]]; then
  echo "ERROR: .env file not found" 1>&2
  exit 1
fi

DOCKER_COMPOSE_FILE="${BASEDIR}/docker-compose.yml"

get_image_tag() {
  local image_name=${1}
  case ${image_name} in
  "app")
    grep 'MEDIA_DOCKER_IMAGE_TAG' ${ENVFILE} | cut -d '=' -f 2
    ;;
  "elasticsearch")
    grep 'docker.elastic.co' ${DOCKER_COMPOSE_FILE} | awk -F':' '$0=$3'
    ;;
  esac
}

get_image_id() {
  local image_name=${1}
  local image_tag=${2}
  case ${image_name} in
  "app")
    echo "ghcr.io/media-team/media_app:${image_tag}"
    ;;
  "elasticsearch")
    grep 'docker.elastic.co' ${DOCKER_COMPOSE_FILE} | awk '$0=$2'
    ;;
  esac
}

for image_name in "app" "elasticsearch"; do
  image_tag=$(get_image_tag "${image_name}")
  container_image_id=$(get_image_id "${image_name}" "${image_tag}")
  image_out_path="${IMAGE_DIR}/media_${image_name}_${image_tag}.tar.gz"

  echo "### Pulling docker container image for ${image_name} ..."
  docker pull ${container_image_id}
  echo "### done."

  echo "### Saving docker container image ${container_image_id} ..."
  docker save ${container_image_id} | gzip >${image_out_path}
  echo "### done."

  if [[ ! -e ${image_out_path} ]]; then
    echo "ERROR: Failed to create container image ${container_image_id}"
    exit 1
  fi

  echo "### Image successfully saved at ${image_out_path}"

  echo "### Removing cached image file ..."
  docker rmi ${container_image_id}
  echo "### done."

  echo "### Copy .tar file to deployment environment and execute 'docker load < $(basename ${image_out_path})' to load the image."
  echo "### Saving image for ${image_name} done."
done

echo "### Process successfully finished!"
