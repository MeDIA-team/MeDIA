export const getProjects = () => {
  return [
    "Retrospective clinical data",
    "Maemuki",
    "Genome",
    "Biomarker",
    "Bleach bath",
    "Mobile app",
    "Microbiome",
    "Microbiome with intervention",
    "Tight junction"
  ]
}

export const getDataTypes = () => {
  return [
    "Skin Picture",
    "RNAseq(tissue)",
    "RNAseq(PBMC)",
    "Histology",
    "Cytokine"
  ]
}

export const getSexes = () => {
  return ["Male", "Female"]
}

const getMetaDataKeys = (dataType) => {
  if (dataType === "Skin Picture") {
    return ["FilePath", "MetaData1"]
  } else if (dataType === "RNAseq(tissue)") {
    return ["FilePath", "MetaData1", "MetaData2"]
  }

  return ["FilePath"]
}

export const getDataTypesMetaDataKeys = () => {
  const dataTypes = getDataTypes()

  const retList = dataTypes.reduce((acc, val) => {
    acc[val] = getMetaDataKeys(val)
    return acc
  }, {})

  return retList
}
