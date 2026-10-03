declare module 'whatsapp-web.js' {
  export class Client {
    constructor(options?: any);
    on(event: string, callback: (...args: any[]) => void): void;
    initialize(): Promise<void>;
    destroy(): Promise<void>;
    sendMessage(chatId: string, content: any, options?: any): Promise<any>;
    logout(): Promise<void>;
    info: any;
  }
  export class LocalAuth {
    constructor(options?: { clientId?: string; dataPath?: string });
  }
  const pkg: {
    Client: typeof Client;
    LocalAuth: typeof LocalAuth;
  };
  export default pkg;
}
