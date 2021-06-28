import store from "@/store";
import { RawLocation, Route } from "vue-router";

export class XFunctions {
  /**
   * Display error alert box
   *
   * Note, use this method from the app.
   *
   * @param code Error code from PHP backend
   * @returns true after the alert dialog closed
   */
  static error(code: string): void {
    if (typeof code === "string" && code.indexOf("error_") === 0) {
      // This is a PHP backend erorr
      return this.alert(this.tr("error"), this.tr(code));
    } else {
      return this.alert(this.tr("error"), "Unknown error: " + code);
    }
  }

  /**
   * Returns true when the confirm box has closed.
   *
   * Note, use this method from the app.
   *
   * @param title title
   * @param content content
   * @returns boolean
   */
  static alert(title: string, content: string): void {
    return store.state.vm.$bvModal.msgBoxOk(content, {
      title: title,
      size: "sm",
      buttonSize: "sm",
      okVariant: "success",
      headerClass: "p-2 border-bottom-0",
      footerClass: "p-2 border-top-0",
    });
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
  static openToast(
    title = "title",
    content = "content",
    placement?: string,
    variant?: string,
    hideCloseButton?: boolean,
    hideDelay?: number,
    append?: boolean
  ): void {
    alert(title + content);

    return store.state.vm.$bvToast.toast(content, {
      title: title,
      toaster: placement,
      variant: variant,
      noCloseButton: hideCloseButton,
      autoHideDelay: hideDelay ?? 1000,
      append: append,
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
  static async confirm(
    title: string,
    content: string
  ): Promise<boolean | null> {
    return await store.state.vm.$bvModal.msgBoxConfirm(content, {
      title: title,
      size: "sm",
      buttonSize: "sm",
      okVariant: "danger",
      okTitle: this.tr("yes"),
      cancelTitle: this.tr("no"),
      footerClass: "p-2",
      hideHeaderClose: false,
      centered: true,
    });
  }

  static tr(code: string): string {
    return code;
    // if (!code) return "";
    // if (!apiStore.texts) return code;
    // if (!apiStore.texts[code]) return code;
    // if (!apiStore.texts[code][ApiService.instance.userLanguage]) return code;
    // return apiStore.texts[code][ApiService.instance.userLanguage];
  }

  /**
   * @param location
   * @returns
   */
  static open(location: RawLocation): Promise<Route> {
    // alert("do not use open()");
    return store.state.router.push(location);
  }
}
