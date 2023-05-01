/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import assert from "assert";
import { storesAndApisCanBeCreatedInjectionToken } from "../stores-apis-can-be-created.token";
import { PriorityClassApi } from "./priority-class.api";
import { loggerInjectionToken } from "@k8slens/logger";
import { getKubeApiInjectable } from "../kube-api/kube-api-injection-token";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";

const priorityClassApiInjectable = getKubeApiInjectable({
  id: "priority-class-api",
  instantiate: (di) => {
    assert(di.inject(storesAndApisCanBeCreatedInjectionToken), "PriorityClassApi is only available in certain environments");

    return new PriorityClassApi({
      logger: di.inject(loggerInjectionToken),
      maybeKubeApi: di.inject(maybeKubeApiInjectable),
    });
  },
});

export default priorityClassApiInjectable;
