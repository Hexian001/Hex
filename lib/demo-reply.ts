export function localDemoReply(modelLabel: string, prompt: string): string {
  const collapsed = prompt.replace(/\s+/g, " ").trim();
  const shown =
    collapsed.length > 500 ? `${collapsed.slice(0, 500)}…` : collapsed;

  return [
    `Local demo reply. This was written by the Hivera website on this machine. It is not ${modelLabel}, and no frontier model was called.`,
    "",
    `You selected ${modelLabel}. This server has no API key for that family, so your prompt was not forwarded.`,
    "",
    `Prompt received: "${shown}"`,
    "",
    "A deployment with a key would show the provider’s reply in this thread and label it as a provider reply. This message is a local demo so the two are not confused.",
  ].join("\n");
}
