import { component, html, rootTask } from "jetix";
import themeMenu from "../components/themeMenu";
const { div, h1, a } = html;


export default component(() => ({

    init: rootTask("SetDocTitle", { title: "About" }),

    view(id) {
        return div(`#${id}`,
            div(".intro", [
                themeMenu("#theme-menu"),
                a({attrs: {href: "/counter" + location.search, "data-navigo": true}}, "Counter page"),
                h1("About"),
                div("Lorem ipsum dolor sit amet.")
            ])
        );
    }

}));
