declare module "@paystack/inline-js" {
  interface CheckoutCallbacks {
    onSuccess?: (transaction: { id?: number; reference: string; message?: string }) => void;
    onCancel?: () => void;
    onError?: (error: { message: string }) => void;
    onLoad?: (response: { id?: number; accessCode?: string }) => void;
  }

  export default class PaystackPop {
    newTransaction(options: Record<string, unknown>): unknown;
    resumeTransaction(accessCode: string, callbacks?: CheckoutCallbacks): unknown;
    cancelTransaction(transaction: unknown): void;
    checkout(options: Record<string, unknown>): Promise<unknown>;
    preloadTransaction(options: Record<string, unknown>): () => void;
    isLoaded(): boolean;
  }
}
