import { component, html, Config, VNode } from "jetix";
import { RootActions } from "../app";
const { div, button } = html;

type Component = {
  RootActions: RootActions;
};

export default component<Component>(({ rootAction }): Config<Component> => ({

  view(id): VNode {
    return div(`#${id}`, [
      button(
        { on: { click: rootAction("SetTheme", { theme: "light" }) } },
        "Light theme"),
      button(
        { on: { click: rootAction("SetTheme", { theme: "dark" }) } },
        "Dark theme"),
      div('#note', "Add `debug` to the query string to activate logging.")
    ]);
  }

}));
