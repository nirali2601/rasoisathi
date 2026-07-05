import { describe, expect, it } from 'vitest';
import { buildCorsOptions } from './cors-config.js';

describe('buildCorsOptions', () => {
  it('allows explicitly configured client origins', () => {
    const options = buildCorsOptions({ CLIENT_URL: 'https://rasoisathi.example.com' });

    options.origin('https://rasoisathi.example.com', (error, allow) => {
      expect(error).toBeNull();
      expect(allow).toBe(true);
    });
  });

  it('allows GitHub Pages origins in production', () => {
    const options = buildCorsOptions({ NODE_ENV: 'production' });

    options.origin('https://nirali2601.github.io', (error, allow) => {
      expect(error).toBeNull();
      expect(allow).toBe(true);
    });
  });
});
