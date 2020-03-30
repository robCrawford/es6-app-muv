import { component, html, Config, VNode } from "jetix";
import counter from "../components/counter";
import themeMenu from "../components/themeMenu";
import like from "../components/like";
import { RootState, RootTasks } from "../app";
const { div, h1, a } = html;

type Component = {
  RootState: RootState;
  RootTasks: RootTasks;
};

export default component<Component>(
  ({ rootTask }): Config<Component> => ({

    init: rootTask("SetDocTitle", { title: "Counter" }),

    view(id, { rootState }): VNode {
      return div(`#${id}`, [
        div(".content", [
          themeMenu("#theme-menu"),
          a({ attrs: {href: "/about" + location.search, "data-navigo": true} }, "About page"),
          div(".visits", ["Likes: ", rootState.likes.counterPage]),
          h1("Counter"),
          like('#counter-like', { page: 'counterPage'})
        ]),
        counter("#counter-0", { start: 0 }),
        counter("#counter-1", { start: -1 })
      ]);
    }

  })
);
