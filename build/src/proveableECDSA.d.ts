export declare function verifyECDSA2(message: string, s: bigint, r: bigint, pub_x: bigint, pub_y: bigint): Promise<boolean>;
export declare function publicKeyToCompressed(x: bigint, y: bigint): Promise<string>;
export declare function proveableECDSAreturnR(ee: bigint, s: bigint, r: bigint, pub_x: bigint, pub_y: bigint): Promise<bigint>;
