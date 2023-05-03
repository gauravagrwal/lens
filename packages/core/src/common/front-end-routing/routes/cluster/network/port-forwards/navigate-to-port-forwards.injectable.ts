/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import portForwardsRouteInjectable from "./port-forwards-route.injectable";
import type { NavigateToSpecificRoute } from "../../../../navigate-to-route-injection-token";
import { navigateToRouteInjectionToken } from "../../../../navigate-to-route-injection-token";

export type NavigateToPortForwards = NavigateToSpecificRoute<typeof portForwardsRouteInjectable>;

const navigateToPortForwardsInjectable = getInjectable({
  id: "navigate-to-port-forwards",

  instantiate: (di): NavigateToPortForwards => {
    const navigateToRoute = di.inject(navigateToRouteInjectionToken);
    const route = di.inject(portForwardsRouteInjectable);

    return (parameters) => navigateToRoute(route, { parameters });
  },
});

export default navigateToPortForwardsInjectable;
