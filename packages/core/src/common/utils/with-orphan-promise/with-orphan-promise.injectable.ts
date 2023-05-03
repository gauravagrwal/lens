/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import withErrorLoggingInjectable from "../with-error-logging/with-error-logging.injectable";
import { withErrorSuppression } from "../with-error-suppression/with-error-suppression";
import { pipeline } from "@ogre-tools/fp";

const withOrphanPromiseInjectable = getInjectable({
  id: "with-orphan-promise",

  instantiate: (di) => {
    const withErrorLoggingFor = di.inject(withErrorLoggingInjectable);

    return <Args extends unknown[]>(toBeDecorated: (...args: Args) => unknown) =>
      (...args: Args): void => {
        const decorated = pipeline(
          toBeDecorated,
          withErrorLoggingFor(() => "Orphan promise rejection encountered"),
          withErrorSuppression,
        ) as ((...args: unknown[]) => unknown);

        decorated(...args);
      };
  },
});

export default withOrphanPromiseInjectable;
