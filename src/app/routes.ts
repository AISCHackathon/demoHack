import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/AppShell";
import { Dashboard } from "./components/Dashboard";
import { ProjectsList } from "./components/ProjectsList";
import { ProjectDetail } from "./components/ProjectDetail";
import { NewProject } from "./components/NewProject";
import { Sourcing } from "./components/Sourcing";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppShell,
    children: [
      { index: true, Component: Dashboard },
      { path: "projects", Component: ProjectsList },
      { path: "projects/new", Component: NewProject },
      { path: "projects/:id", Component: ProjectDetail },
      { path: "sourcing", Component: Sourcing },
    ],
  },
]);