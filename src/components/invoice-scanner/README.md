# Invoice Scanner Component

This component provides functionality to scan invoices using the device camera and extract information using OCR (Optical Character Recognition) via Tesseract.js.

## Features

- Camera capture for invoice scanning
- OCR text extraction from images
- Automatic form field population based on extracted data
- Support for common invoice fields (invoice number, order number, consignee, etc.)

## Usage

```jsx
import { InvoiceScanner } from 'src/components/invoice-scanner';

// In your component
const [scannerOpen, setScannerOpen] = useState(false);

const handleScanComplete = (invoiceData) => {
  // Populate your form fields with the extracted data
  console.log('Extracted invoice data:', invoiceData);
  setScannerOpen(false);
};

// In your JSX
<InvoiceScanner
  open={scannerOpen}
  onClose={() => setScannerOpen(false)}
  onScanComplete={handleScanComplete}
/>;
```

## Extracted Data

The component extracts the following data from invoices:

- Invoice Number
- Order Number
- Shipment Number
- Consignee
- Loading Weight
- Rate

## Implementation Details

The component uses:

- Tesseract.js for OCR processing
- React's useRef and useCallback hooks for camera handling
- Regular expressions for data extraction from OCR text

## Requirements

- Tesseract.js library
- Browser with camera access
- User permission to access the camera

## Notes

- The OCR accuracy depends on the quality of the image and the clarity of the text
- For best results, ensure good lighting and a stable camera position
- The component is designed to work with the Material-UI component library
