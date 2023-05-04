/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import styles from "./hotbar-icon.module.scss";

import React, { useState } from "react";

import type { CatalogEntityContextMenu } from "../../../common/catalog";
import { cssNames } from "@k8slens/utilities";
import { Menu, MenuItem } from "../menu";
import { observer } from "mobx-react";
import type { AvatarProps } from "../avatar";
import { Avatar } from "../avatar";
import { Icon } from "../icon";
import { Tooltip } from "@k8slens/tooltip";
import type { NormalizeCatalogEntityContextMenu } from "../../catalog/normalize-menu-item.injectable";
import { withInjectables } from "@ogre-tools/injectable-react";
import normalizeCatalogEntityContextMenuInjectable from "../../catalog/normalize-menu-item.injectable";

export interface HotbarIconProps extends AvatarProps {
  uid: string;
  source?: string;
  material?: string;
  onMenuOpen?: () => void;
  active?: boolean;
  menuItems?: CatalogEntityContextMenu[];
  disabled?: boolean;
  tooltip?: string;
}

interface Dependencies {
  normalizeMenuItem: NormalizeCatalogEntityContextMenu;
}

const NonInjectedHotbarIcon = observer(({
  menuItems = [],
  size = 40,
  tooltip,
  normalizeMenuItem,
  ...props
}: HotbarIconProps & Dependencies) => {
  const { uid, title, src, material, active, className, source, disabled, onMenuOpen, onClick, children, ...rest } = props;
  const id = `hotbarIcon-${uid}`;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={cssNames(styles.HotbarIcon, className, (menuItems.length > 0 && styles.contextMenuAvailable))}>
      {tooltip && (
        <Tooltip targetId={id}>
          {tooltip}
        </Tooltip>
      )}
      <Avatar
        {...rest}
        id={id}
        title={title}
        colorHash={source ? `${title}-${source}` : title}
        className={cssNames(
          styles.avatar,
          active && styles.active,
          !!src && styles.hasImag,
        )}
        disabled={disabled}
        size={size}
        src={src}
        onClick={(event) => !disabled && onClick?.(event)}
      >
        {material && <Icon material={material} />}
      </Avatar>
      {children}
      <Menu
        usePortal
        htmlFor={id}
        isOpen={menuOpen}
        toggleEvent="contextmenu"
        position={{ right: true, bottom: true }} // FIXME: position does not work
        open={() => {
          onMenuOpen?.();
          toggleMenu();
        }}
        close={() => toggleMenu()}
      >
        {
          menuItems
            .map(normalizeMenuItem)
            .map((menuItem) => (
              <MenuItem key={menuItem.title} onClick={menuItem.onClick}>
                {menuItem.title}
              </MenuItem>
            ))
        }
      </Menu>
    </div>
  );
});

export const HotbarIcon = withInjectables<Dependencies, HotbarIconProps>(NonInjectedHotbarIcon, {
  getProps: (di, props) => ({
    ...props,
    normalizeMenuItem: di.inject(normalizeCatalogEntityContextMenuInjectable),
  }),
});
