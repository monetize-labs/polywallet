import { describe, expect, test } from '@jest/globals';
import { WhatsOnChainDataProvider } from './whats-on-chain-data-provider';

describe('WhatsOnChainDataProvider tests', () => {
  test('should provide the appropriate outputs ', async () => {
    const result = await new WhatsOnChainDataProvider().getTxData(
      'e3ce2bb4ccf708594b34a2cfd3cc63a54b763252c202588e1bbb4ec6dcbaef6f',
    );

    expect(result.locktime).toEqual(0);
    expect(result.outputs.length).toEqual(3);
    expect(result.outputs[2].amountSats).toEqual(30732);
    expect(result.outputs[2].lockScriptHex).toEqual(
      '76a9144f7d6a485e09770f947c0ba38d15050a5a80b6fa88ac',
    );
  });
});
