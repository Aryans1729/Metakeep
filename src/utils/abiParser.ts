// src/utils/abiParser.ts
export const parseAbi = (abi: any) => {
    try {
      const parsedAbi = JSON.parse(abi);
      return parsedAbi.filter((item: any) => item.type === "function");
    } catch (error) {
      console.error("Error parsing ABI:", error);
      return [];
    }
  };
  