/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { loggerInjectionToken } from "@k8slens/logger";
import { getKubeApiInjectable } from "../kube-api/kube-api-injection-token";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";
import { ValidatingWebhookConfigurationApi } from "./validating-webhook-configuration.api";

const validatingWebhookConfigurationApiInjectable = getKubeApiInjectable({
  id: "validating-webhook-configuration",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "validatingWebhookConfigurationApi is only available in certain environments");

    return new ValidatingWebhookConfigurationApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default validatingWebhookConfigurationApiInjectable;
