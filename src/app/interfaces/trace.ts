export interface Trace {
  principal: any;
  request: TraceRequest;
  response: TraceResponse;
  session: any;
  timeTaken: number;
  timestamp: string;
}

interface TraceRequest {
  headers: any;
  method: string;
  remoteAddress: any;
  uri: string;
}

interface TraceResponse {
  headers: any;
  status: number;
}
