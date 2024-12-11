// Function to fetch and check the page for the PDF link
function checkForPDF(url, buttonId) {
  // Display status message
  document.getElementById("status").innerHTML =
    "Waiting for the PDF to be released...";

  // Timeout for how long to wait for the PDF (in milliseconds)
  const timeoutDuration = 10000; // 10 seconds
  const checkInterval = 5000; // 5 seconds
  let isPDFFound = false;
  let remainingTime = timeoutDuration / 1000; // Convert to seconds

  // Disable the button while waiting for the result
  document.getElementById(buttonId).disabled = true;

  // Display the remaining time
  const countdownInterval = setInterval(() => {
    document.getElementById(
      "status"
    ).innerHTML = `Waiting for the PDF... ${remainingTime} seconds remaining`;

    remainingTime--; // Decrease the remaining time by 1 second

    if (remainingTime <= 0) {
      clearInterval(countdownInterval); // Stop the countdown
    }
  }, 1000); // Update every 1 second

  // Polling every 5 seconds to check if the PDF link appears
  const interval = setInterval(() => {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        let pdfLink = extractPDFLink(data);

        if (pdfLink) {
          clearInterval(interval); // Stop the polling once the PDF is found
          clearInterval(countdownInterval); // Stop the countdown
          document.getElementById("status").innerHTML =
            "PDF found! Downloading...";

          // Update the button with the PDF link for future downloads
          document.getElementById(buttonId).innerText = "Download PDF";
          document.getElementById(buttonId).onclick = function () {
            downloadPDF(pdfLink);
          };

          // Automatically download the PDF
          downloadPDF(pdfLink);
          isPDFFound = true;
        }
      })
      .catch((error) => {
        console.error("Error checking for PDF:", error);
      });
  }, checkInterval); // Check every 5 seconds

  // Set a timeout to stop the polling after a certain period and notify the user
  setTimeout(() => {
    if (!isPDFFound) {
      clearInterval(interval); // Stop the polling
      clearInterval(countdownInterval); // Stop the countdown
      document.getElementById("status").innerHTML =
        "PDF not yet available. Please check again later.";
      alert("ala pa pong PDF, wait lang po tayo hehe");
      // Re-enable the button
      document.getElementById(buttonId).disabled = false;
    }
  }, timeoutDuration); // Timeout after 30 seconds
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
