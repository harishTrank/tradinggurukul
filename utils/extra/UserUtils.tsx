export const getfileobj = (file: any) => {
  let localUri = file;
  let filename = localUri?.split("/").pop();
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;
  return {
    type,
    name: filename,
    uri: localUri,
  };
};
