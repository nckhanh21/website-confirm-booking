const getElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Không tìm thấy nội dung booking để export.');
  return element;
};

const captureElement = async (elementId) => {
  const { default: html2canvas } = await import('html2canvas');
  return html2canvas(getElement(elementId), {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
  });
};

export const exportConfirmationToPNG = async (elementId, fileName) => {
  const canvas = await captureElement(elementId);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const exportConfirmationToPDF = async (elementId, fileName) => {
  const [canvas, jsPdfModule] = await Promise.all([
    captureElement(elementId),
    import('jspdf'),
  ]);
  const { default: jsPDF } = jsPdfModule;
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageHeight = (canvas.height * pageWidth) / canvas.width;
  const imageData = canvas.toDataURL('image/png');

  let remainingHeight = imageHeight;
  let position = 0;
  pdf.addImage(imageData, 'PNG', 0, position, pageWidth, imageHeight);
  remainingHeight -= pageHeight;

  while (remainingHeight > 0) {
    position = remainingHeight - imageHeight;
    pdf.addPage();
    pdf.addImage(imageData, 'PNG', 0, position, pageWidth, imageHeight);
    remainingHeight -= pageHeight;
  }

  pdf.save(fileName);
};
