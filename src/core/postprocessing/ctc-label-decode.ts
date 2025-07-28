// import type { OCRConfig } from '../ocr-config';

interface CTCDecodeResult {
  text: string;
  confidence: number;
  wordBoxes?: {
    words: string[][];
    wordPositions: number[][];
    states: string[];
  };
}

export class CTCLabelDecode {
  private character: string[];
  // private _dict: Map<string, number>;

  constructor(character: string[] | null = null, characterPath: string | null = null) {
    this.character = this.getCharacter(character, characterPath);
    // this._dict = new Map(this.character.map((char, i) => [char, i]));
  }

  decode(
    textIndex: number[][],
    textProb: number[][] | null = null,
    returnWordBox: boolean = false,
    isRemoveDuplicate: boolean = true
  ): CTCDecodeResult[] {
    const resultList: CTCDecodeResult[] = [];
    const ignoredTokens = this.getIgnoredTokens();
    const batchSize = textIndex.length;

    for (let batchIdx = 0; batchIdx < batchSize; batchIdx++) {
      const selection = new Array(textIndex[batchIdx].length).fill(true);
      
      // Remove duplicate characters
      if (isRemoveDuplicate) {
        for (let i = 1; i < textIndex[batchIdx].length; i++) {
          selection[i] = textIndex[batchIdx][i] !== textIndex[batchIdx][i - 1];
        }
      }

      // Remove ignored tokens (blank)
      for (const ignoredToken of ignoredTokens) {
        for (let i = 0; i < textIndex[batchIdx].length; i++) {
          selection[i] = selection[i] && textIndex[batchIdx][i] !== ignoredToken;
        }
      }

      // Get confidence list
      let confList: number[] = [];
      if (textProb !== null) {
        confList = textIndex[batchIdx]
          .map((_, idx) => selection[idx] ? textProb[batchIdx][idx] : null)
          .filter(conf => conf !== null) as number[];
      } else {
        confList = selection.filter(sel => sel).map(() => 1);
      }

      if (confList.length === 0) {
        confList = [0];
      }

      // Get character list
      const charList = textIndex[batchIdx]
        .map((textId, idx) => selection[idx] ? this.character[textId] : null)
        .filter(char => char !== null) as string[];
      
      const text = charList.join('');
      const avgConfidence = confList.reduce((a, b) => a + b, 0) / confList.length;

      if (returnWordBox) {
        const wordInfo = this.getWordInfo(text, selection);
        resultList.push({
          text,
          confidence: avgConfidence,
          wordBoxes: wordInfo
        });
      } else {
        resultList.push({
          text,
          confidence: avgConfidence
        });
      }
    }

    return resultList;
  }

  private getWordInfo(text: string, selection: boolean[]): {
    words: string[][];
    wordPositions: number[][];
    states: string[];
  } {
    let state: string | null = null;
    const wordContent: string[] = [];
    const wordColContent: number[] = [];
    const wordList: string[][] = [];
    const wordColList: number[][] = [];
    const stateList: string[] = [];

    // Get valid columns
    const validCol: number[] = [];
    selection.forEach((sel, idx) => {
      if (sel) validCol.push(idx);
    });

    const colWidth = new Array(validCol.length).fill(0);
    if (validCol.length > 0) {
      for (let i = 1; i < validCol.length; i++) {
        colWidth[i] = validCol[i] - validCol[i - 1];
      }
      // Check if first character is Chinese
      const isFirstChinese = /[\u4e00-\u9fff]/.test(text[0]);
      colWidth[0] = Math.min(isFirstChinese ? 3 : 2, validCol[0]);
    }

    for (let cIdx = 0; cIdx < text.length; cIdx++) {
      const char = text[cIdx];
      const cState = /[\u4e00-\u9fff]/.test(char) ? 'cn' : 'en&num';

      if (state === null) {
        state = cState;
      }

      // Check if we need to start a new word
      if (state !== cState || colWidth[cIdx] > 4) {
        if (wordContent.length !== 0) {
          wordList.push([...wordContent]);
          wordColList.push([...wordColContent]);
          stateList.push(state);
          wordContent.length = 0;
          wordColContent.length = 0;
        }
        state = cState;
      }

      wordContent.push(char);
      wordColContent.push(validCol[cIdx]);
    }

    // Add the last word
    if (wordContent.length !== 0) {
      wordList.push(wordContent);
      wordColList.push(wordColContent);
      stateList.push(state!);
    }

    return {
      words: wordList,
      wordPositions: wordColList,
      states: stateList
    };
  }

  private getCharacter(character: string[] | null, characterPath: string | null): string[] {
    if (!character && !characterPath) {
      throw new Error('Either character array or character path must be provided');
    }

    let characterList: string[] | null = null;
    
    if (character) {
      characterList = character;
    }
    
    // Note: In browser environment, we typically get characters from the model metadata
    // rather than from a file path
    if (!characterList) {
      throw new Error('Character list not found');
    }

    // Insert special characters
    characterList = this.insertSpecialChar(characterList, ' ', characterList.length);
    characterList = this.insertSpecialChar(characterList, 'blank', 0);
    
    return characterList;
  }

  private insertSpecialChar(characterList: string[], specialChar: string, loc: number): string[] {
    const newList = [...characterList];
    if (loc === -1 || loc === newList.length) {
      newList.push(specialChar);
    } else {
      newList.splice(loc, 0, specialChar);
    }
    return newList;
  }

  private getIgnoredTokens(): number[] {
    return [0]; // CTC blank token
  }

  updateCharacterFromModel(character: string[]): void {
    this.character = this.getCharacter(character, null);
    // this._dict = new Map(this.character.map((char, i) => [char, i]));
  }
}