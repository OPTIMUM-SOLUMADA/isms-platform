export const ImageViewer: React.FC<{ url: string }> = ({ url }) => (
    <div style={{ textAlign: 'center' }}>
        <img src={url} alt="Document" style={{ maxWidth: '100%', maxHeight: '800px' }} />
    </div>
);
