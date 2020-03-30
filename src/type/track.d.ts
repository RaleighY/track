interface IEvent {
  type: string;
  view: string;
  timestamp?: number;
}

interface IEventClick extends IEvent {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IEventView extends IEvent {
  width: number;
  height: number;
}

interface IEventByU extends IEvent {
  data: any;
}

interface IUploader {
  url: string;
  q: [];
  timer: any;
  add: (obj: any) => void;
  flush: () => void;
}

interface IInitOptions {
  appId: string;
  url: string;
  version?: string;
}
