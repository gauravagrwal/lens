/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { NamespaceApi } from "./namespace.api";
import { loggerInjectionToken } from "@k8slens/logger";
import { getKubeApiInjectable } from "../kube-api/kube-api-injection-token";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";

const namespaceApiInjectable = getKubeApiInjectable({
  id: "namespace-api",

  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "namespaceApi is only available in certain environments");

    return new NamespaceApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default namespaceApiInjectable;
