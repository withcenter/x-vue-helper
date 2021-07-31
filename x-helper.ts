import router from "@/router";
import { PromptToast } from "@/x-vue/services/component.service";
import { translate } from "@/x-vue/services/functions";
import Vue from "vue";

interface ConfirmToast {
  title: string;
  message: string;
  yesCallback: () => void;
  noCallback: () => void;
  placement?: string;
  variant?: string;
  hideDelay?: number;
  append?: boolean;
}

export interface Toast {
  title: string;
  message: string;
  clickCallback?: () => void;
  closeCallback?: () => void;
  placement?: string;
  variant?: string;
  hideDelay?: number;
  append?: boolean;
}
export enum PLACEMENT {
  TOP_RIGHT = "b-toaster-top-right",
  TOP_LEFT = "b-toaster-top-left",
  TOP_CENTER = "b-toaster-top-center",
  TOP_FULL = "b-toaster-top-full",
  BOTTOM_RIGHT = "b-toaster-bottom-right",
  BOTTOM_LEFT = "b-toaster-bottom-left",
  BOTTOM_CENTER = "b-toaster-bottom-center",
  BOTTOM_FULL = "b-toaster-bottom-full",
}
export class XHelper {
  private static _instance: XHelper;
  public static get instance(): XHelper {
    if (!XHelper._instance) {
      XHelper._instance = new XHelper();
    }
    return XHelper._instance;
  }

  vm: Vue = {} as Vue;

  toastCount = 0;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  init(options: { vm: any }): void {
    this.vm = options.vm;
    // console.log("XHelper::init", this.vm);
  }

  /**
   * Display error alert box
   *
   * Note, use this method from the app.
   *
   * @param code Error code from PHP backend
   * @returns true after the alert dialog closed
   */
  error(code: string): Promise<void> {
    if (typeof code === "string" && code.indexOf("error_") === 0) {
      // This is a PHP backend erorr
      return this.alert(translate("error"), translate(code));
    } else {
      return this.alert(translate("error"), "Unknown error: " + code);
    }
  }

  /**
   * Open toast.
   *
   * @param title
   * @param content
   * @param placement
   * @param variant
   * @param hideDelay
   * @param append
   */
  toast(options: Toast): void {
    // Use a shorter name for `this.$createElement`
    const h = this.vm.$createElement;
    // Create a ID with a incremented count
    const id = `my-toast-${this.toastCount++}`;
    const $title = h(
      "div",
      {
        class: "xhelper-custom-toast-title d-flex justify-content-between w-100",
      },
      [
        h(
          "strong",
          {
            class: "w-100 pt-1 pointer",
            on: {
              click: () => {
                this.vm.$bvToast.hide(id);
                if (options.clickCallback) options.clickCallback();
              },
            },
          },
          options.title
        ),
        h(
          "button",
          {
            class: "close pl-2",
            on: {
              click: () => {
                this.vm.$bvToast.hide(id);
                if (options.closeCallback) options.closeCallback();
              },
            },
          },
          "×"
        ),
      ]
    );

    const $content = h(
      "div",
      {
        class: ["xhelper-custom-toast-content w-100 pointer"],
        on: {
          click: () => {
            this.vm.$bvToast.hide(id);
            if (options.clickCallback) options.clickCallback();
          },
        },
      },
      [options.message]
    );

    return this.vm.$bvToast.toast([$content], {
      id: id,
      title: $title,
      toaster: options.placement,
      variant: options.variant,
      autoHideDelay: options.hideDelay ?? 5000,
      append: options.append,
      solid: true,
      noCloseButton: true,
      // noAutoHide: true,
    });
  }

