/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./status-brick.scss";

import React from "react";
import { cssNames } from "@k8slens/utilities";
import { withTooltip } from "@k8slens/tooltip";

export type StatusBrickProps = React.HTMLAttributes<HTMLDivElement>;

export const StatusBrick = withTooltip(({ className, ...elemProps }: StatusBrickProps) => (
  <div
    className={cssNames("StatusBrick", className)}
    {...elemProps}
  />
));
