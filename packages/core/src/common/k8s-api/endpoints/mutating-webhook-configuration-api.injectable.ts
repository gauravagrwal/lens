/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { loggerInjectionToken } from "@k8slens/logger";
import { getKubeApiInjectable } from "../kube-api/kube-api-injection-token";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";
import { MutatingWebhookConfigurationApi } from "./mutating-webhook-configuration.api";

const mutatingWebhookConfigurationApiInjectable = getKubeApiInjectable({
  id: "mutating-webhook-configuration",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "mutatingWebhookApi is only available in certain environments");

    return new MutatingWebhookConfigurationApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default mutatingWebhookConfigurationApiInjectable;
