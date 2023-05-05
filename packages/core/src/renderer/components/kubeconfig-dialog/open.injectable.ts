/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type React from "react";
import { prefixedLoggerInjectable } from "@k8slens/logger";
import showCheckedErrorNotificationInjectable from "../notifications/show-checked-error.injectable";
import kubeconfigDialogStateInjectable from "./state.injectable";

export interface OpenKubeconfigDialogArgs {
  title?: React.ReactNode;
  loader: () => Promise<string>;
}

export type OpenKubeconfigDialog = (openArgs: OpenKubeconfigDialogArgs) => void;

const openKubeconfigDialogInjectable = getInjectable({
  id: "open-kubeconfig-dialog",
  instantiate: (di): OpenKubeconfigDialog => {
    const state = di.inject(kubeconfigDialogStateInjectable);
    const showCheckedErrorNotification = di.inject(showCheckedErrorNotificationInjectable);
    const logger = di.inject(prefixedLoggerInjectable, "KUBE-CONFIG-DIALOG");

    return ({ title, loader }) => {
      void (async () => {
        try {
          const config = await loader();

          state.set({ title, config });
        } catch (error) {
          showCheckedErrorNotification(error, "Failed to retrieved config for dialog");
          logger.warn("failed to retrieved config for dialog", error);
        }
      })();
    };
  },
});

export default openKubeconfigDialogInjectable;
