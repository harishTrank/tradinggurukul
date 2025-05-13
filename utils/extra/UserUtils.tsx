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

export const getProcessedHtml = (descriptionString: any) => {
  if (!descriptionString) {
    return "<p>No description available.</p>";
  }

  let html = descriptionString;
  html = html.replace(/\\n/g, "<br />");
  html = html.replace(/\n/g, "<br />");
  html = html.replace(/(<(ul|ol)(?: [^>]*)?>)\s*<br\s*\/?>/gi, "$1");
  html = html.replace(/<\/li>\s*<br\s*\/?>\s*(<li(?: [^>]*)?>)/gi, "</li>$1");
  html = html.replace(/<br\s*\/?>\s*(<\/(ul|ol)>)/gi, "$1");
  return html;
};

export function validateIsEmail(email: any) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

export const isEmptyObj = (obj: any) => {
  return Object.keys(obj).length === 0;
};
