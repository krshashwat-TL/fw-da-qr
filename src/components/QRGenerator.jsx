import { useRef, useState } from 'react';
import QRCode from 'qrcode';
import { createCanvas } from 'canvas';
import '../App.css';

const QRGenerator = () => {
  const [name, setName] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef(null);

  const handleGenerate = async () => {
    setError('');
    setGenerated(true);
    if (!name || !recruiterId) {
      setError('Both name and recruiter ID are required.');
      return;
    }

    try {
      const qrSize = 300;
      const margin = 20;
      const textHeight = 80;
      const canvasWidth = qrSize + margin * 2;
      const canvasHeight = textHeight + qrSize + margin * 2;

      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';

      ctx.font = 'bold 16px Arial';
      ctx.fillText(name, canvasWidth / 2, 30);

      const recruiterIdLower = recruiterId.trim().toLowerCase();
      ctx.font = 'bold 12px Arial';
      ctx.fillText(recruiterIdLower, canvasWidth / 2, 50);

      const qrData = `https://www.freshersworld.com/ceat-apprentice-da-test?recruiter_id=${btoa(
        recruiterIdLower
      )}`;

      ctx.font = '10px Arial';
      ctx.fillText(qrData, canvasWidth / 2, 70, canvasWidth - 40);

      const qrCanvas = createCanvas(qrSize, qrSize);
      await QRCode.toCanvas(qrCanvas, qrData, {
        margin: 1,
        width: qrSize,
        color: {
          dark: '#7258DE',
          light: '#ffffff',
        },
      });

      ctx.shadowColor = '#ccc';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 10;
      ctx.shadowOffsetY = 10;

      ctx.drawImage(qrCanvas, margin, textHeight + margin);

      const visibleCanvas = canvasRef.current;
      visibleCanvas.width = canvasWidth;
      visibleCanvas.height = canvasHeight;
      visibleCanvas.getContext('2d').drawImage(canvas, 0, 0);

    } catch (err) {
      console.error(err);
      setError('Something went wrong while generating QR code.');
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `CEAT_DA_QR_${name.replace(/ /g, '_')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="qr-generator-container">
      <div className="qr-card">
        <h2>QR Code Generator</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="recruiterId">Recruiter ID</label>
          <input
            id="recruiterId"
            value={recruiterId}
            onChange={(e) => setRecruiterId(e.target.value)}
            placeholder="Enter recruiter ID"
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="generate-btn" onClick={handleGenerate}>
          Generate QR Code
        </button>

        {generated && (
          <>
            <canvas ref={canvasRef} className="qr-canvas" />
            <button className="download-btn" onClick={handleDownload}>
              Download QR Code
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;
