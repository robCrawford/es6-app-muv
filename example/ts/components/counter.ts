import { component, html, Config, VNode, Next, TaskSpec } from "jetix";
import notification from "./notification";
import { validateCount } from "../services/validation";
const { div, button } = html;

export type Props = Readonly<{
  start: number;
}>;

export type State = Readonly<{
  counter: number;
  feedback: string;
}>;

type Actions = Readonly<{
  Increment: { step: number };
  Decrement: { step: number };
  Validate: null;
  SetFeedback: { text: string };
}>;

type Tasks = Readonly<{
  ValidateCount: { count: number };
}>;

type Component = {
  Props: Props;
  State: State;
  Actions: Actions;
  Tasks: Tasks;
};


export default component<Component>(
  ({ action, task }): Config<Component> => ({

    // Initial state
    state: (props): State => ({
      counter: props.start,
      feedback: ""
    }),

    // Initial action
    init: action("Validate"),

    // Action handlers return new state, and any next actions/tasks
    actions: {
      Increment: ({ step }, { props, state, rootState }): { state: State; next: Next } => {
        return {
          state: {
            ...state,
            counter: state.counter + step
          },
          next: action("Validate")
        };
      },
      Decrement: ({ step }, { props, state, rootState }): { state: State; next: Next } => {
        return {
          state: {
            ...state,
            counter: state.counter - step
          },
          next: action("Validate")
        };
      },
      Validate: (_, { props, state, rootState }): { state: State; next: Next } => {
        return {
          state,
          next: [
            action("SetFeedback", { text: "Validating..." }),
            // An async task
            task("ValidateCount", { count: state.counter })
          ]};
      },
      SetFeedback: ({ text }, { props, state, rootState }): { state: State } => {
        return {
          state: {
            ...state,
            feedback: text
          }
        };
      }
    },

    // Task handlers provide callbacks for effects and async operations that may fail
    tasks: {
      ValidateCount: ({ count }): TaskSpec<Props, State> => {
        return {
          perform: (): Promise<{ text: string }> => validateCount(count),
          success: (result: { text: string }, { props, state, rootState }): Next => {
            return action("SetFeedback", result);
          },
          failure: (err, { props, state, rootState }): Next => {
            return action("SetFeedback", { text: "Unavailable" });
          }
        };
      }
    },

    // View renders from props & state
    view(id, { props, state, rootState }): VNode {
      return div(`#${id}.counter`, [
        button(
          { on: { click: action("Increment", { step: 1 }) } },
          "+"
        ),
        div(String(state.counter)),
        button(
          { on: { click: action("Decrement", { step: 1 }) } },
          "-"
        ),
        // Child component - `notification` module
        notification(`#${id}-feedback`, {
          text: state.feedback,
          onDismiss: action("SetFeedback", { text: "" })
        })
      ]);
    }

  })
);
