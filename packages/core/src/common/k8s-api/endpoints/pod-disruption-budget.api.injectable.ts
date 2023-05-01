/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { PodDisruptionBudgetApi } from "./pod-disruption-budget.api";
import { loggerInjectionToken } from "@k8slens/logger";
import { getKubeApiInjectable } from "../kube-api/kube-api-injection-token";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";

const podDisruptionBudgetApiInjectable = getKubeApiInjectable({
  id: "pod-disruption-budget-api",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "podDisruptionBudgetApi is only available in certain environments");

    return new PodDisruptionBudgetApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    }, {
      checkPreferredVersion: true,
      allowedUsableVersions: {
        policy: [
          "v1",
          "v1beta1",
        ],
      },
    });
  },
});

export default podDisruptionBudgetApiInjectable;
