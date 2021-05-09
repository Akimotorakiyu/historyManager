import repoInfo from "../package.json";
import { applyPatches, enableAllPlugins } from "immer";
enableAllPlugins();

import { produce, produceWithPatches, Patch, nothing } from "immer";
console.log("version", repoInfo.version);

interface IMomentChange {
  patches: Patch[];
  inversePatches: Patch[];
}

export function useHistory<T extends object>(initData: T) {
  const history: IMomentChange[] = [];

  const status = {
    index: 0,
    history,
  };

  const cache = {
    initData,
    data: initData,
  };

  function undo() {
    if (canUndo()) {
      const change = history[status.index];
      cache.data = applyPatches(cache.data, change.inversePatches);
      status.index++;
    }

    return cache.data;
  }

  function redo() {
    if (canRedo()) {
      const change = history[status.index - 1];
      cache.data = applyPatches(cache.data, change.patches);
      status.index--;
      cache.data;
    }
    return cache.data;
  }

  function canUndo() {
    return status.index !== history.length ? true : false;
  }

  function canRedo() {
    return status.index !== 0 ? true : false;
  }

  function doProduce(deal: (draft: T) => void | T) {
    cache.data = produce(cache.data, deal, (patches, inversePatches) => {
      history.unshift({
        patches,
        inversePatches,
      });
    });
    return cache.data;
  }

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    cache,
    doProduce,
  };
}


// const {doProduce,undo,redo,canUndo,canRedo} = useHistory({x:0})

// console.log(doProduce((draft)=>{
//     draft.x=1
// }))

// console.log(doProduce((draft)=>{
//     draft.x=2
// }))

// console.log(doProduce((draft)=>{
//     draft.x=3
// }))

// console.log(doProduce((draft)=>{
//     draft.x=4
// }))


// console.log(canUndo(),undo())
// console.log(canUndo(),undo())
// console.log(canUndo(),undo())
// console.log(canUndo(),undo())
// console.log(canUndo(),undo())
// console.log(canUndo(),undo())
// console.log(canUndo(),undo())

// console.log(canRedo(),redo())
// console.log(canRedo(),redo())
// console.log(canRedo(),redo())
// console.log(canRedo(),redo())
// console.log(canRedo(),redo())
// console.log(canRedo(),redo())
// console.log(canRedo(),redo())
