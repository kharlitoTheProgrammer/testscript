// Function to fetch and check the page for the PDF link
function checkForPDF(url) {
  // Display status message
  document.getElementById("status").innerHTML =
    "Waiting for the PDF to be released...";

  // Timeout for how long to wait for the PDF (in milliseconds)
  const timeoutDuration = 60000; // 60 seconds
  let isPDFFound = false;

  // Polling every 10 seconds to check if the PDF link appears
  const interval = setInterval(() => {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        let pdfLink = extractPDFLink(data);

        if (pdfLink) {
          clearInterval(interval); // Stop the polling once the PDF is found
          document.getElementById("status").innerHTML =
            "PDF found! Downloading...";
          downloadPDF(pdfLink);
          isPDFFound = true;
        }
      })
      .catch((error) => {
        console.error("Error checking for PDF:", error);
      });
  }, 10000); // Check every 10 seconds

  // Set a timeout to stop the polling after a certain period and notify the user
  setTimeout(() => {
    if (!isPDFFound) {
      clearInterval(interval); // Stop the polling
      document.getElementById("status").innerHTML =
        "PDF not yet available. Please check again later.";
      alert(
        "The PDF for this range is not yet available. Please check again later."
      );
    }
  }, timeoutDuration); // Timeout after 60 seconds
}

// Function to download the PDF
function downloadPDF(pdfUrl) {
  const a = document.createElement("a");
  a.href = pdfUrl;
  a.download = pdfUrl.split("/").pop(); // Extract filename from URL
  a.click();
  document.getElementById("status").innerHTML = "Download started!";
}

// Function to extract the PDF link from the HTML content
function extractPDFLink(htmlContent) {
  // You can refine this part to extract the exact PDF URL based on the structure of the HTML page
  const match = htmlContent.match(/href="([^"]+\.pdf)"/);
  return match ? match[1] : null;
}

// Example: Start checking when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Replace with any specific URL you want to monitor
  const url =
    "https://www.prcboard.com/a-b-passers-september-2024-let-results-elementary";
  checkForPDF(url); // Start checking the page for the PDF
});
