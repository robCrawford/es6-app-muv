/*
  @flow
  Counter component
*/
import type { Config } from "../lib/muv";
import { init } from "../lib/muv";
import { h } from "../lib/snabbdom";
import message from "./message";


type Props = {
    start: number;
};

type Model = {
    counter: number;
    highlight: boolean;
    errors: string;
};

type Msg =
    "Increment" |
    "Decrement" |
    "Highlight" |
    "Validate" |
    "SetErrors";


export default (props: Props) => init(
    ({
        initialModel: {
            counter: props.start,
            highlight: isEven(props.start),
            errors: ""
        },

        update(model, action) {
            return {
                Increment: (step: number) => {
                    model.counter += step;
                    return [
                        action("Highlight"),
                        action("Validate")
                    ];
                },
                Decrement: (step: number) => {
                    model.counter -= step;
                    return action("Validate");
                },
                Highlight: () => {
                    model.highlight = isEven(model.counter);
                },
                Validate: () => {
                    model.errors = "";
                    // Async
                    return validateCount(model.counter)
                        .then(e => action("SetErrors", e));
                },
                SetErrors: (text: string) => {
                    model.errors = text;
                }
            };
        },

        view(model, action) {
            return h("div.counter", [
                h('button',
                    { on: { click: action("Increment", 1) } },
                    "+"),
                h('div',
                    { class: { highlight: model.highlight } },
                    String(model.counter)),
                h('button',
                    { on: { click: action("Decrement", 2) } },
                    "-"),
                // Child component
                model.errors.length ?
                    message({ text: model.errors }) :
                    ""
            ]);
        }

    }: Config<Model, Msg>)
);


export function isEven(n: number): boolean {
    return !(n % 2);
}

export function isNegative(n: number): boolean {
    return n < 0;
}

function validateCount(n: number): Promise<string> {
    return new Promise((resolve/*, reject*/) => {
        setTimeout(() => resolve(isNegative(n) ? "Negative!" : ""), 500);
    });
}
