/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { ResourceQuotaApi } from "./resource-quota.api";
import { loggerInjectionToken } from "@k8slens/logger";
import { getKubeApiInjectable } from "../kube-api/kube-api-injection-token";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";

const resourceQuotaApiInjectable = getKubeApiInjectable({
  id: "resource-quota-api",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "resourceQuotaApi is only available in certain environments");

    return new ResourceQuotaApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default resourceQuotaApiInjectable;
