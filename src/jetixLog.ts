/*
Logging for Jetix lifecycle
*/
let groupId = '';

const logEnabled = /[&?]debug/.test(window.location.search);

export const log = ({
  setStateGlobal(id: string, state: object | undefined): void {
    if (logEnabled) {
      const win = window as unknown as { state: Record<string, object | undefined> };
      const stateGlobal = win.state || (win.state = {});
      stateGlobal[id] = state;
    }
  },
  noInitialAction(id: string, state?: {}): void {
    if (logEnabled) {
      console.group(`%c#${id}`, "color: #69f");
      if (state) {
        console.log(`${JSON.stringify(state)}`);
      }
      groupId = id;
    }
  },
  updateStart(id: string, state: {} | undefined, label: string, data?: {}): void {
    if (logEnabled) {
      if (!groupId || groupId !== id) {
        console.group(`%c#${id}`, "color: #69f");
        groupId = id;
      }
      if (state) {
        console.log(`%c${JSON.stringify(state)}`, "text-decoration: line-through;");
      }
      let msg = `${String(label)}`;
      if (data) {
        msg += ` ${JSON.stringify(data)}`;
      }
      console.log(`%c${msg}`, "color: #f6b");
      if (!state) {
        console.log(`No change`);
      }
    }
  },
  updateEnd(state: {}): void {
    if (logEnabled && state) {
      console.log(`${JSON.stringify(state)}`);
    }
  },
  taskPerform(label: string, isPromise: boolean): void {
    if (logEnabled) {
      console.log(`%cTask "${label}" perform${isPromise ? '...': 'ed'}`, "color: #dd8");
    }
  },
  taskSuccess(id: string, label: string): void {
    if (logEnabled) {
      console.log(`%c\n...#${id} task "${label}" success`, "color: #dd8");
    }
  },
  taskFailure(id: string, label: string, err: Error): void {
    if (logEnabled) {
      console.log(`%c\n...#${id} task "${label}" failure`, "color: #dd8");
      if (err) console.error(JSON.stringify(err));
    }
  },
  render(id: string, props?: {}): void {
    if (logEnabled) {
      console.groupEnd();
      let msg = `⟳ Render #${id}`;
      if (props && Object.keys(props).length) {
        msg += `, props: ${JSON.stringify(props, replacer)}`;
      }
      console.log(`%c${msg}`, "color: #888");
      groupId = '';
    }
  },
  patch(): void {
    if (logEnabled) {
      console.log(`%c» PATCH`, "color: #888");
      console.groupEnd();
    }
  },
  manualError(id: string, name: string): void {
    throw Error(`#${id} "${name}" cannot be invoked manually`);
  }
});

function replacer(k: string, v: string | Function): string {
  return (typeof v === 'function') ? '[fn]' : v;
}

window.addEventListener('error', (): void => {
  setTimeout((): void => {
    console.groupEnd();
    groupId = '';
  });
});
