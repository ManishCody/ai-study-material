export const downloadPDF = async (payment) => {
    const url = `/api/generatePdf?paymentId=${payment.id}&amount=${payment.amount / 100}&email=${payment.email}&contact=${payment.contact}&method=${payment.method}&status=${payment.status}`;
  
    const response = await fetch(url);
  
    if (response.ok) {
      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `StudyBeam_Payment_${payment.id}.pdf`;
      link.click();
    } else {
      console.error("Failed to download PDF");
    }
  };
  