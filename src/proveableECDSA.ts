const p = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F');
  
async function isPointOnCurve(x: bigint, y: bigint): Promise<boolean> {
    const a=0n;
    const b=7n;
    return (y * y) % p === ((x * x * x) + (a * x) + b) % p;
}

async function modInverse(k: bigint, n: bigint): Promise<bigint> {
    const egcd = async (a: bigint, b: bigint): Promise<[bigint, bigint, bigint]>=> {
        if (a === 0n) return [b, 0n, 1n];
        const [g, y, x] = await egcd(b % a, a);
        return [g, x - (b / a) * y, y];
    };
  
      k = ((k % n) + n) % n;
      const [g, x] = await egcd(k, n);
      
      if (g !== 1n) return 0n; // No modular inverse exists
      
      return ((x % n) + n) % n;
}
  
async function  ellipticCurveMultiply(k: bigint, x: bigint, y: bigint, p: bigint): Promise<[bigint, bigint]> {
      // Handle special cases: return point at infinity
      if (k === 0n || (x === 0n && y === 0n)) {
        return [0n, 0n];
      }
    
      let result: [bigint, bigint] = [0n, 0n]; // Initialize result as point at infinity
      let current: [bigint, bigint] = [x, y];  // Start with the input point
    
      // Use the absolute value of k
      let absK = k < 0n ? -k : k;
    
      while (absK > 0n) {
        if (absK & 1n) {
          // If the least significant bit is 1, add current point to result
          result = await ellipticCurveAdd(result[0], result[1], current[0], current[1], p);
        }
        // Double the current point
        current = await ellipticCurveAdd(current[0], current[1], current[0], current[1], p);
        absK >>= 1n; // Right shift k to process the next bit
      }
    
      // If the original k was negative, negate the y-coordinate of the result
      if (k < 0n) {
        result[1] = (-result[1] + p) % p;
      }
    
      return result;
}
    
async function ellipticCurveAdd(x1: bigint, y1: bigint, x2: bigint, y2: bigint, p: bigint): Promise<[bigint, bigint]> {
      // Handle point at infinity
      if (x1 === 0n && y1 === 0n) return [x2, y2];
      if (x2 === 0n && y2 === 0n) return [x1, y1];
    
      // Handle additive inverse
      if (x1 === x2 && y1 === (p - y2) % p) return [0n, 0n]; // Point at infinity
    
      let m: bigint;
      if (x1 === x2 && y1 === y2) {
        // Point doubling for secp256k1: m = (3x²) / (2y)
        m = ((3n * x1 * x1) * (await modInverse(2n * y1, p))) % p;
      } else {
        // Point addition
        m = ((y2 - y1 + p) * (await modInverse((x2 - x1 + p), p))) % p;
      }
    
      const x3 = (m * m - x1 - x2) % p;
      const y3 = (m * (x1 - x3) - y1) % p;
      
      return [(x3+p) % p, (y3+p) % p];
}

