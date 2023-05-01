/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { IngressClassApi } from "./ingress-class.api";
import { loggerInjectionToken } from "@k8slens/logger";
import { getKubeApiInjectable } from "../kube-api/kube-api-injection-token";
import maybeKubeApiInjectable from "../maybe-kube-api.injectable";

const ingressClassApiInjectable = getKubeApiInjectable({
  id: "ingress-class-api",
  instantiate: (di) => new IngressClassApi({
    logger: di.inject(loggerInjectionToken),
    maybeKubeApi: di.inject(maybeKubeApiInjectable),
  }),
});

export default ingressClassApiInjectable;
