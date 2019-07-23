import { component, html, rootTask } from "../../../src/jetix";
import counter from "../components/counter";
import themeMenu from "../components/themeMenu";
const { div, h1, a } = html;


export default component(() => ({

    init: rootTask("SetDocTitle", { title: "Counter" }),

    view(id) {
        return div(`#${id}`, [
            div(".intro", [
                themeMenu("#theme-menu"),
                a({attrs: {href: "/about" + location.search, "data-navigo": true}}, "About page"),
                h1("Counter")
            ]),
            counter("#counter-0", { start: 0 }),
            counter("#counter-1", { start: -1 })
        ]);
    }

}));
