import { component } from "../../src/jetix";
import { html } from "../../src/vdom";
import counterPage from "./pages/counterPage";
import aboutPage from "./pages/aboutPage";
import "./router";
const { div } = html;

type Props = {};

export type State = {
    theme: Theme;
    page?: Page;
};

export type RootActions = {
    "SetPage": { page: Page };
    "SetTheme": { theme: Theme };
};

export type Page = "counterPage" | "aboutPage";

export type Theme = "default" | "dark";


export default component<State, Props, RootActions>(action => ({

    state: () => ({
        theme: "default",
        page: null
    }),

    actions: {
        SetPage: ({ page }, state) => {
            state.page = page;
            return { state };
        },
        SetTheme: ({ theme }, state) => {
            state.theme = theme;
            return { state };
        }
    },

    view(id, state) {
        return div(`.page.${state.theme}`,
            (() => {
                switch (state.page) {

                    case "aboutPage":
                        return aboutPage(
                            "#about-page",
                            { onSetTheme: action("SetTheme") }
                        );

                    case "counterPage":
                        return counterPage(
                            "#counter-page",
                            { onSetTheme: action("SetTheme") }
                        );
                }
            })()
        );
    }

}));
