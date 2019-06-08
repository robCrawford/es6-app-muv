import { Action, UpdateThunk, component } from "jetix";
import { html } from "../lib/vdom";
const { div, button } = html;

type Props = {
    readonly text: string;
    readonly onDismiss: UpdateThunk;
};

type State = {
    show: boolean;
};

type ActionName =
    "Dismiss";


export default component<State, Props, ActionName>((action: Action<ActionName>) => ({

    state: () => ({
        show: true
    }),

    actions: {
        Dismiss: (_, state: State, props: Props) => {
            state.show = false;
            return {
                state,
                next: props.onDismiss
            };
        }
    },

    view(id: string, state: State, props: Props) {
        return div(".notification", {
            class: {
                show: state.show && props.text.length
            }
        }, [
            props.text,
            button({ on: { click: action("Dismiss") } }, "Dismiss")
        ]);
    }

}));
