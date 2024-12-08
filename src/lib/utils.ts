import { clsx, type ClassValue } from "clsx"
import { createHmac } from "crypto";
import { getMasterKeyFromSeed } from "ed25519-hd-key";
import { parse } from "path";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CKDPriv = ({ key, chainCode }: { key: Buffer, chainCode: Buffer }, index: any) => {
  const indexBuffer = Buffer.allocUnsafe(4);
  indexBuffer.writeUInt32BE(index, 0);
  const data = Buffer.concat([Buffer.alloc(1, 0), key, indexBuffer]);
  const I = createHmac('sha512', chainCode)
      .update(data)
      .digest();
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
      key: IL,
      chainCode: IR,
  };
};

export const derivePath = (path: string, seed: string, offset = 0x80000000) => {
  const { key, chainCode } = getMasterKeyFromSeed(seed);
  const segments = path
      .split('/')
      .slice(1)
      .map((val) => val.replace("'", ''))
      .map(el => parseInt(el, 10));

  console.log('segments', segments);
  let stringForm = segments
  .map((segment) => {
    if(Number.isNaN(segment)){
      return '';
    }
    return Number.isInteger(segment) ? segment.toString() + "'" : segment.toString();
  })
  .join('/');
  stringForm = segments.length==0?'':'m/' + stringForm;
  console.log("Parsed path: "+stringForm);
  return {data: segments.reduce((parentKeys, segment) => CKDPriv(parentKeys, segment + offset), { key, chainCode }), parsedPath: stringForm};
};

export const parseDerivationPath = (path: string) => {
  const segments = path
  .split('/')
  .slice(1)
  .map((val) => val.replace("'", ''))
  .map(el => parseInt(el, 10));

  let stringForm = segments
  .map((segment) => {
  if(Number.isNaN(segment)){
    return '';
  }
  return Number.isInteger(segment) ? segment.toString() + "'" : segment.toString();
  })
  .join('/');
  stringForm = segments.length==0?'':'m/' + stringForm;
  return stringForm;
}