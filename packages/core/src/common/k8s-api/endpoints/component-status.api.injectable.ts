/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { ComponentStatusApi } from "./component-status.api";
import { getKubeApiInjectable } from "../kube-api/kube-api-injection-token";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";
import { loggerInjectionToken } from "@k8slens/logger";

const componentStatusApiInjectable = getKubeApiInjectable({
  id: "component-status-api",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "componentStatusApi is only available in certain environments");

    return new ComponentStatusApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default componentStatusApiInjectable;
