import QrScanner from 'qr-scanner';
import { onCleanup, onMount } from "solid-js";

const qrcodeRegionId = "html5qr-code-full-region";

export default function CameraWidget(props: {onSuccess: (decodedText: string) => void}) {
  let qrCodeScanner: QrScanner;

  onMount(() => {
    const videoElem = document.getElementById(qrcodeRegionId) as HTMLVideoElement;
    qrCodeScanner = new QrScanner(videoElem, result => {
      props.onSuccess(result.data);
    }, {
      highlightScanRegion: true,
      highlightCodeOutline: true
    });
    qrCodeScanner.start();
  });

  onCleanup(() => {
    qrCodeScanner.stop();
    qrCodeScanner.destroy();
  })

  return <video id={qrcodeRegionId} style={{ width: '100%' }} />
}