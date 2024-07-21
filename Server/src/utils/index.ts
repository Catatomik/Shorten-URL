async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

function hasAttribute<A extends string>(obj: unknown, attr: A): obj is { [key in A]: unknown } {
  return typeof obj === "object" && obj !== null && attr in obj;
}

export default { sha256 };

export { hasAttribute };
