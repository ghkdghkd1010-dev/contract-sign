"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PdfViewerClient() {
  const [numPages, setNumPages] = useState(0);

  return (
    <div className="flex justify-center">
      <Document
        file="/contract.pdf"
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={index}
            pageNumber={index + 1}
            width={800}
          />
        ))}
      </Document>
    </div>
  );
}