import { lookupPincode, isValidPincodeFormat, type PincodeLookupResponse } from '../../src/data/pincodes';
import { AppError } from '../middleware/errorHandler';

export { type PincodeLookupResponse };

export class ServerPincodeService {
  public static isValidFormat(pincode: string): boolean {
    return isValidPincodeFormat(pincode);
  }

  public static lookup(pincodeInput: string): PincodeLookupResponse {
    try {
      return lookupPincode(pincodeInput);
    } catch (err: any) {
      throw new AppError(err.message || 'A valid 6-digit Indian postal PIN code is required.', 422, 'INVALID_PINCODE_FORMAT');
    }
  }
}
