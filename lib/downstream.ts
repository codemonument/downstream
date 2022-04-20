import { DownstreamResponse } from "./DownstreamResponse.ts";

/**
 * A function for downloading a file and returning a readable stream
 * allows to decouple downloading from further processing
 * (writing to file, sending to another network stream, etc.)
 */
export async function downstream(
  input: string | Request,
  options?: RequestInit,
): Promise<DownstreamResponse> {
  /**
   * start file download stream
   */

  const fileResponse = await fetch(input, options);
  if (fileResponse.status != 200) {
    throw new Deno.errors.Http(
      `status ${fileResponse.status}-'${fileResponse.statusText}' received instead of 200`,
    );
  }

  if (!fileResponse.body) {
    throw new Deno.errors.InvalidData(`The download response has no body!`);
  }

  return {
    body: fileResponse.body,
  };
}
