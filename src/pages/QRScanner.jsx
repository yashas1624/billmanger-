/** QR Scanner UI */
import React, { useState, useRef, useEffect } from 'react';
import { Link } from '../App';
import { SectionHeader, Card, Button } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isScanning) return;
    const stream = navigator.mediaDevices.getUserMedia
      ? navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      : Promise.reject(new Error('Camera not available'));

    stream.then((s) => {
      videoRef.current.srcObject = s;
      videoRef.current.play();
    }).catch(() => {
      setIsScanning(false);
    });

    return () => {
      if (videoRef.current.srcObject) {
        const track = videoRef.current.srcObject.getTracks()[0];
        track.stop();
      }
    };
  }, [isScanning]);

  const handleScan = () => {
    setScannedData('yashas.s@paytm • ₹500');
    setIsScanning(false);
  };

  const handleRetry = () => {
    setScannedData(null);
    setIsScanning(true);
  };

  return (
    <div className="px-4 pb-24">
      <SectionHeader title="QR Scanner" subtitle="Scan QR to pay or receive" />

      <Card className="p-4">
        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden mx-auto max-w-[400px] shadow-2xl mb-6">
          {isScanning ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : null}
          {/* Scanner frame */}
          <div className="absolute inset-0 border-4 border-white/50 rounded-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-paytm rounded-full animate-pulse flex items-center justify-center">
              <Icon name="scan" size="32" className="text-paytm" />
            </div>
          </div>
        </div>

        {!isScanning && scannedData && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-light text-success mb-4">
              <Icon name="check" size="24" />
            </div>
            <h3 className="text-lg font-bold text-gray800">QR Scanned</h3>
            <p className="text-sm text-gray500 mb-4">{scannedData}</p>
            <div className="flex gap-2">
              <Button className="flex-1">Pay Now</Button>
              <Button variant="outline" onClick={handleRetry}>Scan Again</Button>
            </div>
          </div>
        )}

        {isScanning && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray500">Point camera at QR code to scan</p>
          </div>
        )}
      </Card>

      <div className="px-4 mt-6">
        <h4 className="text-xs font-bold text-gray500 uppercase tracking-wider mb-3">Or enter UPI ID manually</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="UPI ID"
            className="flex-1 pl-4 pr-4 py-3 rounded-xl border border-gray200 bg-gray50 text-gray800 focus:outline-none focus:ring-2 focus:ring-paytm"
          />
          <Button>Next</Button>
        </div>
      </div>
    </div>
  );
}
