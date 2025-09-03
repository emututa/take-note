

// // src/types/vosk.d.ts
// declare module "vosk" {
//   export class Model {
//     constructor(modelPath: string);
//   }

//   export class KaldiRecognizer {
//     constructor(model: Model, sampleRate: number);
//     acceptWaveform(chunk: Buffer | Int16Array): boolean;
//     finalResult(): string;
//     result(): string;
//     partialResult(): string;
//   }
// }





declare module "vosk" {
  export class Model {
    constructor(modelPath: string);
  }

  export class KaldiRecognizer {
    constructor(model: Model, sampleRate: number);
    acceptWaveform(chunk: Buffer | Int16Array): boolean;
    finalResult(): string;
    result(): string;
    partialResult(): string;
  }
}
