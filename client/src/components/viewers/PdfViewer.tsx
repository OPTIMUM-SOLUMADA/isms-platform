import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
// Make sure worker matches installed pdfjs-dist
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

type PdfViewerProps = {
    url: string;
};

export const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div style={{ height: '800px' }}>
            <Viewer fileUrl={url} />
        </div>
    </Worker>
);
