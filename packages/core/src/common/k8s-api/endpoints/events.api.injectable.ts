/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { KubeEventApi } from "./events.api";
import { loggerInjectionToken } from "@k8slens/logger";
import { getKubeApiInjectable } from "../kube-api/kube-api-injection-token";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";

const kubeEventApiInjectable = getKubeApiInjectable({
  id: "kube-event-api",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "kubeEventApi is only available in certain environments");

    return new KubeEventApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default kubeEventApiInjectable;
