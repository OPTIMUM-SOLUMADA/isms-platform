

export default function DocPreview() {
  const pdfUrl = "http://localhost:5173/sample.pdf"; 
    
    return (
    <div className="h-[80vh] w-full">
      <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
      <iframe
        src={pdfUrl}
        className="w-full h-full border rounded-lg"
        title="PDF Preview"
      />
    </div>
    )
} 