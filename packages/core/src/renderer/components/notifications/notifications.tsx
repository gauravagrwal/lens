/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./notifications.scss";

import React from "react";
import { reaction } from "mobx";
import { disposeOnUnmount, observer } from "mobx-react";
import { JsonApiErrorParsed } from "@k8slens/json-api";
import type { Disposer } from "@k8slens/utilities";
import { cssNames, prevDefault } from "@k8slens/utilities";
import type { CreateNotificationOptions, Notification, NotificationMessage, NotificationsStore } from "./notifications.store";
import { Animate } from "../animate";
import { Icon } from "../icon";
import { withInjectables } from "@ogre-tools/injectable-react";
import notificationsStoreInjectable from "./notifications-store.injectable";

export type ShowNotification = (message: NotificationMessage, opts?: CreateNotificationOptions) => Disposer;

interface Dependencies {
  store: NotificationsStore;
}

@observer
class NonInjectedNotifications extends React.Component<Dependencies> {
  public elem: HTMLDivElement | null = null;

  componentDidMount() {
    disposeOnUnmount(this, [
      reaction(() => this.props.store.notifications.length, () => {
        this.scrollToLastNotification();
      }, { delay: 250 }),
    ]);
  }

  scrollToLastNotification() {
    if (!this.elem) {
      return;
    }
    this.elem.scrollTo?.({
      top: this.elem.scrollHeight,
      behavior: "smooth",
    });
  }

  getMessage(notification: Notification) {
    let { message } = notification;

    if (message instanceof JsonApiErrorParsed || message instanceof Error) {
      message = message.toString();
    }

    return React.Children.toArray(message);
  }

  render() {
    const { store } = this.props;

    return (
      <div className="Notifications flex column align-flex-end" ref={e => this.elem = e}>
        {store.notifications.map(notification => {
          const { id, status, onClose } = notification;
          const msgText = this.getMessage(notification);

          return (
            <Animate key={id}>
              <div
                className={cssNames("notification flex", status)}
                onMouseLeave={() => store.addAutoHideTimer(id)}
                onMouseEnter={() => store.removeAutoHideTimer(id)}
              >
                <div className="box">
                  <Icon material="info_outline" />
                </div>
                <div className="message box grow">{msgText}</div>
                <div className="box">
                  <Icon
                    material="close"
                    className="close"
                    data-testid={`close-notification-for-${id}`}
                    onClick={prevDefault(() => {
                      store.remove(id);
                      onClose?.();
                    })}
                  />
                </div>
              </div>
            </Animate>
          );
        })}
      </div>
    );
  }
}

export const Notifications = withInjectables<Dependencies>(NonInjectedNotifications, {
  getProps: (di) => ({
    store: di.inject(notificationsStoreInjectable),
  }),
});
