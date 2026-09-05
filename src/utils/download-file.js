/**
 * Downloads a file from a remote URL.
 * Attempts to fetch as a Blob to trigger a direct download with a designated filename.
 * Falls back to opening the URL in a new tab if CORS or network constraints prevent fetching.
 *
 * @param {string} url - The URL of the file to download.
 * @param {string} [defaultFilename='document'] - Desired filename for the download.
 */
export async function downloadFileFromUrl(url, defaultFilename = 'document') {
  if (!url) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    // Extract file extension from the URL if not already in defaultFilename
    const cleanUrl = url.split('?')[0].split('#')[0];
    const urlExt = cleanUrl.includes('.') ? cleanUrl.split('.').pop() : '';
    const filename =
      defaultFilename.includes('.') || !urlExt
        ? defaultFilename
        : `${defaultFilename}.${urlExt}`;

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.URL.revokeObjectURL(objectUrl);
  } catch (error) {
    // Graceful fallback for cross-origin or restricted URLs
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
