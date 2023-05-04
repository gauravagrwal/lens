/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./port-forward-details.scss";

import React from "react";
import { Link } from "react-router-dom";
import type { PortForwardItem } from "../../port-forward";
import { portForwardAddress } from "../../port-forward";
import { Drawer, DrawerItem } from "../drawer";
import { cssNames } from "@k8slens/utilities";
import type { PodApi, ServiceApi } from "../../../common/k8s-api/endpoints";
import { PortForwardMenu } from "./port-forward-menu";
import { withInjectables } from "@ogre-tools/injectable-react";
import serviceApiInjectable from "../../../common/k8s-api/endpoints/service.api.injectable";
import type { GetDetailsUrl } from "../kube-detail-params/get-details-url.injectable";
import getDetailsUrlInjectable from "../kube-detail-params/get-details-url.injectable";
import podApiInjectable from "../../../common/k8s-api/endpoints/pod.api.injectable";

export interface PortForwardDetailsProps {
  portForward?: PortForwardItem;
  hideDetails(): void;
}

interface Dependencies {
  serviceApi: ServiceApi;
  getDetailsUrl: GetDetailsUrl;
  podApi: PodApi;
}

class NonInjectedPortForwardDetails extends React.Component<PortForwardDetailsProps & Dependencies> {
  renderResourceName(portForward: PortForwardItem) {
    const {
      serviceApi,
      podApi,
      getDetailsUrl,
    } = this.props;
    const name = portForward.getName();
    const api = {
      "service": serviceApi,
      "pod": podApi,
    }[portForward.kind];

    if (!api) {
      return (
        <span>{name}</span>
      );
    }

    return (
      <Link to={getDetailsUrl(api.formatUrlForNotListing({ name, namespace: portForward.getNs() }))}>
        {name}
      </Link>
    );
  }

  renderContent() {
    const { portForward } = this.props;

    if (!portForward) return null;

    return (
      <div>
        <DrawerItem name="Resource Name">
          {this.renderResourceName(portForward)}
        </DrawerItem>
        <DrawerItem name="Namespace">
          {portForward.getNs()}
        </DrawerItem>
        <DrawerItem name="Kind">
          {portForward.getKind()}
        </DrawerItem>
        <DrawerItem name="Pod Port">
          {portForward.getPort()}
        </DrawerItem>
        <DrawerItem name="Local Port">
          {portForward.getForwardPort()}
        </DrawerItem>
        <DrawerItem name="Protocol">
          {portForward.getProtocol()}
        </DrawerItem>
        <DrawerItem name="Status">
          <span className={cssNames("status", portForward.getStatus().toLowerCase())}>{portForward.getStatus()}</span>
        </DrawerItem>
      </div>
    );
  }

  render() {
    const { hideDetails, portForward } = this.props;

    return (
      <Drawer
        className="PortForwardDetails"
        usePortal={true}
        open={!!portForward}
        title={portForward && `Port Forward: ${portForwardAddress(portForward)}`}
        onClose={hideDetails}
        toolbar={portForward && (
          <PortForwardMenu
            portForward={portForward}
            toolbar
            hideDetails={hideDetails}
          />
        )}
      >
        {this.renderContent()}
      </Drawer>
    );
  }
}

export const PortForwardDetails = withInjectables<Dependencies, PortForwardDetailsProps>(NonInjectedPortForwardDetails, {
  getProps: (di, props) => ({
    ...props,
    serviceApi: di.inject(serviceApiInjectable),
    getDetailsUrl: di.inject(getDetailsUrlInjectable),
    podApi: di.inject(podApiInjectable),
  }),
});
