import * as fcl from "@onflow/fcl";

const transformDictToObject = (dict) => {
  let obj = {};
  if (dict) {
    for (let f of dict) {
      obj[f["key"]["value"]] = transformFlowValueRecursive(f["value"]);
    }
  }
  return obj;
};

const transformArray = (arr) => {
  let res = [];
  if (arr) {
    for (let f of arr) {
      res.push(transformFlowValueRecursive(f));
    }
  }
  return res;
};

const transformFlowValueRecursive = (value) => {
  if (value?.type === "UInt64") {
    return parseInt(value?.value);
  } else if (value?.type === "UFix64") {
    return parseFloat(value?.value);
  } else if (value?.type === "Type") {
    return value?.value?.staticType?.typeID;
  } else if (value?.type === "Dictionary") {
    return transformDictToObject(value?.value);
  } else if (value?.type === "Array") {
    return transformArray(value?.value);
  } else if (value?.type === "Optional") {
    return transformFlowValueRecursive(value?.value);
  } else {
    return value?.value;
  }
};

export const transformEventToObject = (event) => {
  const fields = event.payload?.value?.fields || [];
  let obj = {};
  for (let f of fields) {
    obj[f.name] = transformFlowValueRecursive(f.value);
  }
  return obj;
};

export const getLatestBlockHeight = async () => {
  const latestBlock = await fcl.send([fcl.getBlock(true)]);
  const latestBlockDecoded = await fcl.decode(latestBlock);
  return latestBlockDecoded.height;
};

export const queryEvents = async (contractAddress, contractName, event, startHeight, endHeight) => {
  try {
    const response = await fcl.send([
      fcl.getEventsAtBlockHeightRange(
        `A.${contractAddress}.${contractName}.${event}`,
        startHeight,
        endHeight
      ),
    ]);
    if (response.events && response.events.length > 0) {
      return response.events;
    }
    return [];
  } catch (err) {
    throw err;
  }
};

export const getContractInfoFromType = (nftType) => {
  const arr = nftType.split(".");
  return {
    contractAddress: `0x${arr[1]}`,
    contractName: arr[2],
  };
};

export const queryEventsByTxId = async (txId) => {
  try {
    const response = await fcl.send([fcl.getTransactionStatus(txId)]);
    if (
      Array.isArray(response?.transactionStatus?.events) &&
      response.transactionStatus.events.length > 0
    ) {
      return response.transactionStatus.events;
    }
    return [];
  } catch (err) {
    console.log(err);
  }
};
