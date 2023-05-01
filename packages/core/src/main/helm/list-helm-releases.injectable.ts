/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import execHelmInjectable from "./exec-helm/exec-helm.injectable";
import { toCamelCase, isObject, isArray } from "@k8slens/utilities";

export type ListHelmReleases = (pathToKubeconfig: string, namespace?: string) => Promise<Record<string, unknown>[]>;

const listHelmReleasesInjectable = getInjectable({
  id: "list-helm-releases",
  instantiate: (di): ListHelmReleases => {
    const execHelm = di.inject(execHelmInjectable);

    return async (pathToKubeconfig, namespace) => {
      const args = [
        "ls",
        "--all",
        // By default 256 results are listed, we want to list practically all
        "--max", "9999",
        "--output", "json",
      ];

      if (namespace) {
        args.push("-n", namespace);
      } else {
        args.push("--all-namespaces");
      }

      args.push("--kubeconfig", pathToKubeconfig);

      const result = await execHelm(args);

      if (!result.isOk) {
        throw result.error;
      }

      const output = JSON.parse(result.value) as unknown;

      if (!isArray(output) || output.length == 0) {
        return [];
      }

      return output.filter(isObject).map(toCamelCase);
    };
  },
});

export default listHelmReleasesInjectable;