async function modularTests(point1:[bigint,bigint], point2:[bigint,bigint], G_x:bigint, G_y:bigint, p:bigint){
//Associvity:
  let left = await ellipticCurveMultiply(1n, ...await ellipticCurveAdd(... await ellipticCurveAdd(...point1, ...point2, p), ...[G_x, G_y], p), p);
  let right = await ellipticCurveMultiply(1n, ...await ellipticCurveAdd(...point1, ...await ellipticCurveAdd(...point2, ...[G_x,G_y], p), p), p);
  left[0] === right[0] && left[1] === right[1] ? console.log("Associative property passed.") : console.log("Associative property failed.")

//Comutative
  left = await ellipticCurveMultiply(1n, ...await ellipticCurveAdd(...point1, ...point2, p), p);
  right = await ellipticCurveMultiply(1n, ...await ellipticCurveAdd(...point2, ...point1, p), p);
  left[0] === right[0] && left[1] === right[1] ? console.log("Commutative property passed.") : console.log("Commutative property failed.")

//Identity Element
  const O: [bigint, bigint] = [0n, 0n]; // Point at infinity
  let result = await ellipticCurveMultiply(1n, ...await ellipticCurveAdd(...point1, ...O, p), p);
  result[0] === point1[0] && result[1] === point1[1] ? console.log("Identity element passed.") :  console.log("Identity element failed.")

//Inverse element.
  const negP: [bigint, bigint] = [point2[0], (-point2[1] + p) % p];
  result = await ellipticCurveMultiply(1n, ...await ellipticCurveAdd(...point2, ...negP, p), p);
  result[0] === 0n && result[1] === 0n ? console.log("Inverse element passed") :console.log("Inverse element failed");

//Distributive
  left = await ellipticCurveMultiply(10n, ...await ellipticCurveAdd(...point1, ...point2, p), p);
  right = await ellipticCurveAdd(...await ellipticCurveMultiply(10n, ...point1, p), ...await ellipticCurveMultiply(10n, ...point2, p), p);
  left[0] === right[0] && left[1] === right[1] ? console.log( "Distributivity passed") : console.log( "Distributivity failed")

//Scalar Mult Test
  let k = 10848n;
  let expected = point2;
  for (let i = 1n; i < k; i++) {
      expected = await ellipticCurveAdd(...expected, ...point2, p);
  }
  result = await ellipticCurveMultiply(k, point2[0], point2[1], p);
  result[0] === expected[0] && result[1] === expected[1] ? console.log("Scalar multiplication passed"): console.log("Scalar multiplication failed");

//Point doubling
  let P = point2;
  left = await ellipticCurveMultiply(2n, P[0], P[1], p);
  right = await ellipticCurveAdd(P[0], P[1], P[0], P[1], p);
  left[0] === right[0] && left[1] === right[1]? console.log("Point doubling passed") : console.log("Point doubling failed");

//Point onCurve
  P = point2;
  k = 100n;
  result = await ellipticCurveMultiply(k, P[0], P[1], p);
  await isPointOnCurve(result[0], result[1]) ? console.log("Point on curve.") : console.log("Point not on curve.");

}  

export async function publicKeyToCompressed(x: bigint, y: bigint): Promise<string> {
    // Convert x to a 32-byte hex string, padding with zeros if necessary
    let xHex = x.toString(16).padStart(64, '0');
    
    // Determine the prefix based on whether y is even or odd
    const prefix = y % 2n === 0n ? '02' : '03';
    
    // Combine the prefix and x-coordinate
    return prefix + xHex;
}

export async function proveableECDSAreturnR(ee:bigint , s: bigint, r: bigint, pub_x: bigint, pub_y: bigint): Promise<bigint> {

  const p = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F');
  const n = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');

  const G_x= BigInt('55066263022277343669578718895168534326250603453777594175500187360389116729240')
  const G_y= BigInt('32670510020758816978083085130507043184471273380659243275938904335757337482424')

  // 1. Verify that r and s are integers in [1, n-1]
  // if (r <= 0n || r >= n || s <= 0n || s >= n) {
  //     return false;
  // }

  // 2. Calculate e = HASH(m). Recieve this directly from zkProgram.
  const e = BigInt(ee);
  
  // 3. Calculate w = s^-1 mod n
  const sInv = await modInverse(s,n);

  // 4. Calculate u1 = ew mod n and u2 = rw mod n
  const u1 = (e * sInv) % n; 
  const u2 = (r * sInv) % n; 

  // 5. Calculate (x, y) = u1G + u2Q
  const point1 = await ellipticCurveMultiply(u1, G_x, G_y, p);
  const point2 = await ellipticCurveMultiply(u2, pub_x, pub_y, p);
  const R = await ellipticCurveAdd(point1[0], point1[1], point2[0], point2[1], p);
  
  //await modularTests(point1,point1,G_x,G_y,p);
 
  // 6. If (x, y) = O (the point at infinity), the signature is invalid
  // if (R[0] === 0n && R[1] === 0n) {
  //     console.log("Point at Infinity.")
  //     return false;
  // }

  // 7. Calculate v = x mod n
  //const v = R[0] % n;
  const v = R[0]
  // 8. The signature is valid if and only if v = r
  // if(v === r){
  //     console.log("Recovery Point:",R);
  //     console.log("Siganture recieved:", {r:r, s:s})
  //     console.log("X-affine of RecoveryPoint R == r of signature. Hence valid signature.")
  //     console.log("Signature is valid.")
  //     return true
  // }else{
  //     return false
  // }
  return v
}
  