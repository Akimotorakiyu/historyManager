import repoInfo from "../package.json";
import { applyPatches, enableAllPlugins } from "immer";
enableAllPlugins();

import { produce, produceWithPatches, Patch, nothing } from "immer";

interface IMomentChange {
  patches: Patch[];
  inversePatches: Patch[];
}

export function useHistory<T extends object>(initData: T) {
  const history: IMomentChange[] = [];

  const status = {
    index: 0,
    history,
    showLog: false,
  };

  const cache = {
    initData,
    data: initData,
  };

  function undo() {
    const canDo = canUndo();
    if (canDo) {
      const change = history[status.index];
      cache.data = applyPatches(cache.data, change.inversePatches);
      status.index++;
    }

    if (status.showLog) {
      console.log(canDo, cache.data);
    }

    return cache.data;
  }

  function redo() {
    const canDo = canRedo();

    if (canDo) {
      const change = history[status.index - 1];
      cache.data = applyPatches(cache.data, change.patches);
      status.index--;
      cache.data;
    }

    if (status.showLog) {
      console.log(canDo, cache.data);
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
    if (status.index !== 0) {
      history.splice(0, status.index);
      status.index = 0;
      if (status.showLog) {
        console.log("new world line");
      }
    }
    cache.data = produce(cache.data, deal, (patches, inversePatches) => {
      history.unshift({
        patches,
        inversePatches,
      });
    });

    if (status.showLog) {
      console.log("n", cache.data);
    }
    return cache.data;
  }

  function showLog(show = true) {
    if (show) {
      console.log(`version: ${repoInfo.version}, start show log.`);
    }
    status.showLog = show;
  }

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    cache,
    doProduce,
    showLog,
  };
}

// const { doProduce, undo, redo, canUndo, canRedo, showLog } = useHistory({
//   x: 0,
// });

// showLog();

// doProduce((draft) => {
//   draft.x = 1;
// });
// doProduce((draft) => {
//   draft.x = 2;
// });
// doProduce((draft) => {
//   draft.x = 3;
// });
// doProduce((draft) => {
//   draft.x = 4;
// });

// undo();
// undo();
// undo();
// undo();
// undo();
// undo();
// undo();

// redo();
// redo();
// redo();
// redo();
// redo();
// redo();
// redo();

// undo();
// undo();
// undo();

// doProduce((draft) => {
//   draft.x = 0;
// });
// doProduce((draft) => {
//   draft.x = -1;
// });
// doProduce((draft) => {
//   draft.x = -2;
// });

// doProduce((draft) => {
//   draft.x = -3;
// });

// doProduce((draft) => {
//   draft.x = -4;
// });

// undo();
// undo();
// undo();
// undo();
// undo();
// undo();
// undo();

// redo();
// redo();
// redo();
// redo();
// redo();
// redo();
// redo();
