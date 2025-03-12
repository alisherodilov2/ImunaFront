// interface Window {
//     NDEFReader: NDEFReader
//   }
//   declare class NDEFReader extends EventTarget {
//     constructor()
//     onreading: (this: this, event: NDEFReadingEvent) => any
//     onreadingerror: (this: this, error: Event) => any
//     scan: (options?: NDEFScanOptions) => Promise<void>
//     write: (
//       message: NDEFMessageSource,
//       options?: NDEFWriteOptions
//     ) => Promise<void>
//   }

import { useDispatch } from "react-redux";
import { AppDispatch } from "./service/store/store";

//   interface Window {
//     NDEFReadingEvent: NDEFReadingEvent
//   }
//   declare class NDEFReadingEvent extends Event {
//     constructor(type: string, readingEventInitDict: NDEFReadingEventInit)
//     serialNumber: string
//     message: NDEFMessage
//   }
//   interface NDEFReadingEventInit extends EventInit {
//     serialNumber?: string
//     message: NDEFMessageInit
//   }

//   interface NDEFWriteOptions {
//     overwrite?: boolean
//     signal?: AbortSignal
//   }
//   interface NDEFScanOptions {
//     signal: AbortSignal
//   }

const send = useDispatch<AppDispatch>()
// declare class Dispatch extends Event {
//     constructor()
//     send(data: any) {

//     }
// }

declare class Test {
    constructor(send: any)
    send: (data: any) => this

}



