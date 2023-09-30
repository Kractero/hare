import { XMLParser } from "fast-xml-parser";

export const parser = new XMLParser({ignoreAttributes : false});
export const abortController = new AbortController();

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }