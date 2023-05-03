/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getRouteSpecificComponentInjectable } from "../../routes/route-specific-component-injection-token";
import crdListRouteInjectable from "../../../common/front-end-routing/routes/cluster/custom-resources/crd-list/crd-list-route.injectable";
import { CustomResourceDefinitions } from "./crd-list";

const crdListRouteComponentInjectable = getRouteSpecificComponentInjectable({
  id: "crd-list-route-component",
  Component: CustomResourceDefinitions,
  routeInjectable: crdListRouteInjectable,
});

export default crdListRouteComponentInjectable;
