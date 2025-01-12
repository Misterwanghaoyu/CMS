const downLoadFile = function (res: any) {
  const headers = res.headers;
  const contentType = headers['Content-Type'];
  const blob = new Blob([res.data], { type: contentType });
  let fileName = "exported_data.xlsx"
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
export { downLoadFile }