import * as ort from 'onnxruntime-web';

export class ONNXMetadataExtractor {
  /**
   * Extract character dictionary from ONNX model metadata
   * @param session - ONNX Runtime InferenceSession
   * @param key - Metadata key to look for (default: 'character')
   * @returns Array of characters or null if not found
   */
  static async getCharacterList(
    session: ort.InferenceSession, 
    key: string = 'character'
  ): Promise<string[] | null> {
    try {
      // Access model metadata
      const metadata = (session as any).metadata;
      if (!metadata || !metadata.customMetadata) {
        console.warn('No custom metadata found in model');
        return null;
      }

      const characterData = metadata.customMetadata[key];
      if (!characterData) {
        console.warn(`No '${key}' key found in model metadata`);
        return null;
      }

      // Split by newlines and filter empty lines
      const characters = characterData
        .split('\n')
        .filter((line: string) => line.length > 0);

      console.log(`Extracted ${characters.length} characters from model metadata`);
      return characters;
    } catch (error) {
      console.error('Error extracting character list from model:', error);
      return null;
    }
  }

  /**
   * Check if a specific key exists in model metadata
   * @param session - ONNX Runtime InferenceSession
   * @param key - Metadata key to check
   * @returns true if key exists
   */
  static hasKey(session: ort.InferenceSession, key: string): boolean {
    try {
      const metadata = (session as any).metadata;
      if (!metadata || !metadata.customMetadata) {
        return false;
      }
      return key in metadata.customMetadata;
    } catch (error) {
      console.error('Error checking metadata key:', error);
      return false;
    }
  }

  /**
   * Get all custom metadata from model
   * @param session - ONNX Runtime InferenceSession
   * @returns Object containing all custom metadata or null
   */
  static getAllMetadata(session: ort.InferenceSession): Record<string, string> | null {
    try {
      const metadata = (session as any).metadata;
      if (!metadata || !metadata.customMetadata) {
        return null;
      }
      return metadata.customMetadata;
    } catch (error) {
      console.error('Error getting all metadata:', error);
      return null;
    }
  }

  /**
   * Extract dictionary from model or fallback to external dictionary
   * @param session - ONNX Runtime InferenceSession
   * @param externalDict - External dictionary URL or array
   * @returns Character array for CTC decoding
   */
  static async getDictionary(
    session: ort.InferenceSession,
    externalDict?: string | string[]
  ): Promise<string[]> {
    // First try to get from model metadata
    const embeddedDict = await this.getCharacterList(session);
    if (embeddedDict && embeddedDict.length > 0) {
      console.log('Using embedded dictionary from model metadata');
      return embeddedDict;
    }

    // If not in model, use external dictionary
    if (externalDict) {
      if (Array.isArray(externalDict)) {
        console.log('Using provided dictionary array');
        return externalDict;
      } else {
        console.log('Fetching external dictionary from:', externalDict);
        try {
          const response = await fetch(externalDict);
          const text = await response.text();
          return text.split('\n').filter(line => line.length > 0);
        } catch (error) {
          console.error('Failed to fetch external dictionary:', error);
        }
      }
    }

    // Fallback to a basic dictionary if nothing else works
    console.warn('Using fallback dictionary - recognition may be limited');
    return this.getDefaultDictionary();
  }

  /**
   * Get a basic default dictionary for fallback
   * @returns Basic character set
   */
  private static getDefaultDictionary(): string[] {
    // Basic ASCII printable characters + common symbols
    const chars: string[] = [];
    
    // Numbers
    for (let i = 48; i <= 57; i++) {
      chars.push(String.fromCharCode(i));
    }
    
    // Uppercase letters
    for (let i = 65; i <= 90; i++) {
      chars.push(String.fromCharCode(i));
    }
    
    // Lowercase letters
    for (let i = 97; i <= 122; i++) {
      chars.push(String.fromCharCode(i));
    }
    
    // Common punctuation and symbols
    const symbols = ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    for (const char of symbols) {
      chars.push(char);
    }
    
    return chars;
  }
}