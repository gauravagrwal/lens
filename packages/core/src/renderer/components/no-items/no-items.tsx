/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./no-items.scss";

import React from "react";
import type { IClassName } from "@k8slens/utilities";
import { isTruthy, cssNames } from "@k8slens/utilities";

export interface NoItemsProps {
  className?: IClassName;
  children?: React.ReactNode;
}

export function NoItems(props: NoItemsProps) {
  const { className, children } = props;

  return (
    <div className={cssNames("NoItems flex box grow", className)}>
      <div className="box center">
        {isTruthy(children) ? children : "Item list is empty"}
      </div>
    </div>
  );
}
