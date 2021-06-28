export class XFunctions {
  private static _instance: XFunctions;
  public static get instance(): XFunctions {
    if (!XFunctions._instance) {
      XFunctions._instance = new XFunctions();
    }

    return XFunctions._instance;
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
   * Returns true when the confirm box has closed.
   *
   * Note, use this method from the app.
   *
   * @param title title
   * @param content content
   * @returns boolean
   */
  alert(title: string, content: string): void {
    alert(title + content);

    // return await vm.$bvModal.msgBoxOk(content, {
    //   title: title,
    //   size: "sm",
    //   buttonSize: "sm",
    //   okVariant: "success",
    //   headerClass: "p-2 border-bottom-0",
    //   footerClass: "p-2 border-top-0",
    // });
  }

  tr(code: string): string {
    return code;
    // if (!code) return "";
    // if (!apiStore.texts) return code;
    // if (!apiStore.texts[code]) return code;
    // if (!apiStore.texts[code][ApiService.instance.userLanguage]) return code;
    // return apiStore.texts[code][ApiService.instance.userLanguage];
  }
}
