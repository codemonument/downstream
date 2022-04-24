import {
  assert,
  assertRejects,
  assertSnapshot,
  describe,
  it,
} from "../dependencies/_testing.std.ts";
import { downstream } from "../mod.ts";

const File1GB = `https://speed.hetzner.de/1GB.bin`;
const File100MB = `https://speed.hetzner.de/100MB.bin`;
const File50MB = `http://ipv4.download.thinkbroadband.com/50MB.zip`;
const File50MB404 = `https://speed.hetzner.de/50MB.bin`;

/**
 * tc = (Deno) test context
 */
describe(`'downstream'`, () => {
  it("returns content size correctly", async () => {
    const { contentLength, closeStreams } = await downstream(File1GB);

    console.log(contentLength);
    const kb = contentLength / 1024;
    const mb = kb / 1024;
    const gb = mb / 1000; // the 1GB testfile consists of 1000 mb
    closeStreams();
    assert(typeof contentLength === "number");
    assert(gb === 1);
  });

  it.ignore(`Reports Progress correctly`, async (tc) => {
    const { progressStream, closeStreams } = await downstream(File100MB);

    const progressEvents: string[] = [];
    for await (const progress of progressStream) {
      console.log(progress);
      progressEvents.push(progress);
    }
    await closeStreams();

    await assertSnapshot(tc, progressEvents);
  });
});

describe(`'downstream' Regression Tests`, () => {
  it(`should not leak streams on http errors (like 404)`, () =>
    assertRejects(() => downstream(File50MB404)));
});
