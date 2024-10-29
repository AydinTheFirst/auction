import { Logger } from "@nestjs/common";
import axios from "axios";
import fs from "node:fs/promises";

type SendMessageOptions =
  | {
      context: Record<string, string>;
      template: string;
    }
  | string;

class Netgsm {
  private netgsm = axios.create({
    baseURL: "https://api.netgsm.com.tr",
  });

  private netgsmConf = {
    appkey: "xxx",
    password: process.env.NETGSM_PASSWORD,
    usercode: process.env.NETGSM_USERCODE,
  };

  private templateDir = process.cwd() + "/src/templates/sms";
  private templates = new Map<string, string>();

  constructor() {
    this.loadTemplates();
  }

  public async loadTemplates() {
    const files = await fs.readdir(this.templateDir);

    for (const file of files) {
      const template = await fs.readFile(this.templateDir + "/" + file, {
        encoding: "utf-8",
      });

      this.templates.set(file.split(".")[0], template);
    }

    Logger.debug("Templates loaded", "NETGSM");
  }

  public async sendSMS(gsmno: string, opts: SendMessageOptions) {
    let message = "";

    if (typeof opts === "string") {
      message = opts;
    } else {
      message = this.templates.get(opts.template) || "";
      for (const [key, value] of Object.entries(opts.context)) {
        message = message.replace(new RegExp(`{{${key}}}`, "g"), value);
      }
    }

    const res = await this.netgsm.post("/sms/send/get", null, {
      params: {
        ...this.netgsmConf,
        gsmno,
        message,
        msgheader: process.env.NETGSM_USERCODE,
      },
    });

    Logger.debug(`SMS sent to ${gsmno} | Response ${res.data}`, "NETGSM");

    return res.data;
  }
}

export default new Netgsm();
