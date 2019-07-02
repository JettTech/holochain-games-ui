export const getDisplayName = (agentHash: string) => {
  if (agentHash.length > 15 ) {
    return agentHash.substring(0,15) + "...";
  }
  else {
    return agentHash;
  }
}
