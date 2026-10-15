/** Ambient types for @tgwf/co2 v0.19.0 (the package ships no declarations). */
declare module "@tgwf/co2" {
  export interface Co2Options {
    /** Emission model, e.g. "swd" (Sustainable Web Design). */
    model?: string;
    /** Model version, e.g. 4. */
    version?: number;
  }

  export class co2 {
    constructor(options?: Co2Options);
    /** CO2e in grams for the given transfer size in bytes. */
    perByte(bytes: number, green?: boolean): number;
  }
}