  confirmToast(options: ConfirmToast): void {
    // Use a shorter name for `this.$createElement`
    const h = this.vm.$createElement;
    // Create a ID with a incremented count
    const id = `my-toast-${this.toastCount++}`;

    const $content = h("div", {}, [options.message]);
    const $openButton = h(
      "b-button",
      {
        on: {
          click: () => {
            this.vm.$bvToast.hide(id);
            options.yesCallback();
          },
        },
      },
      "Open"
    );

    // Create the custom close button
    const $closeButton = h(
      "b-button",
      {
        class: "ml-2",
        on: {
          click: () => {
            this.vm.$bvToast.hide(id);
            options.noCallback();
          },
        },
      },
      "Close"
    ); // Create the custom close button

    return this.vm.$bvToast.toast([$content, $openButton, $closeButton], {
      id: id,
      title: options.title,
      toaster: options.placement,
      variant: options.variant,
      autoHideDelay: options.hideDelay ?? 5000,
      append: options.append,
      solid: true,
    });
  }

  /**
   * Ask user for confirmation
   *
   * Note, use this method from the app.
   *
   * @param title title
   * @param content content
   * @returns boolean|null
   *  - true on yes
   *  - false on no
   *  - null if close without confirmation
   * @example
   * ```
   *  console.log("confirm; ", await this.app.confirm("title", "content"));
   * ```
   */
  async confirm(title: string, content: string): Promise<boolean | null> {
    if (this.vm.$bvModal) {
      return await this.vm.$bvModal.msgBoxConfirm(content, {
        title: title,
        size: "sm",
        buttonSize: "sm",
        okVariant: "danger",
        okTitle: translate("yes"),
        cancelTitle: translate("no"),
        footerClass: "p-2",
        hideHeaderClose: false,
        centered: true,
      });
    }
    return confirm(title + " " + content);
  }
  /**
   * Display alert box
   *
   * ! Do not use this method directly.
   * ! You should use `ComponentService.instance.alert()` that might call this method.
   *
   * Returns true when the confirm box has closed.
   *
   * Note, use this method from the app.
   * ! Note, it does not display alert box on same content white alert box is open.
   *
   * @param title title
   * @param content content
   * @returns boolean
   */
  prevAlertContent = "";
  alert(title: string, content: string): Promise<void> {
    if (this.prevAlertContent != content) {
      console.log("different content; ", content);
      this.prevAlertContent = content;
      return (
        this.vm.$bvModal
          .msgBoxOk(content, {
            title: title,
            size: "sm",
            buttonSize: "sm",
            okVariant: "success",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
          })
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          .then((value: any) => {
            this.prevAlertContent = "";
          })
      );
    } else {
      console.log("same content; just return;", content);
      return Promise.resolve();
    }
  }

  promptToast(options: PromptToast): void {
    // Use a shorter name for `this.$createElement`
    const h = this.vm.$createElement;
    // Create a ID with a incremented count
    const id = `my-toast-${this.toastCount++}`;

    const $content = h("input", {
      class: "w-100",
      domProps: {
        value: options.message,
      },
      on: {
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        input: (event: any) => {
          console.log(event);
          if (!event) return;
          options.message = event.target.value;
        },
      },
    });

    const $openButton = h(
      "b-button",
      {
        class: "ml-2 btn-sm",
        on: {
          click: () => {
            this.vm.$bvToast.hide(id);
            options.okCallback(options.message);
          },
        },
      },
      "Ok"
    );

    // Create the custom close button
    const $closeButton = h(
      "b-button",
      {
        class: "ml-2 btn-sm",
        on: {
          click: () => {
            this.vm.$bvToast.hide(id);
            if (options.cancelCallback) options.cancelCallback();
          },
        },
      },
      "Cancel"
    ); // Create the custom close button

    return this.vm.$bvToast.toast([$content, h("hr"), $openButton, $closeButton], {
      id: id,
      title: options.title,
      toaster: options.placement,
      variant: options.variant,
      // autoHideDelay: options.hideDelay ?? 5000,
      append: options.append,
      solid: true,
      noAutoHide: true,
    });
  }

  /**
   * @deprecated Use `translate`
   * @param code ...
   * @returns ...
   */
  tr(code: string): string {
    return translate(code);
  }

  /**
   * Some of `x-vue` components need to move around pages. That's why it is here.
   *
   * @param location location to open
   * @returns void
   */
  open(location: string | { path?: string }): void {
    router.push(location);
  }
}
