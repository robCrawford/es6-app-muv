

// TODO: connect these up during mount
import { patch, setHook } from "./examples/vdom/src/ts/lib/vdom";

export type UpdateThunk = (data?: {}) => void | UpdateThunk; // Argument when currying

export type Action<A> = (actionName: A, data?: {}) => UpdateThunk;

export type Task<T> = (taskName: T, data: Record<string, any>) => Promise<any>;

type TaskSpec = {
    perform: () => Promise<any>;
    success: (a: any) => UpdateThunk;
    failure: (a: any) => UpdateThunk | void;
};

type Next = UpdateThunk | Promise<any> | (UpdateThunk | Promise<any>)[];

type ActionHandler<S, P> = (
    data: any,
    state: S,
    props: P,
    rootState: any
) => { state: S; next?: Next };

type TaskHandler = (data: any) => TaskSpec;

type Vnode = {
    sel: string | undefined;
    data: any;
    children: (Vnode | string)[] | undefined;
    elm: Node | undefined;
    text: string | undefined;
    key: any;
}

export type Config<S = {}, P = {}, A extends string = "", T extends string = ""> = {
    state: (props: P) => S;
    init?: Next;
    actions: Record<A, ActionHandler<S, P>>;
    tasks?: Record<T, TaskHandler>;
    view: (id: string, state: S, props: any, rootState: any) => Vnode;
};

export type GetConfig<S, P, A extends string, T extends string> =
    (action: Action<A>, task: Task<T>) => Config<S, P, A, T>;

const appId = "app";
const renderRefs: { [a: string]: Function } = {};
const internalKey = { k: Math.random() };
let rootState;

export let rootAction: Action<any> | undefined;

export function component<S = {}, P = {}, A extends string = "", T extends string = "">(
    getConfig: GetConfig<S, P, A, T>
) {
    // Pass in callback that returns component config
    // Returns render function that is called by parent e.g. `counter("counter-0", { start: 0 })`
    const renderFn = (idStr: string, props: P): Vnode => {
        const id = idStr.replace(/^#/, "");
        if (!id.length) {
            throw Error("Component requires an id");
        }
        return renderComponent<S, P, A, T>(id, props, getConfig);
    };
    // Add a handle to `getConfig` for tests
    renderFn.getConfig = getConfig;
    return renderFn;
}

export function renderComponent<S, P, A extends string = "", T extends string = "">(
    id: string,
    props: P,
    getConfig: GetConfig<S, P, A, T>
): Vnode {

    const isRoot = id === appId;

    // If component already exists, just run render() again
    let componentRoot = renderById(id, props);
    if (componentRoot) {
        return componentRoot;
    }

    const action: Action<A> = (actionName, data): UpdateThunk => {
        return (thunkInput?: {}): void => {
            if (thunkInput && "srcElement" in thunkInput) {
                // Invoked from the DOM, `thunkInput` is the (unused) event
                update(actionName, data);
            }
            else if (thunkInput === internalKey) {
                // Called by internal method `run()`
                // `internalKey` disallows an action being invoked manually from outside
                update(actionName, data);
            }
            else if (thunkInput) {
                // If a data argument is supplied, return a new thunk instead of invoking the current one
                // This enables currying e.g. when passing an action from parent to child via props
                action(actionName, thunkInput);
            }



        };
    };

    const task: Task<T> = (taskName, data) => {
        if (!config.tasks) {
            throw Error(`tasks ${String(config.tasks)}`);
        }
        const { perform, success, failure }: TaskSpec = config.tasks[taskName](data);
        const promise = perform();
        (promise.then as any).taskName = taskName;
        return promise.then(success).catch(failure);
    };

    // Invoke the function passed into `component()` with props and these functions
    const config = getConfig(action, task);
    let state = config.state && config.state(props);
    let noRender = 0;

    function update(actionName: A, data?: {}): void {
        let next;

        const newState =

                state

        ;
        if (isRoot) {
            rootState = newState;
        }
        ({ state, next } = config.actions[actionName](data, newState, props, rootState));
        // Freeze in dev to error on any mutation outside of action handlers


        run(next, props, actionName);
    }

    function run(next: Next | undefined, props: P, prevTag?: any): void {
        if (!next) {
            render(props);
        }
        else if (typeof next === "function") {
            // An action thunk is either invoked here or from the DOM
            // `internalKey` prevents manual calls from outside
            next(internalKey);
        }
        else if (Array.isArray(next)) {
            noRender++;
            next.forEach(n => run(n, props, prevTag));
            noRender--;
            render(props);
        }
        else if (typeof next.then === "function") {
            const taskName = (next.then as any).taskName || "unknown";
            next
                .then(n => {

                    run(n, props, prevTag);
                })


            render(props); // End of sync chain
        }
    }

    function render(props: P): Vnode | void {
        if (!noRender) {
            patch(componentRoot as Vnode, (componentRoot = config.view(id, state, props, rootState)));
            setRenderRef(componentRoot, id, render);

            publish("patch");
        }
        return componentRoot;
    }

    if (config.init) {
        noRender++;
        run(config.init, props);
        noRender--;
    }




    if (isRoot) {
        rootAction = action;
        rootState = state;
    }

    componentRoot = config.view(id, state, props, rootState);
    setRenderRef(componentRoot, id, render);

    return componentRoot;
}

export function mount(appComponent: (string, any) => Vnode, initFn?: Function): void {
    // Mount the top-level app component
    patch(
        document.getElementById(appId),
        appComponent(appId, {
            /* Props */
        })
    );
    // An optional callback can be provided to run root actions at startup with `internalKey`
    if (initFn) {
        const runRootAction = (actionName, data) => {
            rootAction(actionName, data)(internalKey);
        };
        initFn(runRootAction);
    }
}

function renderById(id: string, props: {}): Vnode | void {
    const render = renderRefs[id];
    if (render) {
        return render(props);
    }
}

function setRenderRef(vnode: Vnode, id: string, render: Function): void {
    // Run after all synchronous patches
    setTimeout(() => {
        renderRefs[id] = render;
        setHook(vnode, "destroy", () => {
            delete renderRefs[id];
        });
    });
}


    // Should only be cloning simple state models




















// Pub/sub
export function subscribe(type: any, listener: EventListener) {
    document.addEventListener(type, listener);
}
export function unsubscribe(type: any, listener: EventListener) {
    document.removeEventListener(type, listener);
}
export function publish(type: any, detail?: any) {
    document.dispatchEvent(new CustomEvent(type, detail ? { detail } : null));
}
