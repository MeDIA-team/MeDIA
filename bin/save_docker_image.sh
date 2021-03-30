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

ENVFILE="${BASEDIR}/.env"
if [[ ! -e ${ENVFILE} ]]; then
  echo "ERROR: .env file not found" 1>&2
  exit 1
fi

IMAGE_TAG=$(grep 'MEDIA_DOCKER_IMAGE_TAG' ${ENVFILE} | cut -d '=' -f 2)
CONTAINER_IMAGE_ID="ghcr.io/media-team/media_app:${IMAGE_TAG}"

IMAGE_DIR="${BASEDIR}/container_images"
mkdir -p ${IMAGE_DIR}
IMAGE_OUT_PATH="${IMAGE_DIR}/media_app_${IMAGE_TAG}.tar"

echo "### Pulling docker container image from GitHub Container Registry ..."
docker pull ${CONTAINER_IMAGE_ID}

echo "### Saving docker container image ${CONTAINER_IMAGE_ID} ..."
docker save ${CONTAINER_IMAGE_ID} > ${IMAGE_OUT_PATH}

if [[ ! -e ${IMAGE_OUT_PATH} ]]; then
  echo "ERROR: Failed to create container image"
  exit 1
fi

echo "### Image successfully saved at ${IMAGE_OUT_PATH}"

echo "### Removing cached image file ..."
docker rmi ${CONTAINER_IMAGE_ID}

echo "### Process successfully finished!"
echo "### Copy .tar file to deployment environment and execute 'docker load -i $(basename ${IMAGE_OUT_PATH})' to load the image."
