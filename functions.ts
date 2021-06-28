export class XFunctions {
  private static _instance: XFunctions;
  public static get instance(): XFunctions {
    if (!XFunctions._instance) {
      XFunctions._instance = new XFunctions();
    }
    return XFunctions._instance;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  vm: any;

  init(vm: any): void {
    this.vm = vm;
    // console.log("XFunctions::init", this.vm);
  }

  /**
   * Display error alert box
   *
   * Note, use this method from the app.
   *
   * @param code Error code from PHP backend
   * @returns true after the alert dialog closed
   */
  error(code: string): void {
    if (typeof code === "string" && code.indexOf("error_") === 0) {
      // This is a PHP backend erorr
      return this.alert(this.tr("error"), this.tr(code));
    } else {
      return this.alert(this.tr("error"), "Unknown error: " + code);
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
  openToast(
    title = "title",
    content = "content",
    placement?: string,
    variant?: string,
    hideCloseButton?: boolean,
    hideDelay?: number,
    append?: boolean
  ): void {
    if (this.vm.$bvToast) {
      return this.vm.$bvToast.toast(content, {
        title: title,
        toaster: placement,
        variant: variant,
        noCloseButton: hideCloseButton,
        autoHideDelay: hideDelay ?? 1000,
        append: append,
        solid: true,
      });
    }
    return alert(title + " " + content);
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
        okTitle: this.tr("yes"),
        cancelTitle: this.tr("no"),
        footerClass: "p-2",
        hideHeaderClose: false,
        centered: true,
      });
    }
    return confirm(title + " " + content);
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
  alert(title: string, content: string): void {
    if (this.vm.$bvModal) {
      return this.vm.$bvModal.msgBoxOk(content, {
        title: title,
        size: "sm",
        buttonSize: "sm",
        okVariant: "success",
        headerClass: "p-2 border-bottom-0",
        footerClass: "p-2 border-top-0",
      });
    }
    return alert(title + " " + content);
  }

  tr(code: string): string {
    return code;
    // if (!code) return "";
    // if (!apiStore.texts) return code;
    // if (!apiStore.texts[code]) return code;
    // if (!apiStore.texts[code][ApiService.instance.userLanguage]) return code;
    // return apiStore.texts[code][ApiService.instance.userLanguage];
  }

  open(location: string | { path?: string }): void {
    // console.log(this.vm);
    if (this.vm._router) {
      return this.vm._router.push(location);
    } else {
      alert("vm.router is not defined");
    }
  }
}
