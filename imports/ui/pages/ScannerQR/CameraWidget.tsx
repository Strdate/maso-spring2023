import QrScanner from 'qr-scanner';
import PropTypes from 'prop-types'
import {useParams} from "@solidjs/router";

const qrcodeRegionId = "html5qr-code-full-region";

export default function CameraWidget {
  const params = useParams();

  return <video id={}/>
}



// class CameraWidget extends Component {
//   constructor(props) {
//     super(props)
//   }
//
//   componentDidMount() {
//     const videoElem = document.getElementById(qrcodeRegionId)
//     this.html5QrcodeScanner = new QrScanner(videoElem, result => {
//       this.props.onSuccess(result.data)
//     }, {
//       highlightScanRegion: true,
//       highlightCodeOutline: true
//     })
//     this.html5QrcodeScanner.start()
//   }
//
//   componentWillUnmount() {
//     this.html5QrcodeScanner.stop()
//     this.html5QrcodeScanner.destroy()
//   }
//
//
//   render() {
//     return <video id={qrcodeRegionId} style={{ width: '100%' }} />;
//   }
// }
//
// CameraWidget.propTypes = {
//   onSuccess: PropTypes.func.isRequired,
//   visible: PropTypes.bool
// }
//
// export default CameraWidget