/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { DiContainerForInjection } from "@ogre-tools/injectable";
import { getInjectable, getInjectionToken } from "@ogre-tools/injectable";
import type { KubeObjectStore } from "../kube-object.store";

export const kubeObjectStoreInjectionToken = getInjectionToken<KubeObjectStore>({
  id: "kube-object-store-token",
});

export interface KubeStoreInjectableParts<Store> {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instantiate: (di: DiContainerForInjection) => Store extends KubeObjectStore<any, any, any> ? Store : never;
}

export const getKubeStoreInjectable = <Store>(parts: KubeStoreInjectableParts<Store>) => getInjectable({
  id: parts.id,
  instantiate: (di) => parts.instantiate(di),
  injectionToken: kubeObjectStoreInjectionToken,
});
