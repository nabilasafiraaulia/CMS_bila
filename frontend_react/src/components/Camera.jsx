import React, { useState, useEffect, useRef } from 'react';

export default function Camera({ onProfilePicChange, embedMode = false, onCaptureEmbed = null }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [activeFilter, setActiveFilter] = useState('none');
  const [useWatermark, setUseWatermark] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const streamRef = useRef(null);

  useEffect(() => {
    initDevices();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (devices.length > 0 && !previewUrl) {
      startCamera();
    }
  }, [devices, selectedDevice, previewUrl]);

  const initDevices = async () => {
    try {
      // Trigger permission dialog
      const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
      initialStream.getTracks().forEach(track => track.stop());

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Gagal mendeteksi perangkat kamera:', err);
      setErrorMsg('Gagal mengakses kamera. Pastikan browser diizinkan mengakses kamera perangkat Anda.');
    }
  };

  const startCamera = async () => {
    stopCamera();
    setErrorMsg('');
    
    const constraints = {
      audio: false,
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    if (selectedDevice) {
      constraints.video.deviceId = { exact: selectedDevice };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Gagal memutar video stream:', err);
      setErrorMsg('Gagal memutar aliran video kamera. Coba perangkat kamera lain.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const applyGrayscale = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // R
      data[i + 1] = avg; // G
      data[i + 2] = avg; // B
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const applySepia = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
      data[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
      data[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const drawWatermark = (ctx, width, height) => {
    const text = 'ProfileCam - Nabila Safira';
    const dateText = new Date().toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    ctx.save();
    const fontSize = Math.max(14, Math.floor(width * 0.03));
    ctx.font = `bold ${fontSize}px Poppins, sans-serif`;

    const textWidth1 = ctx.measureText(text).width;
    const textWidth2 = ctx.measureText(dateText).width;
    const boxWidth = Math.max(textWidth1, textWidth2) + 30;
    const boxHeight = fontSize * 2.8;

    const x = width - boxWidth - 20;
    const y = height - boxHeight - 20;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, boxWidth, boxHeight, 10);
    } else {
      ctx.rect(x, y, boxWidth, boxHeight);
    }
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'top';
    ctx.fillText(text, x + 15, y + 10);

    ctx.font = `${fontSize * 0.8}px Poppins, sans-serif`;
    ctx.fillStyle = '#F5E8DA';
    ctx.fillText(dateText, x + 15, y + 10 + fontSize * 1.2);
    ctx.restore();
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);

    if (activeFilter === 'grayscale') {
      applyGrayscale(ctx, w, h);
    } else if (activeFilter === 'sepia') {
      applySepia(ctx, w, h);
    }

    if (useWatermark) {
      drawWatermark(ctx, w, h);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setPreviewUrl(dataUrl);
    stopCamera();

    if (embedMode && onCaptureEmbed) {
      onCaptureEmbed(dataUrl);
    }
  };

  const setAsProfilePic = () => {
    if (!previewUrl) return;
    localStorage.setItem('profile_picture', previewUrl);
    if (onProfilePicChange) {
      onProfilePicChange(previewUrl);
    }
    alert('Foto profil berhasil diubah!');
    if (!embedMode) {
      window.location.hash = '#/';
    }
  };

  const downloadPhoto = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `story_camera_${Date.now()}.png`;
    a.click();
  };

  const retakePhoto = () => {
    setPreviewUrl('');
    if (onCaptureEmbed && embedMode) {
      onCaptureEmbed('');
    }
  };

  if (embedMode) {
    return (
      <div className="camera-embed-card">
        <div className="camera-stream-box" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '16px', overflow: 'hidden' }}>
          {!previewUrl ? (
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
          ) : (
            <img src={previewUrl} alt="Captured preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          {activeFilter !== 'none' && !previewUrl && (
            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.65)', color: 'white', padding: '6px 12px', borderRadius: '30px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Filter: {activeFilter}
            </div>
          )}
        </div>

        {errorMsg && <div className="camera-error-message" style={{ display: 'block', color: 'var(--color-maroon)', margin: '10px 0' }}>{errorMsg}</div>}

        {!previewUrl ? (
          <div className="camera-controls-panel-embed">
            <div className="camera-form-row">
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Pilih Kamera</label>
                <select 
                  className="input-field" 
                  value={selectedDevice} 
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px' }}
                >
                  {devices.length === 0 ? (
                    <option>Memuat kamera...</option>
                  ) : (
                    devices.map((device, idx) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Kamera ${idx + 1}`}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Filter Piksel</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['none', 'grayscale', 'sepia'].map((f) => (
                    <button 
                      key={f}
                      type="button" 
                      onClick={() => setActiveFilter(f)}
                      className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                      style={{ flex: 1, padding: '8px 4px', fontSize: '11px', textTransform: 'capitalize', borderRadius: '8px' }}
                    >
                      {f === 'none' ? 'Normal' : f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0', background: 'var(--color-creamy-bg)', padding: '10px 15px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Sertakan Watermark Waktu</span>
              <input type="checkbox" checked={useWatermark} onChange={(e) => setUseWatermark(e.target.checked)} />
            </div>

            <button type="button" onClick={capturePhoto} className="btn-rose-action glitter-shimmer" style={{ width: '100%', padding: '12px', borderRadius: '12px' }}>
              📷 Ambil Foto
            </button>
          </div>
        ) : (
          <div className="camera-preview-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button type="button" onClick={downloadPhoto} className="btn-rose-control-alt glitter-shimmer" style={{ flex: 1, padding: '10px' }}>📥 Unduh PNG</button>
            <button type="button" onClick={retakePhoto} className="btn-secondary-action" style={{ flex: 1, padding: '10px' }}>🔄 Ambil Ulang</button>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
    );
  }

  // Page mode (hash route #/camera)
  return (
    <div className="login-page" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="glow glow1"></div>
      <div className="glow glow2"></div>

      <div className="login-card" style={{ maxWidth: '680px', width: '100%', padding: '30px', borderRadius: '28px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', textAlign: 'left', margin: 0, color: 'var(--color-maroon)' }}>📷 Story Camera</h1>
          <a href="#/" className="back-profile" style={{ margin: 0, fontWeight: 600 }}>← Kembali</a>
        </div>
        
        <div className="camera-stream-box" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', border: '4px solid white' }}>
          {!previewUrl ? (
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
          ) : (
            <img src={previewUrl} alt="Captured preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          {activeFilter !== 'none' && !previewUrl && (
            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.65)', color: 'white', padding: '6px 12px', borderRadius: '30px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Filter: {activeFilter}
            </div>
          )}
        </div>

        {errorMsg && <div className="camera-error-message" style={{ display: 'block', color: 'var(--color-maroon)', marginTop: '15px' }}>{errorMsg}</div>}

        {!previewUrl ? (
          <div style={{ marginTop: '25px' }}>
            <div className="form-row" style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ textAlign: 'left', fontSize: '13px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '5px' }}>Pilih Perangkat Kamera</label>
                <select 
                  value={selectedDevice} 
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  style={{ background: 'white', border: '1px solid var(--color-border)', padding: '12px', fontSize: '13px', borderRadius: '12px', width: '100%' }}
                >
                  {devices.length === 0 ? (
                    <option>Memuat kamera...</option>
                  ) : (
                    devices.map((device, idx) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Kamera ${idx + 1}`}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label style={{ textAlign: 'left', fontSize: '13px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '5px' }}>Pilihan Filter Piksel</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['none', 'grayscale', 'sepia'].map((f) => (
                    <button 
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                      style={{ flex: 1, padding: '10px 4px', fontSize: '12px', textTransform: 'capitalize', borderRadius: '8px' }}
                    >
                      {f === 'none' ? 'Normal' : f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'var(--color-creamy-bg)', padding: '12px 18px', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-dark)' }}>Tambahkan Watermark Waktu</span>
              <input type="checkbox" checked={useWatermark} onChange={(e) => setUseWatermark(e.target.checked)} />
            </div>

            <button onClick={capturePhoto} className="btn-rose-action glitter-shimmer" style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '15px' }}>
              📷 Ambil Foto
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '25px' }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <button onClick={setAsProfilePic} className="btn-rose-control glitter-shimmer" style={{ flex: 1, padding: '12px' }}>👤 Jadikan Foto Profil</button>
              <button onClick={downloadPhoto} className="btn-rose-control-alt glitter-shimmer" style={{ flex: 1, padding: '12px' }}>📥 Unduh Foto PNG</button>
            </div>
            <button onClick={retakePhoto} className="btn-secondary-action" style={{ width: '100%', padding: '12px', borderRadius: '12px' }}>🔄 Ambil Ulang Foto</button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}
