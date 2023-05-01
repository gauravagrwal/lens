/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React from "react";

interface FormControlLabelProps {
  control: React.ReactElement;
  label: React.ReactNode;
}

/**
 * @deprecated Use <Switch/> instead from "../switch.tsx".
 */
export function FormSwitch(props: FormControlLabelProps & { children?: React.ReactNode }) {
  const ClonedElement = React.cloneElement(props.control, {
    children: <span>{props.label}</span>,
  });

  return ClonedElement;
}
