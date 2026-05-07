export function downloadLocalFile(filePath, fileName) {
  const link = document.createElement("a");
  link.href = filePath;

  if (fileName) {
    link.download = fileName;
  } else {
    link.download = filePath.split("/").pop();
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
