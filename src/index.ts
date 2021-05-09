import repoInfo from "../package.json";
import { applyPatches, enableAllPlugins } from "immer";
enableAllPlugins();

import { produce, produceWithPatches, Patch, nothing } from "immer";

interface IChangePatches {
  patches: Patch[];
  inversePatches: Patch[];
}

export function useHistory<T extends object>(initData: T) {

  const status = {
    index: 0,
    history:<IChangePatches[]>[],
    showLog: false,
  };

  const value = {
    value: initData,
  };

  function undo() {
    const canDo = canUndo();
    if (canDo) {
      const change = status.history[status.index];
      value.value = applyPatches(value.value, change.inversePatches);
      status.index++;
    }

    if (status.showLog) {
      console.log(canDo, value.value);
    }

    return value.value;
  }

  function redo() {
    const canDo = canRedo();

    if (canDo) {
      const change = status.history[status.index - 1];
      value.value = applyPatches(value.value, change.patches);
      status.index--;
      value.value;
    }

    if (status.showLog) {
      console.log(canDo, value.value);
    }
    return value.value;
  }

  function canUndo() {
    return status.index !== history.length ? true : false;
  }

  function canRedo() {
    return status.index !== 0 ? true : false;
  }

  function doProduce(deal: (draft: T) => void | T) {
    if (status.index !== 0) {
      status.history.splice(0, status.index);
      status.index = 0;
      if (status.showLog) {
        console.log("new world line");
      }
    }
    value.value = produce(value.value, deal, (patches, inversePatches) => {
      status.history.unshift({
        patches,
        inversePatches,
      });
    });

    if (status.showLog) {
      console.log("n", value.value);
    }
    return value.value;
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
    value:{
      get value(){
        return value.value
      }
    },
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
