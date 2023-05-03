/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import crdListRouteInjectable from "../../../common/front-end-routing/routes/cluster/custom-resources/crd-list/crd-list-route.injectable";
import customResourceDefinitionsInjectable from "./custom-resources.injectable";
import { noop, some } from "lodash/fp";
import customResourcesRouteInjectable from "../../../common/front-end-routing/routes/cluster/custom-resources/custom-resources/custom-resources-route.injectable";
import type { SidebarItemRegistration } from "../layout/sidebar-items.injectable";
import navigateToCustomResourcesInjectable from "../../../common/front-end-routing/routes/cluster/custom-resources/custom-resources/navigate-to-custom-resources.injectable";
import routePathParametersInjectable from "../../routes/route-path-parameters.injectable";
import { iter } from "@k8slens/utilities";

const sidebarItemsForDefinitionGroupsInjectable = getInjectable({
  id: "sidebar-items-for-definition-groups",

  instantiate: (di) => {
    const customResourceDefinitions = di.inject(customResourceDefinitionsInjectable);
    const crdRoute = di.inject(customResourcesRouteInjectable);
    const crdListRoute = di.inject(crdListRouteInjectable);
    const pathParameters = di.inject(routePathParametersInjectable)(crdRoute);
    const navigateToCustomResources = di.inject(navigateToCustomResourcesInjectable);

    return computed((): SidebarItemRegistration[] => {
      const grouped = iter.chain(customResourceDefinitions.get().values())
        .map((definition) => [definition.getGroup(), definition] as const)
        .groupIntoMap();

      return iter.chain(grouped.entries())
        .flatMap(([group, definitions]) => {
          const childItems = definitions.map((crd): SidebarItemRegistration => ({
            id: `custom-resource-definition-group-${group}-crd-${crd.getId()}`,
            parentId: `custom-resource-definition-group-${group}`,
            title: crd.getResourceKind(),
            onClick: () => navigateToCustomResources(pathParameters.get()),
            isActive: computed(() => {
              const params = pathParameters.get();

              return (
                !!params
                  && params.group === crd.getGroup()
                  && params.name === crd.getPluralName()
              );
            }),
            isVisible: crdListRoute.isEnabled,
            orderNumber: 10,
          }));

          return [
            {
              id: `custom-resource-definition-group-${group}`,
              parentId: "custom-resources",
              title: group,
              onClick: noop,
              isVisible: computed(() => some(item => item.isVisible?.get(), childItems)),
              orderNumber: 10,
            },

            ...childItems,
          ];
        })
        .toArray();
    });
  },
});

export default sidebarItemsForDefinitionGroupsInjectable;
