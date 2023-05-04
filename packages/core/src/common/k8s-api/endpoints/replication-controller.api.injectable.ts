/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { loggerInjectionToken } from "@k8slens/logger";
import { getKubeApiInjectable } from "../kube-api/kube-api-injection-token";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";
import { ReplicationControllerApi } from "./replication-controller.api";

const replicationControllerApiInjectable = getKubeApiInjectable({
  id: "replication-controller-api",
  instantiate: (di) => {
    return new ReplicationControllerApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default replicationControllerApiInjectable;
